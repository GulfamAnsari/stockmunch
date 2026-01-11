
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StockNews } from '../types';

const NewsCard: React.FC<{ 
  news: StockNews; 
  onCopy: (text: string) => void;
  onWatchlistAdd: (item: any) => void;
  fetchPrice: (symbol: string, bseCode?: string) => void;
}> = ({ news, onCopy, onWatchlistAdd, fetchPrice }) => {
  const [showWatchlistOpts, setShowWatchlistOpts] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="bg-[#111621] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden hover:border-emerald-500/30 transition-all group shadow-2xl">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg ${news.logoColor || 'bg-slate-700'} flex items-center justify-center text-white text-[11px] font-black shadow-inner`}>
              {news.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[11px] font-black text-white tracking-wider uppercase leading-none">{news.symbol}</h3>
                <span className={`text-[9px] font-bold flex items-center ${news.sentiment === 'bullish' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {news.sentiment === 'bullish' ? '↑' : '↓'} {(Math.random() * 5).toFixed(2)}%
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

        <h4 className="text-[12px] font-bold text-slate-100 leading-snug mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {news.title}
        </h4>

        <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed mb-4 opacity-80 font-medium">
          {news.content}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className={`px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.15em] inline-flex items-center ${getSentimentStyles(news.sentiment)}`}>
            <div className={`w-1 h-1 rounded-full mr-2 ${news.sentiment === 'bullish' ? 'bg-emerald-500' : news.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-amber-500'} animate-pulse`}></div>
            {news.sentiment}
          </div>
          <div className="bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-tighter">
            Confidence: <span className="text-white">{news.sentimentScore}%</span>
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
  const [autoRefresh, setAutoRefresh] = useState(false); // Changed to false initially
  const [sortOrder, setSortOrder] = useState<'TIME' | 'SENTIMENT' | 'CHANGE'>('TIME');
  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');
  const [timeRange, setTimeRange] = useState({ from: 0, to: 24 });
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeQuote, setActiveQuote] = useState<{symbol: string, price?: number, change?: number} | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const [fromDateInput, setFromDateInput] = useState('2026-01-11');
  const [toDateInput, setToDateInput] = useState('2026-01-12');

  useEffect(() => {
    const saved = localStorage.getItem('stockmanch_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
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
            timestamp: new Date(item.publishedAt).toLocaleString('en-IN', { 
              day: '2-digit', month: 'short', year: 'numeric', 
              hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false 
            }),
            rawPublishedAt: item.publishedAt,
            priceChange: (Math.random() * 4 - 2), 
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

    if (sentimentFilter !== 'ALL') {
      list = list.filter(n => n.sentiment.toUpperCase() === sentimentFilter);
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
  }, [news, watchlist, activeTab, searchTerm, sortOrder, sentimentFilter, timeRange]);

  const copyAllTitles = () => {
    const content = processedNews.map(n => `${n.timestamp} | ${n.symbol} | ${n.title}`).join('\n');
    navigator.clipboard.writeText(content);
    alert(`Station: ${processedNews.length} dispatch titles copied.`);
  };

  const isWatchlist = activeTab === 'WATCHLIST';

  return (
    <div className="flex-grow flex flex-col min-h-0 bg-[#0b0f1a]">
      
      {/* Terminal Toolbar (Single Row Desktop Optimization) */}
      <div className="px-8 py-3 shrink-0 bg-[#0d121f] border-b border-white/5 flex flex-nowrap items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        
        {/* Navigation Tabs */}
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

        {/* Search Data */}
        <div className="relative w-48 lg:w-64 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="SEARCH DATA..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-[9px] text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500/30 font-mono shadow-inner"
          />
        </div>

        {/* Dynamic Controls (Date, Refresh, Auto-Sync) */}
        {!isWatchlist && (
          <div className="flex items-center space-x-3 shrink-0 px-4 border-l border-white/5">
            <div className="flex items-center space-x-2">
              <input 
                type="date" 
                value={fromDateInput} 
                onChange={(e) => setFromDateInput(e.target.value)} 
                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[8px] text-white font-mono focus:border-emerald-500 focus:outline-none w-[100px]" 
              />
              <span className="text-slate-600 text-[9px]">→</span>
              <input 
                type="date" 
                value={toDateInput} 
                onChange={(e) => setToDateInput(e.target.value)} 
                className="bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-[8px] text-white font-mono focus:border-emerald-500 focus:outline-none w-[100px]" 
              />
              <button 
                onClick={fetchNews} 
                disabled={loading}
                className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                title="Sync Feed"
              >
                <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-2 border-l border-white/5 pl-3">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Auto_Sync</span>
              <button onClick={() => setAutoRefresh(!autoRefresh)} className={`relative inline-flex h-3.5 w-7 items-center rounded-full transition-colors ${autoRefresh ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                <span className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Quotes, Filters, and Copy */}
        <div className="flex items-center space-x-3 shrink-0 ml-auto border-l border-white/5 pl-4">
          {activeQuote && (
            <div className="flex items-center bg-sky-500/10 border border-sky-500/20 rounded-lg px-3 py-1.5 animate-in slide-in-from-right-4">
              <span className="text-[8px] font-black text-white mr-2">{activeQuote.symbol}:</span>
              <span className="text-[9px] font-mono text-white">{activeQuote.price || '...'}</span>
            </div>
          )}
          
          <button 
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center space-x-1.5 ${isFilterPanelOpen ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-slate-900 border-white/5 text-slate-400 hover:text-white'}`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>

          <button onClick={copyAllTitles} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/5 shadow-sm" title="Copy Dispatch Titles">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Panel (Sentiment, Time, Sort) */}
      {isFilterPanelOpen && (
        <div className="px-8 py-8 bg-[#0d121f] border-b border-white/10 space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Sentiment Filter */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">AI Sentiment Protocol</span>
              <div className="flex items-center space-x-1 bg-slate-950 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                {['ALL', 'BULLISH', 'BEARISH'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSentimentFilter(filter as any)}
                    className={`flex-1 px-4 py-2.5 text-[9px] font-black rounded-xl transition-all ${sentimentFilter === filter ? 'bg-emerald-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Protocol */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Intraday Time Range</span>
              <div className="flex items-center space-x-4 bg-slate-950 p-3 rounded-2xl border border-white/10 shadow-inner">
                <div className="flex-1 flex flex-col space-y-2">
                   <input type="range" min="0" max="23" value={timeRange.from} onChange={(e) => setTimeRange({ ...timeRange, from: parseInt(e.target.value) })} className="w-full accent-emerald-500" />
                   <input type="range" min="0" max="24" value={timeRange.to} onChange={(e) => setTimeRange({ ...timeRange, to: parseInt(e.target.value) })} className="w-full accent-rose-500" />
                </div>
                <div className="flex flex-col items-center space-y-1 font-mono text-[10px] w-14">
                  <span className="text-emerald-500">{timeRange.from.toString().padStart(2, '0')}:00</span>
                  <span className="text-slate-700">TO</span>
                  <span className="text-rose-500">{timeRange.to.toString().padStart(2, '0')}:00</span>
                </div>
              </div>
            </div>

            {/* Sort Protocol */}
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Terminal Sort Method</span>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-3.5 text-[11px] text-white font-mono uppercase focus:border-emerald-500 focus:outline-none shadow-inner">
                <option value="TIME">Chronological Sync</option>
                <option value="SENTIMENT">AI Confidence Score</option>
                <option value="CHANGE">Intrinsic Volatility</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-end pt-4 border-t border-white/5">
            <button onClick={() => setIsFilterPanelOpen(false)} className="text-[9px] font-black text-slate-600 hover:text-white uppercase tracking-[0.2em] transition-colors">Collapse Filter Node</button>
          </div>
        </div>
      )}

      {/* Internal Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto px-8 py-8 custom-scrollbar bg-black/5">
        {loading && news.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-30">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[12px] font-black uppercase tracking-[0.4em]">Establishing Secure Feed...</p>
          </div>
        ) : processedNews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <p className="text-xl font-black uppercase tracking-[0.3em]">No Match Found in Data Tunnel</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedNews.map((newsItem) => (
              <div key={newsItem.id} className="relative">
                <NewsCard 
                  news={newsItem} 
                  onCopy={(text) => { navigator.clipboard.writeText(text); }}
                  onWatchlistAdd={handleWatchlistAdd}
                  fetchPrice={fetchPrice}
                />
                {isWatchlist && (
                  <button onClick={() => removeFromWatchlist(newsItem.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:scale-110 transition-all">✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terminal Footer Status Bar */}
      <footer className="shrink-0 bg-[#111621] border-t border-white/5 px-8 py-3.5 flex items-center justify-between text-[9px] font-black font-mono text-slate-600 tracking-[0.2em] uppercase">
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
          <span className="opacity-60 italic tracking-tight uppercase">StockManch Station V5.6-STABLE</span>
        </div>
      </footer>
    </div>
  );
};

export default MarketTerminal;
