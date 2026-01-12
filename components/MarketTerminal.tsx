
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StockNews } from '../types';

const AnimatedTooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  return (
    <div className="group relative flex flex-col">
      {children}
      <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-[#1a2235]/95 backdrop-blur-xl text-slate-200 text-[10px] font-medium rounded-2xl border border-white/10 shadow-2xl w-72 pointer-events-none opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 transition-all duration-300 ease-out text-left leading-relaxed">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-[6px] border-transparent border-t-[#1a2235]/95"></div>
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ 
  news: StockNews; 
  isWatchlist?: boolean;
  onCopy: (text: string) => void;
  onWatchlistAdd: (item: any) => void;
  fetchPrice: (symbol: string, bseCode?: string) => void;
}> = ({ news, isWatchlist, onCopy, onWatchlistAdd, fetchPrice }) => {
  const [showWatchlistOpts, setShowWatchlistOpts] = useState(false);
  const [livePercentage, setLivePercentage] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLocalPercent = async () => {
      // Priority: NSE Symbol > BSE Code
      const hasNse = news.symbol && news.symbol !== 'NSE';
      const bse = (news as any).bseCode;
      const querySymbol = hasNse ? `${news.symbol}.NS` : (bse ? `${bse}.BO` : null);
      
      if (!querySymbol) return;

      try {
        const resp = await fetch(`https://droidtechknow.com/admin/api/stocks/chart.php?symbol=${querySymbol}&interval=1d&range=1d`);
        const data = await resp.json();
        if (data && data.meta && data.meta.chartPreviousClose) {
          const pct = ((data.meta.regularMarketPrice - data.meta.chartPreviousClose) / data.meta.chartPreviousClose) * 100;
          setLivePercentage(pct);
        }
      } catch (e) {
        console.warn(`Could not fetch live percentage for ${querySymbol}`);
      }
    };
    fetchLocalPercent();
  }, [news.symbol, (news as any).bseCode]);

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
      case 'bullish': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'bearish': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="bg-[#111621] border border-white/5 rounded-xl flex flex-col h-full hover:border-emerald-500/30 transition-all group shadow-2xl relative">
      {isWatchlist && news.userSentiment && (
        <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest z-30 border shadow-lg ${news.userSentiment === 'BULLISH' ? 'bg-emerald-500 text-slate-950 border-emerald-400' : 'bg-rose-500 text-white border-rose-400'}`}>
          {news.userSentiment}
        </div>
      )}

      {news.image && (
        <div className="w-full h-32 overflow-hidden bg-slate-900 border-b border-white/5 rounded-t-xl">
          <img src={news.image} alt={news.symbol} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
        </div>
      )}

      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg ${news.logoColor || 'bg-slate-700'} flex items-center justify-center text-white text-[11px] font-black shadow-inner overflow-hidden`}>
              {news.logoUrl ? (
                <img src={news.logoUrl} alt={news.symbol} className="w-full h-full object-contain p-1" />
              ) : (
                news.symbol.substring(0, 2)
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[11px] font-black text-white tracking-wider uppercase leading-none">{news.symbol}</h3>
                <span className={`text-[9px] font-bold flex items-center ${livePercentage !== null ? (livePercentage >= 0 ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-600'}`}>
                   {livePercentage !== null ? (livePercentage >= 0 ? '↑' : '↓') : '•'} {livePercentage !== null ? Math.abs(livePercentage).toFixed(2) : '0.00'}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight truncate max-w-[120px]">{news.companyName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 font-mono uppercase tracking-tighter leading-none">{news.timestamp.split(',')[1]?.trim() || ''}</p>
            <p className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter">{news.timestamp.split(',')[0]?.trim() || ''}</p>
          </div>
        </div>

        <AnimatedTooltip text={news.title}>
          <h4 className="text-[12px] font-bold text-slate-100 leading-snug mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {news.title}
          </h4>
        </AnimatedTooltip>

        <AnimatedTooltip text={news.content}>
          <p className="text-[10px] text-slate-400 line-clamp-4 leading-relaxed mb-4 opacity-80 font-medium italic border-l-2 border-emerald-500/30 pl-3 transition-colors group-hover:text-slate-200">
            {news.content}
          </p>
        </AnimatedTooltip>

        {news.aiAnalysis && (
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
             <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-1">AI Deep Analysis</span>
             <AnimatedTooltip text={news.aiAnalysis}>
               <p className="text-[9px] text-slate-300 leading-tight line-clamp-3 group-hover:text-white transition-colors">
                 {news.aiAnalysis}
               </p>
             </AnimatedTooltip>
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.15em] inline-flex items-center ${getSentimentStyles(news.sentiment)}`}>
            <div className={`w-1 h-1 rounded-full mr-2 ${news.sentiment === 'bullish' ? 'bg-emerald-500' : news.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-amber-500'} animate-pulse`}></div>
            AI ANALYSIS: {news.sentiment}
          </div>
          <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
            Impact: <span className="text-white">{news.sentimentScore}%</span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5 gap-2">
          <div className="flex items-center gap-1.5 relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowWatchlistOpts(!showWatchlistOpts)}
              className="px-3 py-1.5 bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap"
            >
              + WATCHLIST
            </button>
            
            {showWatchlistOpts && (
              <div className="absolute bottom-full left-0 mb-2 w-32 bg-[#1c2230] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                <button 
                  onClick={() => { onWatchlistAdd({ ...news, userSentiment: 'BULLISH' }); setShowWatchlistOpts(false); }}
                  className="w-full text-left px-4 py-2.5 text-[9px] font-black text-emerald-500 hover:bg-emerald-500/10 uppercase tracking-widest border-b border-white/5"
                >
                  BULLISH
                </button>
                <button 
                  onClick={() => { onWatchlistAdd({ ...news, userSentiment: 'BEARISH' }); setShowWatchlistOpts(false); }}
                  className="w-full text-left px-4 py-2.5 text-[9px] font-black text-rose-500 hover:bg-rose-500/10 uppercase tracking-widest"
                >
                  BEARISH
                </button>
              </div>
            )}

            <button 
              onClick={() => fetchPrice(news.symbol, (news as any).bseCode)}
              className="p-1.5 bg-white/5 hover:bg-sky-500/10 text-slate-500 hover:text-sky-500 rounded-lg border border-white/10 transition-all"
              title="Live Quote"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
             <button 
              onClick={() => onCopy(`${news.timestamp} | ${news.symbol} | ${news.title}`)}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-lg transition-all"
              title="Copy ID"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
            </button>
            <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{news.source}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketTerminal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL FEEDS');
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [sortOrder, setSortOrder] = useState<'TIME' | 'SENTIMENT' | 'CHANGE'>('TIME');
  const [sentimentFilters, setSentimentFilters] = useState<string[]>(['ALL']);
  const [timeRange, setTimeRange] = useState({ from: 0, to: 24 });
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeQuote, setActiveQuote] = useState<{symbol: string, price?: number, change?: number} | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  // Pagination / Infinite Scroll
  const [displayLimit, setDisplayLimit] = useState(20); // Initialized to 20 per request
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const [fromDateInput, setFromDateInput] = useState('2026-01-11');
  const [toDateInput, setToDateInput] = useState('2026-01-12');

  useEffect(() => {
    const saved = localStorage.getItem('stockmanch_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
    
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNews = useCallback(async () => {
    if (activeTab === 'WATCHLIST') return; 
    setLoading(true);
    try {
      const toApiDate = (d: string) => {
        const parts = d.split('-');
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      };
      const url = `https://droidtechknow.com/admin/api/stocks/news/save.php?from=${toApiDate(fromDateInput)}&to=${toApiDate(toDateInput)}`;
      const response = await fetch(url);
      const json = await response.json();
      
      if (json.status === 'success' && json.data) {
        const allItems: StockNews[] = [];
        Object.keys(json.data).forEach(dateKey => {
          const rawItems = json.data[dateKey];
          const mappedItems: StockNews[] = rawItems.map((item: any) => ({
            id: item.postId,
            symbol: item.data.cta?.[0]?.meta?.nseScriptCode || 'NSE',
            bseCode: item.data.cta?.[0]?.meta?.bseScriptCode,
            companyName: item.data.cta?.[0]?.ctaText || 'Market Entry',
            title: item.data.title || '',
            content: item.data.body || '',
            image: item.data.image || item.data.featuredImage,
            logoUrl: item.data.logoUrl,
            aiAnalysis: item.summary || item.data.summary || (item.machineLearningSentiments?.explanation),
            timestamp: new Date(item.publishedAt).toLocaleString('en-IN', { 
              day: '2-digit', month: 'short', year: 'numeric', 
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
            }),
            rawPublishedAt: item.publishedAt,
            priceChange: 0, // Now calculated live per card
            sentiment: item.machineLearningSentiments?.label === 'negative' ? 'bearish' : 
                       item.machineLearningSentiments?.label === 'positive' ? 'bullish' : 'neutral',
            sentimentScore: Math.round((item.machineLearningSentiments?.confidence || 0.5) * 100),
            source: item.publisher || 'BSE',
            platform: 'Groww',
            logoColor: 'bg-indigo-600'
          }));
          allItems.push(...mappedItems);
        });
        setNews(allItems);
        setDisplayLimit(20); // Reset display limit to 20 for initial view
      }
    } catch (error) {
      console.error("Terminal API Error:", error);
    } finally {
      setLoading(false);
    }
  }, [fromDateInput, toDateInput, activeTab]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh && !loading && activeTab !== 'WATCHLIST') {
      interval = window.setInterval(fetchNews, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, loading, fetchNews, activeTab]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 100) {
      if (displayLimit < processedNews.length) {
        setDisplayLimit(prev => prev + 20); // Increase limit on scroll
      }
    }
  };

  const fetchPrice = async (symbol: string, bseCode?: string) => {
    try {
      const querySymbol = bseCode ? `${bseCode}.BO` : `${symbol}.NS`;
      setActiveQuote({ symbol, price: undefined });
      const resp = await fetch(`https://droidtechknow.com/admin/api/stocks/chart.php?symbol=${querySymbol}&interval=1d&range=1d`);
      const data = await resp.json();
      if (data && data.meta) {
        setActiveQuote({
          symbol,
          price: data.meta.regularMarketPrice,
          change: data.meta.regularMarketPrice - data.meta.chartPreviousClose
        });
      }
    } catch (e) {
      console.error("Price fetch error", e);
    }
  };

  const handleWatchlistAdd = (item: any) => {
    const newWatchlist = [item, ...watchlist.filter(w => w.id !== item.id)];
    setWatchlist(newWatchlist);
    localStorage.setItem('stockmanch_watchlist', JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (id: string) => {
    const next = watchlist.filter(w => w.id !== id);
    setWatchlist(next);
    localStorage.setItem('stockmanch_watchlist', JSON.stringify(next));
  };

  const handleSentimentToggle = (val: string) => {
    if (val === 'ALL') {
      setSentimentFilters(['ALL']);
      return;
    }
    let next = sentimentFilters.filter(f => f !== 'ALL');
    if (next.includes(val)) {
      next = next.filter(f => f !== val);
    } else {
      next.push(val);
    }
    if (next.length === 0) next = ['ALL'];
    setSentimentFilters(next);
  };

  const processedNews = useMemo(() => {
    let list = activeTab === 'WATCHLIST' ? [...watchlist] : [...news];
    
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      list = list.filter(n => 
        n.symbol.toLowerCase().includes(lower) || 
        n.title.toLowerCase().includes(lower) ||
        n.companyName.toLowerCase().includes(lower)
      );
    }

    if (!sentimentFilters.includes('ALL')) {
      list = list.filter(n => sentimentFilters.includes(n.sentiment.toUpperCase()));
    }

    list = list.filter(n => {
      const hour = new Date(n.rawPublishedAt).getHours();
      return hour >= timeRange.from && hour <= timeRange.to;
    });

    if (sortOrder === 'TIME') {
      list.sort((a, b) => new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime());
    } else if (sortOrder === 'SENTIMENT') {
      list.sort((a, b) => b.sentimentScore - a.sentimentScore);
    } else if (sortOrder === 'CHANGE') {
      list.sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
    }

    return list;
  }, [news, watchlist, activeTab, searchTerm, sortOrder, sentimentFilters, timeRange]);

  const pagedNews = useMemo(() => processedNews.slice(0, displayLimit), [processedNews, displayLimit]);

  const copyAllTitles = () => {
    const content = processedNews.map(n => `${n.timestamp} | ${n.symbol} | ${n.title}`).join('\n');
    navigator.clipboard.writeText(content);
    alert(`Station: ${processedNews.length} dispatch titles copied.`);
  };

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a]">
      <div className="px-8 py-3 shrink-0 bg-[#0d121f] border-b border-white/5 flex flex-wrap items-center justify-between gap-y-3 gap-x-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/5 shadow-inner shrink-0">
            {['ALL FEEDS', 'WATCHLIST'].map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setIsFilterPanelOpen(false); }}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-48 lg:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH SYMBOL, NAME..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-[10px] text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all font-mono"
            />
          </div>
        </div>

        {activeTab !== 'WATCHLIST' && (
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2 bg-slate-900/50 p-1 rounded-lg border border-white/10">
              <input 
                type="date" 
                value={fromDateInput} 
                onChange={(e) => setFromDateInput(e.target.value)} 
                className="bg-slate-900 border border-white/20 rounded-md px-2 py-1 text-[9px] text-white font-mono focus:border-emerald-500 focus:outline-none w-[115px] cursor-pointer" 
              />
              <span className="text-slate-400 text-[10px]">→</span>
              <input 
                type="date" 
                value={toDateInput} 
                onChange={(e) => setToDateInput(e.target.value)} 
                className="bg-slate-900 border border-white/20 rounded-md px-2 py-1 text-[9px] text-white font-mono focus:border-emerald-500 focus:outline-none w-[115px] cursor-pointer" 
              />
              <button 
                onClick={fetchNews} 
                disabled={loading}
                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30 hover:bg-emerald-500/30 transition-all flex items-center justify-center min-w-[32px]"
                title="Sync Feed"
              >
                {loading ? <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div> : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 shrink-0 relative" ref={filterRef}>
          {activeQuote && (
            <div className="flex items-center bg-sky-500/20 border border-sky-500/30 rounded-lg px-3 py-1.5 animate-in slide-in-from-right-4">
              <span className="text-[9px] font-black text-white mr-2">{activeQuote.symbol}:</span>
              <span className="text-[10px] font-mono text-white">{activeQuote.price || '...'}</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-1.5 ${isFilterPanelOpen ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>

          {isFilterPanelOpen && (
            <div className="absolute top-full right-0 mt-3 w-72 bg-[#161b27] border border-white/10 rounded-2xl shadow-2xl p-6 z-[100] animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">AI Sentiment Protocol</span>
                  <div className="grid grid-cols-1 gap-2">
                    {['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'].map((opt) => (
                      <label key={opt} className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input 
                            type="checkbox" 
                            checked={sentimentFilters.includes(opt)} 
                            onChange={() => handleSentimentToggle(opt)}
                            className="peer h-4 w-4 appearance-none border border-white/20 rounded bg-slate-900 checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer"
                          />
                          <svg className="absolute w-3 h-3 text-slate-950 left-0.5 pointer-events-none hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${sentimentFilters.includes(opt) ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/5"></div>

                <div className="space-y-3">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Primary Sort Method</span>
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white font-mono uppercase focus:outline-none">
                    <option value="TIME">Newest First</option>
                    <option value="SENTIMENT">Highest AI Confidence</option>
                    <option value="CHANGE">Price Volatility</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        onScroll={handleScroll} 
        className="flex-grow overflow-y-auto px-8 py-8 custom-scrollbar bg-black/5"
      >
        {loading && news.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-30">Establishing Secure Feed...</p>
          </div>
        ) : processedNews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <p className="text-xl font-black uppercase tracking-[0.3em]">No Match Found in Data Tunnel</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 pt-4">
              {pagedNews.map((newsItem) => (
                <div key={newsItem.id} className="relative">
                  <NewsCard 
                    news={newsItem} 
                    isWatchlist={activeTab === 'WATCHLIST'}
                    onCopy={(text) => { navigator.clipboard.writeText(text); }}
                    onWatchlistAdd={handleWatchlistAdd}
                    fetchPrice={fetchPrice}
                  />
                  {activeTab === 'WATCHLIST' && (
                    <button 
                      onClick={() => removeFromWatchlist(newsItem.id)} 
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:scale-110 transition-all z-40 border border-white/20"
                      title="Remove from Watchlist"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {displayLimit < processedNews.length && (
              <div className="py-10 flex justify-center">
                 <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>

      <footer className="shrink-0 bg-[#111621] border-t border-white/5 px-8 py-3 flex items-center justify-between text-[9px] font-black font-mono text-slate-600 tracking-[0.2em] uppercase">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-black">SYSTEM:</span>
            <span>READY</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-black">STREAM:</span>
            <span>{processedNews.length} SYNCED</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40"></div>
          <span className="opacity-60 italic tracking-tight uppercase">StockManch Station V5.9-STABLE</span>
        </div>
      </footer>
    </div>
  );
};

export default MarketTerminal;
