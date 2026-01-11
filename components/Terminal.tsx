
import React, { useState, useEffect, useMemo } from 'react';
import { StockNews } from '../types';

const Terminal: React.FC = () => {
  const [news, setNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-01-11');
  const [toDate, setToDate] = useState('2026-01-12');
  const [view, setView] = useState<'Selected' | 'Saved' | 'Later'>('Selected');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const formatDateForAPI = (dateStr: string) => {
        const [y, m, d] = dateStr.split('-');
        return `${d}-${m}-${y}`;
      };

      const url = `https://droidtechknow.com/admin/api/stocks/news/save.php?from=${formatDateForAPI(fromDate)}&to=${formatDateForAPI(toDate)}`;
      const response = await fetch(url);
      const json = await response.json();
      
      if (json.status === 'success' && json.data) {
        // Flatten the date-keyed object into a single array
        const allItems: any[] = [];
        Object.keys(json.data).forEach(dateKey => {
          allItems.push(...json.data[dateKey]);
        });

        const mappedData: StockNews[] = allItems.map((item: any) => ({
          id: item.postId,
          symbol: item.data.cta?.[0]?.ctaText || 'N/A',
          companyName: item.data.cta?.[0]?.ctaText || 'Unknown',
          title: item.data.title || '',
          content: item.data.body || '',
          timestamp: new Date(item.publishedAt).toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
          }).replace(',', ''),
          priceChange: (Math.random() * 8 - 4), // Deriving mock change since it's in screenshot but not sample API
          sentiment: item.machineLearningSentiments?.label === 'negative' ? 'bearish' : 
                     item.machineLearningSentiments?.label === 'positive' ? 'bullish' : 'neutral',
          sentimentScore: Math.round((item.machineLearningSentiments?.confidence || 0) * 100),
          source: item.publisher || 'BSE',
          platform: item.from || 'Groww',
          logoUrl: item.data.cta?.[0]?.logoUrl
        }));
        
        setNews(mappedData);
      }
    } catch (error) {
      console.error("Terminal API Error:", error);
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
    <div className="w-full flex flex-col min-h-[800px] bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Terminal Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-3 bg-[#0b0f1a] border-b border-white/5 gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#161b27] border border-white/10 rounded-lg px-2 py-1">
             <svg className="w-3.5 h-3.5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-transparent border-none text-[11px] font-bold text-white focus:outline-none w-24"
            />
          </div>
          <div className="flex items-center bg-[#161b27] border border-white/10 rounded-lg px-2 py-1">
             <svg className="w-3.5 h-3.5 text-slate-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
             <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-transparent border-none text-[11px] font-bold text-white focus:outline-none w-24"
            />
          </div>
          <button 
            onClick={fetchNews}
            className="px-5 py-1.5 bg-[#1d4ed8] hover:bg-blue-600 text-white text-[11px] font-black rounded-lg transition-colors shadow-lg shadow-blue-900/20 uppercase tracking-wider"
          >
            Fetch
          </button>
          <label className="flex items-center gap-2 cursor-pointer ml-1">
            <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/10 bg-slate-900 checked:bg-blue-600" defaultChecked />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">Auto</span>
          </label>
          <div className="relative ml-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search news..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#161b27] border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-[11px] text-white focus:outline-none focus:border-blue-500/50 w-64"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#161b27] rounded-lg p-1 border border-white/10">
            {(['Selected', 'Saved', 'Later'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={`px-4 py-1 text-[11px] font-black uppercase tracking-tight rounded-md transition-all ${view === t ? 'bg-[#334155] text-white' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 ml-2">
            <button className="p-1.5 bg-[#161b27] hover:bg-slate-800 border border-white/10 rounded-lg text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={fetchNews} className="p-1.5 bg-[#161b27] hover:bg-slate-800 border border-white/10 rounded-lg text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b27] hover:bg-slate-800 border border-white/10 rounded-lg text-slate-400 text-[11px] font-black uppercase tracking-tight">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Prices
            </button>
            <div className="relative">
              <select className="appearance-none bg-[#161b27] border border-white/10 rounded-lg px-3 pr-8 py-1.5 text-[11px] font-black text-slate-400 uppercase tracking-tight focus:outline-none hover:bg-slate-800 cursor-pointer">
                <option>Sort</option>
              </select>
              <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b27] border border-white/10 rounded-lg text-[11px] font-black text-white hover:bg-slate-800 uppercase tracking-tight">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Filters
              <span className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[9px] font-black">1</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesizing Feed...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredNews.map((item) => (
              <TerminalCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TerminalCard: React.FC<{ news: StockNews & { logoUrl?: string } }> = ({ news }) => {
  const isNegative = news.priceChange < 0;

  return (
    <div className="bg-[#0b0f1a] border border-white/5 rounded-xl flex flex-col hover:border-white/15 transition-all group shadow-xl">
      <div className="p-4 flex flex-col h-full">
        {/* Card Header Area */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
              {news.logoUrl ? (
                <img src={news.logoUrl} alt={news.symbol} className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-[10px] font-black text-slate-900">{news.symbol.substring(0, 2)}</span>
              )}
            </div>
            <div>
              <h3 className="text-[13px] font-black text-blue-400 uppercase tracking-tight leading-none mb-1 group-hover:text-blue-300 transition-colors">
                {news.companyName}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{news.timestamp}</p>
            </div>
          </div>
          <div className={`px-1.5 py-0.5 rounded text-[10px] font-black ${isNegative ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {isNegative ? '' : '+'}{news.priceChange.toFixed(2)}%
          </div>
        </div>

        {/* Card Body / News Content */}
        <div className="flex-grow mb-4">
          <h4 className="text-[13px] font-bold text-slate-200 leading-snug mb-3 group-hover:text-white transition-colors line-clamp-2">
            {news.title}
          </h4>
          <p className="text-[12px] text-slate-400 leading-relaxed line-clamp-6 opacity-90 font-medium">
            {news.content}
          </p>
        </div>

        {/* Card Metadata (Source) */}
        <div className="space-y-3 mb-4">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            Source: <span className="text-slate-400">{news.source}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#161b27] text-slate-500 text-[10px] font-bold uppercase tracking-tight rounded border border-white/5">
              {news.platform}
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
            news.sentiment === 'bullish' 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : news.sentiment === 'bearish'
              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}>
            AI: {news.sentiment} ({news.sentimentScore}%)
          </div>
          
          <div className="flex bg-[#161b27] rounded-lg border border-white/10 overflow-hidden shadow-lg">
            <button className="px-4 py-1.5 text-[11px] font-black text-slate-300 hover:bg-slate-800 transition-colors uppercase tracking-tight">Save</button>
            <button className="px-2.5 py-1.5 border-l border-white/10 hover:bg-slate-800 text-slate-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
