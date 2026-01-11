
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Terminal from '../components/Terminal';
import { User } from '../types';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TERMINAL' | 'BILLING' | 'SETTINGS'>('OVERVIEW');
  const navigate = useNavigate();

  // Mock User State
  const [user] = useState<User>({
    id: 'TRD-772',
    name: 'Harsh Vardhan',
    phone: '+91 9876543210',
    email: 'harsh@terminal.com',
    planId: 'alerts-only',
    planName: 'Alerts Only',
    hasDashboardAccess: true, // User only has the alerts plan
    joinedAt: '12 Jan 2026'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Dashboard | StockManch";
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex text-slate-300">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-[#111621] border-r border-white/5 p-10 flex flex-col hidden lg:flex">
        <div className="mb-12">
           <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-2xl font-black mb-6">
             {user.name.charAt(0)}
           </div>
           <h3 className="text-white font-black uppercase tracking-tighter text-xl">{user.name}</h3>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">{user.id}</p>
        </div>

        <nav className="space-y-3 flex-grow">
          {[
            { id: 'OVERVIEW', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
            { id: 'TERMINAL', label: 'Market Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
            { id: 'BILLING', label: 'Plan & Billing', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
            { id: 'SETTINGS', label: 'Profile Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="uppercase text-[11px] tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-12 flex items-center px-6 py-4 rounded-2xl text-slate-600 hover:text-rose-500 transition-colors uppercase text-[11px] font-black tracking-widest"
        >
          <svg className="w-5 h-5 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          System Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
              {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}
            </h2>
            <p className="text-slate-500 text-sm font-medium italic">Active Node Session: {Math.random().toString(16).slice(2, 8).toUpperCase()}</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Plan: {user.planName}</span>
             </div>
          </div>
        </header>

        {activeTab === 'OVERVIEW' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#161b27] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                 <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Subscription Status</h4>
                 <p className="text-2xl font-bold text-white mb-2 uppercase italic">{user.planName}</p>
                 <p className="text-sm text-emerald-500 font-bold">Renewals on 12 Feb 2026</p>
              </div>
              <div className="bg-[#161b27] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                 <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Alert Delivery</h4>
                 <p className="text-2xl font-bold text-white mb-2">Telegram Active</p>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-tighter">@stockmanch_alerts</p>
              </div>
              <div className="bg-[#161b27] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                 <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">Terminal Access</h4>
                 <p className="text-2xl font-bold text-white mb-2">{user.hasDashboardAccess ? 'UNLOCKED' : 'LOCKED'}</p>
                 <p className="text-sm text-slate-500 font-bold">Requires Bundle/Dashboard Plan</p>
              </div>
            </div>

            <section className="bg-emerald-500/5 border border-emerald-500/20 p-10 rounded-[3rem] shadow-inner">
               <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tight">Recent Activity Log</h3>
               <div className="space-y-4">
                 {[
                   { event: 'Login successful via mobile verification', time: '12 mins ago' },
                   { event: 'Telegram alert dispatched: RELIANCE Q3', time: '4 hours ago' },
                   { event: 'Subscription plan updated to "Alerts Only"', time: '1 day ago' },
                 ].map((log, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-white/5 last:border-0">
                     <span className="text-sm text-slate-400 font-medium">{log.event}</span>
                     <span className="text-[10px] font-mono text-slate-600 uppercase">{log.time}</span>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        )}

        {activeTab === 'TERMINAL' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {user.hasDashboardAccess ? (
              <Terminal />
            ) : (
              <div className="bg-[#161b27] border border-white/5 p-20 rounded-[4rem] text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-10 text-rose-500">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Terminal Access Denied</h3>
                <p className="text-slate-400 text-lg font-medium mb-12 max-w-lg mx-auto">The institutional-grade market terminal is reserved for subscribers on the "Dashboard Only" or "Alerts + Dashboard" plans.</p>
                <button 
                  onClick={() => setActiveTab('BILLING')}
                  className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                >
                  Upgrade Membership
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'BILLING' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#161b27] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
               <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Your Subscriptions</h3>
               <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-slate-950/40 rounded-3xl border border-white/5">
                 <div className="mb-6 md:mb-0">
                    <p className="text-white font-bold text-lg uppercase tracking-tight mb-1">{user.planName}</p>
                    <p className="text-slate-500 text-sm font-medium italic">Next billing amount: ₹150 + GST</p>
                 </div>
                 <button className="px-8 py-3 bg-white/5 hover:bg-emerald-500/10 hover:text-emerald-500 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Modify Plan</button>
               </div>
             </div>

             <div className="bg-[#161b27] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
               <h3 className="text-xl font-bold text-white mb-8 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Billing History</h3>
               <div className="space-y-4">
                 {[
                   { id: 'INV-4412', date: '12 Jan 2026', amount: '₹177.00', status: 'Paid' },
                   { id: 'INV-3211', date: '12 Dec 2025', amount: '₹177.00', status: 'Paid' },
                 ].map((inv) => (
                   <div key={inv.id} className="flex justify-between items-center py-6 border-b border-white/5 last:border-0 font-medium">
                     <span className="text-white text-sm">{inv.id}</span>
                     <span className="text-slate-400 text-sm">{inv.date}</span>
                     <span className="text-emerald-500 font-black">{inv.amount}</span>
                     <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Download PDF</button>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="bg-[#161b27] p-12 rounded-[3rem] border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-10 uppercase tracking-widest border-l-4 border-emerald-500 pl-4">Profile Protocol</h3>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Display Name</label>
                  <input type="text" defaultValue={user.name} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Email Terminal</label>
                  <input type="email" defaultValue={user.email} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Mobile Interface</label>
                <input type="text" disabled defaultValue={user.phone} className="w-full bg-slate-950/30 border border-white/5 rounded-2xl px-6 py-4 text-sm text-slate-500 font-mono cursor-not-allowed" />
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/10">Save Configuration</button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
