import React, { useState, useEffect, useCallback, useRef } from 'react';

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

interface BseNewsItem {
  id: string;
  symbol: string;
  bseCode: string;
  companyName: string;
  title: string;
  content: string;
  timestamp: string;
  rawPublishedAt: string;
  pdfUrl?: string;
  source: string;
}

// Independent Tooltip for BseCards
const BseTooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPos({ top: rect.top + window.scrollY - 10, left: rect.left + rect.width / 2 });
      setShow(true);
    }
  };

  return (
    <div className="relative inline-block w-full" ref={ref} onMouseEnter={handleEnter} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div 
          className="fixed z-[500] px-4 py-3 bg-[#1a2235] text-slate-300 text-[11px] font-medium rounded-xl border border-white/10 shadow-2xl w-64 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ top: pos.top, left: pos.left }}
        >
          {text}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1a2235] border-r border-b border-white/10 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const BseNewsCard: React.FC<{ news: BseNewsItem; onWatchlistAdd: (item: any) => void }> = ({ news, onWatchlistAdd }) => {
  const [isRead, setIsRead] = useState(false);

  return (
    <div
      onClick={() => setIsRead(true)}
      className={`bg-[#111621] border border-white/[0.05] rounded-xl flex flex-col h-full hover:border-blue-500/20 transition-all group shadow-2xl relative cursor-pointer ${isRead ? 'opacity-80' : ''}`}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <h3 className="text-[11px] font-black text-blue-500 tracking-tight uppercase leading-none truncate max-w-[180px] mb-1">
              {news.companyName}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {news.symbol} | {news.bseCode}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[9.5px] text-slate-400 font-mono font-bold uppercase tracking-tight leading-none mb-1">
              {news.timestamp.split(",")[1]?.trim() || ""}
            </p>
            <p className="text-[8.5px] text-slate-500 font-mono uppercase tracking-tight">
              {news.timestamp.split(",")[0]?.trim() || ""}
            </p>
          </div>
        </div>

        <BseTooltip text={news.title}>
          <h4 className="text-[14px] font-bold text-slate-200 leading-snug mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {news.title}
          </h4>
        </BseTooltip>

        <div className="flex-grow">
          <BseTooltip text={news.content}>
            <p className="text-[11px] text-slate-400 line-clamp-5 leading-relaxed mb-4 font-medium border-l-2 border-blue-600/30 pl-3">
              {news.content}
            </p>
          </BseTooltip>
        </div>

        <div className="pt-4 mt-auto flex items-center justify-between border-t border-white/[0.05]">
          <button
            onClick={(e) => { e.stopPropagation(); onWatchlistAdd({ ...news, source: 'BSE' }); }}
            className="px-3 py-1.5 bg-white/[0.03] hover:bg-emerald-600/10 text-slate-500 hover:text-emerald-500 border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
          >
            + WATCHLIST
          </button>
          
          {news.pdfUrl ? (
            <a 
              href={news.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 border border-blue-600/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Filing (PDF)</span>
            </a>
          ) : (
            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">BSE SOURCE</span>
          )}
        </div>
      </div>
    </div>
  );
};

interface BseCardsProps {
  onWatchlistAdd: (item: any) => void;
}

const BseCards: React.FC<BseCardsProps> = ({ onWatchlistAdd }) => {
  const [bseNews, setBseNews] = useState<BseNewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchBseFeeds = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://lavender-goldfish-594505.hostingersite.com/api/bsefeed", {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const json = await response.json();

      if (json.status === "success" && json.data) {
        const allItems: BseNewsItem[] = [];
        if (Array.isArray(json.data)) {
          json.data.forEach((item: any) => {
            allItems.push({
              id: item.postId,
              symbol: item.data?.cta?.[0]?.meta?.nseScriptCode || "NSE",
              bseCode: item.data?.cta?.[0]?.meta?.bseScriptCode || item.data?.cta?.[0]?.meta?.bseCode || "N/A",
              companyName: item.data?.cta?.[0]?.ctaText || "BSE Listed",
              title: item.data?.title || "Corporate Filing",
              content: (item.data?.body || "").split("Source:")[0].trim(),
              timestamp: new Date(item.publishedAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
              }),
              rawPublishedAt: item.publishedAt,
              pdfUrl: item.media?.pdf || item.data?.media?.pdf,
              source: "BSE"
            });
          });
        } else {
          Object.keys(json.data).forEach((dateKey) => {
            const rawItems = json.data[dateKey];
            const mappedItems: BseNewsItem[] = rawItems.map((item: any) => ({
              id: item.postId,
              symbol: item.data?.cta?.[0]?.meta?.nseScriptCode || "NSE",
              bseCode: item.data?.cta?.[0]?.meta?.bseScriptCode || item.data?.cta?.[0]?.meta?.bseCode || "N/A",
              companyName: item.data?.cta?.[0]?.ctaText || "BSE Listed",
              title: item.data?.title || "Corporate Filing",
              content: (item.data?.body || "").split("Source:")[0].trim(),
              timestamp: new Date(item.publishedAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
              }),
              rawPublishedAt: item.publishedAt,
              pdfUrl: item.media?.pdf || item.data?.media?.pdf,
              source: "BSE"
            }));
            allItems.push(...mappedItems);
          });
        }
        // Sort by time descending
        allItems.sort((a, b) => new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime());
        setBseNews(allItems);
      } else {
        setError("BSE data stream temporarily unavailable.");
      }
    } catch (err) {
      console.error("BSE Fetch Error:", err);
      setError("Unable to connect to BSE data tunnel.");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBseFeeds(true);
  }, [fetchBseFeeds]);

  // Polling every 10 seconds if autoRefresh is enabled
  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh) {
      interval = window.setInterval(() => {
        fetchBseFeeds(false);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchBseFeeds]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && bseNews.length > displayLimit) {
          setDisplayLimit((prev) => prev + 10);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [bseNews.length, displayLimit]);

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-600 text-center animate-pulse">Syncing BSE Pipeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center opacity-40">
        <p className="text-xl font-black uppercase tracking-[0.2em] mb-4 text-rose-500">Pipeline Offline</p>
        <p className="text-slate-400 text-xs font-medium max-w-xs">{error}</p>
        <button onClick={() => fetchBseFeeds(true)} className="mt-8 px-6 py-2 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all">Retry Link</button>
      </div>
    );
  }

  const pagedNews = bseNews.slice(0, displayLimit);

  return (
    <div className="flex flex-col space-y-6">
      {/* Component Specific Control Bar */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BSE Pipeline Status</span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)} 
          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${ 
            autoRefresh ? "bg-blue-600/10 border-blue-600/50 text-blue-500" : "bg-slate-950/40 border-white/[0.05] text-slate-500 hover:text-slate-300" 
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${ autoRefresh ? "bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.3)]" : "bg-slate-700" }`}></div>
          <span>BSE Live Monitoring</span>
        </button>
      </div>

      {bseNews.length === 0 ? (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20">
          <p className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] px-4">BSE Tunnel Clear</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 pt-4 animate-in fade-in duration-500">
            {pagedNews.map((newsItem) => (
              <BseNewsCard 
                key={newsItem.id} 
                news={newsItem} 
                onWatchlistAdd={onWatchlistAdd} 
              />
            ))}
          </div>
          
          {/* Infinite Scroll Trigger */}
          <div ref={loaderRef} className="py-10 flex justify-center">
            {displayLimit < bseNews.length && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Fetching more dispatches...</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BseCards;