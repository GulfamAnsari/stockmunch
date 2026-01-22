import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';
import { NewsCard } from './MarketTerminal';

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

interface BseNewsItem {
  id: string;
  symbol: string;
  bseCode: string;
  companyName: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  rawPublishedAt: string;
  pdfUrl?: string;
  source: string;
}

interface BseCardsProps {
  onWatchlistAdd: (item: any) => void;
  isSidebarCollapsed?: boolean;
  externalSearch?: string;
  externalCategory?: string;
  externalAutoRefresh?: boolean;
  showAwardsOnly?: boolean;
  onCategoriesLoad?: (cats: string[]) => void;
}

const BseCards: React.FC<BseCardsProps> = ({ 
  onWatchlistAdd, 
  isSidebarCollapsed, 
  externalSearch = "", 
  externalCategory = "ALL", 
  externalAutoRefresh = false, 
  showAwardsOnly = false,
  onCategoriesLoad 
}) => {
  const [bseNews, setBseNews] = useState<BseNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const loaderRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const fetchBseFeeds = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return;
    if (isInitial) setLoading(true);
    isFetchingRef.current = true;
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bsefeed`, {
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const json = await response.json();

      if (json.status === "success" && json.data) {
        const allItems: BseNewsItem[] = [];
        const rawData = Array.isArray(json.data) ? json.data : Object.values(json.data).flat();

        rawData.forEach((item: any) => {
          const pdfMedia = item.data?.media?.find((m: any) => m.type === "PDF");
          
          allItems.push({
            id: item.postId,
            symbol: item.data?.cta?.[0]?.meta?.nseScriptCode || "NSE",
            bseCode: item.data?.cta?.[0]?.meta?.bseScriptCode || item.data?.cta?.[0]?.meta?.bseCode || "N/A",
            companyName: item.data?.cta?.[0]?.ctaText || "BSE Listed",
            category: item.category || "Company Update",
            title: item.data?.title === "ATTACHED" ? "CORPORATE ANNOUNCEMENT" : (item.data?.title || "Corporate Filing"),
            content: (item.data?.body || "").split("Category:")[0].trim(),
            timestamp: new Date(item.publishedAt).toLocaleString("en-IN", {
              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
            }),
            rawPublishedAt: item.publishedAt,
            pdfUrl: pdfMedia?.url,
            source: "BSE"
          });
        });

        allItems.sort((a, b) => new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime());
        setBseNews(allItems);
        
        if (onCategoriesLoad) {
          const set = new Set<string>();
          allItems.forEach(n => set.add(n.category));
          onCategoriesLoad(["ALL", ...Array.from(set)].sort());
        }
      } else {
        setError("BSE data stream temporarily unavailable.");
      }
    } catch (err) {
      console.error("BSE Fetch Error:", err);
      setError("Unable to connect to BSE data tunnel.");
    } finally {
      isFetchingRef.current = false;
      if (isInitial) setLoading(false);
    }
  }, [onCategoriesLoad]);

  useEffect(() => {
    fetchBseFeeds(true);
  }, [fetchBseFeeds]);

  useEffect(() => {
    let interval: number | undefined;
    if (externalAutoRefresh) {
      interval = window.setInterval(() => fetchBseFeeds(false), 10000);
    }
    return () => clearInterval(interval);
  }, [externalAutoRefresh, fetchBseFeeds]);

  const filteredNews = useMemo(() => {
    let list = bseNews;
    if (externalCategory !== "ALL") {
      list = list.filter(n => n.category === externalCategory);
    }
    if (showAwardsOnly) {
      list = list.filter(n => 
        n.title.toUpperCase().includes("AWARD OF ORDER") || 
        n.title.toUpperCase().includes("RECEIPT OF ORDER") ||
        n.category.toUpperCase().includes("AWARD OF ORDER") ||
        n.category.toUpperCase().includes("RECEIPT OF ORDER")
      );
    }
    if (externalSearch) {
      const lower = externalSearch.toLowerCase();
      list = list.filter(n => 
        n.companyName.toLowerCase().includes(lower) || 
        n.bseCode.toLowerCase().includes(lower) || 
        n.title.toLowerCase().includes(lower)
      );
    }
    return list;
  }, [bseNews, externalCategory, externalSearch, showAwardsOnly]);

  const pagedNews = useMemo(() => filteredNews.slice(0, displayLimit), [filteredNews, displayLimit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && filteredNews.length > displayLimit) {
          setDisplayLimit((prev) => prev + 10);
        }
      },
      { threshold: 1.0 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filteredNews.length, displayLimit]);

  const gridClasses = "grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-4 pt-4 animate-in fade-in duration-700";

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-8">
        <div className="w-20 h-20 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-700 text-center animate-pulse">SYNCING BSE PIPELINE...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center opacity-40">
        <p className="text-xl font-black uppercase tracking-[0.2em] mb-4 text-rose-500">Pipeline Offline</p>
        <p className="text-slate-400 text-xs font-medium max-w-xs">{error}</p>
        <button onClick={() => fetchBseFeeds(true)} className="mt-8 px-8 py-3 bg-slate-900 border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all">Retry Link</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {filteredNews.length === 0 ? (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20">
          <p className="text-xl font-black uppercase tracking-[0.4em] px-8">NO DISPATCHES IN REGION</p>
        </div>
      ) : (
        <>
          <div className={gridClasses}>
            {pagedNews.map((newsItem) => (
              <NewsCard 
                key={newsItem.id} 
                news={newsItem} 
                onWatchlistAdd={onWatchlistAdd} 
                variant="bse"
              />
            ))}
          </div>
          
          <div ref={loaderRef} className="py-16 flex justify-center">
            {displayLimit < filteredNews.length && (
              <div className="flex flex-col items-center space-y-6">
                <div className="w-12 h-12 border-4 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">FETCHING REGIONAL DATA...</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BseCards;