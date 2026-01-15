import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketTerminal from '../components/MarketTerminal';
import PricingCard from '../components/PricingCard';
import { User, PricingPlan } from '../types';
import { Logo, PRICING_PLANS } from '../constants';

const getAuthToken = () => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; sm_token=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const OverviewSection: React.FC<{ user: User; onNavigate: (section: any) => void }> = ({ user, onNavigate }) => (
  <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-[#111621] border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl group hover:border-emerald-500/20 transition-all">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Plan Status</p>
        <div className="flex items-end justify-between">
          <h3 className="text-xl md:text-2xl font-black text-emerald-500 uppercase tracking-tighter truncate mr-2">{user.planName}</h3>
          <span className="text-slate-500 text-[9px] md:text-[10px] font-bold italic whitespace-nowrap uppercase tracking-widest">RENEWS 12 FEB</span>
        </div>
      </div>
      <div className="bg-[#111621] border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl group hover:border-sky-500/20 transition-all">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Devices</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">02</h3>
          <span className="text-sky-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">ONLINE</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-[#111621] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
          Quick Links
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('terminal')}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Live Terminal</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Market News</span>
          </button>
          <button 
            onClick={() => onNavigate('notifications')}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-sky-500/10 hover:border-sky-500/30 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Recent Alerts</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">History</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111621] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {[
            { msg: 'Login successful from Mumbai', time: '2h ago', status: 'SUCCESS' },
            { msg: 'Telegram alerts active', time: '1d ago', status: 'INFO' },
            { msg: 'Plan details updated', time: '3d ago', status: 'INFO' }
          ].map((act, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-300">{act.msg}</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">{act.time}</span>
              </div>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                act.status === 'SUCCESS' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                'border-white/10 text-slate-500 bg-white/5'
              }`}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Simplified menu state: starts on Overview (Control Center)
  const [activeSection, setActiveSection] = useState<'overview' | 'terminal' | 'account' | 'notifications' | 'settings' | 'billing'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const [user, setUser] = useState<User>({
    id: 'TRD-772',
    name: 'Harsh Vardhan',
    phone: '+91 9876543210',
    email: 'harsh@terminal.com',
    planId: 'alerts-dashboard',
    planName: 'Alerts + Dashboard',
    hasDashboardAccess: true,
    joinedAt: '12 Jan 2026'
  });

  useEffect(() => {
    document.title = "My Dashboard | StockManch";
    if (!getAuthToken()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    document.cookie = "sm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  const handleUpgrade = (plan: PricingPlan) => {
    setUser({ ...user, planId: plan.id, planName: plan.name });
    setIsUpgradeModalOpen(false);
    setActiveSection('billing');
    alert(`Success: You are now on the ${plan.name} plan.`);
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'terminal', label: 'Market Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'notifications', label: 'Alert History', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'account', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'billing', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'settings', label: 'App Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const sectionTitles = {
    overview: 'Account Overview',
    terminal: 'Market Terminal',
    notifications: 'Recent Alerts',
    account: 'My Profile',
    settings: 'App Settings',
    billing: 'Subscription'
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
      <div className={`p-6 border-b border-white/5 bg-slate-950/20 ${isSidebarCollapsed ? 'items-center' : ''} flex flex-col`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
        {!isSidebarCollapsed && (
          <div className="space-y-1">
            <h2 className="text-white font-black uppercase text-xs tracking-tighter">Terminal V4.2</h2>
            <p className="text-[9px] text-slate-600 font-mono uppercase">Online - Mumbai Node</p>
          </div>
        )}
      </div>

      <nav className="flex-grow py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveSection(item.id as any); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-all group ${activeSection === item.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title={isSidebarCollapsed ? item.label : ''}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} uppercase tracking-widest text-[9px] font-black truncate`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-white/5 bg-slate-950/20">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex w-full items-center justify-center p-2 rounded-lg text-slate-700 hover:text-white transition-all"
        >
          <svg className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0b0f1a] flex flex-col text-slate-300 overflow-hidden">
      {!isFullScreenMode && (
        <header className="w-full bg-[#111621] px-4 md:px-8 py-4 flex items-center justify-between shrink-0 border-b border-white/10 z-20">
          <div className="flex items-center space-x-3 md:space-x-8">
            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center space-x-4">
              <Logo className="h-6 md:h-7 w-auto hidden sm:block" />
              <div className="h-5 w-px bg-white/10 hidden md:block"></div>
              <h2 className="text-white font-black uppercase tracking-tighter text-sm hidden md:block">
                {sectionTitles[activeSection]}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black text-white uppercase tracking-tight">{user.name}</span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{user.planName}</span>
            </div>
            <button onClick={handleLogout} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>
      )}

      <div className="flex-grow flex overflow-hidden relative">
        {!isFullScreenMode && (
          <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#0d121f] border-r border-white/5 flex-col shrink-0 z-10 transition-all duration-500`}>
            <SidebarContent />
          </aside>
        )}
        <main className="flex-grow flex flex-col min-w-0 bg-[#0b0f1a] relative overflow-hidden">
          <div className="flex-grow flex flex-col overflow-hidden">
            {activeSection === 'terminal' && <MarketTerminal onToggleFullScreen={setIsFullScreenMode} />}
            {activeSection === 'overview' && <OverviewSection user={user} onNavigate={setActiveSection} />}
            {activeSection === 'account' && <div className="p-8"><h3 className="text-xl font-bold mb-4">My Profile</h3><p>Manage your profile and contact details here.</p></div>}
            {activeSection === 'notifications' && <div className="p-8"><h3 className="text-xl font-bold mb-4">Alert History</h3><p>View your past alerts and messages.</p></div>}
            {activeSection === 'settings' && <div className="p-8"><h3 className="text-xl font-bold mb-4">App Settings</h3><p>Customize your experience.</p></div>}
            {activeSection === 'billing' && <div className="p-8"><h3 className="text-xl font-bold mb-4">Subscription</h3><p>Manage your billing and plan.</p></div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;