
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import AlertShowcase from './components/AlertShowcase';
import PricingModal from './components/PricingModal';
import LegalModal from './components/LegalModal';
import { PRICING_PLANS, FAQ_DATA, Logo } from './constants';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[#1fa84f] transition-colors"
      >
        <span className="text-lg font-medium text-slate-200">{question}</span>
        <svg 
          className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1fa84f]' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-slate-400 leading-relaxed font-medium">{answer}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [hoveredPlanId, setHoveredPlanId] = useState<string | null>(null);
  const [journeyStep, setJourneyStep] = useState<Record<string, boolean>>({});
  const [legalModal, setLegalModal] = useState<{ isOpen: boolean; title: string; content: string }>({
    isOpen: false,
    title: '',
    content: ''
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartJourney = (id: string) => {
    setJourneyStep(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setJourneyStep(prev => ({ ...prev, [id]: false }));
      alert(`Initiating your Next Journey for the ${id.replace('-', ' ')} plan! Redirecting to secure checkout...`);
    }, 1500);
  };

  const openLegal = (type: 'privacy' | 'terms' | 'regulatory') => {
    const data = {
      privacy: {
        title: 'Privacy Charter',
        content: `At StockManch, we take your data privacy seriously.\n\nInformation We Collect: We collect your phone number and email address strictly for delivery of stock alerts. We do not sell your personal data to third-party marketing firms.\n\nData Usage: Your usage patterns within the terminal are anonymized and used to improve our AI sentiment delivery engine.\n\nSecurity: All communication between your device and our servers is encrypted using industry-standard TLS 1.3 protocols.\n\nUpdates: We may update this charter from time to time to reflect changes in regulatory requirements.`
      },
      terms: {
        title: 'Terms of Usage',
        content: `By using StockManch.com, you agree to the following terms:\n\nNature of Service: StockManch provides information and alerts based on public filings. We are not a registered investment advisor.\n\nNo Financial Advice: Information provided on the dashboard or via alerts does not constitute financial advice. Always consult with a certified professional before making trading decisions.\n\nAccuracy: While we strive for millisecond precision, technical latencies or exchange errors are beyond our control.\n\nSubscription: Monthly subscriptions are billed in advance and can be canceled at any time.`
      },
      regulatory: {
        title: 'Regulatory Policy',
        content: `Compliance is our priority.\n\nSEBI Guidelines: StockManch operates as a news aggregation and analysis tool. We strictly adhere to SEBI (Investment Advisers) Regulations, ensuring we only provide factual data and AI-driven sentiment analysis without specific recommendations.\n\nData Integrity: Our data is sourced via authorized APIs from Indian stock exchanges and corporate filing repositories.\n\nDisclosure: Our employees and algorithms do not take positions in the stocks mentioned in alerts during the "Lock-In" period of the news cycle.`
      }
    };
    setLegalModal({ isOpen: true, ...data[type] });
  };

  return (
    <div className="min-h-screen selection:bg-[#1fa84f]/30">
      <Navbar onOpenPricing={() => scrollToSection('pricing')} />
      
      <main>
        <Hero onOpenPricing={() => scrollToSection('pricing')} />

        {/* Reverted Features Section to Original Detailed Version */}
        <section id="features" className="py-24 bg-[#0b0f1a]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                Everything You Need to <span className="text-[#1fa84f]">Stay Ahead</span>
              </h2>
              <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto opacity-80">Powerful features designed to give you the ultimate edge in the stock market.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Alerts",
                  desc: "Receive real-time stock market news and price alerts directly to your phone via Telegram, SMS, or app notification.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  )
                },
                {
                  title: "Live Dashboard",
                  desc: "Access our comprehensive terminal to track market trends, view detailed analytics, and manage your watchlist in real-time.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  title: "24/7 Monitoring",
                  desc: "Our automated systems monitor every exchange announcement around the clock so you never miss a corporate action.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Mobile First",
                  desc: "Optimized for high-speed delivery to mobile devices. Get alerts and access the terminal from anywhere on the planet.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  title: "Secure & Reliable",
                  desc: "Enterprise-grade infrastructure ensures 99.9% uptime and zero missed alerts for your mission-critical trades.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: "AI Analysis",
                  desc: "Every news piece is instantly analyzed by our proprietary AI for sentiment impact and historical significance.",
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )
                }
              ].map((f, i) => (
                <div key={i} className="bg-[#161b27] p-10 rounded-[2rem] border border-white/5 hover:border-[#1fa84f]/20 transition-all duration-300 group shadow-2xl">
                  <div className="w-14 h-14 bg-[#1fa84f]/10 text-[#1fa84f] rounded-2xl flex items-center justify-center mb-8 border border-[#1fa84f]/10 group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-base font-medium opacity-80">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <AlertShowcase />

        <section id="pricing" className="py-24 bg-[#0b0f1a]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">
              Professional <span className="text-[#1fa84f]">Access</span>
            </h2>
            <p className="text-slate-400 mb-20 text-lg font-medium">Choose the tier that powers your trading strategy.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {PRICING_PLANS.map((plan) => {
                const isActive = hoveredPlanId ? hoveredPlanId === plan.id : plan.popular;
                const isJoining = journeyStep[plan.id];

                return (
                  <div 
                    key={plan.id}
                    onMouseEnter={() => setHoveredPlanId(plan.id)}
                    onMouseLeave={() => setHoveredPlanId(null)}
                    className={`relative p-12 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${
                      isActive 
                        ? 'border-[#1fa84f] bg-[#161b27] shadow-[0_32px_64px_-16px_rgba(31,168,79,0.3)] scale-105 z-10 translate-y-[-8px]' 
                        : 'border-white/5 bg-[#161b27]/40 scale-100'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#1fa84f] text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-bottom-2">
                        {hoveredPlanId ? 'Selected' : 'Best Value'}
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-white mb-3 uppercase tracking-tight">{plan.name}</h3>
                    <div className="flex items-center justify-center mb-10">
                      <span className="text-3xl text-slate-500 mr-2 font-black">₹</span>
                      <span className="text-7xl font-black text-white tracking-tighter">{plan.price}</span>
                      <span className="text-slate-600 ml-3 text-lg font-bold">/mo</span>
                    </div>
                    <ul className="space-y-5 mb-12 text-left flex-grow">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start text-sm text-slate-300 font-medium">
                          <svg className="w-5 h-5 text-[#1fa84f] mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => handleStartJourney(plan.id)}
                    disabled={isJoining}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                      isActive 
                        ? 'bg-[#1fa84f] text-slate-950 hover:bg-[#1fa84f]/90 shadow-2xl shadow-[#1fa84f]/20' 
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                    } ${isJoining ? 'animate-pulse cursor-wait' : ''}`}
                  >
                    {isJoining ? 'Next Journey...' : plan.cta}
                  </button>
                </div>
              )})}
            </div>
          </div>
        </section>

        <section id="faq" className="py-24 bg-slate-950">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                Common <span className="text-[#1fa84f]">Queries</span>
              </h2>
            </div>
            <div className="bg-[#161b27]/30 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
              {FAQ_DATA.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        <section id="dashboard" className="py-24 bg-[#0b0f1a] border-t border-white/5">
           <div className="max-w-[1500px] mx-auto px-6">
              <Dashboard />
           </div>
        </section>
      </main>

      <footer className="bg-[#0b0f1a] pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Branding Column */}
            <div>
              <div className="mb-8">
                <Logo className="h-12 w-auto" />
              </div>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed font-medium">
                The definitive source for real-time stock alerts in India. We equip retail traders with institutional-grade news delivery and market terminals.
              </p>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'Telegram'].map((social) => (
                  <button key={social} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 hover:text-[#1fa84f] hover:bg-white/10 transition-all">
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 border border-current rounded-sm"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-[#1fa84f] transition-colors">Core Features</button></li>
                <li><button onClick={() => scrollToSection('dashboard')} className="hover:text-[#1fa84f] transition-colors">Terminal Demo</button></li>
                <li><button onClick={() => setIsPricingOpen(true)} className="hover:text-[#1fa84f] transition-colors">Subscription Plans</button></li>
                <li><button onClick={() => scrollToSection('alerts')} className="hover:text-[#1fa84f] transition-colors">Alert Dispatch</button></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><button onClick={() => openLegal('privacy')} className="hover:text-[#1fa84f] transition-colors">Privacy Charter</button></li>
                <li><button onClick={() => openLegal('terms')} className="hover:text-[#1fa84f] transition-colors">Terms of Usage</button></li>
                <li><button onClick={() => openLegal('regulatory')} className="hover:text-[#1fa84f] transition-colors">Regulatory Policy</button></li>
                <li><a href="#" className="hover:text-[#1fa84f] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li className="flex items-center text-slate-400">
                  <svg className="w-4 h-4 mr-3 text-[#1fa84f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                  </svg>
                  support@stockmanch.com
                </li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-[#1fa84f] transition-colors">Help Center / FAQ</button></li>
                <li><a href="#" className="hover:text-[#1fa84f] transition-colors">Live Chat Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-slate-700 font-mono tracking-widest uppercase">
              © 2026 StockManch | Terminal Build v4.2.1 | Secure Enterprise System
            </div>
            <div className="flex space-x-8 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
              <span className="flex items-center"><div className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></div> NSE Live</span>
              <span className="flex items-center"><div className="w-1 h-1 bg-emerald-500 rounded-full mr-2"></div> BSE Connected</span>
            </div>
          </div>
        </div>
      </footer>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <LegalModal 
        isOpen={legalModal.isOpen} 
        onClose={() => setLegalModal({ ...legalModal, isOpen: false })} 
        title={legalModal.title} 
        content={legalModal.content} 
      />
    </div>
  );
};

export default App;
