
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../constants';

interface NavbarProps {
  onOpenPricing: () => void;
  onOpenLogin: () => void;
  onNavigateHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenPricing, onOpenLogin, onNavigateHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const element = document.getElementById(target);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDashboard = location.pathname === '/dashboard';
  if (isDashboard) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? 'py-3 glass border-b shadow-2xl shadow-black/20' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
          <Logo className="h-8 md:h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
          <a href="#features" onClick={(e) => handleSectionClick(e, 'features')} className="hover:text-emerald-500 transition-colors">Features</a>
          <a href="#pricing" onClick={(e) => handleSectionClick(e, 'pricing')} className="hover:text-emerald-500 transition-colors">Pricing</a>
          <Link to="/about" className={`hover:text-emerald-500 transition-colors ${location.pathname === '/about' ? 'text-emerald-500' : ''}`}>Our Mission</Link>
          <Link to="/contact" className={`hover:text-emerald-500 transition-colors ${location.pathname === '/contact' ? 'text-emerald-500' : ''}`}>Contact</Link>
          <a href="#faq" onClick={(e) => handleSectionClick(e, 'faq')} className="hover:text-emerald-500 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenLogin}
            className="hidden sm:flex px-6 md:px-8 py-2.5 md:py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 items-center group"
          >
            Login
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0d121f] border-t border-white/5 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" onClick={(e) => handleSectionClick(e, 'features')} className="py-2 hover:text-emerald-500 transition-colors border-b border-white/5">Features</a>
            <a href="#pricing" onClick={(e) => handleSectionClick(e, 'pricing')} className="py-2 hover:text-emerald-500 transition-colors border-b border-white/5">Pricing</a>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-500 transition-colors border-b border-white/5">Our Mission</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 hover:text-emerald-500 transition-colors border-b border-white/5">Contact</Link>
            <a href="#faq" onClick={(e) => handleSectionClick(e, 'faq')} className="py-2 hover:text-emerald-500 transition-colors">FAQ</a>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-4 bg-emerald-500 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg mt-4"
            >
              Login to Terminal
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
