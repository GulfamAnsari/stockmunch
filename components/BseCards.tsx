import React, { useState, useEffect, useCallback } from 'react';
import { StockNews } from '../types';
import { NewsCard } from './MarketTerminal';

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

interface BseCardsProps {
  onWatchlistAdd: (item: any) => void;
}

const BseCards: React.FC<BseCardsProps> = ({ onWatchlistAdd }) => {
  const [bseNews, setBseNews] = useState<StockNews[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBseFeeds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bsefeed", {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      const json = await response.json();

      if (json.status === "success" && json.data) {
        const allItems: StockNews[] = [];
        Object.keys(json.data).forEach((dateKey) => {
          const rawItems = json.data[dateKey];
          const mappedItems: StockNews[] = rawItems.map((item: any) => ({
            id: item.postId,
            symbol: item.data.cta?.[0]?.meta?.nseScriptCode || "NSE",
            bseCode: item.data.cta?.[0]?.meta?.bseScriptCode || item.data.cta?.[0]?.meta?.bseCode,
            companyName: item.data.cta?.[0]?.ctaText || "BSE Listed",
            title: item.data.title || "",
            content: (item.data.body || "").split("Source:")[0],
            image: item.data.image || item.data.featuredImage,
            logoUrl: item.data.cta?.[0]?.logoUrl,
            aiAnalysis: item.summary || item.data.summary || item.machineLearningSentiments?.explanation,
            timestamp: new Date(item.publishedAt).toLocaleString("en-IN", {
              day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
            }),
            rawPublishedAt: item.publishedAt,
            priceChange: 0,
            sentiment: item.machineLearningSentiments?.label === "negative" ? "bearish" : item.machineLearningSentiments?.label === "positive" ? "bullish" : "neutral",
            sentimentScore: Math.round((item.machineLearningSentiments?.confidence || 0.5) * 100),
            from: item.from,
            source: "BSE",
            logoColor: "bg-blue-600"
          }));
          allItems.push(...mappedItems);
        });
        setBseNews(allItems);
      } else {
        setError("Invalid stream response format.");
      }
    } catch (err) {
      console.error("BSE Fetch Error:", err);
      setError("Unable to connect to BSE data tunnel.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBseFeeds();
  }, [fetchBseFeeds]);

  if (loading) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-600 text-center animate-pulse">Syncing BSE Pipeline...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center opacity-40">
        <p className="text-xl font-black uppercase tracking-[0.2em] mb-4 text-rose-500">Pipeline Offline</p>
        <p className="text-slate-400 text-xs font-medium max-w-xs">{error}</p>
        <button onClick={fetchBseFeeds} className="mt-8 px-6 py-2 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all">Retry Link</button>
      </div>
    );
  }

  if (bseNews.length === 0) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center opacity-20">
        <p className="text-lg sm:text-xl font-black uppercase tracking-[0.3em] px-4">BSE Tunnel Clear</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-6 pt-4 animate-in fade-in duration-500">
      {bseNews.map((newsItem) => (
        <NewsCard 
          key={newsItem.id} 
          news={newsItem} 
          onWatchlistAdd={onWatchlistAdd} 
        />
      ))}
    </div>
  );
};

export default BseCards;