import React, { useState } from 'react';
import Hero from '../components/Hero';
import AlertShowcase from '../components/AlertShowcase';
import PricingCard from '../components/PricingCard';
import { FAQ_DATA, MOCK_NEWS } from '../constants';

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[#1fa84f] transition-colors"
      >
        <span className="text-lg font-medium text-slate-200">{question}</span>
        <svg 
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1fa84f]' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-slate-400 leading-relaxed font-medium">{answer}</p>
      </div>
    </div>
  );
};

interface HomeProps {
  onOpenPricing: () => void;
  onScrollToSection: (id: string) => void;
  hoveredPlanId: string | null;
  setHoveredPlanId: (id: string | null) => void;
  journeyStep: Record<string, boolean>;
  handleStartJourney: (id: string) => void;
  pricingPlans: any[];
}

const TerminalMockupCard: React.FC<{ news: any }> = ({ news }) => (
  <div className="bg-[#111621] border border-white/[0.06] rounded-2xl p-5 flex flex-col h-full opacity-90 hover:opacity-100 transition-opacity">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`w-9 h-9 rounded-xl bg-slate-900 border border-white/[0.05] flex items-center justify-center text-[10px] font-black text-slate-700`}>
          {news.symbol.substring(0, 2)}
        </div>
        <div className="min-w-0">
          <h3 className="text-[12px] font-semibold text-[#60a5fa] truncate">{news.companyName}</h3>
          <p className="text-[10px] text-slate-500">{news.timestamp}</p>
        </div>
      </div>
      <div className={`px-2 py-0.5 rounded-lg text-[9px] font-mono ${news.priceChange >= 0 ? 'bg-[#062010] text-[#4ade80]' : 'bg-[#2d1212] text-[#fca5a5]'}`}>
        {news.priceChange >= 0 ? '+' : ''}{news.priceChange}%
      </div>
    </div>
    <h4 className="text-[13px] font-medium text-slate-200 mb-3 line-clamp-2 uppercase tracking-tight">{news.title}</h4>
    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3 mb-4">{news.content}</p>
    <div className="mt-auto pt-4 border-t border-white/[0.05] flex justify-between items-center">
      <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${news.sentiment === 'bullish' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
        AI: {news.sentiment}
      </div>
      <span className="text-[9px] text-slate-700 font-black">{news.source}</span>
    </div>
  </div>
);

