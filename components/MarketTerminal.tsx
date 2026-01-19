import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useLayoutEffect
} from "react";
import { StockNews } from "../types";

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

const AnimatedTooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  label?: string;
}> = ({ text, children }) => {
  const [position, setPosition] = useState<"left" | "right" | "top" | "bottom">("right");
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (windowWidth < 768) {
        if (rect.top > (windowHeight - rect.bottom)) {
          setPosition("top");
        } else {
          setPosition("bottom");
        }
      } else {
        if (rect.right + 300 > windowWidth) {
          setPosition("left");
        } else {
          setPosition("right");
        }
      }
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "right": return "top-0 left-full ml-4";
      case "left": return "top-0 right-full mr-4";
      case "top": return "bottom-full left-0 mb-4";
      case "bottom": return "top-full left-0 mt-4";
      default: return "top-0 left-full ml-4";
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case "right": return "-left-2 top-4 border-r-white/10 border-r-8 border-y-transparent border-y-8";
      case "left": return "-right-2 top-4 border-l-white/10 border-l-8 border-y-transparent border-y-8";
      case "top": return "-bottom-2 left-4 border-t-white/10 border-t-8 border-x-transparent border-x-8";
      case "bottom": return "-top-2 left-4 border-b-white/10 border-b-8 border-x-transparent border-x-8";
      default: return "";
    }
  };

  return (
    <div
      className="group/tooltip relative flex flex-col"
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
    >
      {children}
      <div
        className={`absolute z-[100] ${getPositionClasses()} px-4 py-4 bg-[#1a2235]/98 backdrop-blur-2xl text-slate-300 text-[11px] font-medium rounded-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-72 pointer-events-none opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 ease-out text-left leading-relaxed`}
      >
        {text}
        <div className={`absolute ${getArrowClasses()}`}></div>
      </div>
    </div>
  );
};

const percentageMap = new Map();

