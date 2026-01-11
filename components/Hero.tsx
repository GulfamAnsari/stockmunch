
import React from 'react';

interface HeroProps {
  onOpenPricing: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenPricing }) => {
  const scrollToDashboard = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('dashboard');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAlerts = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('alerts');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* Background with Candlestick Pattern Overlay */}
      <div className="absolute inset-0 -z-10 bg-[#0b0f1a]">
        {/* Decorative Grid and Glows */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }}></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[150px] rounded-full"></div>
        
        {/* Candlestick SVG Background (Simulated) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 500">
             <path d="M0,400 L50,380 L100,420 L150,350 L200,370 L250,310 L300,340 L350,280 L400,290 L450,220 L500,250 L550,180 L600,210 L650,150 L700,190 L750,120 L800,150 L850,80 L900,110 L1000,40" 
                   fill="none" stroke="#10b981" strokeWidth="2" />
             {/* Random Green/Red Candlesticks */}
             {Array.from({ length: 20 }).map((_, i) => (
               <rect key={i} x={i * 50 + 20} y={350 - Math.random() * 200} width="4" height={20 + Math.random() * 80} fill="#10b981" fillOpacity="0.4" />
             ))}
          </svg>
        </div>
      </div>

      {/* Floating Decorative Icons */}
      <div className="absolute left-10 top-1/3 text-emerald-500/30 animate-bounce delay-700">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </div>
      <div className="absolute right-10 bottom-1/3 text-emerald-500/30 animate-pulse">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-10 tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-700">
          <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Start your 30-day full-access trial today
        </div>
        
        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-8 tracking-tight leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Never Miss a <span className="text-emerald-500">Market</span> <br />
          <span className="text-emerald-500">Move</span> Again
        </h1>
        
        {/* Description */}
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Get instant stock market news alerts delivered to your phone. Stay ahead of the market with our real-time notification system and comprehensive terminal dashboard.
        </p>
        
        {/* Buttons */}
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
            <span className="text-[10px] opacity-70 mt-1">No credit card required upfront</span>
          </button>
          
          <a 
            href="#alerts" 
            onClick={scrollToAlerts}
            className="w-full sm:w-auto px-8 py-5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold rounded-xl border border-sky-500/30 transition-all flex items-center justify-center"
          >
            View Alert Showcase
          </a>

          <a 
            href="#dashboard" 
            onClick={scrollToDashboard}
            className="w-full sm:w-auto px-8 py-5 bg-transparent hover:bg-emerald-500/5 text-emerald-500 font-bold rounded-xl border border-emerald-500/50 transition-all flex items-center justify-center"
          >
            Terminal Demo
          </a>
        </div>

        {/* Stats Section */}
        <div className="mt-24 flex justify-center animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500">
          <div className="text-center px-12 border-x border-white/5">
            <div className="text-5xl font-extrabold text-emerald-500 mb-2 tracking-tighter uppercase">99.9%</div>
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">System Uptime</div>
          </div>
          <div className="text-center px-12 border-r border-white/5">
            <div className="text-5xl font-extrabold text-emerald-500 mb-2 tracking-tighter uppercase">30 Days</div>
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Risk Free Trial</div>
          </div>
        </div>

        {/* Mouse Scroll Icon */}
        <div className="mt-20 flex justify-center animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-700 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
