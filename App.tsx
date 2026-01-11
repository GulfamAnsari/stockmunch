
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRoutes from './routes';
import PricingModal from './components/PricingModal';
import TrialFlowModal from './components/TrialFlowModal';
import { Logo, PRICING_PLANS } from './constants';

const App: React.FC = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [journeyStep, setJourneyStep] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const handleStartJourney = (id: string) => {
    const plan = PRICING_PLANS.find(p => p.id === id);
    setSelectedPlan(plan?.name || 'Pro');
    setIsTrialModalOpen(true);
    // Track attempt
    setJourneyStep(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJourneyStep(prev => ({ ...prev, [id]: false }));
    }, 500);
  };

  const scrollToSection = (id: string) => {
    if (window.location.hash !== '#/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const SocialIcons = {
    Twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    Instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.848s.012-3.584.07-4.849c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.947s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    YouTube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 0 0-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    )
  };

  return (
    <div className="min-h-screen selection:bg-[#1fa84f]/30">
      <Navbar 
        onOpenPricing={() => scrollToSection('pricing')} 
        onNavigateHome={() => navigate('/')}
      />
      
      <main>
        <AppRoutes 
          onOpenPricing={() => scrollToSection('pricing')}
          hoveredPlanId={hoveredPlanId}
          setHoveredPlanId={setHoveredPlanId}
          journeyStep={journeyStep}
          handleStartJourney={handleStartJourney}
        />
      </main>

      <footer className="bg-[#0b0f1a] pt-24 pb-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Branding Column */}
            <div className="space-y-8">
              <Link to="/" className="inline-block">
                <Logo className="h-12 w-auto" />
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                India's definitive real-time stock alert engine. We empower traders with lightning-fast exchange data and professional-grade news terminals.
              </p>
              <div className="flex space-x-5">
                {Object.entries(SocialIcons).map(([name, icon]) => (
                  <button 
                    key={name} 
                    className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border hover:border-emerald-500/20 transition-all duration-300 shadow-lg"
                    title={name}
                  >
                    <span className="sr-only">{name}</span>
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 border-l-2 border-emerald-500 pl-3">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-emerald-500 transition-colors text-left w-full">Core Features</button></li>
                <li><button onClick={() => scrollToSection('dashboard')} className="hover:text-emerald-500 transition-colors text-left w-full">Terminal Demo</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-emerald-500 transition-colors text-left w-full">Subscription Plans</button></li>
                <li><button onClick={() => scrollToSection('alerts')} className="hover:text-emerald-500 transition-colors text-left w-full">Alert Dispatch</button></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 border-l-2 border-emerald-500 pl-3">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><Link to="/privacy" className="hover:text-emerald-500 transition-colors block">Privacy Charter</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-500 transition-colors block">Terms of Usage</Link></li>
                <li><Link to="/regulatory" className="hover:text-emerald-500 transition-colors block">Regulatory Policy</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-8 border-l-2 border-emerald-500 pl-3">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li className="flex items-center text-slate-400">
                  <svg className="w-4 h-4 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                  support@stockmanch.com
                </li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-emerald-500 transition-colors text-left w-full">Help Center / FAQ</button></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors block">Telegram Live Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 text-center flex flex-col items-center max-w-4xl mx-auto">
            <div className="mb-6 text-[11px] text-slate-600 font-mono tracking-[0.2em] uppercase">
              © 2026 StockManch | Terminal Build v4.2.1-stable | Secure Node #042
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium opacity-60 mb-8 max-w-3xl">
              DISCLAIMER: Investment in securities market are subject to market risks. Read all the related documents carefully before investing. StockManch provides technology-driven information aggregation and AI sentiment analysis for educational and informational purposes only. We are not a SEBI registered investment advisor. The information provided does not constitute financial or investment advice.
            </p>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center text-[10px] text-emerald-500/50 uppercase font-black tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                Systems Operational
              </div>
              <div className="h-3 w-px bg-white/10"></div>
              <div className="text-[10px] text-slate-700 uppercase font-bold">Made with ❤️ for Indian Traders</div>
            </div>
          </div>
        </div>
      </footer>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} onSelectPlan={handleStartJourney} />
      <TrialFlowModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} planName={selectedPlan} />
    </div>
  );
};

export default App;
