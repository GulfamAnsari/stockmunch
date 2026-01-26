import React from 'react';

interface HeroProps {
  onOpenPricing: () => void;
  onScrollToSection: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenPricing, onScrollToSection }) => {
  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Institutional High-Fidelity Background */}
      <div className="absolute inset-0 -z-10 bg-[#0b0f1a]">
        {/* Animated Perspective Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] perspective-1000 overflow-hidden">
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: `linear-gradient(to bottom, transparent, #0b0f1a), 
                                   linear-gradient(#1e293b 1px, transparent 1px), 
                                   linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
                 backgroundSize: '100% 100%, 40px 40px, 40px 40px',
                 transform: 'rotateX(60deg) translateY(0)',
                 transformOrigin: 'top',
                 animation: 'grid-run 20s linear infinite'
               }}>
          </div>
        </div>

        {/* Floating Data Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-emerald-500/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${5 + Math.random() * 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random()
              }}
            ></div>
          ))}
        </div>

        {/* Multi-layered Aurora Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-sky-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full"></div>

        {/* Large Decorative Bell Icon (Floating) */}
        <div className="absolute top-[15%] right-[10%] hidden xl:block animate-[float-icon_6s_ease-in-out_infinite]">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full scale-150 group-hover:bg-emerald-500/30 transition-all duration-700"></div>
            <svg className="w-32 h-32 text-emerald-600/40 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>
        {/* Floating Candlestick UI Elements */}
        <div className="absolute bottom-[25%] left-[10%] hidden xl:flex space-x-8 items-end animate-[float-icon_8s_ease-in-out_infinite_reverse]">
          <div className="flex flex-col items-center opacity-40">
            <div className="w-0.5 h-16 bg-emerald-500"></div>
            <div className="w-5 h-24 bg-emerald-500/20 border border-emerald-500/50 rounded-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]"></div>
            <div className="w-0.5 h-10 bg-emerald-500"></div>
          </div>
          <div className="flex flex-col items-center mb-8 opacity-40">
            <div className="w-0.5 h-10 bg-rose-500"></div>
            <div className="w-5 h-36 bg-rose-500/20 border border-rose-500/50 rounded-sm shadow-[0_0_30px_rgba(244,63,94,0.2)]"></div>
            <div className="w-0.5 h-20 bg-rose-500"></div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grid-run {
          from { background-position: 0 0, 0 0, 0 0; }
          to { background-position: 0 0, 0 40px, 0 0; }
        }
        @keyframes float-particle {
          from { transform: translateY(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          to { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes float-icon {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] md:text-xs font-black mb-6 tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <svg className="w-3 h-3 mr-2 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          India's definitive real-time stock alert engine
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-200 mb-6 md:mb-8 tracking-tighter leading-[0.95] md:leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 uppercase">
          Stop checking news. <span className="text-emerald-600 italic drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"></span> <br className="hidden sm:block" />
          <span className="text-emerald-600 italic drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]"> Start getting alerts.</span>
        </h1>
        
        <p className="text-sm sm:text-base md:text-xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 font-medium">
          Get real-time stock market news alerts on Dashboard & Telegram
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onOpenPricing}
            className="w-full md:w-auto px-8 md:px-10 py-4 md:py-5 bg-emerald-700 hover:bg-emerald-600 text-slate-100 font-black uppercase tracking-widest rounded-xl transition-all shadow-2xl shadow-emerald-900/20 flex flex-col items-center justify-center group shrink-0"
          >
            <span className="flex items-center">
              Sign Up Free
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          
          <button 
            onClick={() => onScrollToSection('alerts')}
            className="w-full md:w-auto px-8 py-4 md:py-5 bg-transparent hover:bg-emerald-600/5 text-emerald-600 font-bold rounded-xl border border-emerald-600/30 transition-all flex items-center justify-center"
          >
            Explore Alerts
          </button>

          <button 
            onClick={() => onScrollToSection('dashboard')}
            className="w-full md:w-auto px-8 py-4 md:py-5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 font-bold rounded-xl border border-white/[0.05] transition-all flex items-center justify-center"
          >
            Live Terminal
          </button>
        </div>

        {/* Roadmap Roadmap/Coming Soon Badges */}
        {/* <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.02] rounded-full border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">WhatsApp Alerts Coming Soon</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/[0.02] rounded-full border border-white/[0.05]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">Android & iOS Apps Coming Soon</span>
          </div>
        </div> */}

        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <div className="text-center px-6 md:px-12 sm:border-x border-white/[0.05]">
            <div className="text-3xl md:text-5xl font-black text-emerald-600/80 mb-1 md:mb-2 tracking-tighter uppercase">99.9%</div>
            <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest opacity-60">Uptime</div>
          </div>
          <div className="text-center px-6 md:px-12 sm:border-r border-white/[0.05]">
            <div className="text-3xl md:text-5xl font-black text-emerald-600/80 mb-1 md:mb-2 tracking-tighter uppercase">30 Days</div>
            <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest opacity-60">Trial Period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;