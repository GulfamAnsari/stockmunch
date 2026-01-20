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

const BseNewsCard: React.FC<{ news: BseNewsItem; onWatchlistAdd: (item: any) => void; onPdfView: (url: string) => void }> = ({ news, onWatchlistAdd, onPdfView }) => {
  const [isRead, setIsRead] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      onClick={() => setIsRead(true)}
      className={`bg-[#111621] border border-white/[0.06] rounded-2xl flex flex-col h-full hover:border-emerald-500/30 transition-all group shadow-2xl relative cursor-pointer group/card ${isRead ? 'opacity-80' : ''}`}
    >
      <div className="p-6 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="min-w-0">
            <h3 className="text-[12px] font-extrabold text-emerald-400/90 tracking-tight uppercase leading-none truncate max-w-[200px] mb-1.5">
              {news.companyName}
            </h3>
            <div className="flex items-center space-x-3">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest">
                {news.bseCode}
              </span>
              <span className="text-slate-800">•</span>
              <span className="text-[9px] px-2 py-0.5 bg-blue-500/10 text-blue-400 font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                BSE INDIA
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-tighter leading-none mb-1">
              {news.timestamp.split(",")[1]?.trim() || ""}
            </p>
            <p className="text-[9px] text-slate-600 font-mono uppercase tracking-tighter">
              {news.timestamp.split(",")[0]?.trim() || ""}
            </p>
          </div>
        </div>

        <h4 className="text-[15px] font-medium text-slate-400/90 leading-[1.4] mb-3 line-clamp-2 group-hover:text-emerald-300 transition-colors uppercase tracking-tight">
          {news.title}
        </h4>

        <div className="flex-grow relative">
          <p className={`text-[12px] text-slate-500 leading-relaxed mb-4 font-medium border-l-2 border-emerald-900/30 pl-4 group-hover:border-emerald-500/40 transition-all duration-300 ${isExpanded ? 'line-clamp-none bg-emerald-500/[0.02] py-2' : 'line-clamp-3'}`}>
            {news.content}
          </p>
          {news.content.length > 120 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center space-x-1 text-[10px] font-black text-slate-600 hover:text-emerald-400 uppercase tracking-widest mb-4 transition-colors"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              <svg className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="pt-5 mt-auto flex items-center justify-between border-t border-white/[0.05] gap-4">
          <div className="px-3 py-1.5 bg-white/[0.03] text-slate-500 border border-white/[0.06] rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
            {news.category}
          </div>
          
          {news.pdfUrl ? (
            <button
              onClick={(e) => { e.stopPropagation(); onPdfView(news.pdfUrl!); }}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-slate-900 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-[0_10px_30px_rgba(5,150,105,0.3)] shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>FILING</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-700 font-black uppercase tracking-widest whitespace-nowrap">BSE DATA</span>
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
  const [searchTerm, setSearchTerm] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);
  const initialFetchDone = useRef(false);

  const fetchBseFeeds = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/bsefeed`, {
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
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchBseFeeds(true);
    }
  }, [fetchBseFeeds]);

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh) {
      interval = window.setInterval(() => fetchBseFeeds(false), 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchBseFeeds]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    bseNews.forEach(n => set.add(n.category));
    return ["ALL", ...Array.from(set)].sort();
  }, [bseNews]);

  const filteredNews = useMemo(() => {
    let list = bseNews;
    if (selectedCategory !== "ALL") {
      list = list.filter(n => n.category === selectedCategory);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(n => 
        n.companyName.toLowerCase().includes(lower) || 
        n.bseCode.toLowerCase().includes(lower) || 
        n.title.toLowerCase().includes(lower)
      );
    }
    return list;
  }, [bseNews, selectedCategory, searchTerm]);

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

  const handlePdfOpen = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

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
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.05]">
        <div className="flex items-center space-x-6 flex-wrap gap-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CATEGORY</span>
            <select 
              value={selectedCategory} 
              onChange={(e) => { setSelectedCategory(e.target.value); setDisplayLimit(10); }}
              className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-[11px] font-black uppercase tracking-tight text-slate-300 focus:outline-none focus:border-blue-500/50 transition-all"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH BSE FEEDS..." 
              value={searchTerm} 
              onChange={(e) => { setSearchTerm(e.target.value); setDisplayLimit(10); }} 
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-all font-mono placeholder:text-slate-800" 
            />
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block"></div>
          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">PIPELINE</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
        </div>
        
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)} 
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${ 
            autoRefresh ? "bg-blue-600/10 border-blue-600/50 text-blue-500" : "bg-slate-950/40 border-white/[0.08] text-slate-500 hover:text-slate-300" 
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${ autoRefresh ? "bg-blue-600 animate-pulse" : "bg-slate-700" }`}></div>
          <span>BSE LIVE (10s)</span>
        </button>
      </div>

      {filteredNews.length === 0 ? (
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20">
          <p className="text-xl font-black uppercase tracking-[0.4em] px-8">NO DISPATCHES IN REGION</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pt-4 animate-in fade-in duration-700">
            {pagedNews.map((newsItem) => (
              <BseNewsCard 
                key={newsItem.id} 
                news={newsItem} 
                onWatchlistAdd={onWatchlistAdd} 
                onPdfView={handlePdfOpen}
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