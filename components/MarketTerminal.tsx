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

// Optimized audio handling with a real sound file
const alertAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const playAlertSound = () => {
  alertAudio.currentTime = 0;
  alertAudio.play().catch(e => {
    // Browsers often block autoplay until the first user interaction
    console.debug("Audio play deferred or blocked by browser policy.");
  });
};

// Universal NewsCard for both General and BSE feeds
export const NewsCard: React.FC<{
  news: any;
  isWatchlist?: boolean;
  onWatchlistAdd?: (item: any) => void;
  onPriceUpdate?: (id: string, pct: number) => void;
  autoRefresh?: boolean;
  variant?: 'general' | 'bse';
}> = ({ news, isWatchlist, onWatchlistAdd, onPriceUpdate, variant = 'general' }) => {
  const [showWatchlistOpts, setShowWatchlistOpts] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isBse = variant === 'bse';

  const [isNew] = useState(() => {
    const publishedAt = new Date(news.rawPublishedAt).getTime();
    const now = Date.now();
    return (now - publishedAt) < 10 * 60 * 1000;
  });

  const shouldHighlight = isNew && !isRead;

  const fetchLocalPercent = useCallback(async (manualUpdate = false) => {
    if (isBse) return;
    const hasNse = news.symbol && news.symbol !== "NSE";
    const bse = news.bseCode;
    const querySymbol = hasNse ? `${news.symbol}.NS` : bse ? `${bse}.BO` : null;

    if (!querySymbol) return;

    try {
      if (percentageMap.has(querySymbol) && !manualUpdate) {
        onPriceUpdate?.(news.id, percentageMap.get(querySymbol));
      } else {
        const resp = await fetch(
          `${API_BASE_URL}/chart?symbol=${querySymbol}&interval=1d&range=1d`,
          {
            cache: "no-store",
            headers: { 'Authorization': `Bearer ${getAuthToken()}` }
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
    }
  }, [news.id, news.symbol, news.bseCode, onPriceUpdate, isBse]);

  useEffect(() => {
    if (!isBse && (news.symbol || news.bseCode)) fetchLocalPercent();
  }, [fetchLocalPercent, isBse]);

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
    switch (sentiment?.toLowerCase()) {
      case "bullish": return "bg-[#062010] text-[#4ade80]";
      case "bearish": return "bg-[#2d1212] text-[#fca5a5]";
      default: return "bg-[#1c190a] text-[#fbbf24]";
    }
  };

  const getPriceStyles = (pct: number) => {
    if (pct > 0) return "bg-[#062010] text-[#4ade80]";
    if (pct < 0) return "bg-[#2d1212] text-[#fca5a5]";
    return "bg-[#1f2937] text-[#9ca3af]";
  };

  const handlePdfClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (news.pdfUrl) window.open(news.pdfUrl, '_blank', 'noopener,noreferrer');
  };

  const hasPriceData = typeof news.priceChange === 'number';

  return (
    <div
      onClick={() => setIsRead(true)}
      className={`bg-[#111621] border ${
        shouldHighlight ? "border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "border-white/[0.06]"
      } rounded-2xl flex flex-col h-full hover:border-blue-500/30 transition-all group shadow-2xl relative cursor-pointer group/card min-w-[310px]`}
    >
      {shouldHighlight && (
        <div className="absolute -top-2 right-4 px-2 py-0.5 bg-emerald-600 text-slate-950 text-[8px] font-black uppercase rounded z-20 shadow-lg animate-pulse">
          New Alert
        </div>
      )}

      {!isBse && isWatchlist && news.userSentiment && (
        <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest z-30 border shadow-lg ${
            news.userSentiment === "BULLISH" ? "bg-emerald-600 text-slate-950 border-emerald-500" : "bg-rose-600 text-slate-100 border-rose-500"
          }`}>
          {news.userSentiment}
        </div>
      )}

      {!isBse && news.image && (
        <div className="w-full h-32 overflow-hidden bg-slate-900 border-b border-white/[0.05] rounded-t-2xl">
          <img src={news.image} alt={news.symbol} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-90" />
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col h-full relative z-10">
        <div className="flex items-start justify-between mb-5 gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            {!isBse && (
              <div className={`w-9 h-9 shrink-0 flex items-center justify-center overflow-hidden bg-slate-900 rounded-xl border border-white/[0.05]`}>
                {news.logoUrl ? (
                  <img src={news.logoUrl} alt={news.symbol} className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-700">
                    {news.symbol?.substring(0, 2) || "SM"}
                  </div>
                )}
              </div>
            )}
            
            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-[14px] font-semibold text-[#60a5fa] leading-tight truncate">
                {news.companyName}
              </h3>
              <p className="text-[12px] text-[#9ca3af] font-normal leading-tight mt-0.5 whitespace-nowrap">
                {news.timestamp}
              </p>
            </div>
          </div>

          {!isBse && (
            <div className="flex flex-col items-end shrink-0 pt-1">
               <div className="flex items-center gap-1.5 mb-1">
                  {(news.priceChange !== undefined || news.symbol) && (
                    <div className={`px-2 py-0.5 rounded-lg text-[10px] font-normal font-mono tracking-tight transition-colors ${getPriceStyles(news.priceChange || 0)}`}>
                      {hasPriceData ? (news.priceChange >= 0 ? "+" : "") : ""}{hasPriceData ? news.priceChange.toFixed(2) : "0.00"}%
                    </div>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); fetchLocalPercent(true); }} 
                    className="p-1 bg-white/[0.03] hover:bg-blue-500/10 text-[#9ca3af] hover:text-blue-400 rounded-md border border-white/[0.08] transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
               </div>
               <span className="text-[8px] text-[#9ca3af] font-mono font-normal uppercase tracking-widest">{news.symbol || news.bseCode}</span>
            </div>
          )}
          {isBse && (
            <div className="flex flex-col items-end shrink-0 pt-1">
              <span className="text-[8px] text-[#9ca3af] font-mono font-normal uppercase tracking-widest">{news.bseCode || news.symbol}</span>
            </div>
          )}
        </div>

        <h4 className={`text-[13px] sm:text-[14px] font-medium text-[#d1d5db] leading-[1.3] mb-3 group-hover:text-blue-300 transition-colors tracking-tight uppercase ${isExpanded ? '' : 'line-clamp-2'}`}>
          {news.title}
        </h4>

        <div className="flex-grow relative min-w-0">
          <p className={`text-[11px] text-[#9ca3af] leading-relaxed mb-4 font-medium border-l-2 border-slate-800/50 pl-3 transition-all duration-300 ${isExpanded ? 'line-clamp-none bg-white/[0.02] py-2' : 'line-clamp-3'}`}>
            {news.content}
          </p>
          {news.content?.length > 120 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="flex items-center space-x-1 text-[9px] font-black text-[#9ca3af] hover:text-blue-400 uppercase tracking-widest mb-4 transition-colors"
            >
              <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
              <svg className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        <div className="mt-auto">
          {!isBse && news.aiAnalysis && (
            <div className="mb-4 p-3 bg-white/[0.015] rounded-xl border border-white/[0.04]">
              <span className="text-[8px] font-black text-emerald-600/80 uppercase tracking-widest block mb-1.5">Analysis Node</span>
              <p className="text-[10px] text-[#9ca3af] leading-relaxed line-clamp-2 font-medium italic">{news.aiAnalysis}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#9ca3af] font-normal uppercase tracking-[0.05em] block whitespace-nowrap overflow-hidden text-ellipsis max-w-[140px]">
                Source: <span className="text-slate-300 font-normal">{news.source || 'BSE'}</span>
              </span>
            </div>
            {isBse && news.category && (
              <div className="px-2 py-0.5 bg-white/[0.03] text-slate-500 border border-white/[0.06] rounded-lg text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
                {news.category}
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/[0.05] gap-2 min-w-0">
          {!isBse ? (
            <div className="flex items-center gap-2 relative shrink-0" ref={dropdownRef}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowWatchlistOpts(!showWatchlistOpts); }}
                className="px-3 py-1.5 bg-white/[0.03] hover:bg-emerald-500/10 text-[#9ca3af] hover:text-emerald-500 border border-white/[0.08] rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
              >
                + WATCHLIST
              </button>
              {showWatchlistOpts && (
                <div className="absolute bottom-full left-0 mb-3 w-32 bg-[#1c2230] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onWatchlistAdd?.({ ...news, userSentiment: "BULLISH" }); setShowWatchlistOpts(false); }}
                    className="w-full text-left px-4 py-2 text-[9px] font-black text-emerald-500 hover:bg-emerald-600/10 uppercase tracking-widest border-b border-white/[0.05]"
                  >
                    BULLISH
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onWatchlistAdd?.({ ...news, userSentiment: "BEARISH" }); setShowWatchlistOpts(false); }}
                    className="w-full text-left px-4 py-2 text-[9px] font-black text-rose-500 hover:bg-rose-600/10 uppercase tracking-widest"
                  >
                    BEARISH
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-grow"></div>
          )}
          
          <div className="flex items-center gap-2 shrink-0">
            {news.pdfUrl && (
               <button
                  onClick={handlePdfClick}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 text-slate-950 font-black rounded-lg text-[8px] uppercase tracking-widest transition-all hover:bg-emerald-500 shadow-lg"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>FILING</span>
                </button>
            )}
            {!isBse && (
              <div className={`px-2.5 py-1.5 rounded-lg text-[10px] font-normal uppercase tracking-wide inline-flex items-center ${getSentimentStyles(news.sentiment)}`}>
                AI: {news.sentiment || 'NEUTRAL'} ({news.sentimentScore || 0}%)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketTerminal: React.FC<{ 
  onToggleFullScreen?: (state: boolean) => void;
  isSidebarCollapsed?: boolean;
  userId?: string | number;
}> = ({ onToggleFullScreen, isSidebarCollapsed, userId }) => {
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
  const isFetchingWatchlistRef = useRef<boolean>(false);
  const lastAlertIdRef = useRef<string | null>(null);

  const isFiltered = useMemo(() => sentimentFilters.some((f) => f !== "ALL"), [sentimentFilters]);

  // Audio alert monitor
  useEffect(() => {
    if (news.length > 0) {
      const topId = news[0].id;
      if (lastAlertIdRef.current && lastAlertIdRef.current !== topId) {
        try {
          const stored = localStorage.getItem("stockmanch_settings");
          if (stored) {
            const settingsObj = JSON.parse(stored);
            if (settingsObj?.settings?.terminal_audio === 1) {
              playAlertSound();
            }
          }
        } catch (e) {}
      }
      lastAlertIdRef.current = topId;
    }
  }, [news]);

  // Watchlist Persistence API
  const fetchWatchlist = useCallback(async () => {
    if (!userId || isFetchingWatchlistRef.current) return;
    
    isFetchingWatchlistRef.current = true;
    try {
      const resp = await fetch(`${API_BASE_URL}/localstorage?user_id=${userId}`, { cache: 'no-store' });
      const json = await resp.json();
      if (json.status === 'success') {
        setWatchlist(json.data.watchlist);
      }
    } catch (e) {
      console.warn("Failed to fetch watchlist from node", e);
    } finally {
      isFetchingWatchlistRef.current = false;
    }
  }, [userId]);

  const saveWatchlistToNode = useCallback(async (list: any[]) => {
    if (!userId) return;
    try {
      await fetch(`${API_BASE_URL}/localstorage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          watchlist: list
        })
      });
    } catch (e) {
      console.warn("Failed to sync watchlist to node", e);
    }
  }, [userId]);

  // Use a ref to ensure we only trigger the initial fetch once per userId transition
  const lastFetchedUserId = useRef<string | number | null>(null);
  useEffect(() => {
    if (userId && userId !== lastFetchedUserId.current) {
      lastFetchedUserId.current = userId;
      fetchWatchlist();
    }
  }, [userId, fetchWatchlist]);

  useEffect(() => {
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
      saveWatchlistToNode(next);
      return next;
    });
  }, [saveWatchlistToNode]);

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
        headers: { 'Authorization': `Bearer ${getAuthToken()}` }
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
    saveWatchlistToNode(newWatchlist);
  };

  const removeFromWatchlist = (id: string) => {
    const next = watchlist.filter((w) => w.id !== id);
    setWatchlist(next);
    saveWatchlistToNode(next);
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
    alert(`${processedNews.length} titles copied.`);
  };

  const toggleFullScreen = () => {
    const next = !isFullScreen;
    setIsFullScreen(next);
    if (onToggleFullScreen) onToggleFullScreen(next);
  };

  const handleSentimentToggleCheck = (opt: string) => {
    handleSentimentToggle(opt);
  };

  const gridClasses = "grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-4 pt-2";

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a] overflow-x-hidden relative">
      {/* Mobile Toggle to Hide Header */}
      <div className="lg:hidden shrink-0 bg-[#0d121f] px-4 py-2 flex items-center justify-between border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Terminal Controls</span>
        <button 
          onClick={() => setIsControlsVisible(!isControlsVisible)} 
          className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600/10 transition-all flex items-center space-x-1"
        >
          {isControlsVisible ? (<><span>Hide</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>) : (<><span>Show</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>

      {/* Redesigned Header with full responsiveness */}
      <div className={`${isControlsVisible ? 'flex' : 'hidden lg:flex'} px-4 md:px-6 py-4 shrink-0 bg-[#0d121f] border-b border-white/[0.08] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-y-4 gap-x-6 z-40 overflow-visible`}>
        
        {/* Row 1: Nav Tabs & Mobile Context */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-grow flex-wrap">
          
          {/* Navigation Tabs */}
          <div className="flex bg-slate-950 rounded-2xl p-1 border border-white/[0.1] shadow-xl shrink-0 self-start sm:self-auto w-full sm:w-auto">
            {["ALL FEEDS", "BSE FEEDS", "WATCHLIST"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setIsFilterPanelOpen(false); }} 
                className={`flex-1 sm:flex-none px-4 md:px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${ activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-500 hover:text-slate-300" }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-white/5 hidden xl:block"></div>

          {/* Contextual Inputs (BSE or Standard) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-grow min-w-0">
            {activeTab === "BSE FEEDS" ? (
              <div className="flex items-center space-x-3 flex-wrap gap-y-2 animate-in fade-in slide-in-from-left-2 duration-300 flex-grow">
                <div className="flex items-center space-x-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/[0.1] shadow-inner flex-grow sm:flex-grow-0">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:inline">CAT</span>
                  <select 
                    value={bseCategory} 
                    onChange={(e) => setBseCategory(e.target.value)}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-tight text-slate-200 focus:outline-none cursor-pointer w-full"
                  >
                    {bseCategories.map(c => <option key={c} value={c} className="bg-[#111621]">{c}</option>)}
                  </select>
                </div>
                <div className="relative flex-grow sm:max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="SEARCH FILINGS..." 
                    value={bseSearchTerm} 
                    onChange={(e) => setBseSearchTerm(e.target.value)} 
                    className="w-full bg-slate-900 border border-white/[0.15] rounded-xl pl-12 pr-4 py-2.5 text-[11px] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-400" 
                  />
                </div>
                <button 
                    onClick={() => setBseAwardsOnly(!bseAwardsOnly)}
                    className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 ${ bseAwardsOnly ? "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-lg" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300" }`}
                >
                    <span>Order_Receipt</span>
                </button>
                <button 
                  onClick={() => setBseAutoRefresh(!bseAutoRefresh)} 
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${ bseAutoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300" }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${ bseAutoRefresh ? "bg-emerald-600 animate-pulse" : "bg-slate-700" }`}></div>
                  <span>LIVE</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-grow">
                <div className="relative flex-grow sm:max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    placeholder="FILTER TERMINAL..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full bg-slate-900 border border-white/[0.15] rounded-xl pl-12 pr-4 py-2.5 text-[11px] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-400" 
                  />
                </div>

                {activeTab === "ALL FEEDS" && (
                  <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/[0.1] shadow-inner shrink-0">
                    <input type="date" value={fromDateInput} onChange={(e) => setFromDateInput(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-[120px] cursor-pointer" />
                    <span className="text-slate-700 text-[10px]">→</span>
                    <input type="date" value={toDateInput} onChange={(e) => setToDateInput(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-lg px-3 py-1.5 text-[10px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-[120px] cursor-pointer" />
                    <button onClick={() => fetchNews(false)} disabled={loading} className="p-2 bg-blue-600/10 text-blue-500 rounded-lg border border-blue-500/20 hover:bg-blue-600/20 transition-all min-w-[36px]">
                      {loading ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    </button>
                  </div>
                )}
                
                {activeTab === "ALL FEEDS" && (
                  <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 shrink-0 ${ autoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300" }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${ autoRefresh ? "bg-emerald-600 animate-pulse" : "bg-slate-700" }`}></div>
                    <span>Monitor</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Global Utility Actions */}
        <div className="flex items-center gap-3 shrink-0 relative justify-end">
          {activeTab !== "BSE FEEDS" && (
            <button ref={filterBtnRef} onClick={(e) => { e.stopPropagation(); setIsFilterPanelOpen(!isFilterPanelOpen); }} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 relative ${ isFilterPanelOpen ? "bg-blue-600 text-white border-blue-600 shadow-lg" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300" }`}>
              {isFiltered && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d121f] z-10 animate-pulse"></span>}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              <span className="hidden sm:inline">Filter</span>
            </button>
          )}
          <button onClick={copyAllTitles} className="p-2.5 bg-slate-900/40 hover:bg-slate-800 text-slate-500 hover:text-slate-200 rounded-xl border border-white/[0.1] transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
          <button onClick={toggleFullScreen} className={`p-2.5 bg-slate-900/40 hover:bg-slate-800 rounded-xl border border-white/[0.1] transition-all ${ isFullScreen ? "text-blue-500 border-blue-500/30" : "text-slate-500 hover:text-slate-200" }`}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg></button>
          
          {isFilterPanelOpen && activeTab !== "BSE FEEDS" && (
            <div ref={filterPanelRef} className={`absolute top-full mt-4 w-64 sm:w-72 bg-[#161b27] border border-white/10 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] p-8 z-[100] animate-in fade-in zoom-in-95 duration-200 ${ filterDropdownSide === "left" ? "right-0" : "left-0" }`}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">AI SENTIMENT FILTER</span>
                  <div className="grid grid-cols-1 gap-3">
                    {["ALL", "BULLISH", "BEARISH", "NEUTRAL"].map((opt) => (
                      <label key={opt} className="flex items-center space-x-4 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={sentimentFilters.includes(opt)} onChange={() => handleSentimentToggleCheck(opt)} className="peer h-5 w-5 appearance-none border border-white/10 rounded-lg bg-slate-950 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
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
      </div>

      <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-grow overflow-y-auto px-2 sm:px-3 py-8 custom-scrollbar bg-black/10 overflow-x-hidden">
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
                  <NewsCard news={newsItem} isWatchlist={activeTab === "WATCHLIST"} onWatchlistAdd={handleWatchlistAdd} onPriceUpdate={updatePriceChange} autoRefresh={autoRefresh} variant="general" />
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