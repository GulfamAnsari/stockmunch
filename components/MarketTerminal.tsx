
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { StockNews } from '../types';

const TickerTape = () => {
  const stocks = [
    { symbol: 'BHARTIARTL', price: '1,120.45', change: '+0.5%' },
    { symbol: 'SBIN', price: '612.90', change: '+1.7%' },
    { symbol: 'RELIANCE', price: '2,543.20', change: '+1.2%' },
    { symbol: 'TCS', price: '3,890.45', change: '-0.4%' },
    { symbol: 'HDFCBANK', price: '1,678.10', change: '+0.8%' },
    { symbol: 'INFY', price: '1,512.00', change: '+2.1%' },
    { symbol: 'ICICIBANK', price: '987.30', change: '-1.1%' },
  ];

  return (
    <div className="w-full bg-[#0b0f1a] border-y border-white/5 py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee">
        {Array(3).fill(stocks).flat().map((stock, i) => (
          <span key={i} className="inline-flex items-center mx-6 space-x-2">
            <span className="text-[10px] font-black text-white tracking-tighter uppercase">{stock.symbol}</span>
            <span className="text-[10px] font-mono text-slate-400">{stock.price}</span>
            <span className={`text-[9px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stock.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

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
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sortOrder, setSortOrder] = useState<'TIME' | 'SENTIMENT' | 'CHANGE'>('TIME');
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [activeQuote, setActiveQuote] = useState<{symbol: string, price?: number, change?: number} | null>(null);

  const [fromDateInput, setFromDateInput] = useState('2026-01-11');
  const [toDateInput, setToDateInput] = useState('2026-01-12');

  // Load Watchlist
  useEffect(() => {
    const saved = localStorage.getItem('stockmanch_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const fetchNews = useCallback(async () => {
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
              hour: '2-digit', minute: '2-digit', hour12: true 
            }),
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
  }, [fromDateInput, toDateInput]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    let interval: number | undefined;
    if (autoRefresh && !loading) {
      interval = window.setInterval(fetchNews, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, loading, fetchNews]);

  const fetchPrice = async (symbol: string, bseCode?: string) => {
    try {
      // Prioritize BSE code for the requested price API as seen in example
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
    alert(`${item.symbol} categorized as ${item.userSentiment} and synced to watchlist node.`);
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

    if (sortOrder === 'TIME') {
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } else if (sortOrder === 'SENTIMENT') {
      list.sort((a, b) => b.sentimentScore - a.sentimentScore);
    } else if (sortOrder === 'CHANGE') {
      list.sort((a, b) => Math.abs(b.priceChange) - Math.abs(a.priceChange));
    }

    return list;
  }, [news, watchlist, activeTab, searchTerm, sortOrder]);

  const copyAllTitles = () => {
    const content = processedNews.map(n => `${n.timestamp} | ${n.symbol} | ${n.title}`).join('\n');
    navigator.clipboard.writeText(content);
    alert(`Station: ${processedNews.length} dispatch titles copied to clipboard.`);
  };

  return (
    <div className="w-full flex flex-col bg-[#0b0f1a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. Terminal Window Bar */}
      <div className="bg-[#161b27] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
          </div>
          <div className="h-6 w-px bg-white/5 mx-2"></div>
          <div className="bg-slate-950/60 px-5 py-2 rounded-xl border border-white/5 text-[11px] text-slate-500 font-mono flex items-center shadow-inner min-w-[320px]">
            <span className="opacity-60">stockmanch.com/terminal/dashboard</span>
          </div>
        </div>
        
        {activeQuote && (
          <div className="flex items-center bg-sky-500/10 border border-sky-500/20 rounded-lg px-4 py-1.5 animate-in slide-in-from-top-4">
            <span className="text-[10px] font-black text-white mr-2">{activeQuote.symbol}:</span>
            <span className="text-[10px] font-mono text-white mr-2">{activeQuote.price || 'FETCHING...'}</span>
            {activeQuote.change !== undefined && (
              <span className={`text-[10px] font-bold ${activeQuote.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {activeQuote.change >= 0 ? '+' : ''}{activeQuote.change.toFixed(2)}
              </span>
            )}
            <button onClick={() => setActiveQuote(null)} className="ml-3 text-slate-500 hover:text-white">✕</button>
          </div>
        )}

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'} rounded-full`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {autoRefresh ? 'STATION SYNC: ACTIVE' : 'STATION SYNC: PAUSED'}
            </span>
          </div>
          <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-white leading-none uppercase tracking-tight">Harsh Vardhan</p>
                <p className="text-[9px] text-emerald-500 font-bold opacity-70 uppercase tracking-tighter">TRD-772</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[11px] font-black text-emerald-500 uppercase">HV</div>
          </div>
        </div>
      </div>

      <TickerTape />

      {/* Terminal Controls */}
      <div className="px-8 py-8 flex flex-col space-y-6 bg-black/10">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/5 shadow-inner">
            {['ALL FEEDS', 'WATCHLIST'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-600 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="SEARCH DISPATCH BY SYMBOL, NAME OR KEYWORD..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/5 rounded-xl pl-12 pr-6 py-3.5 text-[11px] text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500/30 font-mono tracking-tight shadow-inner transition-all"
            />
          </div>

          <div className="flex items-center space-x-3 bg-slate-900/40 px-4 py-2 rounded-xl border border-white/5">
             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Auto 10s</span>
             <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${autoRefresh ? 'bg-emerald-500' : 'bg-slate-800'}`}
             >
               <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-6' : 'translate-x-1'}`} />
             </button>
          </div>

          <button 
            onClick={copyAllTitles}
            className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center space-x-3 border border-white/5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            <span>COPY ALL DISPATCH</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-white/5">
           <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">START_DATE</span>
                 <input 
                  type="date" 
                  value={fromDateInput} 
                  onChange={(e) => setFromDateInput(e.target.value)}
                  className="bg-slate-950/50 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                 />
              </div>
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-slate-600 uppercase mb-1 tracking-widest">END_DATE</span>
                 <input 
                  type="date" 
                  value={toDateInput} 
                  onChange={(e) => setToDateInput(e.target.value)}
                  className="bg-slate-950/50 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                 />
              </div>
              <button 
                onClick={fetchNews}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black border border-emerald-500/30 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? 'SYNCING...' : 'REFETCH'}
              </button>
           </div>
           
           <div className="h-8 w-px bg-white/5 mx-2"></div>

           <div className="flex items-center space-x-3">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sort Protocol:</span>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-slate-950/50 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white font-mono focus:outline-none focus:border-emerald-500 uppercase cursor-pointer transition-all"
              >
                <option value="TIME">Time (Newest)</option>
                <option value="SENTIMENT">AI Sentiment Weight</option>
                <option value="CHANGE">Volatility / % Change</option>
              </select>
           </div>
        </div>
      </div>

      {/* Grid */}
      <div className="px-8 pb-12 min-h-[600px]">
        {loading && news.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-6 opacity-30">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[12px] font-black uppercase tracking-[0.4em]">Establishing Secure Data Tunnel...</p>
          </div>
        ) : processedNews.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="opacity-20 flex flex-col items-center">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.726 2.179a2 2 0 01-1.9 1.36h-1.856a2 2 0 01-1.9-1.36l-.726-2.179a2 2 0 00-1.96-1.414l-2.387.477a2 2 0 00-1.022.547L2 18.428V21a1 1 0 001 1h18a1 1 0 001-1v-2.572l-2.572-3z" />
              </svg>
              <p className="text-xl font-black uppercase tracking-[0.3em]">No Station Match Detected</p>
            </div>
            {activeTab === 'WATCHLIST' && (
              <button onClick={() => setActiveTab('ALL FEEDS')} className="text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:underline">Browse Main Feed</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {processedNews.map((newsItem) => (
              <div key={newsItem.id} className="relative">
                <NewsCard 
                  news={newsItem} 
                  onCopy={(text) => { navigator.clipboard.writeText(text); alert('Station: Data copied.'); }}
                  onWatchlistAdd={handleWatchlistAdd}
                  fetchPrice={fetchPrice}
                />
                {activeTab === 'WATCHLIST' && (
                  <button 
                    onClick={() => removeFromWatchlist(newsItem.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg hover:bg-rose-400 transition-all z-10"
                    title="Remove from Station Watchlist"
                  >
                    ✕
                  </button>
                )}
                {activeTab === 'WATCHLIST' && (newsItem as any).userSentiment && (
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-lg ${(newsItem as any).userSentiment === 'BULLISH' ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'}`}>
                    {(newsItem as any).userSentiment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-[#111621] border-t border-white/5 px-8 py-3.5 flex items-center justify-between text-[9px] font-black font-mono text-slate-600 tracking-[0.2em] uppercase">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500">ENGINE_STATUS:</span>
            <span>OPERATIONAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500">DISPATCHES:</span>
            <span>{processedNews.length} SYNCED</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40"></div>
            <span className="opacity-60 italic">STOCKMANCH TERMINAL V5.0.0-STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketTerminal;
