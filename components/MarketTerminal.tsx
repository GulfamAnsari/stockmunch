import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect
} from "react";
import { StockNews } from "../types";
import BseCards from "./BseCards";
import { API_BASE_URL } from "../config";

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

const percentageMap = new Map();

export const NewsCard: React.FC<{
  news: StockNews;
  isWatchlist?: boolean;
  onWatchlistAdd?: (item: any) => void;
  onPriceUpdate?: (id: string, pct: number) => void;
  autoRefresh?: boolean;
}> = ({ news, isWatchlist, onWatchlistAdd, onPriceUpdate }) => {
  const [showWatchlistOpts, setShowWatchlistOpts] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchLocalPercent = useCallback(async (manualUpdate = false) => {
    const hasNse = news.symbol && news.symbol !== "NSE";
    const bse = (news as any).bseCode;
    const querySymbol = hasNse ? `${news.symbol}.NS` : bse ? `${bse}.BO` : null;

    if (!querySymbol) return;

    try {
      if (manualUpdate) setIsRefreshing(true);
      
      if (percentageMap.has(querySymbol) && !manualUpdate) {
        onPriceUpdate?.(news.id, percentageMap.get(querySymbol));
      } else {
        const resp = await fetch(
          `${API_BASE_URL}/chart?symbol=${querySymbol}&interval=1d&range=1d`,
          {
            cache: "no-store",
            headers: {
              'Authorization': `Bearer ${getAuthToken()}`
            }
          }
        );
        const data = await resp.json();
        if (data && data.chart && data.chart.result && data.chart.result[0]) {
          const { chartPreviousClose, regularMarketPrice } = data.chart.result[0].meta;
          if (chartPreviousClose && regularMarketPrice) {
            const pct = ((regularMarketPrice - chartPreviousClose) / chartPreviousClose) * 100;
            onPriceUpdate?.(news.id, pct);
            percentageMap.set(querySymbol, pct);
          }
        }
      }
    } catch (e) {
      console.warn(`Could not fetch live percentage for ${querySymbol}`);
    } finally {
      if (manualUpdate) {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  }, [news.id, news.symbol, (news as any).bseCode, onPriceUpdate]);

  useEffect(() => {
    fetchLocalPercent();
  }, [fetchLocalPercent]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowWatchlistOpts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case "bullish": return "bg-[#0a2c14] text-[#22c55e] border-[#1fa84f]/10";
      case "bearish": return "bg-[#2c0a0a] text-[#ff4d4d] border-rose-500/10";
      default: return "bg-[#2c240a] text-[#d4a017] border-amber-500/10";
    }
  };

  const hasPriceData = typeof news.priceChange === 'number';
  const priceColorClass = news.priceChange >= 0 ? "text-[#22c55e] bg-[#0a2c14]" : "text-[#ff4d4d] bg-[#2c0a0a]";

  return (
    <div
      onClick={() => setIsRead(true)}
      className="bg-[#111621] border border-white/[0.06] rounded-xl p-5 flex flex-col h-full hover:border-white/10 transition-all group shadow-xl relative cursor-pointer"
    >
      {/* Header: Circle Logo, Company & Price Row, Time Row */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 shrink-0 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-slate-900 shadow-sm">
          {news.logoUrl ? (
            <img src={news.logoUrl} alt={news.symbol} className="w-full h-full object-contain p-1.5" />
          ) : (
            <span className="text-[10px] font-black text-slate-600">{news.symbol?.substring(0, 2) || "SM"}</span>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-bold text-[#60a5fa] truncate tracking-tight">
              {news.companyName}
            </h3>
            <div className="flex items-center gap-1.5">
              {hasPriceData && (
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded leading-tight ${priceColorClass}`}>
                  {news.priceChange >= 0 ? "+" : ""}{news.priceChange.toFixed(2)}%
                </span>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); fetchLocalPercent(true); }}
                className={`p-1 text-slate-600 hover:text-slate-400 transition-all ${isRefreshing ? 'animate-spin text-blue-500' : ''}`}
                title="Refresh Price"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-none mt-1">
            {news.timestamp}
          </p>
        </div>
      </div>

      {/* News Headline (Slate-400) */}
      <h4 className="text-[16px] font-bold text-slate-400 leading-[1.4] mt-5 mb-3 tracking-tight">
        {news.title}
      </h4>

      {/* Content Area with Animated Expand Logic */}
      <div className="flex-grow flex flex-col">
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-[72px] opacity-90'}`}
        >
          <p className="text-[14px] text-slate-400 leading-relaxed font-medium mb-3">
            {news.content}
          </p>
        </div>
        {(news.content.length > 150 || isExpanded) && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="text-[11px] font-black text-blue-500/80 hover:text-blue-400 transition-colors uppercase tracking-widest mt-2 mb-4 self-start"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Source Meta */}
      <div className="mb-4">
        <p className="text-[12px] text-slate-500 font-medium">
          Source: <span className="text-slate-300">{news.source || 'Business Standard'}</span>
        </p>
      </div>

      {/* Footer: AI Sentiment (Left), Watchlist Button (Right) */}
      <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
        <div className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight ${getSentimentStyles(news.sentiment)}`}>
          AI: {news.sentiment} ({news.sentimentScore}%)
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowWatchlistOpts(!showWatchlistOpts); }}
            className="flex items-center gap-3 px-4 py-2 bg-[#1c2230] hover:bg-[#252d3d] border border-white/10 rounded-lg text-[12px] font-bold text-white transition-all shadow-sm"
          >
            <span>Watchlist</span>
            <svg className={`w-4 h-4 text-slate-500 transition-transform ${showWatchlistOpts ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showWatchlistOpts && (
            <div className="absolute bottom-full right-0 mb-2 w-44 bg-[#1c2230] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
              <button
                onClick={(e) => { e.stopPropagation(); onWatchlistAdd?.({ ...news, userSentiment: "BULLISH" }); setShowWatchlistOpts(false); }}
                className="w-full text-left px-5 py-3.5 text-[11px] font-bold text-[#22c55e] hover:bg-emerald-500/5 transition-colors border-b border-white/5 uppercase"
              >
                Add as Bullish
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onWatchlistAdd?.({ ...news, userSentiment: "BEARISH" }); setShowWatchlistOpts(false); }}
                className="w-full text-left px-5 py-3.5 text-[11px] font-bold text-[#ff4d4d] hover:bg-rose-500/5 transition-colors uppercase"
              >
                Add as Bearish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MarketTerminal: React.FC<{ 
  onToggleFullScreen?: (state: boolean) => void;
  isSidebarCollapsed?: boolean;
  isRightSidebarCollapsed?: boolean;
}> = ({ onToggleFullScreen, isSidebarCollapsed, isRightSidebarCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bseSearchTerm, setBseSearchTerm] = useState("");
  const [bseCategory, setBseCategory] = useState("ALL");
  const [bseCategories, setBseCategories] = useState<string[]>(["ALL"]);
  const [bseAutoRefresh, setBseAutoRefresh] = useState(false);
  const [bseAwardsOnly, setBseAwardsOnly] = useState(false);

  const [activeTab, setActiveTab] = useState("ALL FEEDS");
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<"TIME" | "SENTIMENT" | "CHANGE">("TIME");
  const [sentimentFilters, setSentimentFilters] = useState<string[]>(["ALL"]);
  const [timeRange] = useState({ from: 0, to: 24 });
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filterDropdownSide, setFilterDropdownSide] = useState<"left" | "right">("right");
  const [displayLimit, setDisplayLimit] = useState(20);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [fromDateInput, setFromDateInput] = useState(new Date().toISOString().split("T")[0]);
  const [toDateInput, setToDateInput] = useState(new Date().toISOString().split("T")[0]);

  const lastParamsRef = useRef<string>("");
  const isFetchingRef = useRef<boolean>(false);

  const isFiltered = useMemo(() => sentimentFilters.some((f) => f !== "ALL"), [sentimentFilters]);

  useEffect(() => {
    const saved = localStorage.getItem("stockmanch_watchlist");
    if (saved) setWatchlist(JSON.parse(saved));

    const handleClickOutside = (event: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target as Node) && filterBtnRef.current && !filterBtnRef.current.contains(event.target as Node)) {
        setIsFilterPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (isFilterPanelOpen && filterBtnRef.current) {
      const rect = filterBtnRef.current.getBoundingClientRect();
      if (rect.right + 300 > window.innerWidth) setFilterDropdownSide("left");
      else setFilterDropdownSide("right");
    }
  }, [isFilterPanelOpen]);

  const updatePriceChange = useCallback((id: string, pct: number) => {
    setNews((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx === -1 || prev[idx].priceChange === pct) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], priceChange: pct };
      return next;
    });
    setWatchlist((prev) => {
      const idx = prev.findIndex((n) => n.id === id);
      if (idx === -1 || prev[idx].priceChange === pct) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], priceChange: pct };
      localStorage.setItem("stockmanch_watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const fetchNews = useCallback(async (isAuto = false) => {
    if (activeTab !== "ALL FEEDS" || isFetchingRef.current) return;
    
    const paramsKey = `${fromDateInput}_${toDateInput}`;
    if (!isAuto && lastParamsRef.current === paramsKey) return;
    if (!isAuto) lastParamsRef.current = paramsKey;
    
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const toApiDate = (d: string) => {
        const parts = d.split("-");
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
      const url = `${API_BASE_URL}/terminal?from=${toApiDate(fromDateInput)}&to=${toApiDate(toDateInput)}&source=g`;
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const json = await response.json();
      
      if (response.status === 401 || json.error === 'unauthorized') {
        document.cookie = "sm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.hash = '/login';
        return;
      }
      
      if (json.status === "success" && json.data) {
        const allItems: StockNews[] = [];
        Object.keys(json.data).forEach((dateKey) => {
          const rawItems = json.data[dateKey];
          const mappedItems: StockNews[] = rawItems.map((item: any) => {
             const rawBody = item.data.body || "";
             const bodyLines = rawBody.split("\n");
             const rawSourceLine = bodyLines[bodyLines.length - 1] || "";
             const cleanedSource = rawSourceLine.replace(/Source:\s*/i, '').trim();

             return {
              id: item.postId,
              symbol: item.data.cta?.[0]?.meta?.nseScriptCode,
              bseCode: item.data.cta?.[0]?.meta?.bseScriptCode,
              companyName: item.data.cta?.[0]?.ctaText,
              title: item.data.title || "",
              content: rawBody.split("Source:")[0],
              image: item.data.image || item.data.featuredImage,
              logoUrl: item.data.cta?.[0]?.logoUrl,
              aiAnalysis: item.summary || item.data.summary || item.machineLearningSentiments?.explanation,
              timestamp: new Date(item.publishedAt).toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
              }),
              rawPublishedAt: item.publishedAt,
              priceChange: 0,
              sentiment: item.machineLearningSentiments?.label === "negative" ? "bearish" : item.machineLearningSentiments?.label === "positive" ? "bullish" : "neutral",
              sentimentScore: Math.round((item.machineLearningSentiments?.confidence || 0.5) * 100),
              from: item.from,
              source: cleanedSource,
              logoColor: "bg-indigo-600"
            };
          });
          allItems.push(...mappedItems);
        });
        setNews((prevNews) => allItems.map(newItem => {
            const existingItem = prevNews.find(p => p.id === newItem.id);
            return { ...newItem, priceChange: existingItem ? existingItem.priceChange : 0 };
          })
        );
      }
    } catch (error) {
      console.error("Terminal API Error:", error);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [fromDateInput, toDateInput, activeTab]);

  useEffect(() => { 
    if (activeTab === "ALL FEEDS") {
      fetchNews(false); 
    } else {
      lastParamsRef.current = "";
    }
  }, [activeTab, fromDateInput, toDateInput, fetchNews]);

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh && activeTab === "ALL FEEDS") {
      interval = window.setInterval(() => {
        if (!isFetchingRef.current) fetchNews(true);
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, activeTab, fetchNews]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (displayLimit < processedNews.length) setDisplayLimit((prev) => prev + 20);
    }
  };

  const handleWatchlistAdd = (item: any) => {
    const newWatchlist = [item, ...watchlist.filter((w) => w.id !== item.id)];
    setWatchlist(newWatchlist);
    localStorage.setItem("stockmanch_watchlist", JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (id: string) => {
    const next = watchlist.filter((w) => w.id !== id);
    setWatchlist(next);
    localStorage.setItem("stockmanch_watchlist", JSON.stringify(next));
  };

  const handleSentimentToggle = (val: string) => {
    if (val === "ALL") { setSentimentFilters(["ALL"]); return; }
    let next = sentimentFilters.filter((f) => f !== "ALL");
    if (next.includes(val)) next = next.filter((f) => f !== val);
    else next.push(val);
    if (next.length === 0) next = ["ALL"];
    setSentimentFilters(next);
  };

  const handleManualRefresh = () => {
    if (activeTab === "ALL FEEDS") {
      fetchNews(false);
    } else if (activeTab === "BSE FEEDS") {
      fetchNews(false);
    }
  };

  const processedNews = useMemo(() => {
    let list = activeTab === "WATCHLIST" ? [...watchlist] : [...news];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter((n) => n.symbol?.toLowerCase().includes(lower) || n.title.toLowerCase().includes(lower) || n.companyName?.toLowerCase().includes(lower));
    }
    if (!sentimentFilters.includes("ALL")) list = list.filter((n) => sentimentFilters.includes(n.sentiment.toUpperCase()));
    list = list.filter((n) => {
      const hour = new Date(n.rawPublishedAt).getHours();
      return hour >= timeRange.from && hour <= timeRange.to;
    });
    if (sortOrder === "TIME") list.sort((a, b) => new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime());
    else if (sortOrder === "SENTIMENT") list.sort((a, b) => b.sentimentScore - a.sentimentScore);
    else if (sortOrder === "CHANGE") list.sort((a, b) => b.priceChange - a.priceChange);
    return list;
  }, [news, watchlist, activeTab, searchTerm, sortOrder, sentimentFilters, timeRange]);

  const pagedNews = useMemo(() => processedNews.slice(0, displayLimit), [processedNews, displayLimit]);

  const copyAllTitles = () => {
    const content = processedNews.map((n) => `${n.timestamp} | ${n.symbol || n.bseCode} | ${n.title}`).join("\n");
    navigator.clipboard.writeText(content);
    alert(`${processedNews.length} dispatch titles copied.`);
  };

  const toggleFullScreen = () => {
    const next = !isFullScreen;
    setIsFullScreen(next);
    if (onToggleFullScreen) onToggleFullScreen(next);
  };

  const gridClasses = useMemo(() => {
    const bothCollapsed = isSidebarCollapsed && isRightSidebarCollapsed;
    const bothOpen = !isSidebarCollapsed && !isRightSidebarCollapsed;
    
    if (bothCollapsed) {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 pt-2";
    }
    if (bothOpen) {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 pt-2";
    }
    // Mix
    return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pt-2";
  }, [isSidebarCollapsed, isRightSidebarCollapsed]);

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a] overflow-x-hidden relative">
      <div className="lg:hidden shrink-0 bg-[#0d121f] px-4 py-2 flex items-center justify-between border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Terminal Controls</span>
        <button onClick={() => setIsControlsVisible(!isControlsVisible)} className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600/10 transition-all flex items-center space-x-1">
          {isControlsVisible ? (<><span>Hide</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>) : (<><span>Show</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>

      <div className={`${isControlsVisible ? 'flex' : 'hidden lg:flex'} px-4 md:px-5 py-3 shrink-0 bg-[#0d121f] border-b border-white/[0.05] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-y-4 gap-x-6 overflow-visible`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
          <div className="flex bg-slate-950 rounded-2xl p-1 border border-white/[0.08] shadow-inner shrink-0 self-start sm:self-auto">
            {["ALL FEEDS", "BSE FEEDS", "WATCHLIST"].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setIsFilterPanelOpen(false); }} className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${ activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-500 hover:text-slate-300" }`}>{tab}</button>
            ))}
          </div>

          {activeTab === "BSE FEEDS" ? (
             <div className="flex items-center space-x-3 flex-wrap gap-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-white/[0.08]">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">CATEGORY</span>
                  <select 
                    value={bseCategory} 
                    onChange={(e) => setBseCategory(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-tight text-slate-300 focus:outline-none cursor-pointer"
                  >
                    {bseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="relative w-full sm:w-48 lg:w-64 shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
                  <input type="text" placeholder="SEARCH FILINGS..." value={bseSearchTerm} onChange={(e) => setBseSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-white/[0.08] rounded-xl pl-12 pr-4 py-2.5 text-[11px] text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-all font-mono placeholder:text-slate-800" />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setBseAwardsOnly(!bseAwardsOnly)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 ${
                      bseAwardsOnly 
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-500" 
                        : "bg-slate-950/40 border-white/[0.08] text-slate-500 hover:text-slate-300"
                    }`}
                    title="Filter: Award/Receipt of Order"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden xl:inline">Order_Receipt</span>
                  </button>
                  <button 
                    onClick={() => setBseAutoRefresh(!bseAutoRefresh)} 
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${ 
                      bseAutoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-950/40 border-white/[0.08] text-slate-500 hover:text-slate-300" 
                    }`}
                  >
                    <div className={`w-1 h-1 rounded-full ${ bseAutoRefresh ? "bg-emerald-600 animate-pulse" : "bg-slate-700" }`}></div>
                    <span>LIVE MONITOR</span>
                  </button>
                </div>
             </div>
          ) : activeTab !== "BSE FEEDS" && (
            <div className="relative w-full sm:w-48 lg:w-72 shrink-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
              <input type="text" placeholder="FILTER TERMINAL..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950 border border-white/[0.08] rounded-xl pl-12 pr-4 py-3 text-[11px] text-slate-300 focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-800" />
            </div>
          )}

          {activeTab === "ALL FEEDS" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-white/[0.08]">
                <input type="date" value={fromDateInput} onChange={(e) => setFromDateInput(e.target.value)} className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-full sm:w-[125px] cursor-pointer" />
                <span className="text-slate-700 text-[10px]">→</span>
                <input type="date" value={toDateInput} onChange={(e) => setToDateInput(e.target.value)} className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-full sm:w-[125px] cursor-pointer" />
                <button onClick={() => fetchNews(false)} disabled={loading} className="p-2 bg-blue-600/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all flex items-center justify-center min-w-[36px]" title="Sync Feed">
                  {loading ? (<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>) : (<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>)}
                </button>
              </div>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 sm:w-auto w-full ${ autoRefresh ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500" : "bg-slate-950/40 border-white/[0.08] text-slate-500 hover:text-slate-300" }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${ autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-slate-700" }`}></div>
                <span>Live Monitor</span>
              </button>
            </div>
          )}
        </div>

        {activeTab !== "BSE FEEDS" && (
          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 relative">
            <div className="flex items-center gap-3">
              <button onClick={handleManualRefresh} disabled={loading} className="p-3 bg-slate-950/40 hover:bg-slate-900 text-slate-600 hover:text-slate-300 rounded-xl border border-white/[0.08] transition-all flex items-center justify-center" title="Refresh Terminal">
                <svg className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button ref={filterBtnRef} onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 relative ${ isFilterPanelOpen ? "bg-blue-600 text-white border-blue-600" : "bg-slate-950/40 border-white/[0.08] text-slate-500 hover:text-slate-300" }`}>
                {isFiltered && (<span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0d121f] z-10"></span>)}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button onClick={copyAllTitles} className="p-3 bg-slate-950/40 hover:bg-slate-900 text-slate-600 hover:text-slate-300 rounded-xl border border-white/[0.08] transition-all flex items-center justify-center" title="Copy Current Dispatch"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
              <button onClick={toggleFullScreen} className={`p-3 bg-slate-950/40 hover:bg-slate-900 rounded-xl border border-white/[0.08] transition-all flex items-center justify-center ${ isFullScreen ? "text-blue-500 border-blue-500/30" : "text-slate-600 hover:text-slate-300" }`} title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            </div>
            {isFilterPanelOpen && (
              <div ref={filterPanelRef} className={`absolute top-full mt-4 w-72 bg-[#161b27] border border-white/10 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] p-8 z-[100] animate-in fade-in zoom-in-95 duration-200 ${ filterDropdownSide === "left" ? "right-0" : "left-0" }`}>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">AI SENTIMENT FILTER</span>
                    <div className="grid grid-cols-1 gap-3">
                      {["ALL", "BULLISH", "BEARISH", "NEUTRAL"].map((opt) => (
                        <label key={opt} className="flex items-center space-x-4 cursor-pointer group">
                          <div className="relative flex items-center">
                            <input type="checkbox" checked={sentimentFilters.includes(opt)} onChange={() => handleSentimentToggle(opt)} className="peer h-5 w-5 appearance-none border border-white/10 rounded-lg bg-slate-950 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                            <svg className="absolute w-3.5 h-3.5 text-white left-0.5 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${ sentimentFilters.includes(opt) ? "text-slate-100" : "text-slate-600 group-hover:text-slate-400" }`}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-white/[0.05]"></div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">SORT ENGINE</span>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[11px] text-slate-300 font-mono uppercase focus:outline-none focus:border-blue-500/40 transition-all"><option value="TIME">Time Descending</option><option value="SENTIMENT">AI Confidence</option><option value="CHANGE">Market Volatility</option></select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-grow overflow-y-auto px-4 sm:px-6 py-10 custom-scrollbar bg-black/10 overflow-x-hidden">
        {activeTab === "BSE FEEDS" ? (
          <BseCards 
            onWatchlistAdd={handleWatchlistAdd} 
            isSidebarCollapsed={isSidebarCollapsed} 
            externalSearch={bseSearchTerm}
            externalCategory={bseCategory}
            externalAutoRefresh={bseAutoRefresh}
            onCategoriesLoad={setBseCategories}
            showAwardsOnly={bseAwardsOnly}
          />
        ) : loading && news.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-8"><div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div><p className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-700 text-center">INITIALIZING TERMINAL TUNNEL...</p></div>
        ) : processedNews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30"><p className="text-xl font-black uppercase tracking-[0.4em] px-6">NO DISPATCHES FOUND IN REGION</p></div>
        ) : (
          <>
            <div className={gridClasses}>
              {pagedNews.map((newsItem) => (
                <div key={newsItem.id} className="relative">
                  <NewsCard news={newsItem} isWatchlist={activeTab === "WATCHLIST"} onWatchlistAdd={handleWatchlistAdd} onPriceUpdate={updatePriceChange} autoRefresh={autoRefresh} />
                  {activeTab === "WATCHLIST" && (<button onClick={() => removeFromWatchlist(newsItem.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-rose-600 text-white rounded-full flex items-center justify-center text-[12px] font-black shadow-2xl hover:scale-110 transition-all z-40 border-4 border-[#0b0f1a]">✕</button>)}
                </div>
              ))}
            </div>
            {displayLimit < processedNews.length && (<div className="py-16 flex justify-center"><div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div></div>)}
          </>
        )}
      </div>

      <footer className="shrink-0 bg-[#0d121f] border-t border-white/[0.05] px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-black font-mono text-slate-700 tracking-[0.3em] uppercase gap-3">
        <div className="flex items-center space-x-8 md:space-x-12"><div className="flex items-center space-x-3"><span className="text-blue-500/60 font-black">NODE:</span><span>READY</span></div><div className="flex items-center space-x-3"><span className="text-blue-500/60 font-black">STREAM:</span><span>{activeTab === "BSE FEEDS" ? "BSE TUNNEL SYNCED" : `${processedNews.length} DISPATCHES SYNCED`}</span></div></div>
        <div className="flex items-center space-x-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></div><span className="opacity-40 italic tracking-tighter uppercase text-center">StockManch Terminal Build v5.0.1</span></div>
      </footer>
    </div>
  );
};

export default MarketTerminal;