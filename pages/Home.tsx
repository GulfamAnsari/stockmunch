import React, { useState } from 'react';
import Hero from '../components/Hero';
import Terminal from '../components/Terminal';
import AlertShowcase from '../components/AlertShowcase';
import PricingCard from '../components/PricingCard';
import { FAQ_DATA } from '../constants';

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
                desc: "A high-fidelity dashboard featuring live NSE/BSE feeds, advanced sentiment analysis, and millisecond dispatch.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
            <div className="transition-all duration-700">
               <Terminal />
            </div>
         </div>
      </section>
    </>
  );
};

export default Home;