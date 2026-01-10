
import React, { useState, useEffect } from 'react';
import { Logo } from '../constants';

interface NavbarProps {
  onOpenPricing: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenPricing }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, target: string) => {
    e.preventDefault();
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'py-3 glass border-b shadow-2xl shadow-black/20' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Logo className="h-10 w-auto" />
        </div>

        <div className="hidden md:flex items-center space-x-10 text-sm font-semibold text-slate-400">
          <a href="#features" onClick={(e) => handleLinkClick(e, 'features')} className="hover:text-emerald-500 transition-colors">Features</a>
          <a href="#pricing" onClick={(e) => handleLinkClick(e, 'pricing')} className="hover:text-emerald-500 transition-colors">Pricing</a>
          <a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')} className="hover:text-emerald-500 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={(e) => handleLinkClick(e, 'dashboard')}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-bold rounded-lg transition-all shadow-lg shadow-emerald-500/20 flex items-center group"
          >
            Go to Dashboard
            <svg className="w-4 h-4 ml-2 group-hover:translate-y-[-1px] transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;