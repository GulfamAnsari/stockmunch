
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../constants';

interface NavbarProps {
  onOpenPricing: () => void;
  onNavigateHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenPricing, onNavigateHome }) => {
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Do not show common Navbar on Dashboard and Login pages for a cleaner immersive experience
  const isDashboardOrLogin = location.pathname === '/dashboard' || location.pathname === '/login';
  if (isDashboardOrLogin) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      isScrolled ? 'py-3 glass border-b shadow-2xl shadow-black/20' : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-10 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-400">
          <a href="#features" onClick={(e) => handleSectionClick(e, 'features')} className="hover:text-emerald-500 transition-colors">Features</a>
          <a href="#pricing" onClick={(e) => handleSectionClick(e, 'pricing')} className="hover:text-emerald-500 transition-colors">Pricing</a>
          <Link to="/about" className={`hover:text-emerald-500 transition-colors ${location.pathname === '/about' ? 'text-emerald-500' : ''}`}>Our Mission</Link>
          <Link to="/contact" className={`hover:text-emerald-500 transition-colors ${location.pathname === '/contact' ? 'text-emerald-500' : ''}`}>Contact</Link>
          <a href="#faq" onClick={(e) => handleSectionClick(e, 'faq')} className="hover:text-emerald-500 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link 
            to="/login"
            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center group"
          >
            Terminal Login
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
