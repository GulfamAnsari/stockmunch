import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketTerminal from '../components/MarketTerminal';
import { User } from '../types';
import { Logo } from '../constants';

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api";

const getAuthToken = () => {
  const name = "sm_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

interface ControlCenterData {
  end_date: string;
  plan_code: string;
  status: string;
  created_at: string;
  auto_renew: string | boolean;
}

const OverviewSection: React.FC<{ 
  user: User; 
  data: ControlCenterData | null; 
  loading: boolean;
  onNavigate: (section: any) => void 
}> = ({ user, data, loading, onNavigate }) => {
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#0b0f1a]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Control Center...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const isAutoRenewOn = data?.auto_renew === '1' || data?.auto_renew === true || data?.auto_renew === 'true';

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-10 custom-scrollbar space-y-8 animate-in fade-in duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Card */}
        <div className="bg-[#111621] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Subscription Node</p>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            {data?.plan_code || user.planName}
          </h3>
          <div className="flex items-center justify-between">
            <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
              data?.status?.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              Status: {data?.status || 'Active'}
            </div>
            <span className="text-slate-500 text-[9px] font-mono font-bold uppercase">EXP: {formatDate(data?.end_date)}</span>
          </div>
        </div>

        {/* Auto Renew Card */}
        <div className="bg-[#111621] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-sky-500/30 transition-all">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Auto Renewal</p>
          <div className="flex items-center space-x-6">
            <h3 className={`text-5xl font-black uppercase tracking-tighter ${isAutoRenewOn ? 'text-white' : 'text-slate-700'}`}>
              {isAutoRenewOn ? 'ON' : 'OFF'}
            </h3>
            <div className="flex flex-col">
              <span className="text-sky-500 text-[10px] font-black uppercase tracking-widest mb-1">System Secure</span>
              <span className="text-slate-500 text-[9px] font-medium leading-tight">Billing is automated <br />via encrypted node.</span>
            </div>
          </div>
        </div>

        {/* Member Card */}
        <div className="bg-[#111621] border border-white/5 p-8 rounded-[2rem] shadow-2xl group hover:border-amber-500/30 transition-all">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Account Verified</p>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            {formatDate(data?.created_at)}
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Active Member</span>
          </div>
        </div>
      </div>

      {/* Action Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161b27] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-4 animate-pulse shadow-[0_0_10px_#10b981]"></span>
            Terminal Quick-Launch
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <button 
              onClick={() => onNavigate('terminal')}
              className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="text-[11px] font-black text-white uppercase tracking-widest block">Market Feed</span>
              <span className="text-[9px] text-slate-600 font-bold uppercase mt-1 block">Live Terminal</span>
            </button>
            <button 
              onClick={() => onNavigate('notifications')}
              className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-sky-500/10 hover:border-sky-500/30 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <span className="text-[11px] font-black text-white uppercase tracking-widest block">Alert Vault</span>
              <span className="text-[9px] text-slate-600 font-bold uppercase mt-1 block">History Logs</span>
            </button>
          </div>
        </div>

        <div className="bg-[#161b27] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-4 animate-pulse shadow-[0_0_10px_#f59e0b]"></span>
            System Integrity Log
          </h3>
          <div className="space-y-4">
            {[
              { msg: 'Access token validated via secure node', time: 'Just now', status: 'SUCCESS' },
              { msg: `Subscription node synchronized: ${data?.plan_code || 'PRO'}`, time: '5m ago', status: 'SYNC' },
              { msg: 'Global market feed connection stable', time: '12m ago', status: 'INFO' }
            ].map((act, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-300">{act.msg}</span>
                  <span className="text-[8px] text-slate-600 uppercase font-mono mt-1">{act.time}</span>
                </div>
                <span className={`text-[8px] font-black px-2 py-1 rounded border ${
                  act.status === 'SUCCESS' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
                  act.status === 'SYNC' ? 'border-sky-500/20 text-sky-500 bg-sky-500/5' :
                  'border-white/10 text-slate-500 bg-white/5'
                } tracking-tighter`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'terminal' | 'account' | 'notifications' | 'settings' | 'billing'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const [controlCenterData, setControlCenterData] = useState<ControlCenterData | null>(null);
  const [loadingControlCenter, setLoadingControlCenter] = useState(false);

  const [user] = useState<User>({
    id: 'TRD-772',
    name: 'Trader',
    phone: '',
    email: '',
    planId: 'alerts-dashboard',
    planName: 'Pro Bundle',
    hasDashboardAccess: true,
    joinedAt: '-'
  });

  const handleLogout = () => {
    document.cookie = "sm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  const fetchControlCenter = async () => {
    setLoadingControlCenter(true);
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const resp = await fetch(`${API_BASE}/control-center`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const json = await resp.json();

      if (resp.status === 401 || json.error === 'unauthorized') {
        console.warn("Session expired or invalid token. Redirecting to login.");
        handleLogout();
        return;
      }
      
      if (json.status === 'success' && json.data) {
        setControlCenterData(json.data);
      }
    } catch (e) {
      console.error("Critical: Control Center Sync Failure", e);
    } finally {
      setLoadingControlCenter(false);
    }
  };

  useEffect(() => {
    document.title = "Control Center | StockManch";
    const token = getAuthToken();
    if (!token) {
       navigate('/login');
       return;
    }
    fetchControlCenter();
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Control Center', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'terminal', label: 'Market Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'notifications', label: 'Alert History', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'account', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'billing', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'settings', label: 'App Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const sectionTitles = {
    overview: 'Control Center',
    terminal: 'Market Terminal',
    notifications: 'Recent Alerts',
    account: 'My Profile',
    settings: 'App Settings',
    billing: 'Subscription'
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
      <div className={`p-8 border-b border-white/5 bg-slate-950/20 ${isSidebarCollapsed ? 'items-center' : ''} flex flex-col`}>
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
        </div>
        {!isSidebarCollapsed && (
          <div className="space-y-1">
            <h2 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Terminal Node</h2>
            <p className="text-[8px] text-slate-600 font-mono uppercase">Online - Mumbai Secure</p>
          </div>
        )}
      </div>

      <nav className="flex-grow py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveSection(item.id as any); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${activeSection === item.id ? 'bg-emerald-500 text-slate-900 shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title={isSidebarCollapsed ? item.label : ''}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} uppercase tracking-[0.15em] text-[10px] font-black truncate`}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
      
      <div className="p-8 border-t border-white/5 bg-slate-950/20">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="flex w-full items-center justify-center p-2 rounded-xl text-slate-700 hover:text-white transition-all bg-white/5 border border-white/5"
        >
          <svg className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0b0f1a] flex flex-col text-slate-300 overflow-hidden relative">
      {/* Mobile Sidebar Overlay - Relocated to root level for proper z-index context */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden bg-black/80 backdrop-blur-md" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="w-72 h-full bg-[#0d121f] shadow-2xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}

      {!isFullScreenMode && (
        <header className="w-full bg-[#111621] px-6 md:px-10 py-5 flex items-center justify-between shrink-0 border-b border-white/10 z-[50]">
          <div className="flex items-center space-x-3 md:space-x-8">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsMobileSidebarOpen(true); }} 
              className="lg:hidden p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center space-x-6">
              <Logo className="h-7 w-auto hidden sm:block" />
              <div className="h-6 w-px bg-white/10 hidden md:block"></div>
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-xs hidden md:block">
                {sectionTitles[activeSection]}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Plan</span>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tight">{controlCenterData?.plan_code || user.planName}</span>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>
      )}

      <div className="flex-grow flex overflow-hidden relative">
        {!isFullScreenMode && (
          <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-24' : 'w-72'} bg-[#0d121f] border-r border-white/5 flex-col shrink-0 z-10 transition-all duration-500`}>
            <SidebarContent />
          </aside>
        )}
        <main className="flex-grow flex flex-col min-w-0 bg-[#0b0f1a] relative overflow-hidden">
          <div className="flex-grow flex flex-col overflow-hidden">
            {activeSection === 'terminal' && <MarketTerminal onToggleFullScreen={setIsFullScreenMode} />}
            {activeSection === 'overview' && (
              <OverviewSection 
                user={user} 
                data={controlCenterData} 
                loading={loadingControlCenter} 
                onNavigate={setActiveSection} 
              />
            )}
            {activeSection === 'account' && <div className="p-10 flex flex-col items-center justify-center h-full text-center"><div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div><h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Account Profile</h3><p className="text-slate-500 text-sm max-w-xs">User identity management and authentication settings node.</p></div>}
            {activeSection === 'notifications' && <div className="p-10 flex flex-col items-center justify-center h-full text-center"><div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-500 mb-6 border border-sky-500/20"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div><h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Alert History</h3><p className="text-slate-500 text-sm max-w-xs">Historical log of all real-time push notifications dispatched to your device.</p></div>}
            {activeSection === 'settings' && <div className="p-10 flex flex-col items-center justify-center h-full text-center"><div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Terminal Settings</h3><p className="text-slate-500 text-sm max-w-xs">Global application preferences and UI configuration parameters.</p></div>}
            {activeSection === 'billing' && <div className="p-10 flex flex-col items-center justify-center h-full text-center"><div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div><h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Billing Ledger</h3><p className="text-slate-500 text-sm max-w-xs">Subscription billing cycles and payment gateway configuration.</p></div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;