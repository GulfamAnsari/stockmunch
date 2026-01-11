
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroProps {
  onOpenPricing: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenPricing }) => {
  const navigate = useNavigate();

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 -z-10 bg-[#0b0f1a]">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }}></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center z-10">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-4 tracking-wide">
          <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          India's definitive real-time stock alert engine
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Never Miss a <span className="text-emerald-500">Market</span> <br />
          <span className="text-emerald-500">Move</span> Again
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Institutional-grade stock market news alerts delivered via Telegram. Stay ahead of the crowd with real-time notifications and professional terminals.
        </p>
        
        <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <button 
            onClick={onOpenPricing}
            className="w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all shadow-2xl shadow-emerald-500/25 flex flex-col items-center justify-center group"
          >
            <span className="flex items-center">
              Start 30-Day Free Trial
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <span className="text-[10px] opacity-70 mt-1 uppercase tracking-tighter">No credit card required</span>
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-5 bg-transparent hover:bg-emerald-500/5 text-emerald-500 font-bold rounded-xl border border-emerald-500/50 transition-all flex items-center justify-center"
          >
            Institutional Login
          </button>

          <a 
            href="#dashboard" 
            onClick={(e) => scrollToSection(e, 'dashboard')}
            className="w-full sm:w-auto px-8 py-5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold rounded-xl border border-sky-500/30 transition-all flex items-center justify-center"
          >
            Terminal Preview
          </a>
        </div>

        <div className="mt-24 flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <div className="text-center px-12 border-x border-white/5">
            <div className="text-5xl font-extrabold text-emerald-500 mb-2 tracking-tighter uppercase">99.9%</div>
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Accuracy</div>
          </div>
          <div className="text-center px-12 border-r border-white/5">
            <div className="text-5xl font-extrabold text-emerald-500 mb-2 tracking-tighter uppercase">30 Days</div>
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Trial Period</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
