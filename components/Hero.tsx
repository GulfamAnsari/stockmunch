
import React from 'react';

interface HeroProps {
  onOpenPricing: () => void;
  onScrollToSection: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenPricing, onScrollToSection }) => {
  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-[#0b0f1a]">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }}></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-emerald-500/10 blur-[100px] md:blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-[10px] md:text-xs font-medium mb-6 tracking-wide">
          <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          India's definitive real-time stock alert engine
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-white mb-6 md:mb-8 tracking-tight leading-[1.1] md:leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Never Miss a <span className="text-emerald-500">Market</span> <br className="hidden sm:block" />
          <span className="text-emerald-500">Move</span> Again
        </h1>
        
        <p className="text-sm sm:text-base md:text-xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Institutional-grade stock market news alerts delivered via Telegram. Stay ahead of the crowd with real-time notifications and professional terminals.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all shadow-2xl shadow-emerald-500/25 flex flex-col items-center justify-center group"
          >
            <span className="flex items-center">
              30-Day Free Trial
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <span className="text-[9px] opacity-70 mt-1 uppercase tracking-tighter">No credit card required</span>
          </button>
          
          <button 
            onClick={() => onScrollToSection('alerts')}
            className="w-full sm:w-auto px-8 py-4 md:py-5 bg-transparent hover:bg-emerald-500/5 text-emerald-500 font-bold rounded-xl border border-emerald-500/50 transition-all flex items-center justify-center"
          >
            Showcase Alerts
          </button>
        </div>

        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <div className="text-center px-6 md:px-12 sm:border-x border-white/5">
            <div className="text-3xl md:text-5xl font-extrabold text-emerald-500 mb-1 md:mb-2 tracking-tighter uppercase">99.9%</div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">Accuracy</div>
          </div>
          <div className="text-center px-6 md:px-12 sm:border-r border-white/5">
            <div className="text-3xl md:text-5xl font-extrabold text-emerald-500 mb-1 md:mb-2 tracking-tighter uppercase">30 Days</div>
            <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">Trial Period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
