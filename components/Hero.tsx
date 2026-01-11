
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

      <div className="max-w-5xl mx-auto px-4 text-center z-10">
        {/* WhatsApp Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-[10px] font-black uppercase tracking-widest mb-6 animate-pulse">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396 0 12.032c0 2.12.556 4.189 1.613 6.04L0 24l6.117-1.605A11.814 11.814 0 0012.046 24c6.635 0 12.032-5.396 12.034-12.032a11.761 11.761 0 00-3.418-8.504z" />
          </svg>
          WhatsApp Alerts coming soon
        </div>

        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-medium mb-4 tracking-wide">
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
            <span className="text-[10px] opacity-70 mt-1 uppercase tracking-tighter">No credit card required</span>
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
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Accuracy</div>
          </div>
          <div className="text-center px-12 border-r border-white/5">
            <div className="text-5xl font-extrabold text-emerald-500 mb-2 tracking-tighter uppercase">30 Days</div>
            <div className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-60">Risk Free</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
