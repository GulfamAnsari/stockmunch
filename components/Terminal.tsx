
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_NEWS, MOCK_CHART_DATA } from '../constants';
import { StockNews } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

const Terminal: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<StockNews>(MOCK_NEWS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({
    'RELIANCE': 2543.20,
    'TCS': 3890.45,
    'HDFCBANK': 1678.10,
    'INFY': 1512.00,
    'SBIN': 612.90,
    'COASTAL': 432.10,
    'RANEMADRAS': 892.30,
    'DMART': 3920.00
  });

  // Simulate live price ticks
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(symbol => {
          const change = (Math.random() - 0.5) * 2;
          next[symbol] = parseFloat((next[symbol] + change).toFixed(2));
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(n => 
      n.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === 'bullish') return 'text-emerald-500';
    if (sentiment === 'bearish') return 'text-rose-500';
    return 'text-amber-500';
  };

  const getSentimentBg = (sentiment: string) => {
    if (sentiment === 'bullish') return 'bg-emerald-500/10 border-emerald-500/20';
    if (sentiment === 'bearish') return 'bg-rose-500/10 border-rose-500/20';
    return 'bg-amber-500/10 border-amber-500/20';
  };

  return (
    <div className="w-full flex flex-col h-[750px] bg-[#0b0f1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-700">
      
      {/* 1. Terminal Header */}
      <header className="bg-[#161b27] border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center space-x-2 bg-black/40 px-3 py-1 rounded border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">NODE:</span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">MUM-SECURE-042</span>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="SEARCH SYMBOL OR NEWS KEYWORD..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-white/5 rounded-lg pl-10 pr-4 py-1.5 text-[10px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 font-mono tracking-tight transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NSE LIVE</span>
          </div>
          <button 
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${isLive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-slate-800 text-slate-500 border border-white/5'}`}
          >
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
      </header>

      {/* 2. Main Terminal Body (3 Columns) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Market Watch */}
        <aside className="w-64 border-r border-white/5 bg-[#0e121b] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-black/20">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Watch</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Object.entries(livePrices).map(([symbol, price]) => (
              <div 
                key={symbol}
                className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{symbol}</span>
                  <span className="text-[11px] font-mono text-white">{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-600 font-bold uppercase">NSE EQ</span>
                  <span className={`text-[9px] font-bold ${Math.random() > 0.5 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 2).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Column: Live News Feed */}
        <main className="flex-1 flex flex-col bg-[#0b0f1a] overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Exchange Feed</h3>
            <span className="text-[9px] font-mono text-slate-700 uppercase">Showing {filteredNews.length} Entries</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredNews.map((news) => (
              <div 
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] ${selectedNews?.id === news.id ? 'bg-emerald-500/[0.03] border-l-2 border-l-emerald-500' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded text-[9px] font-mono text-slate-400">{news.timestamp.split(' ')[2]}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{news.symbol}</span>
                    <span className={`text-[8px] font-black px-1 rounded uppercase ${news.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {news.sentiment}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-700 uppercase">{news.source}</span>
                </div>
                <h4 className={`text-[12px] font-bold leading-snug ${selectedNews?.id === news.id ? 'text-emerald-400' : 'text-slate-100'}`}>
                  {news.title}
                </h4>
              </div>
            ))}
          </div>
        </main>

        {/* Right Column: Detail & Intelligence */}
        <aside className="w-96 border-l border-white/5 bg-[#0e121b] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-black/20">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market Intelligence</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {selectedNews ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${selectedNews.logoColor || 'bg-slate-700'} flex items-center justify-center text-white text-xs font-black shadow-2xl`}>
                      {selectedNews.symbol.substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none mb-1">{selectedNews.symbol}</h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedNews.companyName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Current Price</p>
                      <p className="text-lg font-mono text-white">₹{livePrices[selectedNews.symbol]?.toLocaleString() || '---'}</p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                      <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Impact Volatility</p>
                      <p className={`text-lg font-mono ${selectedNews.priceChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedNews.priceChange > 0 ? '+' : ''}{selectedNews.priceChange.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border mb-8 ${getSentimentBg(selectedNews.sentiment)}`}>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Sentiment Analysis</span>
                      <span className={`text-[9px] font-black uppercase ${getSentimentColor(selectedNews.sentiment)}`}>{selectedNews.sentimentScore}% Confidence</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full transition-all duration-1000 ${selectedNews.sentiment === 'bullish' ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                        style={{ width: `${selectedNews.sentimentScore}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-relaxed italic">
                      "Historical correlation suggests a {selectedNews.sentiment === 'bullish' ? 'positive' : 'negative'} breakout window of 45-60 minutes post-dispatch."
                    </p>
                  </div>

                  <div className="mb-8">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">Quick Chart Preview</h5>
                    <div className="h-32 w-full bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MOCK_CHART_DATA}>
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke={selectedNews.sentiment === 'bullish' ? '#10b981' : '#f43f5e'} 
                            strokeWidth={2} 
                            dot={false} 
                            animationDuration={1500}
                          />
                          <YAxis domain={['auto', 'auto']} hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">Full Brief</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      {selectedNews.content}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                <svg className="w-12 h-12 mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-[10px] font-black uppercase tracking-widest">Select an entry from the feed</p>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* 3. Terminal Footer Status Bar */}
      <footer className="bg-[#161b27] border-t border-white/10 px-8 py-2 flex items-center justify-between text-[9px] font-mono text-slate-600 tracking-wider">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-black">FEED:</span>
            <span>STABLE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-500 font-black">LATENCY:</span>
            <span>{(12 + Math.random() * 8).toFixed(1)}ms</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-emerald-500 font-black">MEMORY:</span>
            <span>2.4GB / 8GB</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="uppercase opacity-40">StockManch Terminal v4.2.1-GOLD-BUILD</span>
          <div className="h-3 w-px bg-white/10"></div>
          <time className="text-white font-black">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST</time>
        </div>
      </footer>
    </div>
  );
};

export default Terminal;
