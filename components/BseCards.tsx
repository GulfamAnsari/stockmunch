import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../config';

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

const BseNewsCard: React.FC<{ news: BseNewsItem; onWatchlistAdd: (item: any) => void }> = ({ news, onWatchlistAdd }) => {
  const [isRead, setIsRead] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePdfClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (news.pdfUrl) {
      window.open(news.pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={() => setIsRead(true)}
      className={`bg-[#111621] border border-white/[0.06] rounded-2xl flex flex-col h-full hover:border-emerald-500/30 transition-all group shadow-2xl relative cursor-pointer group/card ${isRead ? 'opacity-80' : ''}`}
    >
      <div className="p-4 sm:p-5 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-5 gap-2">
          <div className="min-w-0">
            <h3 className="text-[10px] sm:text-[11px] font-extrabold text-emerald-400/90 tracking-tight uppercase leading-none truncate max-w-[140px] mb-1.5">
              {news.companyName}
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                {news.bseCode}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[8px] sm:text-[9px] text-slate-400 font-mono font-bold uppercase tracking-tighter leading-none mb-1">
              {news.timestamp.split(",")[1]?.trim() || ""}
            </p>
            <p className="text-[7px] sm:text-[9px] text-slate-600 font-mono uppercase tracking-tighter">
              {news.timestamp.split(",")[0]?.trim() || ""}
            </p>
          </div>
        </div>

        <h4 className={`text-[13px] sm:text-[14px] font-medium text-slate-400/90 leading-[1.3] mb-3 group-hover:text-emerald-300 transition-colors uppercase tracking-tight ${isExpanded ? '' : 'line-clamp-2'}`}>
          {news.title}
        </h4>

        <div className="flex-grow relative">
          <p className={`text-[11px] text-slate-500 leading-relaxed mb-4 font-medium border-l-2 border-emerald-900/30 pl-3 group-hover:border-emerald-500/40 transition-all duration-300 ${isExpanded ? 'line-clamp-none bg-emerald-500/[0.02] py-2' : 'line-clamp-3'}`}>
            {news.content}
          </p>
          {news.content.length > 120 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center space-x-1 text-[9px] font-black text-slate-600 hover:text-emerald-400 uppercase tracking-widest mb-4 transition-colors"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              <svg className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/[0.05] gap-3">
          <div className="px-2 py-1 bg-white/[0.03] text-slate-500 border border-white/[0.06] rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] sm:max-w-none">
            {news.category}
          </div>
          
          {news.pdfUrl ? (
            <button
              onClick={handlePdfClick}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-slate-900 font-black rounded-lg text-[8px] uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-[0_10px_30px_rgba(5,150,105,0.3)] shrink-0"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>FILING</span>
            </button>
          ) : (
            <span className="text-[8px] sm:text-[10px] text-slate-700 font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              {news.source || 'BSE DATA'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

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

  const gridClasses = useMemo(() => {
    if (isSidebarCollapsed) {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pt-4 animate-in fade-in duration-700";
    }
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4 animate-in fade-in duration-700";
  }, [isSidebarCollapsed]);

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
              <BseNewsCard 
                key={newsItem.id} 
                news={newsItem} 
                onWatchlistAdd={onWatchlistAdd} 
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