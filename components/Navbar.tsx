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

  const isDashboard = location.pathname.startsWith('/dashboard');
  if (isDashboard) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled || isMobileMenuOpen ? 'py-3 bg-[#0b0f1a] border-b border-white/5 shadow-2xl shadow-black/40' : 'py-5 bg-transparent'
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
            className="md:hidden p-2 text-slate-400 hover:text-white relative z-[110]"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content - Solid background for better readability */}
      <div className={`fixed inset-0 top-0 md:hidden bg-[#0b0f1a] transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} z-[105]`}>
        <div className="pt-24 p-6 space-y-2">
          <div className="flex flex-col space-y-1 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <a href="#features" onClick={(e) => handleSectionClick(e, 'features')} className="py-5 hover:text-emerald-500 transition-colors border-b border-white/5 flex justify-between items-center group">
              <span className="group-hover:translate-x-2 transition-transform">Features</span>
              <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <a href="#pricing" onClick={(e) => handleSectionClick(e, 'pricing')} className="py-5 hover:text-emerald-500 transition-colors border-b border-white/5 flex justify-between items-center group">
              <span className="group-hover:translate-x-2 transition-transform">Pricing</span>
              <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-5 hover:text-emerald-500 transition-colors border-b border-white/5 flex justify-between items-center group">
              <span className="group-hover:translate-x-2 transition-transform">Our Mission</span>
              <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-5 hover:text-emerald-500 transition-colors border-b border-white/5 flex justify-between items-center group">
              <span className="group-hover:translate-x-2 transition-transform">Contact</span>
              <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <button 
              onClick={() => { setIsMobileMenuOpen(false); onOpenLogin(); }}
              className="w-full py-5 bg-emerald-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl mt-8 hover:bg-emerald-400 transition-all"
            >
              Sign In to Terminal
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;