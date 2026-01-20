import React, { useState, useMemo } from 'react';
import { MOCK_NEWS } from '../constants';
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
    <div className="w-full bg-[#0b0f1a] border-y border-white/[0.05] py-2 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-marquee">
        {Array(3).fill(stocks).flat().map((stock, i) => (
          <span key={i} className="inline-flex items-center mx-6 space-x-2">
            <span className="text-[10px] font-black text-slate-300 tracking-tighter uppercase">{stock.symbol}</span>
            <span className="text-[10px] font-mono text-slate-500">{stock.price}</span>
            <span className={`text-[9px] font-bold ${stock.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stock.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ news: StockNews }> = ({ news }) => {
  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-emerald-600/5 text-emerald-600 border-emerald-600/20';
      case 'bearish':
        return 'bg-rose-600/5 text-rose-600 border-rose-600/20';
      default:
        return 'bg-amber-600/5 text-amber-600 border-amber-600/20';
    }
  };

  const isPositive = news.priceChange >= 0;

  return (
    <div className="bg-[#111621] border border-white/[0.05] rounded-xl flex flex-col h-full overflow-hidden hover:border-emerald-600/20 transition-all group shadow-2xl">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-lg ${news.logoColor || 'bg-slate-800'} flex items-center justify-center text-slate-400 text-[11px] font-black shadow-inner`}>
              {news.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-[11px] font-black text-slate-300 tracking-wider uppercase leading-none">{news.companyName}</h3>
                <span className={`text-[9px] font-bold flex items-center ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? '↑' : '↓'} {Math.abs(news.priceChange).toFixed(2)}%
                </span>
              </div>
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">{news.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-600 font-mono uppercase tracking-tighter leading-none">{news.timestamp.split(' ').slice(2).join(' ')}</p>
            <p className="text-[8px] text-slate-700 font-mono uppercase tracking-tighter">{news.timestamp.split(' ').slice(0, 2).join(' ')}</p>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-[12px] font-bold text-slate-300 leading-snug mb-3 line-clamp-2 group-hover:text-emerald-500/80 transition-colors">
          {news.title}
        </h4>

        {/* Content */}
        <p className="text-[10px] text-slate-500 line-clamp-4 leading-relaxed mb-4 opacity-80 font-medium">
          {news.content}
        </p>

        {/* AI Analysis */}
        <div className={`mb-4 px-3 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-[0.15em] inline-flex items-center self-start ${getSentimentStyles(news.sentiment)}`}>
          <div className={`w-1 h-1 rounded-full mr-2 ${news.sentiment === 'bullish' ? 'bg-emerald-600' : news.sentiment === 'bearish' ? 'bg-rose-600' : 'bg-amber-600'} animate-pulse`}></div>
          AI ANALYSIS: {news.sentiment}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/[0.05]">
          <button className="px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-600 hover:text-slate-300 border border-white/[0.05] rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
            + WATCHLIST
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-[9px] text-slate-700 font-black uppercase tracking-widest">{news.source}</span>
            <button className="text-slate-700 hover:text-slate-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Terminal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL FEEDS');

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter(n => 
      n.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="w-full flex flex-col bg-[#0b0f1a] border border-white/[0.05] rounded-2xl overflow-hidden shadow-[0_32px_120px_-20px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* 1. Terminal Window Bar */}
      <div className="bg-[#161b27] border-b border-white/[0.05] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-900/30 border border-rose-900/50"></div>
            <div className="w-3 h-3 rounded-full bg-amber-900/30 border border-amber-900/50"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-900/30 border border-emerald-900/50"></div>
          </div>
          <div className="h-6 w-px bg-white/[0.05] mx-2"></div>
          <div className="bg-slate-950/60 px-5 py-2 rounded-xl border border-white/[0.05] text-[11px] text-slate-600 font-mono flex items-center shadow-inner min-w-[320px]">
            <span className="opacity-40">stockmanch.com/terminal/live-feed</span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-700 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">EXCHANGE: NSE LIVE</span>
          </div>
          <div className="flex items-center space-x-4 border-l border-white/[0.05] pl-6">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 leading-none uppercase tracking-tight">Trader Dashboard</p>
                <p className="text-[9px] text-emerald-700 font-bold opacity-50 uppercase tracking-tighter">PRO MEMBER</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-900/20 border border-emerald-900/30 flex items-center justify-center text-[11px] font-black text-emerald-700">SM</div>
          </div>
        </div>
      </div>

      {/* 2. Ticker Tape */}
      <TickerTape />

      {/* 3. Terminal Navigation Controls */}
      <div className="px-8 py-8 flex flex-wrap items-center gap-6 bg-black/[0.05]">
        <div className="flex bg-slate-900/60 rounded-xl p-1 border border-white/[0.05] shadow-inner">
          {['ALL FEEDS', 'BSE FEEDS', 'WATCHLIST', 'ANALYSIS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg transition-all ${activeTab === tab ? 'bg-emerald-700 text-slate-100 shadow-lg' : 'text-slate-600 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-grow max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="FILTER TERMINAL BY SYMBOL OR CONTENT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/[0.05] rounded-xl pl-12 pr-6 py-3.5 text-[11px] text-slate-400 placeholder:text-slate-800 focus:outline-none focus:border-emerald-700/30 font-mono tracking-tight shadow-inner"
          />
        </div>

        <button className="ml-auto px-8 py-3.5 bg-emerald-700 text-slate-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-emerald-900/20 hover:bg-emerald-600 transition-all flex items-center space-x-3">
          <div className="w-1.5 h-1.5 bg-slate-100 rounded-full animate-pulse"></div>
          <span>TERMINAL LIVE</span>
        </button>
      </div>

      {/* 4. News Grid */}
      <div className="px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>

      {/* 5. Terminal Footer */}
      <footer className="bg-[#111621] border-t border-white/[0.05] px-8 py-3.5 flex items-center justify-between text-[9px] font-black font-mono text-slate-700 tracking-[0.2em] uppercase">
        <div className="flex items-center space-x-10">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700">CORE:</span>
            <span>OPERATIONAL</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700">LATENCY:</span>
            <span>18ms</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-emerald-700">UPTIME:</span>
            <span>99.98%</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-700 opacity-20"></div>
            <span className="opacity-40 italic">STOCKMANCH TERMINAL SHOWCASE V4.2.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terminal;