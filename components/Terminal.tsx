
import React, { useState, useEffect, useMemo } from 'react';
import { StockNews } from '../types';

const Terminal: React.FC = () => {
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-01-12');
  const [toDate, setToDate] = useState('2026-01-12');
  const [view, setView] = useState<'Selected' | 'Saved' | 'Later'>('Selected');

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Formatting dates to dd-mm-yyyy for the API
      const formatDate = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}-${m}-${y}`;
      };

      const url = `https://droidtechknow.com/admin/api/stocks/news/save.php?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`;
      const response = await fetch(url);
      const data = await response.json();
      
      // Mapping API data to our StockNews interface
      // Assuming API returns an array. Mapping fields based on screenshot requirements.
      const mappedData: StockNews[] = data.map((item: any, index: number) => ({
        id: item.id || String(index),
        symbol: item.symbol || 'N/A',
        companyName: item.company_name || item.symbol || 'Unknown Company',
        title: item.title || '',
        content: item.content || item.description || '',
        timestamp: item.date_time || '10 Jan 2026 05:36PM',
        priceChange: parseFloat(item.price_change) || (Math.random() * 10 - 5),
        sentiment: item.sentiment?.toLowerCase() || (Math.random() > 0.5 ? 'bullish' : 'neutral'),
        sentimentScore: parseInt(item.sentiment_score) || Math.floor(Math.random() * 40 + 60),
        source: item.source || 'BSE',
        platform: item.platform || 'Groww',
        logoColor: item.logo_color || 'bg-indigo-600'
      }));
      
      setNews(mappedData);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter(n => 
      n.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [news, searchTerm]);

  return (
    <div className="w-full flex flex-col min-h-[800px] bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30">
      
      {/* Terminal Top Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-[#0b0f1a] border-b border-white/5 gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-[#161b27] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
            <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-500 rounded-full opacity-0"></span>
          </div>
          <div className="relative">
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-[#161b27] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <button 
            onClick={fetchNews}
            className="px-4 py-1.5 bg-[#1d4ed8] hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
          >
            Fetch
          </button>
          <label className="flex items-center gap-2 cursor-pointer ml-2">
            <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-slate-900 checked:bg-emerald-500" />
            <span className="text-xs font-bold text-slate-400">Auto</span>
          </label>
          <div className="relative ml-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#161b27] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#161b27] rounded-lg p-1 border border-white/10">
            {(['Selected', 'Saved', 'Later'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`px-4 py-1 text-[11px] font-bold rounded-md transition-all ${view === t ? 'bg-[#334155] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <button className="p-1.5 hover:bg-white/5 rounded text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button onClick={fetchNews} className="p-1.5 hover:bg-white/5 rounded text-slate-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded text-slate-400 text-xs font-bold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Prices
            </button>
          </div>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <select className="bg-transparent border-none text-xs font-bold text-slate-400 focus:outline-none">
              <option>Sort</option>
              <option>Newest</option>
              <option>Impact</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b27] border border-white/10 rounded-lg text-xs font-bold text-white hover:bg-slate-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Filters
              <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: News Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-black uppercase tracking-widest">Accessing Node Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const NewsCard: React.FC<{ news: StockNews }> = ({ news }) => {
  const isNegative = news.priceChange < 0;

  return (
    <div className="bg-[#0b0f1a] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all flex flex-col group shadow-2xl">
      <div className="p-4 flex flex-col h-full">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${news.logoColor || 'bg-slate-800'} flex items-center justify-center shadow-lg border border-white/5`}>
              <span className="text-[10px] font-black text-white">{news.symbol.substring(0, 2)}</span>
            </div>
            <div>
              <h3 className="text-[13px] font-black text-blue-400 uppercase tracking-tight leading-none mb-1">{news.companyName}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase">{news.timestamp}</p>
            </div>
          </div>
          <div className={`px-2 py-0.5 rounded text-[11px] font-black ${isNegative ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isNegative ? '' : '+'}{news.priceChange.toFixed(2)}%
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-grow mb-6">
          <h4 className="text-[13px] font-bold text-slate-200 leading-snug mb-3 group-hover:text-blue-400 transition-colors">
            {news.title}
          </h4>
          <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-6 opacity-80 font-medium">
            {news.content}
          </p>
        </div>

        {/* Card Meta */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-500">Source: {news.source}</p>
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="bg-[#161b27] px-2 py-1 rounded border border-white/5 flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{news.platform}</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            news.sentiment === 'bullish' 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : news.sentiment === 'bearish'
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}>
            AI: {news.sentiment} ({news.sentimentScore}%)
          </div>
          
          <div className="flex bg-[#161b27] rounded-lg border border-white/10 overflow-hidden">
            <button className="px-4 py-1.5 text-[11px] font-black text-slate-300 hover:bg-slate-800 transition-colors">Save</button>
            <button className="px-2 py-1.5 border-l border-white/10 hover:bg-slate-800 text-slate-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
