import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MarketTerminal from '../components/MarketTerminal';
import PricingCard from '../components/PricingCard';
import { User, PricingPlan } from '../types';
import { Logo, PRICING_PLANS } from '../constants';

const OverviewSection: React.FC<{ user: User; onNavigate: (section: any) => void }> = ({ user, onNavigate }) => (
  <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-[#111621] border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl group hover:border-emerald-500/20 transition-all">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Subscription Status</p>
        <div className="flex items-end justify-between">
          <h3 className="text-xl md:text-2xl font-black text-emerald-500 uppercase tracking-tighter truncate mr-2">{user.planName}</h3>
          <span className="text-slate-500 text-[9px] md:text-[10px] font-bold italic whitespace-nowrap uppercase tracking-widest">RENEWS 12 FEB</span>
        </div>
      </div>
      <div className="bg-[#111621] border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl group hover:border-sky-500/20 transition-all">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Active Sessions</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">02</h3>
          <span className="text-sky-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">SECURE NODES</span>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      <div className="bg-[#111621] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
          Quick Navigation
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('terminal')}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Live Terminal</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">Real-time Feed</span>
          </button>
          <button 
            onClick={() => onNavigate('notifications')}
            className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-sky-500/10 hover:border-sky-500/30 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <span className="text-[10px] font-black text-white uppercase tracking-widest block">Alert Logs</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase">System Alerts</span>
          </button>
        </div>
      </div>

      <div className="bg-[#111621] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
          Recent Security Activity
        </h3>
        <div className="space-y-3">
          {[
            { msg: 'Terminal login from Mumbai, IN', time: '2h ago', status: 'SUCCESS' },
            { msg: 'Telegram bot re-linked', time: '1d ago', status: 'INFO' },
            { msg: 'Plan upgraded to Terminal Pro', time: '3d ago', status: 'BILLING' }
          ].map((act, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-300">{act.msg}</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest">{act.time}</span>
              </div>
              <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${
                act.status === 'SUCCESS' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                act.status === 'BILLING' ? 'border-sky-500/30 text-sky-500 bg-sky-500/5' :
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

const NotificationsSection: React.FC = () => (
  <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">Alert Archive</h3>
        <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors px-4 py-2 border border-white/5 rounded-xl">Clear All Logs</button>
      </div>

      <div className="space-y-4">
        {[
          { type: 'MARKET', title: 'High Volatility Detected', body: 'NIFTY IT index showing abnormal price action (+2.4% in 15min)', time: '10:15 AM' },
          { type: 'SYSTEM', title: 'Feed Synchronized', body: 'All institutional data pipelines are now operating with <10ms latency.', time: '09:00 AM' },
          { type: 'ACCOUNT', title: 'Security Token Rotated', body: 'Your session security token has been automatically refreshed.', time: 'Yesterday' },
          { type: 'MARKET', title: 'New IPO Filing: GROWW', body: 'Draft Red Herring Prospectus (DRHP) filed with SEBI.', time: '2 days ago' },
        ].map((alert, i) => (
          <div key={i} className="bg-[#111621] border border-white/5 p-5 md:p-6 rounded-3xl flex items-start gap-5 hover:border-emerald-500/10 transition-all group">
            <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center border ${
              alert.type === 'MARKET' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' :
              alert.type === 'SYSTEM' ? 'border-sky-500/20 text-sky-500 bg-sky-500/5' :
              'border-amber-500/20 text-amber-500 bg-amber-500/5'
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={alert.type === 'MARKET' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"} />
              </svg>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-[13px] font-black text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors">{alert.title}</h4>
                <span className="text-[9px] font-mono text-slate-500">{alert.time}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{alert.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SettingsSection: React.FC = () => {
  const [settings, setSettings] = useState({
    telegramAlerts: true,
    emailReports: false,
    aiSummary: true,
    darkTerminal: true,
    soundAlerts: false
  });

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-10">Interface & Preferences</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Dispatch Methods</h4>
            {[
              { id: 'telegramAlerts', label: 'Telegram Push Alerts', desc: 'Real-time delivery to @stockmanch_bot' },
              { id: 'emailReports', label: 'Daily Email Digest', desc: 'Summary of market action at 4:00 PM' },
              { id: 'soundAlerts', label: 'Terminal Audio Alerts', desc: 'Play notification sound for new news' }
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between group">
                <div className="max-w-[200px]">
                  <p className="text-xs font-bold text-white mb-0.5">{pref.label}</p>
                  <p className="text-[10px] text-slate-500">{pref.desc}</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, [pref.id]: !s[pref.id as keyof typeof settings] }))}
                  className={`w-10 h-5 rounded-full transition-all relative ${settings[pref.id as keyof typeof settings] ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings[pref.id as keyof typeof settings] ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>

          <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 space-y-8 shadow-2xl">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Terminal Engine</h4>
            {[
              { id: 'aiSummary', label: 'Enable AI Insights', desc: 'Show Gemini-powered analysis on cards' },
              { id: 'darkTerminal', label: 'High-Contrast Mode', desc: 'Enhanced visibility for trading terminals' }
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between group">
                <div className="max-w-[200px]">
                  <p className="text-xs font-bold text-white mb-0.5">{pref.label}</p>
                  <p className="text-[10px] text-slate-500">{pref.desc}</p>
                </div>
                <button 
                  onClick={() => setSettings(s => ({ ...s, [pref.id]: !s[pref.id as keyof typeof settings] }))}
                  className={`w-10 h-5 rounded-full transition-all relative ${settings[pref.id as keyof typeof settings] ? 'bg-emerald-500' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings[pref.id as keyof typeof settings] ? 'left-6' : 'left-1'}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-rose-500 font-black uppercase text-xs tracking-widest mb-1">Danger Zone</h4>
              <p className="text-[10px] text-slate-500 font-medium">Resetting your account will clear your watchlist and system preferences.</p>
            </div>
            <button className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
              Factory Reset Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlanUpgradeModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onUpgrade: (plan: PricingPlan) => void;
  currentPlanId: string;
}> = ({ isOpen, onClose, onUpgrade, currentPlanId }) => {
  if (!isOpen) return null;

  // Simple hierarchy check: alerts-dashboard (250) > others (150)
  const isUpgrade = (planId: string) => {
    if (currentPlanId === 'alerts-dashboard') return false;
    if (planId === 'alerts-dashboard') return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="w-full max-w-5xl bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Upgrade Station</h2>
              <p className="text-slate-500 text-sm font-medium">Select a superior dispatch protocol.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <PricingCard 
                key={plan.id}
                plan={plan}
                isActive={plan.id === currentPlanId || plan.popular}
                compact={true}
                showTrialBadge={false}
                buttonLabel={plan.id === currentPlanId ? 'Current Plan' : isUpgrade(plan.id) ? 'Upgrade Now' : 'Switch Plan'}
                onSelect={() => onUpgrade(plan)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BillingSection: React.FC<{ user: User; onOpenUpgrade: () => void }> = ({ user, onOpenUpgrade }) => (
  <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div className="max-w-4xl mx-auto space-y-8">
      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-4">Billing & Subscription</h3>
      
      <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Active Service</p>
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{user.planName}</h4>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-medium">Auto-renewing on 12 Feb 2026</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded border border-emerald-500/20 uppercase tracking-widest">PRO PROTOCOL</span>
            </div>
          </div>
          <button 
            onClick={onOpenUpgrade}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20"
          >
            Upgrade Membership
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Payment Method</h5>
          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center font-bold text-[8px] text-white italic">VISA</div>
              <div>
                <p className="text-xs font-bold text-white leading-none mb-1">•••• •••• •••• 4242</p>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Expires 12/28</p>
              </div>
            </div>
            <button className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors">Update</button>
          </div>
        </div>
        <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Dispatch History</h5>
          <div className="space-y-4">
            {[
              { date: '12 Jan 2026', amount: '₹250.00', id: 'INV-7721' },
              { date: '12 Dec 2025', amount: '₹250.00', id: 'INV-6420' }
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">{inv.id}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{inv.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-300">{inv.amount}</span>
                  <button className="p-2 text-slate-600 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AccountSection: React.FC<{ user: User; onNavigate: (s: any) => void }> = ({ user, onNavigate }) => (
  <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar space-y-6 md:space-y-8 animate-in fade-in duration-500">
    <div className="max-w-4xl mx-auto">
      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter mb-10">Trader Profile</h3>
      <div className="bg-[#111621] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-white/5">
          <div className="w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl text-emerald-500 font-black shadow-lg">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{user.name}</h4>
            <p className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] mb-4">{user.planName}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {user.id}</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">Joined: {user.joinedAt}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact Details</h5>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Phone Protocol</p>
                <p className="text-sm font-mono text-white">{user.phone}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Email Address</p>
                <p className="text-sm font-mono text-white">{user.email || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Subscription Status</h5>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Active Protocol</p>
              <p className="text-xs font-bold text-white mb-4">Your membership for {user.planName} is currently live.</p>
              <button onClick={() => onNavigate('billing')} className="w-full py-2 bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:bg-emerald-400">
                Manage Billing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'overview' | 'terminal' | 'account' | 'notifications' | 'settings' | 'billing'>('terminal');
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
    document.title = "Terminal Dashboard | StockManch";
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const handleUpgrade = (plan: PricingPlan) => {
    setUser({ ...user, planId: plan.id, planName: plan.name });
    setIsUpgradeModalOpen(false);
    setActiveSection('billing');
    alert(`Station Link Updated: You are now on the ${plan.name} Protocol.`);
  };

  const menuItems = [
    { id: 'overview', label: 'Control Center', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'terminal', label: 'Live Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'notifications', label: 'Alert Center', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'account', label: 'Trader Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'billing', label: 'Billing Node', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'settings', label: 'System Prefs', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const sectionTitles = {
    overview: 'Control Center',
    terminal: 'Market Terminal',
    notifications: 'Alert Archive',
    account: 'Trader Profile',
    settings: 'System Preferences',
    billing: 'Billing Node'
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
            <p className="text-[9px] text-slate-600 font-mono uppercase">Node Mumbai Station 01</p>
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
      
      {!isSidebarCollapsed && (
        <div className="px-6 mb-6">
          <div className="bg-[#1a2235] border border-white/5 rounded-2xl p-4 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-xl rounded-full"></div>
            <div className="relative z-10">
              <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Package: Active</p>
              <h4 className="text-[10px] font-black text-white uppercase mb-3 leading-tight truncate">{user.planName}</h4>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter truncate max-w-[80px]">Pro Member</span>
                <span className="text-[9px] text-emerald-500 font-black tracking-widest">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 border-t border-white/5 bg-slate-950/20">
        <div className={`${isSidebarCollapsed ? 'hidden' : 'block'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-600 uppercase">Uptime</span>
            <span className="text-[9px] font-black text-emerald-500">99.98%</span>
          </div>
          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden border border-white/5">
            <div className="w-[99.98%] h-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
          </div>
        </div>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="mt-6 flex w-full items-center justify-center p-2 rounded-lg text-slate-700 hover:text-white transition-all"
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
        <header className="w-full bg-[#111621] px-4 md:px-8 py-4 flex items-center justify-between shrink-0 border-b border-white/10 z-20 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-3 md:space-x-8">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <div className="flex items-center space-x-4">
              <Logo className="h-6 md:h-7 w-auto hidden sm:block" />
              <div className="h-5 w-px bg-white/10 hidden md:block"></div>
              <div className="hidden md:flex flex-col">
                <h2 className="text-white font-black uppercase tracking-tighter text-sm leading-none">
                  {sectionTitles[activeSection]}
                </h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 opacity-60">ID: {user.id}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-8">
            <div className="hidden xl:flex items-center space-x-6">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Feed Status</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live & Synced</span>
              </div>
              <div className="h-6 w-px bg-white/5"></div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Node Location</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Mumbai, IN</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5 pl-4 border-l border-white/10">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-white uppercase tracking-tight">{user.name}</span>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest truncate max-w-[120px]">{user.planName}</span>
              </div>
              <div className="relative group cursor-pointer" onClick={() => setActiveSection('account')}>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[11px] text-emerald-500 font-black shadow-lg group-hover:border-emerald-500 transition-all">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#111621] rounded-full"></div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                title="System Logout"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="flex-grow flex overflow-hidden relative">
        {!isFullScreenMode && (
          <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-[#0d121f] border-r border-white/5 flex-col shrink-0 z-10 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-left-4`}>
            <SidebarContent />
          </aside>
        )}

        {isMobileSidebarOpen && !isFullScreenMode && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
            <aside className="absolute top-0 left-0 w-64 h-full bg-[#0d121f] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/20">
                <Logo className="h-6 w-auto" />
                <button onClick={() => setIsMobileSidebarOpen(false)} className="text-slate-500 hover:text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <SidebarContent />
            </aside>
          </div>
        )}

        <main className="flex-grow flex flex-col min-w-0 bg-[#0b0f1a] relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(16,185,129,0.03),_transparent)] pointer-events-none"></div>
          {user.hasDashboardAccess ? (
            <div className="flex-grow flex flex-col overflow-hidden relative z-10">
              {activeSection === 'terminal' && <MarketTerminal onToggleFullScreen={setIsFullScreenMode} />}
              {activeSection === 'overview' && <OverviewSection user={user} onNavigate={setActiveSection} />}
              {activeSection === 'account' && <AccountSection user={user} onNavigate={setActiveSection} />}
              {activeSection === 'notifications' && <NotificationsSection />}
              {activeSection === 'settings' && <SettingsSection />}
              {activeSection === 'billing' && <BillingSection user={user} onOpenUpgrade={() => setIsUpgradeModalOpen(true)} />}
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center p-6 md:p-12 relative z-10">
              <div className="bg-[#161b27] border border-white/5 p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] text-center max-w-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10 text-rose-500">
                  <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Institutional Lock</h3>
                <p className="text-slate-400 text-sm md:text-lg font-medium mb-8 md:mb-12 max-w-md mx-auto opacity-80">This node is reserved for high-fidelity traders. Please upgrade your membership to unlock.</p>
                <button onClick={() => setIsUpgradeModalOpen(true)} className="w-full sm:w-auto px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20">
                  Upgrade Membership
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <PlanUpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} onUpgrade={handleUpgrade} currentPlanId={user.planId} />
    </div>
  );
};

export default Dashboard;