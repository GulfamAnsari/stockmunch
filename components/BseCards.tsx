import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

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
      className={`bg-[#111621] border border-white/[0.05] rounded-xl flex flex-col h-full hover:border-blue-500/40 transition-all group shadow-2xl relative cursor-pointer ${isRead ? 'opacity-80' : ''}`}
    >
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0">
            <h3 className="text-[12px] font-black text-emerald-500 tracking-tight uppercase leading-none truncate max-w-[180px] mb-1">
              {news.companyName}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {news.bseCode}
              </span>
              <span className="text-[10px] text-slate-700">•</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/10 text-blue-400 font-black uppercase tracking-widest rounded border border-blue-500/20">
                {news.category}
              </span>
            </div>
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

        {/* Title */}
        <BseTooltip text={news.title}>
          <h4 className="text-[14px] font-bold text-slate-100 leading-snug mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors uppercase tracking-tight">
            {news.title}
          </h4>
        </BseTooltip>

        {/* Content */}
        <div className="flex-grow">
          <BseTooltip text={news.content}>
            <p className="text-[11px] text-slate-400 line-clamp-5 leading-relaxed mb-4 font-medium border-l-2 border-blue-600/30 pl-3">
              {news.content}
            </p>
          </BseTooltip>
        </div>

        {/* Footer */}
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
              className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-600 text-slate-900 font-black rounded-lg text-[9px] uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>PDF FILING</span>
            </a>
          ) : (
            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">BSE INDIA</span>
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
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
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
        const rawData = Array.isArray(json.data) ? json.data : Object.values(json.data).flat();

        rawData.forEach((item: any) => {
          // Find PDF in media array
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

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh) {
      interval = window.setInterval(() => fetchBseFeeds(false), 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchBseFeeds]);

  // Unique categories for filtering
  const categories = useMemo(() => {
    const set = new Set<string>();
    bseNews.forEach(n => set.add(n.category));
    return ["ALL", ...Array.from(set)].sort();
  }, [bseNews]);

  const filteredNews = useMemo(() => {
    if (selectedCategory === "ALL") return bseNews;
    return bseNews.filter(n => n.category === selectedCategory);
  }, [bseNews, selectedCategory]);

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

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
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

  return (
    <div className="flex flex-col space-y-6">
      {/* Component Specific Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.03]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BSE Category</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => { setSelectedCategory(e.target.value); setDisplayLimit(10); }}
              className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-tight text-slate-300 focus:outline-none focus:border-blue-500/50"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pipeline Status</span>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>
        
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)} 
          className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${ 
            autoRefresh ? "bg-blue-600/10 border-blue-600/50 text-blue-500" : "bg-slate-950/40 border-white/[0.05] text-slate-500 hover:text-slate-300" 
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${ autoRefresh ? "bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.3)]" : "bg-slate-700" }`}></div>
          <span>BSE Live (10s)</span>
        </button>
      </div>

      {filteredNews.length === 0 ? (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20">
          <p className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] px-4">No Dispatches in Category</p>
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
            {displayLimit < filteredNews.length && (
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