const Home: React.FC<HomeProps> = ({ 
  onOpenPricing, 
  onScrollToSection,
  hoveredPlanId, 
  setHoveredPlanId, 
  journeyStep, 
  handleStartJourney,
  pricingPlans 
}) => {
  return (
    <>
      <Hero 
        onOpenPricing={onOpenPricing} 
        onScrollToSection={onScrollToSection}
      />

      <section id="features" className="py-24 bg-[#0b0f1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">
              Everything You Need to <span className="text-[#1fa84f]">Stay Ahead</span>
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto opacity-80">Professional grade tools designed for individual traders who demand speed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                title: "Instant Alerts",
                desc: "Receive real-time news alerts delivered via Telegram. Our high-speed dispatch engine ensures news hits your device the second it breaks.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                )
              },
              {
                title: "BSE Corporate Feed",
                desc: "Direct integration with the BSE regulatory filing system. Get official corporate announcements and results the moment they reach the exchange.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )
              },
              {
                title: "Personal Watchlist",
                desc: "Track specific symbols and get prioritized news for your portfolio. Our 'Watchlist' engine ensures you never miss a corporate action.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                )
              },
              {
                title: "Institutional Terminal",
                desc: "A high-fidelity dashboard aggregating live news from leading financial media houses, featuring AI-driven sentiment analysis and millisecond dispatch.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "Sentiment Analysis",
                desc: "AI-driven sentiment engine that processes every news item to identify bullish or bearish potential in seconds.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              {
                title: "24/7 Monitoring",
                desc: "Our automated systems monitor corporate announcements and exchange filings around the clock, even when markets are closed.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((f, i) => (
              <div key={i} className="bg-[#161b27] p-10 rounded-[2rem] border border-white/5 hover:border-[#1fa84f]/20 transition-all duration-300 group shadow-2xl">
                <div className="w-14 h-14 bg-[#1fa84f]/10 text-[#1fa84f] rounded-2xl flex items-center justify-center mb-8 border border-[#1fa84f]/10 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-base font-medium opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AlertShowcase />

      <section id="pricing" className="py-24 bg-[#0b0f1a]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-4 py-2 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-widest rounded-full border border-emerald-500/20 mb-6">
            Limited Time: 30-Day Risk-Free Trial
          </div>
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
            Choose Your <span className="text-[#1fa84f]">Plan</span>
          </h2>
          <p className="text-slate-400 mb-20 text-lg font-medium max-w-2xl mx-auto">Get professional alerts and dashboard access. Instant Telegram delivery for serious traders.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isActive={hoveredPlanId ? hoveredPlanId === plan.id : plan.popular}
                isLoading={journeyStep[plan.id]}
                onSelect={handleStartJourney}
                onMouseEnter={() => setHoveredPlanId(plan.id)}
                onMouseLeave={() => setHoveredPlanId(null)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-24 bg-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
              Common <span className="text-[#1fa84f]">Queries</span>
            </h2>
          </div>
          <div className="bg-[#161b27]/30 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
            {FAQ_DATA.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24 bg-[#0b0f1a] border-t border-white/5">
         <div className="max-w-[1500px] mx-auto px-6 relative">
            <div className="mb-12 text-center">
               <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                 Experience the <span className="text-emerald-500 italic">Terminal</span>
               </h2>
               <p className="text-slate-400 text-sm font-medium mb-8">Institutional-grade data aggregation at your fingertips. High-fidelity real-time preview.</p>
            </div>
            
            {/* Professional Terminal UI Mockup with Dummy Data */}
            <div className="relative group max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0b0f1a] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]">
                {/* Browser Window Header */}
                <div className="bg-[#161b27] border-b border-white/5 px-8 py-5 flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/50"></div>
                  </div>
                  <div className="h-6 w-px bg-white/5 mx-4"></div>
                  <div className="flex-grow bg-slate-950/50 rounded-xl px-6 py-2 text-[10px] text-slate-500 font-mono flex items-center space-x-2 border border-white/5">
                    <svg className="w-3.5 h-3.5 text-emerald-500/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="tracking-tight">https://stockmunch.com/terminal/v5-preview</span>
                  </div>
                </div>

                {/* Mock Terminal Body */}
                <div className="bg-[#0b0f1a] min-h-[600px] flex flex-col pointer-events-none select-none">
                  {/* Mock Navbar */}
                  <div className="px-8 py-4 border-b border-white/[0.05] flex items-center justify-between bg-[#0d121f]">
                    <div className="flex bg-slate-950 rounded-xl p-1 border border-white/[0.1]">
                      <div className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg">All Feeds</div>
                      <div className="px-4 py-1.5 text-slate-500 text-[10px] font-black uppercase">BSE Feeds</div>
                      <div className="px-4 py-1.5 text-slate-500 text-[10px] font-black uppercase">Watchlist</div>
                    </div>
                    <div className="w-64 h-8 bg-slate-950/50 border border-white/[0.08] rounded-xl flex items-center px-4">
                      <div className="w-3 h-3 bg-slate-800 rounded-full mr-3"></div>
                      <div className="w-24 h-2 bg-slate-800 rounded"></div>
                    </div>
                  </div>

                  {/* Mock Ticker */}
                  <div className="w-full bg-[#0b0f1a] border-b border-white/5 py-3 px-8 flex overflow-hidden whitespace-nowrap">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className="flex items-center space-x-4 mr-10">
                        <span className="text-[10px] font-black text-white">RELIANCE</span>
                        <span className="text-[10px] text-emerald-500">+1.24%</span>
                      </div>
                    ))}
                  </div>

                  {/* Mock News Grid */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {MOCK_NEWS.slice(0, 8).map((news) => (
                      <TerminalMockupCard key={news.id} news={news} />
                    ))}
                  </div>

                  {/* Mock Footer */}
                  <div className="mt-auto border-t border-white/[0.05] px-8 py-3 flex justify-between items-center bg-[#0d121f]">
                    <div className="flex items-center space-x-4">
                      <span className="text-[8px] font-black text-blue-500/40 uppercase">Node: Ready</span>
                      <span className="text-[8px] font-black text-blue-500/40 uppercase">Stream: Synced</span>
                    </div>
                    <span className="text-[8px] text-slate-700 font-mono">StockMunch v5.0.1 Stable Preview</span>
                  </div>
                </div>

                {/* Interactive Badge Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                   <div className="bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-10 py-5 rounded-2xl shadow-2xl scale-110">
                      <span className="text-emerald-500 font-black uppercase tracking-[0.4em] text-xs">Live Terminal Preview</span>
                   </div>
                </div>
              </div>
            </div>
         </div>
      </section>
    </>
  );
};

export default Home;