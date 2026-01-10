
import React, { useState, useEffect } from 'react';
import { MOCK_NEWS } from '../constants';
import { StockNews } from '../types';

const TickerTape = () => {
  const stocks = [
    { symbol: 'RELIANCE', price: '2,543.20', change: '+1.2%' },
    { symbol: 'TCS', price: '3,890.45', change: '-0.4%' },
    { symbol: 'HDFCBANK', price: '1,678.10', change: '+0.8%' },
    { symbol: 'INFY', price: '1,512.00', change: '+2.1%' },
    { symbol: 'ICICIBANK', price: '987.30', change: '-1.1%' },
    { symbol: 'BHARTIARTL', price: '1,120.45', change: '+0.5%' },
    { symbol: 'SBIN', price: '612.90', change: '+1.7%' },
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

const NewsCard = ({ news }: { news: StockNews }) => {
  const getSentimentStyles = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'bearish':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  return (
    <div className="bg-[#111621] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden hover:border-emerald-500/30 transition-all group shadow-sm hover:shadow-emerald-500/5">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg ${news.logoColor || 'bg-slate-700'} flex items-center justify-center text-white text-[10px] font-black shadow-inner`}>
              {news.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-[11px] font-black text-white tracking-wider">{news.symbol}</h3>
                <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${news.priceChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {news.priceChange >= 0 ? '↑' : '↓'} {Math.abs(news.priceChange).toFixed(2)}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium uppercase truncate max-w-[80px]">{news.companyName}</p>
            </div>
          </div>
          <div className="text-right">
             <p className="text-[8px] text-slate-600 font-mono leading-tight uppercase">{news.timestamp.split(' ')[2]} {news.timestamp.split(' ')[3]}</p>
             <p className="text-[8px] text-slate-700 font-mono uppercase leading-tight">{news.timestamp.split(' ')[0]} {news.timestamp.split(' ')[1]}</p>
          </div>
        </div>

        {/* News Title */}
        <h4 className="text-[12px] font-bold text-slate-100 leading-snug mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
          {news.title}
        </h4>

        {/* Content Preview */}
        <p className="text-[10px] text-slate-400 line-clamp-4 leading-relaxed flex-grow mb-3 opacity-80">
          {news.content}
        </p>

        {/* Sentiment Analysis Bar */}
        <div className={`mb-3 px-2 py-1 rounded border text-[9px] font-black uppercase tracking-widest inline-flex items-center self-start ${getSentimentStyles(news.sentiment)}`}>
          <div className={`w-1 h-1 rounded-full mr-1.5 ${news.sentiment === 'bullish' ? 'bg-emerald-500 animate-pulse' : news.sentiment === 'bearish' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
          AI ANALYSIS: {news.sentiment}
        </div>

        {/* Source Footer */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-[8px] text-slate-600 uppercase font-bold tracking-tight">SRC:</span>
            <span className="text-[9px] text-sky-400 font-bold tracking-tight">{news.source}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-slate-600 hover:text-white hover:bg-slate-800 rounded transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button className="p-1.5 text-slate-600 hover:text-white hover:bg-slate-800 rounded transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="w-full">
      {/* Institutional Terminal Frame Showcase */}
      <div className="relative rounded-2xl overflow-hidden bg-[#0b0f1a] border border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Terminal Window Header */}
        <div className="bg-[#161b27] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></div>
            </div>
            <div className="h-6 w-px bg-white/5 mx-2"></div>
            <div className="bg-slate-950/50 px-4 py-1.5 rounded-lg border border-white/5 text-[11px] text-slate-500 font-mono flex items-center space-x-2">
              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>stockmanch.com/terminal/live-feed</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exchange: NSE Live</span>
             </div>
             <div className="h-5 w-px bg-white/10 hidden lg:block"></div>
             <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-white leading-none">Trader Dashboard</p>
                   <p className="text-[9px] text-emerald-500 font-bold opacity-60 uppercase">PRO MEMBER</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-500 font-bold shadow-lg shadow-emerald-500/5">SM</div>
             </div>
          </div>
        </div>

        {/* Real-time Ticker Tape Component */}
        <TickerTape />

        <div className="p-8">
          {/* Main Dashboard Filters & Search */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex bg-slate-900/80 rounded-xl p-1 border border-white/5 shadow-inner">
              <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-slate-950 rounded-lg shadow-xl shadow-emerald-500/10">All Feeds</button>
              <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Watchlist</button>
              <button className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Analysis</button>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            <div className="relative flex-grow max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="FILTER TERMINAL BY SYMBOL OR CONTENT..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[11px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-tight"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-white/5 rounded-xl text-[10px] font-black text-slate-400 hover:text-white hover:border-white/10 transition-all uppercase tracking-widest">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Filters</span>
              </button>
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-xl ${isLive ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/10' : 'bg-slate-800 text-slate-400'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-slate-950 animate-pulse' : 'bg-slate-600'}`}></div>
                <span>{isLive ? 'Terminal Live' : 'Feed Paused'}</span>
              </button>
            </div>
          </div>

          {/* Institutional Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {MOCK_NEWS.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
            {/* Adding more cards to show the high-density terminal look */}
            {MOCK_NEWS.map((news) => (
              <NewsCard key={`fill-${news.id}`} news={{...news, id: `fill-${news.id}`, symbol: news.id === '1' ? 'TCS' : 'RELIANCE'}} />
            ))}
          </div>
        </div>

        {/* Terminal Status Footer */}
        <div className="bg-[#161b27] border-t border-white/10 px-8 py-3 flex items-center justify-between text-[9px] font-mono text-slate-600 tracking-wider">
           <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                 <span className="text-emerald-500 font-black">CORE:</span>
                 <span>OPERATIONAL</span>
              </div>
              <div className="flex items-center space-x-2">
                 <span className="text-emerald-500 font-black">LATENCY:</span>
                 <span>18ms</span>
              </div>
              <div className="hidden lg:flex items-center space-x-2">
                 <span className="text-emerald-500 font-black">UPTIME:</span>
                 <span>99.98%</span>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
              <span className="uppercase opacity-60">StockManch Terminal Showcase v4.1.0</span>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