const NewsCard: React.FC<{
  news: StockNews;
  isWatchlist?: boolean;
  onWatchlistAdd: (item: any) => void;
  onPriceUpdate: (id: string, pct: number) => void;
  autoRefresh: boolean;
}> = ({ news, isWatchlist, onWatchlistAdd, onPriceUpdate }) => {
  const [showWatchlistOpts, setShowWatchlistOpts] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isNew] = useState(() => {
    const publishedAt = new Date(news.rawPublishedAt).getTime();
    const now = Date.now();
    return (now - publishedAt) < 10 * 60 * 1000;
  });

  const shouldHighlight = isNew && !isRead;

  const fetchLocalPercent = useCallback(async (manualUpdate = false) => {
    const hasNse = news.symbol && news.symbol !== "NSE";
    const bse = (news as any).bseCode;
    const querySymbol = hasNse ? `${news.symbol}.NS` : bse ? `${bse}.BO` : null;

    if (!querySymbol) return;

    try {
      if (percentageMap.has(querySymbol) && !manualUpdate) {
        onPriceUpdate(news.id, percentageMap.get(querySymbol));
      } else {
        const resp = await fetch(
          `https://droidtechknow.com/admin/api/stocks/chart.php?symbol=${querySymbol}&interval=1d&range=1d`,
          {
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
            onPriceUpdate(news.id, pct);
            percentageMap.set(querySymbol, pct);
          }
        }
      }
    } catch (e) {
      console.warn(`Could not fetch live percentage for ${querySymbol}`);
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
      case "bullish": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "bearish": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const hasPriceData = typeof news.priceChange === 'number';

  return (
    <div
      onClick={() => setIsRead(true)}
      className={`bg-[#111621] border ${
        shouldHighlight ? "border-emerald-600/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "border-white/[0.05]"
      } rounded-xl flex flex-col h-full hover:border-emerald-500/20 transition-all group shadow-2xl relative cursor-pointer`}
    >
      {shouldHighlight && (
        <div className="absolute -top-2 right-2 px-2 py-0.5 bg-emerald-600 text-slate-950 text-[8px] font-black uppercase rounded z-20 shadow-lg animate-pulse">
          New Alert
        </div>
      )}

      {isWatchlist && news.userSentiment && (
        <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest z-30 border shadow-lg ${
            news.userSentiment === "BULLISH" ? "bg-emerald-600 text-slate-950 border-emerald-500" : "bg-rose-600 text-slate-100 border-rose-500"
          }`}>
          {news.userSentiment}
        </div>
      )}

      {news.image && (
        <div className="w-full h-32 overflow-hidden bg-slate-900 border-b border-white/[0.05] rounded-t-xl">
          <img src={news.image} alt={news.symbol} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3 gap-2">
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-slate-300 text-[11px] font-black shadow-inner overflow-hidden border border-white/[0.05]`}>
              {news.logoUrl ? (
                <img src={news.logoUrl} alt={news.symbol} className="w-full h-full object-contain p-1 bg-white/[0.03]" />
              ) : (
                news.symbol.substring(0, 2)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2">
                <h3 className="text-[11px] font-black text-blue-500/90 tracking-tight uppercase leading-none truncate max-w-[120px]">
                  {news.companyName}
                </h3>
                <span className={`text-[9px] font-bold flex items-center ${
                    hasPriceData && news.priceChange !== 0 ? news.priceChange >= 0 ? "text-emerald-500/80" : "text-rose-500/80" : "text-slate-600"
                  }`}>
                  {hasPriceData && news.priceChange !== 0 ? (news.priceChange >= 0 ? "↑" : "↓") : "•"}{" "}
                  {hasPriceData ? Math.abs(news.priceChange).toFixed(2) : "0.00"}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate max-w-[140px] mt-1">
                {news.symbol || news?.bseCode}
              </p>
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

        <AnimatedTooltip text={news.title}>
          <h4 className="text-[13px] font-bold text-slate-200 leading-snug mb-3 line-clamp-2 group-hover:text-emerald-500/90 transition-colors">
            {news.title}
          </h4>
        </AnimatedTooltip>

        <div className="flex-grow">
          <AnimatedTooltip text={news.content}>
            <p className="text-[11px] text-slate-400 line-clamp-4 leading-relaxed mb-4 font-medium italic border-l-2 border-emerald-600/30 pl-3 transition-colors group-hover:text-slate-200">
              {news.content}
            </p>
          </AnimatedTooltip>
        </div>

        <div className="mt-auto">
          {news.aiAnalysis && (
            <div className="mb-3 p-3 bg-white/[0.02] rounded-lg border border-white/[0.05]">
              <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-widest block mb-1">AI Deep Analysis</span>
              <AnimatedTooltip text={news.aiAnalysis}>
                <p className="text-[9.5px] text-slate-400 leading-tight line-clamp-2 font-medium">{news.aiAnalysis}</p>
              </AnimatedTooltip>
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <div className={`px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest inline-flex items-center ${getSentimentStyles(news.sentiment)}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${news.sentiment === "bullish" ? "bg-emerald-500" : news.sentiment === "bearish" ? "bg-rose-500" : "bg-amber-500"} animate-pulse`}></div>
              AI ANALYSIS: {news.sentiment}
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] px-2 py-1.5 rounded-lg text-[9px] font-mono text-slate-500 uppercase tracking-tight whitespace-nowrap">
              Confidence: <span className="text-slate-300 font-bold">{news.sentimentScore}%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/[0.05] gap-2">
          <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowWatchlistOpts(!showWatchlistOpts); }}
              className="px-3 py-1.5 bg-white/[0.03] hover:bg-emerald-600/10 text-slate-500 hover:text-emerald-500 border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              + WATCHLIST
            </button>
            {showWatchlistOpts && (
              <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#1c2230] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onWatchlistAdd({ ...news, userSentiment: "BULLISH" }); setShowWatchlistOpts(false); }}
                  className="w-full text-left px-4 py-2.5 text-[9.5px] font-black text-emerald-500 hover:bg-emerald-600/10 uppercase tracking-widest border-b border-white/[0.05]"
                >
                  BULLISH
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onWatchlistAdd({ ...news, userSentiment: "BEARISH" }); setShowWatchlistOpts(false); }}
                  className="w-full text-left px-4 py-2.5 text-[9.5px] font-black text-rose-500 hover:bg-rose-600/10 uppercase tracking-widest"
                >
                  BEARISH
                </button>
              </div>
            )}
            <button onClick={(e) => { e.stopPropagation(); fetchLocalPercent(true); }} className="p-1.5 bg-white/[0.03] hover:bg-sky-600/10 text-slate-500 hover:text-sky-500 rounded-lg border border-white/[0.05] transition-all" title="Refresh price">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{news.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketTerminal: React.FC<{ onToggleFullScreen?: (state: boolean) => void }> = ({ onToggleFullScreen }) => {
  const [searchTerm, setSearchTerm] = useState("");
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

  const fetchNews = useCallback(async () => {
    if (activeTab === "WATCHLIST") return;
    setLoading(true);
    try {
      const toApiDate = (d: string) => {
        const parts = d.split("-");
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
      const url = `https://lavender-goldfish-594505.hostingersite.com/api/terminal?from=${toApiDate(fromDateInput)}&to=${toApiDate(toDateInput)}&source=g`;
      const response = await fetch(url, {
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
          const mappedItems: StockNews[] = rawItems.map((item: any) => ({
            id: item.postId,
            symbol: item.data.cta?.[0]?.meta?.nseScriptCode,
            bseCode: item.data.cta?.[0]?.meta?.bseScriptCode,
            companyName: item.data.cta?.[0]?.ctaText,
            title: item.data.title || "",
            content: (item.data.body || "").split("Source:")[0],
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
            source: (item.data.body || "").split("\n")[(item.data.body || "").split("\n").length - 1],
            logoColor: "bg-indigo-600"
          }));
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
      setLoading(false);
    }
  }, [fromDateInput, toDateInput, activeTab]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh && !loading && activeTab !== "WATCHLIST") interval = window.setInterval(fetchNews, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loading, fetchNews, activeTab]);

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

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a] overflow-x-hidden relative">
      <div className="lg:hidden shrink-0 bg-[#0d121f] px-4 py-2 flex items-center justify-between border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Terminal Controls</span>
        <button onClick={() => setIsControlsVisible(!isControlsVisible)} className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600/10 transition-all flex items-center space-x-1">
          {isControlsVisible ? (<><span>Hide</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>) : (<><span>Show</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>

      <div className={`${isControlsVisible ? 'flex' : 'hidden lg:flex'} px-4 md:px-8 py-3 shrink-0 bg-[#0d121f] border-b border-white/[0.05] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-y-4 gap-x-6`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-wrap">
          <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/[0.05] shadow-inner shrink-0 self-start sm:self-auto">
            {["ALL FEEDS", "WATCHLIST"].map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setIsFilterPanelOpen(false); }} className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${ activeTab === tab ? "bg-emerald-700 text-slate-100 shadow-lg" : "text-slate-500 hover:text-slate-300" }`}>{tab}</button>
            ))}
          </div>
          <div className="relative w-full sm:w-48 lg:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></div>
            <input type="text" placeholder="SEARCH SYMBOL..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-950/40 border border-white/[0.05] rounded-lg pl-10 pr-3 py-2 text-[10px] text-slate-300 focus:outline-none focus:border-emerald-600/50 transition-all font-mono placeholder:text-slate-700" />
          </div>
          {activeTab !== "WATCHLIST" && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="flex items-center space-x-2 bg-slate-900/50 p-1 rounded-lg border border-white/[0.05]">
                <input type="date" value={fromDateInput} onChange={(e) => setFromDateInput(e.target.value)} className="bg-slate-900 border border-white/10 rounded-md px-2 py-1 text-[9px] text-slate-400 font-mono focus:border-emerald-600/50 focus:outline-none w-full sm:w-[110px] cursor-pointer" />
                <span className="text-slate-600 text-[10px]">→</span>
                <input type="date" value={toDateInput} onChange={(e) => setToDateInput(e.target.value)} className="bg-slate-900 border border-white/10 rounded-md px-2 py-1 text-[9px] text-slate-400 font-mono focus:border-emerald-600/50 focus:outline-none w-full sm:w-[110px] cursor-pointer" />
                <button onClick={fetchNews} disabled={loading} className="p-1.5 bg-emerald-600/10 text-emerald-500 rounded-md border border-emerald-600/20 hover:bg-emerald-600/20 transition-all flex items-center justify-center min-w-[32px]" title="Sync Feed">
                  {loading ? (<div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>) : (<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>)}
                </button>
              </div>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 sm:w-auto w-full ${ autoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-950/40 border-white/[0.05] text-slate-500 hover:text-slate-300" }`}>
                <div className={`w-2 h-2 rounded-full ${ autoRefresh ? "bg-emerald-600 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-slate-700" }`}></div>
                <span>Live Monitoring</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 relative">
          <div className="flex items-center gap-3">
            <button ref={filterBtnRef} onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)} className={`px-3 sm:px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-1.5 relative ${ isFilterPanelOpen ? "bg-emerald-600 text-slate-100 border-emerald-600" : "bg-slate-950/40 border-white/[0.05] text-slate-500 hover:text-slate-300" }`}>
              {isFiltered && (<span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full border-2 border-[#0d121f] z-10 animate-pulse"></span>)}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              <span className="hidden sm:inline">Filters</span>
            </button>
            <button onClick={copyAllTitles} className="p-2 bg-slate-950/40 hover:bg-slate-900 text-slate-600 hover:text-slate-300 rounded-lg border border-white/[0.05] transition-all flex items-center justify-center" title="Copy Current Dispatch"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
            <button onClick={toggleFullScreen} className={`p-2 bg-slate-950/40 hover:bg-slate-900 rounded-lg border border-white/[0.05] transition-all flex items-center justify-center ${ isFullScreen ? "text-emerald-500 border-emerald-500/30" : "text-slate-600 hover:text-slate-300" }`} title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg></button>
          </div>
          {isFilterPanelOpen && (
            <div ref={filterPanelRef} className={`absolute top-full mt-3 w-72 bg-[#161b27] border border-white/[0.05] rounded-2xl shadow-2xl p-6 z-[100] animate-in fade-in zoom-in-95 duration-200 ${ filterDropdownSide === "left" ? "right-0" : "left-0" }`}>
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">AI Sentiment</span>
                  <div className="grid grid-cols-1 gap-2">
                    {["ALL", "BULLISH", "BEARISH", "NEUTRAL"].map((opt) => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={sentimentFilters.includes(opt)} onChange={() => handleSentimentToggle(opt)} className="peer h-4 w-4 appearance-none border border-white/20 rounded bg-slate-900 checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer" />
                          <svg className="absolute w-3 h-3 text-slate-950 left-0.5 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${ sentimentFilters.includes(opt) ? "text-slate-200" : "text-slate-600 group-hover:text-slate-400" }`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-white/[0.03]"></div>
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest block">Sort Method</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-slate-300 font-mono uppercase focus:outline-none"><option value="TIME">Newest First</option><option value="SENTIMENT">AI Confidence</option><option value="CHANGE">Volatility</option></select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-grow overflow-y-auto px-4 md:px-8 py-8 custom-scrollbar bg-black/[0.02] overflow-x-hidden">
        {loading && news.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6"><div className="w-16 h-16 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div><p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-20 text-center">Connecting Stream...</p></div>
        ) : processedNews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20"><p className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] px-4">No Match in Tunnel</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 pt-4">
              {pagedNews.map((newsItem) => (
                <div key={newsItem.id} className="relative">
                  <NewsCard news={newsItem} isWatchlist={activeTab === "WATCHLIST"} onWatchlistAdd={handleWatchlistAdd} onPriceUpdate={updatePriceChange} autoRefresh={autoRefresh} />
                  {activeTab === "WATCHLIST" && (<button onClick={() => removeFromWatchlist(newsItem.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-600 text-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:scale-110 transition-all z-40 border border-white/10">✕</button>)}
                </div>
              ))}
            </div>
            {displayLimit < processedNews.length && (<div className="py-10 flex justify-center"><div className="w-8 h-8 border-2 border-emerald-600/20 border-t-emerald-600 rounded-full animate-spin"></div></div>)}
          </>
        )}
      </div>

      <footer className="shrink-0 bg-[#111621] border-t border-white/[0.05] px-4 md:px-8 py-3 flex flex-col sm:flex-row items-center justify-between text-[9px] font-black font-mono text-slate-700 tracking-[0.2em] uppercase gap-2">
        <div className="flex items-center space-x-6 md:space-x-10"><div className="flex items-center space-x-2"><span className="text-emerald-600/80 font-black">SYSTEM:</span><span>READY</span></div><div className="flex items-center space-x-2"><span className="text-emerald-600/80 font-black">STREAM:</span><span>{processedNews.length} SYNCED</span></div></div>
        <div className="flex items-center space-x-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-600 opacity-30"></div><span className="opacity-40 italic tracking-tight uppercase text-center">StockManch</span></div>
      </footer>
    </div>
  );
};

export default MarketTerminal;