import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const AboutUs: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About StockMunch | Our Mission to Democratize Market Data";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Learn about StockMunch's mission to provide retail traders with institutional-grade news speed. Discover how we built India's fastest stock alert engine.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 selection:bg-emerald-500/30">
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 mb-8">
            Our Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-12 uppercase tracking-tighter leading-tight">
            Institutional Edge for <br />
            <span className="text-emerald-500 italic">Every Trader</span>
          </h1>
          
          <div className="space-y-16">
            <section className="bg-[#161b27]/40 border border-white/5 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-sm shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">The StockMunch Story</h2>
              <p className="text-lg leading-relaxed text-slate-400 font-medium">
                StockMunch was born from a simple realization: in the stock market, information is only as valuable as the speed at which it is received. For too long, millisecond-level data advantage was reserved for institutional desks and high-frequency firms.
                <br /><br />
                We built StockMunch to democratize market intelligence. By combining direct exchange data feeds with advanced AI sentiment analysis, we provide retail traders with a professional-grade alerting engine that levels the playing field.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Millisecond Dispatch",
                  desc: "We measure our latency in milliseconds, not minutes. If it breaks on the exchange, it breaks on your phone.",
                  icon: "⚡"
                },
                {
                  title: "AI-Powered Context",
                  desc: "Raw data is noise. Our Gemini-driven engine provides the 'why' behind the 'what' in every alert.",
                  icon: "🧠"
                },
                {
                  title: "Secure & Stable",
                  desc: "Built on high-availability infrastructure to ensure you never miss a corporate filing or market update.",
                  icon: "🛡️"
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#161b27] border border-white/5 p-8 rounded-3xl hover:border-emerald-500/20 transition-all group">
                  <div className="text-3xl mb-6 grayscale group-hover:grayscale-0 transition-all">{item.icon}</div>
                  <h3 className="text-white font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <section className="text-center pt-12">
               <h2 className="text-3xl font-bold text-white mb-8">Ready to experience the future of news?</h2>
               <Link 
                to="/" 
                className="inline-flex items-center px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20"
              >
                Start Your 30-Day Trial
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
            </section>
          </div>
          
          <div className="mt-24 pt-8 border-t border-white/5">
             <Link 
              to="/"
              className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;