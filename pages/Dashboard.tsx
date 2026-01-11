
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketTerminal from '../components/MarketTerminal';
import { User } from '../types';
import { Logo } from '../constants';

const OverviewSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-[#111621] border border-white/5 p-8 rounded-3xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Node Health</p>
        <div className="flex items-end justify-between">
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">99.98%</h3>
          <span className="text-emerald-500 text-[10px] font-bold">OPERATIONAL</span>
        </div>
      </div>
      <div className="bg-[#111621] border border-white/5 p-8 rounded-3xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Plan</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-tighter">{user.planName}</h3>
          <span className="text-slate-500 text-[10px] font-bold italic">RENEWS 12 FEB</span>
        </div>
      </div>
      <div className="bg-[#111621] border border-white/5 p-8 rounded-3xl shadow-2xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Alert Dispatch</p>
        <div className="flex items-end justify-between">
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter">142</h3>
          <span className="text-sky-500 text-[10px] font-bold">LAST 24H</span>
        </div>
      </div>
    </div>

    <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full"></div>
      <h3 className="text-lg font-black text-white uppercase tracking-widest mb-8 flex items-center">
        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
        Market Activity Heatmap
      </h3>
      <div className="grid grid-cols-12 gap-2 h-32">
        {Array(24).fill(0).map((_, i) => (
          <div key={i} className={`rounded-lg ${Math.random() > 0.5 ? 'bg-emerald-500/20' : 'bg-slate-800/40'} border border-white/5 flex items-center justify-center text-[8px] font-mono text-slate-600`}>
            {i.toString().padStart(2, '0')}
          </div>
        ))}
      </div>
      <p className="mt-6 text-[11px] text-slate-500 font-medium">This heatmap displays peak news dispatch hours across the NSE/BSE ecosystem for your tracked sectors.</p>
    </div>
  </div>
);

const AccountSection: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-8 animate-in fade-in duration-500">
    <div className="max-w-3xl">
      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8">Trader Profile</h3>
      <div className="bg-[#111621] border border-white/5 rounded-3xl p-10 space-y-8 shadow-2xl">
        <div className="flex items-center space-x-8">
          <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex items-center justify-center text-3xl text-emerald-500 font-black">
            {user.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-1">{user.name}</h4>
            <p className="text-slate-500 font-mono text-sm">{user.email}</p>
            <div className="mt-3 flex space-x-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {user.id}</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">VERIFIED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Contact Node</h5>
            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 text-sm font-mono text-white">
              {user.phone}
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Telegram Linking</h5>
            <button className="w-full p-4 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 border border-[#0088cc]/30 rounded-2xl text-[11px] font-black text-[#0088cc] uppercase tracking-widest transition-all text-left flex items-center justify-between">
              Link @stockmanch_bot
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        <div className="pt-8 space-y-4">
          <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Security</h5>
          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all">
            Rotate Encryption Password
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'terminal' | 'account'>('terminal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [user] = useState<User>({
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
    document.title = "Terminal Dashboard | StockManch";
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'terminal', label: 'Market Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'account', label: 'Account Node', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ];

  const sectionTitles = {
    overview: 'Management Console',
    terminal: 'Market Terminal',
    account: 'Account Control'
  };

  return (
    <div className="h-screen bg-[#0b0f1a] flex flex-col text-slate-300 overflow-hidden">
      {/* Absolute Full Width Header */}
      <header className="w-full bg-[#111621] px-8 py-4 flex items-center justify-between shrink-0 border-b border-white/10 z-20">
        <div className="flex items-center space-x-8">
          <Logo className="h-8 w-auto" />
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <h2 className="text-white font-black uppercase tracking-tighter text-lg leading-none transition-all duration-300">
              {sectionTitles[activeSection]}
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Station ID: {user.id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-white uppercase tracking-tight">{user.name}</span>
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">{user.planName}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            title="System Logout"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Primary Layout Wrapper */}
      <div className="flex-grow flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-20 lg:w-64'} bg-[#0d121f] border-r border-white/5 flex flex-col shrink-0 z-10 transition-all duration-300 relative`}>
          <nav className="flex-grow py-8 px-4 space-y-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="w-full flex items-center justify-center p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 transition-all mb-4"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <svg className={`w-6 h-6 transition-transform duration-300 ${isSidebarCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>

            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${activeSection === item.id ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/10 font-black' : 'text-slate-500 hover:text-white hover:bg-white/5 font-bold'}`}
              >
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className={`${isSidebarCollapsed ? 'hidden' : 'hidden lg:block'} uppercase tracking-widest text-[11px] truncate`}>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-6 border-t border-white/5">
             <div className={`${isSidebarCollapsed ? 'hidden' : 'hidden lg:block'}`}>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[9px] font-black text-slate-600 uppercase">Usage Node</span>
                 <span className="text-[9px] font-black text-emerald-500">82%</span>
               </div>
               <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                 <div className="w-[82%] h-full bg-emerald-500"></div>
               </div>
             </div>
             {isSidebarCollapsed && (
               <div className="flex justify-center">
                 <div className="w-1.5 h-10 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative">
                   <div className="absolute bottom-0 left-0 w-full h-[82%] bg-emerald-500"></div>
                 </div>
               </div>
             )}
          </div>
        </aside>

        {/* Dynamic Content Panel */}
        <main className="flex-grow flex flex-col min-w-0">
          {user.hasDashboardAccess ? (
            <>
              {activeSection === 'terminal' && <MarketTerminal />}
              {activeSection === 'overview' && <OverviewSection user={user} />}
              {activeSection === 'account' && <AccountSection user={user} />}
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center p-12">
              <div className="bg-[#161b27] border border-white/5 p-20 rounded-[4rem] text-center max-w-4xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-rose-500">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Institutional Lock</h3>
                <p className="text-slate-400 text-lg font-medium mb-12 max-w-lg mx-auto">This node is reserved for high-fidelity traders.</p>
                <button className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all">
                  Upgrade Membership
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
