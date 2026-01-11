
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
    <div className="w-full bg-[#0b0f1a] border-y border-white/5 py-2 overflow-hidden whitespace-nowrap" aria-label="Stock Ticker">
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

const NewsCard = ({ news, onAddToWatchlist }: { news: StockNews, onAddToWatchlist: (symbol: string) => void }) => {
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
    <article className="bg-[#111621] border border-white/5 rounded-xl flex flex-col h-full overflow-hidden hover:border-emerald-500/30 transition-all group shadow-sm hover:shadow-emerald-500/5">
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg ${news.logoColor || 'bg-slate-700'} flex items-center justify-center text-white text-[10px] font-black shadow-inner`} aria-hidden="true">
              {news.symbol.substring(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-[11px] font-black text-white tracking-wider">{news.symbol}</h3>
                <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${news.priceChange >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`} aria-label={`Price change ${news.priceChange}%`}>
                  {news.priceChange >= 0 ? '↑' : '↓'} {Math.abs(news.priceChange).toFixed(2)}%
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium uppercase truncate max-w-[80px]">{news.companyName}</p>
            </div>
          </div>
          <div className="text-right">
             <time className="block text-[8px] text-slate-600 font-mono leading-tight uppercase">{news.timestamp.split(' ')[2]} {news.timestamp.split(' ')[3]}</time>
             <time className="block text-[8px] text-slate-700 font-mono uppercase leading-tight">{news.timestamp.split(' ')[0]} {news.timestamp.split(' ')[1]}</time>
          </div>
        </header>

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
        <footer className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onAddToWatchlist(news.symbol)}
              className="px-2 py-1 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/10 rounded-md text-[8px] font-black uppercase tracking-widest transition-all"
            >
              + Watchlist
            </button>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-[8px] text-slate-600 uppercase font-bold mr-2">{news.source}</span>
            <button className="p-1.5 text-slate-600 hover:text-white hover:bg-slate-800 rounded transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
};

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLive, setIsLive] = useState(true);
  const [activeTab, setActiveTab] = useState('feeds');
  const [watchlist, setWatchlist] = useState<string[]>([]);

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      alert(`${symbol} added to your personal watchlist!`);
    }
  };

  return (
    <div className="w-full">
      {/* Institutional Terminal Frame Showcase */}
      <section className="relative rounded-2xl overflow-hidden bg-[#0b0f1a] border border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Terminal Window Header */}
        <header className="bg-[#161b27] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500/30 border border-rose-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></div>
            </div>
            <div className="h-6 w-px bg-white/5 mx-2"></div>
            <div className="bg-slate-950/50 px-4 py-1.5 rounded-lg border border-white/5 text-[11px] text-slate-500 font-mono flex items-center space-x-2">
              <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>stockmanch.com/terminal/v2</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
             <div className="hidden lg:flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NSE Live Feed</span>
             </div>
             <div className="h-5 w-px bg-white/10 hidden lg:block"></div>
             <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-white leading-none uppercase">Terminal Access</p>
                   <p className="text-[9px] text-emerald-500 font-bold opacity-60 uppercase">PRO MEMBER</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-500 font-bold shadow-lg shadow-emerald-500/5">SM</div>
             </div>
          </div>
        </header>

        {/* Real-time Ticker Tape Component */}
        <TickerTape />

        <div className="p-8">
          {/* Main Dashboard Filters & Search */}
          <nav className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex bg-slate-900/80 rounded-xl p-1 border border-white/5 shadow-inner">
              <button 
                onClick={() => setActiveTab('feeds')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'feeds' ? 'bg-emerald-600 text-slate-950 shadow-xl shadow-emerald-500/10' : 'text-slate-500 hover:text-white'}`}
              >
                All Feeds
              </button>
              <button 
                onClick={() => setActiveTab('watchlist')}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center ${activeTab === 'watchlist' ? 'bg-emerald-600 text-slate-950 shadow-xl shadow-emerald-500/10' : 'text-slate-500 hover:text-white'}`}
              >
                Watchlist
                {watchlist.length > 0 && <span className="ml-2 w-4 h-4 bg-slate-950 text-emerald-500 rounded-full flex items-center justify-center text-[8px] font-black">{watchlist.length}</span>}
              </button>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            <div className="relative flex-grow max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="SYMBOL OR KEYWORD SEARCH..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-[11px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 transition-all font-mono tracking-tight"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              {/* WhatsApp Notice Button */}
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500/5 border border-green-500/20 rounded-xl text-[10px] font-black text-green-500 opacity-60 cursor-not-allowed uppercase tracking-widest"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396 0 12.032c0 2.12.556 4.189 1.613 6.04L0 24l6.117-1.605A11.814 11.814 0 0012.046 24c6.635 0 12.032-5.396 12.034-12.032a11.761 11.761 0 00-3.418-8.504z" />
                  </svg>
                  <span>WhatsApp Alerts</span>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 px-2 py-1 bg-slate-800 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity text-center pointer-events-none uppercase tracking-widest">
                  Coming Soon
                </div>
              </div>

              <button 
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center space-x-3 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest shadow-xl ${isLive ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/10' : 'bg-slate-800 text-slate-400'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-slate-950 animate-pulse' : 'bg-slate-600'}`}></div>
                <span>{isLive ? 'Live' : 'Paused'}</span>
              </button>
            </div>
          </nav>

          {/* Institutional Grid Layout */}
          {activeTab === 'watchlist' && watchlist.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Your Watchlist is Empty</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium">Add stocks to your watchlist from the main feed to track them specifically.</p>
              <button onClick={() => setActiveTab('feeds')} className="px-8 py-3 bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl">Browse All Feeds</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(activeTab === 'feeds' ? MOCK_NEWS : MOCK_NEWS.filter(n => watchlist.includes(n.symbol))).map((news) => (
                <NewsCard key={news.id} news={news} onAddToWatchlist={handleAddToWatchlist} />
              ))}
              {/* Extra density for showcase */}
              {activeTab === 'feeds' && MOCK_NEWS.slice(0, 4).map((news) => (
                <NewsCard key={`dup-${news.id}`} news={{...news, id: `dup-${news.id}`, symbol: news.id === '1' ? 'TATA' : 'JSW'}} onAddToWatchlist={handleAddToWatchlist} />
              ))}
            </div>
          )}
        </div>

        {/* Terminal Status Footer */}
        <footer className="bg-[#161b27] border-t border-white/10 px-8 py-3 flex items-center justify-between text-[9px] font-mono text-slate-600 tracking-wider">
           <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                 <span className="text-emerald-500 font-black">NODE:</span>
                 <span>MUM-01-SECURE</span>
              </div>
              <div className="flex items-center space-x-2">
                 <span className="text-emerald-500 font-black">WHATSAPP_ENGINE:</span>
                 <span className="text-amber-500/50">PENDING_DEPLOY</span>
              </div>
           </div>
           <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
              <span className="uppercase opacity-60">StockManch Terminal v4.2.1-STABLE</span>
           </div>
        </footer>
      </section>
    </div>
  );
};

export default Dashboard;
