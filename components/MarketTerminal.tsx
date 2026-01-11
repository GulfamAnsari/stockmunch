
import React, { useState, useEffect, useMemo } from 'react';
import { StockNews } from '../types';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

const MarketTerminal: React.FC = () => {
  const [news, setNews] = useState<StockNews[]>([]);
  const [selectedNews, setSelectedNews] = useState<StockNews | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('2026-01-11');
  const [toDate, setToDate] = useState('2026-01-12');
  const [livePrices, setLivePrices] = useState<Record<string, number>>({
    'RELIANCE': 2543.20, 'TCS': 3890.45, 'HDFCBANK': 1678.10, 'INFY': 1512.00, 'SBIN': 612.90, 'COASTAL': 432.10
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const formatDate = (d: string) => {
        const [y, m, day] = d.split('-');
        return `${day}-${m}-${y}`;
      };
      const url = `https://droidtechknow.com/admin/api/stocks/news/save.php?from=${formatDate(fromDate)}&to=${formatDate(toDate)}`;
      const response = await fetch(url);
      const json = await response.json();
      
      if (json.status === 'success' && json.data) {
        const allItems: any[] = [];
        Object.keys(json.data).forEach(dateKey => {
          allItems.push(...json.data[dateKey]);
        });

        const mapped: StockNews[] = allItems.map((item: any) => ({
          id: item.postId,
          symbol: item.data.cta?.[0]?.meta?.nseScriptCode || 'N/A',
          companyName: item.data.cta?.[0]?.ctaText || 'Market Entry',
          title: item.data.title || '',
          content: item.data.body || '',
          timestamp: new Date(item.publishedAt).toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', year: 'numeric', 
            hour: '2-digit', minute: '2-digit', hour12: true 
          }),
          priceChange: (Math.random() * 6 - 3),
          sentiment: item.machineLearningSentiments?.label === 'negative' ? 'bearish' : 
                     item.machineLearningSentiments?.label === 'positive' ? 'bullish' : 'neutral',
          sentimentScore: Math.round((item.machineLearningSentiments?.confidence || 0.5) * 100),
          source: item.publisher || 'BSE',
          platform: 'Groww'
        }));
        
        setNews(mapped);
        if (mapped.length > 0) setSelectedNews(mapped[0]);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(() => {
      setLivePrices(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(s => next[s] = parseFloat((next[s] + (Math.random() - 0.5) * 2).toFixed(2)));
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    return news.filter(n => n.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || n.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [news, searchTerm]);

  return (
    <div className="w-full flex flex-col h-[750px] bg-[#0b0f1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header Toolbar */}
      <header className="bg-[#161b27] border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-2 py-1.5">
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="bg-transparent border-none text-[10px] text-white font-mono focus:outline-none w-28" />
          </div>
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg px-2 py-1.5">
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="bg-transparent border-none text-[10px] text-white font-mono focus:outline-none w-28" />
          </div>
          <button onClick={fetchNews} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Fetch</button>
        </div>

        <div className="flex-grow max-w-md">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="SEARCH FEED..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-black/30 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-[10px] text-white font-mono tracking-tight" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LIVE SYNC</span>
          </div>
        </div>
      </header>

      {/* Main Terminal Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Market Watch */}
        <aside className="w-60 border-r border-white/5 bg-[#0e121b] flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 text-[9px] font-black text-slate-500 uppercase tracking-widest">Market Watch</div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {Object.entries(livePrices).map(([s, p]) => (
              <div key={s} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-black text-white group-hover:text-emerald-400">{s}</span>
                  <span className="text-[11px] font-mono text-white">{p}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <span className="text-slate-600">NSE</span>
                  <span className={Math.random() > 0.4 ? 'text-emerald-500' : 'text-rose-500'}>{Math.random() > 0.4 ? '+' : '-'}{(Math.random() * 1.5).toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Live Feed */}
        <main className="flex-1 flex flex-col bg-[#0b0f1a] overflow-hidden border-r border-white/5">
          <div className="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center text-[9px] font-black text-slate-500 uppercase tracking-widest">
            <span>Exchange Dispatch Feed</span>
            <span>{filtered.length} Entries</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="h-full flex items-center justify-center opacity-30">Loading...</div>
            ) : filtered.map(item => (
              <div key={item.id} onClick={() => setSelectedNews(item)} className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] ${selectedNews?.id === item.id ? 'bg-emerald-500/[0.03] border-l-2 border-emerald-500' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] font-mono text-slate-500">{item.timestamp.split(',')[1].trim()}</span>
                    <span className="text-[10px] font-black text-white uppercase">{item.symbol}</span>
                    <span className={`text-[8px] font-black px-1 rounded uppercase ${item.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>{item.sentiment}</span>
                  </div>
                </div>
                <h4 className={`text-[12px] font-bold leading-snug ${selectedNews?.id === item.id ? 'text-emerald-400' : 'text-slate-200'}`}>{item.title}</h4>
              </div>
            ))}
          </div>
        </main>

        {/* Intelligence Detail */}
        <aside className="w-96 bg-[#0e121b] flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 text-[9px] font-black text-slate-500 uppercase tracking-widest">Terminal Intelligence</div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {selectedNews ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="mb-6">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-1">{selectedNews.symbol}</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{selectedNews.companyName}</p>
                </div>
                <div className={`p-4 rounded-xl border mb-6 bg-emerald-500/5 border-emerald-500/20`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase">AI Sentiment Engine</span>
                    <span className="text-[9px] font-black text-emerald-500 uppercase">{selectedNews.sentimentScore}% CONFIDENCE</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${selectedNews.sentimentScore}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-300 italic">"Model identifies potential bullish breakout based on corporate structural realignment."</p>
                </div>
                <div className="h-32 bg-black/40 border border-white/5 rounded-xl mb-6 flex flex-col justify-center p-4">
                  <p className="text-[8px] text-slate-600 font-black uppercase mb-2">Volatility Index</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...Array(10)].map((_,i)=>({v:Math.random()*10}))}><Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false}/><YAxis hide/></LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest border-b border-white/5 pb-2">Full Dispatch</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{selectedNews.content}</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-700 uppercase text-[10px] font-black tracking-widest">Select Dispatch</div>
            )}
          </div>
        </aside>
      </div>
      <footer className="bg-[#161b27] border-t border-white/10 px-8 py-2 flex items-center justify-between text-[8px] font-mono text-slate-600 tracking-widest">
        <span>STATION: MUM-NOD-42</span>
        <span className="text-emerald-500 uppercase">Latency: 22ms</span>
      </footer>
    </div>
  );
};

export default MarketTerminal;
