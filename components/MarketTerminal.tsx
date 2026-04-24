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
import { RemarkModal } from "./RemarkModal";
import { API_BASE_URL } from "../config";

// Color scheme for remarks
const REMARK_COLORS: { [key: string]: { bgColor: string; borderColor: string; textColor: string; icon: string } } = {
  'Bullish': { bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', textColor: 'text-emerald-400', icon: '📈' },
  'Bearish': { bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', textColor: 'text-red-400', icon: '📉' },
  'Swing': { bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', textColor: 'text-amber-400', icon: '⚡' },
  'Long Term': { bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400', icon: '📅' },
  'Positioned': { bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', textColor: 'text-violet-400', icon: '🎯' },
};

const getRemarkColor = (remark: string) => {
  return REMARK_COLORS[remark] || { bgColor: 'bg-blue-600/10', borderColor: 'border-blue-500/30', textColor: 'text-blue-400', icon: '📝' };
};

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

const percentageMap = new Map();

// Optimized audio handling
const alertAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const playAlertSound = () => {
  try {
    const stored = localStorage.getItem("stockmunch_settings");
    if (stored) {
      const settingsObj = JSON.parse(stored);
      if (settingsObj?.settings?.terminal_audio === 1) {
        alertAudio.currentTime = 0;
        alertAudio.play().catch(() => { });
      }
    }
  } catch (e) { }
};

// Global helper for persistent read status
const markAsRead = (id: string) => {
  try {
    const readStr = localStorage.getItem('sm_read_ids') || '[]';
    const readArray = JSON.parse(readStr);
    if (!readArray.includes(id)) {
      readArray.push(id);
      // Keep only last 1000 items to prevent storage bloat
      localStorage.setItem('sm_read_ids', JSON.stringify(readArray.slice(-1000)));
    }
  } catch (e) { }
};

const isIdRead = (id: string) => {
  try {
    const readStr = localStorage.getItem('sm_read_ids') || '[]';
    return JSON.parse(readStr).includes(id);
  } catch (e) {
    return false;
  }
};

export const NewsCard: React.FC<{
  news: any;
  isWatchlist?: boolean;
  onWatchlistAdd?: (item: any) => void;
  onRemarkSave?: (itemId: string, remark: string) => void;
  onRemarkOpen?: (itemId: string, currentRemark?: string) => void;
  onPriceUpdate?: (id: string, pct: number) => void;
  autoRefresh?: boolean;
  variant?: 'general' | 'bse';
}> = ({ news, isWatchlist, onWatchlistAdd, onRemarkSave, onRemarkOpen, onPriceUpdate, autoRefresh, variant = 'general' }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isReadInternal, setIsReadInternal] = useState(() => isIdRead(news.id));
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isBse = variant === 'bse';

  // Check AI insights setting from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("stockmunch_settings");
      if (stored) {
        const settingsObj = JSON.parse(stored);
        setShowAIInsights(!!settingsObj?.settings?.ai_insight);
      }
    } catch (e) {}
  }, []);

  // Synchronize read state if ID changes or on mount
  useEffect(() => {
    setIsReadInternal(isIdRead(news.id));
  }, [news.id]);

  const isActuallyNew = useMemo(() => {
    if (!news.rawPublishedAt) return false;
    const publishedAt = new Date(news.rawPublishedAt).getTime();
    if (isNaN(publishedAt)) return false;
    const now = Date.now();
    // Highlight if item is less than 30 minutes old
    return (now - publishedAt) < 30 * 60 * 1000;
  }, [news.rawPublishedAt]);

  // Only highlight if monitor is on AND item is newly added AND isHighlighted is true
  const shouldHighlight = autoRefresh && isActuallyNew && !isReadInternal && news.isNewlyAdded && isHighlighted && !isWatchlist;

  // Auto-unhighlight after 5 minutes
  useEffect(() => {
    if (shouldHighlight) {
      highlightTimerRef.current = setTimeout(() => {
        setIsHighlighted(false);
      }, 5 * 60 * 1000); // 5 minutes
      return () => {
        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
      };
    }
  }, [shouldHighlight]);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
  }, []);

  const handleCardClick = () => {
    // Remove highlight when card is clicked
    if (shouldHighlight) {
      setIsHighlighted(false);
      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    }
    if (!isReadInternal) {
      setIsReadInternal(true);
      markAsRead(news.id);
    }
  };

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
      onClick={handleCardClick}
      className={`bg-[#111621] border-2 transition-all duration-300 group shadow-2xl relative cursor-pointer group/card min-w-[310px] rounded-2xl flex flex-col h-full ${shouldHighlight
          ? "border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/20"
          : "border-white/[0.06] hover:border-blue-500/30"
        }`}
    >
      {shouldHighlight && (
        <div className="absolute -top-3 right-4 px-2 py-0.5 bg-emerald-600 text-slate-950 text-[9px] font-black uppercase rounded z-20 shadow-xl animate-bounce">
          New Alert
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
          {!isBse && showAIInsights && news.aiAnalysis && (
            <div className="mb-4 p-3 bg-white/[0.015] rounded-xl border border-white/[0.04]">
              <span className="text-[8px] font-black text-emerald-600/80 uppercase tracking-widest block mb-1.5">Analysis Node</span>
              <p className="text-[10px] text-[#9ca3af] leading-relaxed line-clamp-2 font-medium italic">{news.aiAnalysis}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#9ca3af] font-normal uppercase tracking-[0.05em] block whitespace-nowrap overflow-hidden text-ellipsis">
                Source: <span className="text-slate-300 font-normal">{news.source || 'NA'}</span>
              </span>
            </div>
            <div>
              {news?.ctaUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(news?.ctaUrl, '_blank', 'noopener,noreferrer'); }}
                  className="p-1.5 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 rounded-lg border border-blue-500/30 transition-all"
                  title="Open link"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6-6m0 0V4m0-2h2" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-white/[0.05] gap-2 min-w-0">
          {!isBse ? (
            <div className="flex items-center gap-2 relative shrink-0" ref={dropdownRef}>
              {isWatchlist ? (
                <div className="flex items-center gap-1.5">
                  {news.userRemark ? (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${getRemarkColor(news.userRemark).bgColor} ${getRemarkColor(news.userRemark).borderColor}`}>
                      <span className="text-sm">{getRemarkColor(news.userRemark).icon}</span>
                      <span className={`text-[7px] font-black ${getRemarkColor(news.userRemark).textColor} uppercase tracking-widest max-w-[100px] truncate`}>
                        {news.userRemark}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemarkOpen?.(news.id, news.userRemark); }}
                        className={`p-0.5 ${getRemarkColor(news.userRemark).textColor} hover:opacity-75 transition-all`}
                        title="Edit note"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemarkOpen?.(news.id); }}
                      className="p-2 bg-white/[0.03] hover:bg-blue-500/10 text-[#9ca3af] hover:text-blue-400 border border-white/[0.08] rounded-lg transition-all"
                      title="Add note"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); onWatchlistAdd?.({ ...news }); }}
                  className="px-3 py-1.5 bg-white/[0.03] hover:bg-emerald-500/10 text-[#9ca3af] hover:text-emerald-500 border border-white/[0.08] rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
                >
                  + WATCHLIST
                </button>
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
            {!isBse && showAIInsights && (
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

interface SavedFilter {
  id: string;
  name: string;
  stocks: string[];
}

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
  const [showCustomFilterModal, setShowCustomFilterModal] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [selectedStocksForFilter, setSelectedStocksForFilter] = useState<string[]>([]);
  const [newFilterName, setNewFilterName] = useState("");
  const [filterSearchTerm, setFilterSearchTerm] = useState("");
  const [appliedFilterId, setAppliedFilterId] = useState<string | null>(null);
  const [isReloadAnimating, setIsReloadAnimating] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [snackbar, setSnackbar] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  const [remarkModalOpen, setRemarkModalOpen] = useState(false);
  const [remarkModalItemId, setRemarkModalItemId] = useState<string | null>(null);
  const [remarkModalCurrentRemark, setRemarkModalCurrentRemark] = useState<string | undefined>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const [fromDateInput, setFromDateInput] = useState(new Date().toISOString().split("T")[0]);
  const [toDateInput, setToDateInput] = useState(new Date().toISOString().split("T")[0]);

  const lastParamsRef = useRef<string>("");
  const isFetchingRef = useRef<boolean>(false);
  const isFetchingWatchlistRef = useRef<boolean>(false);
  const knownIdsRef = useRef<Set<string>>(new Set());
  const previousNewsCountRef = useRef<number>(0);

  const isFiltered = useMemo(() => sentimentFilters.some((f) => f !== "ALL"), [sentimentFilters]);

  // Load and manage custom filters from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('stockmunch_custom_filters');
      if (saved) setSavedFilters(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Watchlist Persistence API
  const fetchWatchlist = useCallback(async () => {
    if (!userId || isFetchingWatchlistRef.current) return;

    isFetchingWatchlistRef.current = true;
    try {
      const resp = await fetch(`${API_BASE_URL}/localstorage?user_id=${userId}`, { cache: 'no-store' });
      const json = await resp.json();
      if (json.status === 'success' && json.data?.watchlist && Array.isArray(json.data.watchlist)) {
        setWatchlist(json.data.watchlist);
      }
    } catch (e) {
      console.warn("Failed to fetch watchlist from node", e);
    } finally {
      isFetchingWatchlistRef.current = false;
    }
  }, [userId]);

  const showSnackbar = (message: string) => {
    setSnackbar({ message, visible: true });
    setTimeout(() => {
      setSnackbar({ message: "", visible: false });
    }, 3000);
  };

  const saveWatchlistToNode = useCallback(async (list: any[]) => {
    if (!userId || !Array.isArray(list)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/localstorage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          watchlist: list
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.warn("Failed to sync watchlist to node", e);
      showSnackbar('Error: Could not save watchlist to server. Your data may not be synced.');
    }
  }, [userId, showSnackbar]);

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
      if (!Array.isArray(prev)) return [];
      const idx = prev.findIndex((n) => n.id === id);
      if (idx === -1 || prev[idx].priceChange === pct) return prev;
      const next = [...prev];
      next[idx] = { ...next[idx], priceChange: pct };
      return next;
    });
    setWatchlist((prev) => {
      if (!Array.isArray(prev)) return [];
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
      const user = sessionStorage.getItem("user");
      const userType = user ? JSON.parse(user).user_type || "general" : "general";
      const url = `${API_BASE_URL}/terminal?from=${toApiDate(fromDateInput)}&to=${toApiDate(toDateInput)}&source=g&user_type=${userType}`;
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
              ctaUrl: item.data.cta?.[0]?.ctaUrl,
              pdfUrl: item.data.pdfUrl,
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

        // Trigger sound only if new items found and it's a poll (not initial load)
        const incomingIds = allItems.map(item => item.id);
        const hasBrandNew = incomingIds.some(id => !knownIdsRef.current.has(id));

        if (hasBrandNew && knownIdsRef.current.size > 0 && isAuto) {
          playAlertSound();
        }

        // Register all items as "seen" in session
        incomingIds.forEach(id => knownIdsRef.current.add(id));

        // Mark newly added items only when autoRefresh is active
        const allItemsWithNewFlag = allItems.map(item => ({
          ...item,
          isNewlyAdded: autoRefresh && (previousNewsCountRef.current > 0 && !knownIdsRef.current.has(item.id))
        }));

        previousNewsCountRef.current = allItems.length;

        setNews((prevNews) => {
          if (!Array.isArray(prevNews)) return allItemsWithNewFlag;
          return allItemsWithNewFlag.map(newItem => {
            const existingItem = prevNews.find(p => p.id === newItem.id);
            return { ...newItem, priceChange: existingItem ? existingItem.priceChange : 0 };
          });
        }
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
    try {
      setWatchlist((prev) => {
        if (!Array.isArray(prev)) return [item];
        const newWatchlist = [item, ...prev.filter((w) => w.id !== item.id)];
        saveWatchlistToNode(newWatchlist);
        showSnackbar(`${item.symbol || item.bseCode || 'Item'} added to watchlist successfully!`);
        return newWatchlist;
      });
    } catch (error) {
      showSnackbar(`Failed to add ${item.symbol || item.bseCode || 'item'} to watchlist. Please try again.`);
      console.error('Watchlist add error:', error);
    }
  };

  const handleRemarkSave = (itemId: string, remark: string) => {
    // Update in watchlist
    setWatchlist((prev) => {
      if (!Array.isArray(prev)) return [];
      const newWatchlist = prev.map((w) => w.id === itemId ? { ...w, userRemark: remark } : w);
      saveWatchlistToNode(newWatchlist);
      return newWatchlist;
    });
    // Update in news feed
    setNews((prev) => {
      if (!Array.isArray(prev)) return [];
      return prev.map((n) => n.id === itemId ? { ...n, userRemark: remark } : n);
    });
  };

  const removeFromWatchlist = (id: string) => {
    setWatchlist((prev) => {
      if (!Array.isArray(prev)) return [];
      const next = prev.filter((w) => w.id !== id);
      saveWatchlistToNode(next);
      return next;
    });
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
    // Apply custom stock filter if one is selected
    if (appliedFilterId) {
      const appliedFilter = savedFilters.find(f => f.id === appliedFilterId);
      if (appliedFilter && appliedFilter.stocks.length > 0) {
        list = list.filter((n) => appliedFilter.stocks.includes(n.symbol) || appliedFilter.stocks.includes(n.companyName));
      }
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
  }, [news, watchlist, activeTab, searchTerm, sortOrder, sentimentFilters, timeRange, appliedFilterId, savedFilters]);

  const pagedNews = useMemo(() => processedNews.slice(0, displayLimit), [processedNews, displayLimit]);

  const copyAllTitles = () => {
    const content = processedNews.map((n) => `${n.timestamp} | ${n.symbol || n.bseCode} | ${n.title}`).join("\n");
    navigator.clipboard.writeText(content);
    showSnackbar(`${processedNews.length} titles copied.`);
  };

  const toggleFullScreen = () => {
    const next = !isFullScreen;
    setIsFullScreen(next);
    if (onToggleFullScreen) onToggleFullScreen(next);
  };

  const handleSentimentToggleCheck = (opt: string) => {
    handleSentimentToggle(opt);
  };

  const handleDeleteFilter = (filterId: string) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem('stockmunch_custom_filters', JSON.stringify(updated));
    if (appliedFilterId === filterId) {
      setAppliedFilterId(null);
    }
    showSnackbar('Filter deleted successfully.');
  };

  const gridClasses = "grid grid-cols-[repeat(auto-fill,minmax(310px,1fr))] gap-4 pt-2";

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a] overflow-x-hidden relative">
      <div className="lg:hidden shrink-0 bg-[#0d121f] px-4 py-2 flex items-center justify-between border-b border-white/[0.05]">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Terminal Controls</span>
        <button
          onClick={() => setIsControlsVisible(!isControlsVisible)}
          className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600/10 transition-all flex items-center space-x-1"
        >
          {isControlsVisible ? (<><span>Hide</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 15l7-7 7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>) : (<><span>Show</span><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 9l-7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg></>)}
        </button>
      </div>

      <div className={`${isControlsVisible ? 'flex' : 'hidden lg:flex'} px-4 md:px-6 py-4 shrink-0 bg-[#0d121f] border-b border-white/[0.08] flex flex-col gap-3 z-40 overflow-visible relative`}>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-3 w-full flex-wrap justify-between">

          <div className="flex bg-slate-950 rounded-lg p-1 border border-white/[0.1] shadow-xl shrink-0 h-10 items-center w-full sm:w-auto">
            {["ALL FEEDS", "BSE FEEDS", "WATCHLIST"].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsFilterPanelOpen(false); }}
                className={`flex-1 sm:flex-none px-3 md:px-4 py-0 h-full text-[9px] lg:text-[10px] font-black uppercase tracking-[0.12em] rounded-md transition-all flex items-center justify-center ${activeTab === tab ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : "text-slate-500 hover:text-slate-300"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-end">
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
                    className="w-full bg-slate-900 border border-white/[0.15] rounded-xl pl-12 pr-10 py-2.5 text-[11px] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-400"
                  />
                  {bseSearchTerm && (
                    <button
                      onClick={() => setBseSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setBseAwardsOnly(!bseAwardsOnly)}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-2 ${bseAwardsOnly ? "bg-amber-500/20 border-amber-500/50 text-amber-500 shadow-lg" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300"}`}
                >
                  <span>Order_Receipt</span>
                </button>
                <button
                  onClick={() => setBseAutoRefresh(!bseAutoRefresh)}
                  className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-2 ${bseAutoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300"}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${bseAutoRefresh ? "bg-emerald-600 animate-pulse" : "bg-slate-700"}`}></div>
                  <span>LIVE</span>
                </button>
              </div>
            ) : null}
            {activeTab === "ALL FEEDS" && (
              <>
                

                <div className="relative shrink-0 w-56">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="FILTER TERMINAL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.15] rounded-lg pl-12 pr-10 py-2.5 text-[9px] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-400 h-10"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      title="Clear search"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

<div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-lg border border-white/[0.1] shadow-inner shrink-0 h-10">
                  <input type="date" value={fromDateInput} onChange={(e) => setFromDateInput(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-md px-2 py-1 text-[9px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-20 h-8 cursor-pointer" />
                  <span className="text-slate-700 text-[9px]">→</span>
                  <input type="date" value={toDateInput} onChange={(e) => setToDateInput(e.target.value)} className="bg-slate-950/50 border border-white/5 rounded-md px-2 py-1 text-[9px] text-slate-400 font-mono focus:border-blue-500/40 focus:outline-none w-20 h-8 cursor-pointer" />
                  <button onClick={() => { setIsReloadAnimating(true); fetchNews(false); setTimeout(() => setIsReloadAnimating(false), 600); }} disabled={loading} className="px-2 h-8 bg-blue-600/10 text-blue-500 rounded-md border border-blue-500/20 hover:bg-blue-600/20 transition-all flex items-center justify-center">
                    {loading || isReloadAnimating ? <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <svg className={`w-3.5 h-3.5 transition-transform duration-600 ${isReloadAnimating ? 'rotate-360' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                  </button>
                </div>
                <button onClick={() => setAutoRefresh(!autoRefresh)} className={`px-2.5 h-10 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center space-x-1.5 shrink-0 ${autoRefresh ? "bg-emerald-600/10 border-emerald-600/50 text-emerald-500" : "bg-slate-900/40 border-white/[0.1] text-slate-500 hover:text-slate-300"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? "bg-emerald-600 animate-pulse" : "bg-slate-700"}`}></div>
                  <span className="hidden sm:inline">Monitor</span>
                </button>
              </>
            )}

            {activeTab === "WATCHLIST" && (
              <div className="relative shrink-0 w-56">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="SEARCH WATCHLIST..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-white/[0.15] rounded-lg pl-12 pr-10 py-2.5 text-[9px] text-white focus:outline-none focus:border-blue-500/40 transition-all font-mono placeholder:text-slate-400 h-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    title="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-1 shrink-0 relative h-10 bg-slate-900/40 border border-white/[0.1] rounded-lg p-1">
            {activeTab === "ALL FEEDS" && (
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} title="Sort by" className="bg-transparent border-none px-2 text-[9px] text-slate-300 font-mono uppercase focus:outline-none cursor-pointer shrink-0 h-8 flex items-center">
                <option value="TIME">Sort: Time</option>
                <option value="SENTIMENT">Sort: Confidence</option>
                <option value="CHANGE">Sort: Volatility</option>
              </select>
            )}

            { activeTab !== "BSE FEEDS" ?
            <button ref={filterBtnRef} onClick={(e) => { e.stopPropagation(); setIsFilterPanelOpen(!isFilterPanelOpen); }} className={`px-2 h-8 rounded-md text-[9px] font-black uppercase tracking-widest border-0 transition-all flex items-center justify-center space-x-1.5 relative whitespace-nowrap ${isFilterPanelOpen ? "bg-blue-600 text-white shadow-lg" : "hover:bg-slate-800 text-slate-300 hover:text-slate-100"}`}>
              {(isFiltered || appliedFilterId) && <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-[#0d121f] z-10 animate-pulse"></span>}
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              <span className="hidden lg:inline">Filter</span>
            </button>: null}

            <button onClick={copyAllTitles} title="Copy all titles" className="px-2 h-8 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-md border-0 transition-all flex items-center justify-center space-x-1.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              <span className="hidden lg:inline text-[9px] font-black">Copy</span>
            </button>

            <button onClick={toggleFullScreen} title={isFullScreen ? "Exit fullscreen" : "Fullscreen"} className={`px-2 h-8 rounded-md border-0 transition-all flex items-center justify-center space-x-1.5 flex-shrink-0 ${isFullScreen ? "text-blue-400 bg-blue-600/20" : "hover:bg-slate-800 text-slate-300 hover:text-slate-100"}`}>
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
              <span className="hidden lg:inline text-[9px] font-black">FS</span>
            </button>
          </div>
        </div>

        {isFilterPanelOpen && activeTab !== "BSE FEEDS" && (
          <div ref={filterPanelRef} className={`absolute top-full mt-2 w-64 sm:w-72 bg-[#161b27] border border-white/10 rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.8)] p-8 z-[100] animate-in fade-in zoom-in-95 duration-200 ${filterDropdownSide === "left" ? "right-0" : "left-0"}`}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">AI SENTIMENT FILTER</span>
                  <div className="grid grid-cols-1 gap-3">
                    {["ALL", "BULLISH", "BEARISH", "NEUTRAL"].map((opt) => (
                      <label key={opt} className="flex items-center space-x-4 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={sentimentFilters.includes(opt)} onChange={() => handleSentimentToggleCheck(opt)} className="peer h-5 w-5 appearance-none border border-white/10 rounded-lg bg-slate-950 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" />
                          <svg className="absolute w-3.5 h-3.5 text-white left-0.5 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${sentimentFilters.includes(opt) ? "text-slate-100" : "text-slate-600 group-hover:text-slate-400"}`}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {savedFilters.length > 0 && (
                  <>
                    <div className="h-px bg-white/[0.05]"></div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">SAVED FILTERS</span>
                      <div className="space-y-2.5">
                        {savedFilters.map((filter) => (
                          <div key={filter.id} className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setAppliedFilterId(appliedFilterId === filter.id ? null : filter.id);
                              }}
                              className={`flex-1 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-tight text-left transition-all border ${
                                appliedFilterId === filter.id
                                  ? "bg-emerald-600/20 border-emerald-600/40 text-emerald-300"
                                  : "bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{filter.name}</span>
                                {appliedFilterId === filter.id && (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 font-mono">{filter.stocks.length} stocks</span>
                            </button>
                            <button
                              onClick={() => handleDeleteFilter(filter.id)}
                              title="Delete filter"
                              className="px-2.5 py-2.5 rounded-lg border border-white/10 text-slate-500 hover:text-red-500 hover:border-red-500/30 hover:bg-red-600/10 transition-all flex-shrink-0"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="h-px bg-white/[0.05]"></div>
                <button
                  onClick={() => setShowCustomFilterModal(true)}
                  className="w-full px-4 py-3 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all"
                >
                  + Create New Filter
                </button>
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
                  <NewsCard news={newsItem} isWatchlist={activeTab === "WATCHLIST"} onWatchlistAdd={handleWatchlistAdd} onRemarkSave={handleRemarkSave} onRemarkOpen={(id, remark) => { setRemarkModalItemId(id); setRemarkModalCurrentRemark(remark); setRemarkModalOpen(true); }} onPriceUpdate={updatePriceChange} autoRefresh={autoRefresh} variant="general" />
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

      {showCustomFilterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1219] border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] w-full max-w-3xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#1a1f2e] to-[#0f1219] border-b border-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-blue-600/20 rounded-xl border border-blue-500/30">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">Manage Filters</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Create and manage your custom stock filters</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowCustomFilterModal(false); setNewFilterName(""); setSelectedStocksForFilter([]); setFilterSearchTerm(""); }} 
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Saved Filters Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-emerald-600/20 rounded-lg border border-emerald-500/30">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Saved Filters</h4>
                      <p className="text-xs text-slate-500">{savedFilters.length} filter(s)</p>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {savedFilters.length === 0 ? (
                      <div className="text-center py-12 px-4">
                        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-slate-800/50 rounded-xl">
                          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="text-xs text-slate-500 italic">No filters saved yet</p>
                        <p className="text-xs text-slate-600 mt-1">Create your first filter →</p>
                      </div>
                    ) : (
                      savedFilters.map((filter) => (
                        <div 
                          key={filter.id} 
                          className={`p-4 rounded-xl border transition-all duration-200 ${
                            appliedFilterId === filter.id 
                              ? 'bg-gradient-to-r from-blue-600/15 to-blue-500/10 border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                              : 'bg-slate-800/30 border-white/5 hover:border-white/15 hover:bg-slate-800/50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className={`text-sm font-black uppercase tracking-tight ${
                                  appliedFilterId === filter.id ? 'text-blue-300' : 'text-slate-100'
                                }`}>
                                  {filter.name}
                                </h5>
                                {appliedFilterId === filter.id && (
                                  <span className="px-2 py-0.5 bg-blue-600/30 border border-blue-500/50 text-blue-300 text-[8px] rounded-lg font-black">✓ ACTIVE</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{filter.stocks.length} stock(s)</p>
                            </div>
                          </div>
                          <div className="mb-3 flex flex-wrap gap-1.5">
                            {filter.stocks.slice(0, 3).map((stock) => (
                              <span key={stock} className="px-2 py-1 bg-blue-600/10 text-blue-400 text-[8px] font-mono rounded-lg border border-blue-600/30">
                                {stock}
                              </span>
                            ))}
                            {filter.stocks.length > 3 && (
                              <span className="px-2 py-1 bg-slate-700/50 text-slate-400 text-[8px] font-mono rounded-lg border border-slate-600/30">
                                +{filter.stocks.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setAppliedFilterId(appliedFilterId === filter.id ? null : filter.id)}
                              className={`flex-1 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5 ${
                                appliedFilterId === filter.id 
                                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/40 hover:bg-blue-600/40' 
                                  : 'bg-blue-600/10 text-blue-500 border-blue-600/30 hover:bg-blue-600/20'
                              }`}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={appliedFilterId === filter.id ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
                              </svg>
                              {appliedFilterId === filter.id ? 'Remove' : 'Apply'}
                            </button>
                            <button
                              onClick={() => {
                                const updated = savedFilters.filter(f => f.id !== filter.id);
                                setSavedFilters(updated);
                                localStorage.setItem('stockmunch_custom_filters', JSON.stringify(updated));
                                if (appliedFilterId === filter.id) setAppliedFilterId(null);
                              }}
                              className="px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border bg-rose-600/10 text-rose-500 border-rose-600/30 hover:bg-rose-600/20"
                            >
                              ✕ Del
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Create New Filter Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-amber-600/20 rounded-lg border border-amber-500/30">
                      <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">Create New</h4>
                      <p className="text-xs text-slate-500">Add a custom filter</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Filter Name Input */}
                    <div>
                      <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Filter Name
                      </label>
                      <input
                        type="text"
                        value={newFilterName}
                        onChange={(e) => setNewFilterName(e.target.value)}
                        placeholder="e.g., Tech Giants, Pharma Stocks..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      />
                    </div>

                    {/* Stock Selection */}
                    <div>
                      <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Select Stocks
                      </label>
                      
                      {/* Search Box */}
                      <div className="relative mb-3">
                        <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={filterSearchTerm}
                          onChange={(e) => setFilterSearchTerm(e.target.value)}
                          placeholder="Search stocks..."
                          className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                        />
                      </div>

                      {/* Stock List */}
                      <div className="space-y-1 max-h-40 overflow-y-auto bg-slate-900/30 rounded-lg p-3 border border-white/5">
                        {Array.from(new Set(processedNews.map(n => n.symbol || n.companyName))).filter(Boolean).filter((stock) => 
                          (stock as string).toLowerCase().includes(filterSearchTerm.toLowerCase())
                        ).length === 0 ? (
                          <p className="text-xs text-slate-500 text-center py-4">No stocks found</p>
                        ) : (
                          Array.from(new Set(processedNews.map(n => n.symbol || n.companyName))).filter(Boolean).filter((stock) => 
                            (stock as string).toLowerCase().includes(filterSearchTerm.toLowerCase())
                          ).map((stock) => (
                            <label 
                              key={stock} 
                              className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-all cursor-pointer group"
                            >
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedStocksForFilter.includes(stock as string)}
                                  onChange={(e) => {
                                    if (e.target.checked) setSelectedStocksForFilter([...selectedStocksForFilter, stock as string]);
                                    else setSelectedStocksForFilter(selectedStocksForFilter.filter(s => s !== stock));
                                  }}
                                  className="peer h-4 w-4 appearance-none border border-white/20 rounded-md bg-slate-800 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <svg className="absolute w-3 h-3 text-white left-0.5 top-0.5 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors flex-1">{stock}</span>
                              {selectedStocksForFilter.includes(stock as string) && (
                                <span className="text-[8px] text-blue-400 font-black">✓</span>
                              )}
                            </label>
                          ))
                        )}
                      </div>

                      {/* Selected Count */}
                      {selectedStocksForFilter.length > 0 && (
                        <div className="mt-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/30 rounded-lg flex items-center justify-between">
                          <span className="text-xs font-black text-blue-400">
                            {selectedStocksForFilter.length} stock(s) selected
                          </span>
                          <button
                            onClick={() => setSelectedStocksForFilter([])}
                            className="text-xs text-blue-500 hover:text-blue-400 font-black transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          if (newFilterName && selectedStocksForFilter.length > 0) {
                            const newFilter: SavedFilter = {
                              id: Date.now().toString(),
                              name: newFilterName,
                              stocks: selectedStocksForFilter
                            };
                            const updated = [...savedFilters, newFilter];
                            setSavedFilters(updated);
                            localStorage.setItem('stockmunch_custom_filters', JSON.stringify(updated));
                            setAppliedFilterId(newFilter.id);
                            setNewFilterName("");
                            setSelectedStocksForFilter([]);
                            setFilterSearchTerm("");
                          }
                        }}
                        disabled={!newFilterName || selectedStocksForFilter.length === 0}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-black rounded-lg text-xs uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Save & Apply
                      </button>
                      <button 
                        onClick={() => { setShowCustomFilterModal(false); setNewFilterName(""); setSelectedStocksForFilter([]); setFilterSearchTerm(""); }} 
                        className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-white/10 text-slate-300 hover:text-white font-black rounded-lg text-xs uppercase tracking-widest transition-all hover:bg-slate-800 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {snackbar.visible && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-80 z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-500/30 rounded-xl px-4 py-3 text-white text-[13px] font-semibold shadow-lg flex items-center space-x-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <span>{snackbar.message}</span>
          </div>
        </div>
      )}

      <RemarkModal
        isOpen={remarkModalOpen}
        currentRemark={remarkModalCurrentRemark}
        onClose={() => setRemarkModalOpen(false)}
        onSave={(remark) => {
          if (remarkModalItemId) {
            handleRemarkSave(remarkModalItemId, remark);
            setRemarkModalOpen(false);
            setRemarkModalItemId(null);
            setRemarkModalCurrentRemark(undefined);
          }
        }}
      />
    </div>
  );
};

export default MarketTerminal;