import React, { useState, useEffect, useRef } from 'react';
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

interface SubscriptionData {
  end_date: string;
  plan_code: string;
  status: string;
  created_at: string;
  auto_renew: string | number | boolean;
}

interface ProfileData {
  id: string | number;
  name: string;
  phone: string;
  email: string;
  joined_at: string;
  logo?: string;
  is_verified: boolean | number;
  is_email_verified: boolean | number;
}

interface SettingsData {
  telegram_push: boolean | number;
  daily_email: boolean | number;
  ai_insight: boolean | number;
  terminal_audio: boolean | number;
}

interface AlertData {
  user_id: string | number;
  title: string;
  message: string;
  channel: string;
  delivery_status: string;
  delivered_at: string;
  created_at: string;
}

const Toggle: React.FC<{ 
  enabled: boolean; 
  onChange: (val: boolean) => void; 
  loading?: boolean;
}> = ({ enabled, onChange, loading }) => (
  <button 
    onClick={() => !loading && onChange(!enabled)}
    disabled={loading}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none ${enabled ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800'} ${loading ? 'opacity-40 cursor-wait' : ''}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-300 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const OverviewSection: React.FC<{ 
  data: SubscriptionData | null; 
  loading: boolean;
  onNavigate: (section: any) => void 
}> = ({ data, loading, onNavigate }) => {
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#0b0f1a]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Syncing Overview...</p>
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

  const isAutoRenewOn = data?.auto_renew === 1 || data?.auto_renew === '1' || data?.auto_renew === true || data?.auto_renew === 'true';

  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-10 custom-scrollbar space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111621] border border-white/5 p-8 rounded-[2rem] shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Subscription Node</p>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            {data?.plan_code || '---'}
          </h3>
          <div className="flex items-center justify-between">
            <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
              data?.status?.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              Status: {data?.status || '---'}
            </div>
            <span className="text-slate-500 text-[9px] font-mono font-bold uppercase">EXP: {formatDate(data?.end_date)}</span>
          </div>
        </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#161b27] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-4 animate-pulse shadow-[0_0_10px_#10b981]"></span>
            Terminal Quick-Launch
          </h3>
          <div className="grid grid-cols-2 gap-5">
            <button onClick={() => onNavigate('terminal')} className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <span className="text-[11px] font-black text-white uppercase tracking-widest block">Market Feed</span>
            </button>
            <button onClick={() => onNavigate('notifications')} className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl hover:bg-sky-500/10 hover:border-sky-500/30 transition-all text-left group">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </div>
              <span className="text-[11px] font-black text-white uppercase tracking-widest block">Alert Vault</span>
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

const ProfileSection: React.FC<{ data: ProfileData | null; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center opacity-50 font-black uppercase text-xs tracking-widest">Unable to load profile telemetry.</div>;

  const VerificationBadge = ({ verified, label }: { verified: boolean | number, label: string }) => (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${
      verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }`}>
      {verified ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
      )}
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex-grow p-4 md:p-12 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#111621] border border-white/5 rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Logo className="w-64 h-auto" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center text-emerald-500 text-4xl font-black shadow-2xl">
                {data.logo ? <img src={data.logo} alt="User" className="w-full h-full object-cover rounded-[2.5rem]" /> : data.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center text-white shadow-xl">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left space-y-6">
              <div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{data.name}</h2>
                <p className="text-slate-500 font-mono text-sm uppercase">User ID: {data.id}</p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <VerificationBadge verified={data.is_verified} label="Identity Verified" />
                <VerificationBadge verified={data.is_email_verified} label="Email Secured" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Primary Contact</span>
                  <p className="text-white font-bold tracking-tight text-lg">+91 {data.phone}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Communication Hub</span>
                  <p className="text-white font-bold tracking-tight text-lg">{data.email || 'No email provided'}</p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Commencement Date</span>
                  <p className="text-white font-bold tracking-tight text-lg">{new Date(data.joined_at).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsSection: React.FC<{ 
  data: SettingsData | null; 
  loading: boolean;
  onUpdate: (updated: SettingsData) => void;
}> = ({ data, loading, onUpdate }) => {
  const [activeSaveKey, setActiveSaveKey] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Syncing Preferences...</p>
        </div>
      </div>
    );
  }

  if (!data) return (
    <div className="flex-grow flex items-center justify-center">
       <div className="text-center opacity-30">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <p className="font-black uppercase text-xs tracking-widest">Configuration offline</p>
       </div>
    </div>
  );

  const handleToggle = async (key: keyof SettingsData, val: boolean) => {
    setActiveSaveKey(key);
    onUpdate({ ...data, [key]: val });
    setTimeout(() => setActiveSaveKey(null), 1000);
  };

  const settingsList = [
    { 
      key: 'telegram_push', 
      label: 'Telegram Alerts', 
      desc: 'Get instant stock alerts on your Telegram account.',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      color: 'sky'
    },
    { 
      key: 'daily_email', 
      label: 'Daily Email Report', 
      desc: 'Receive a summary of market news every evening.',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z',
      color: 'indigo'
    },
    { 
      key: 'ai_insight', 
      label: 'AI News Analysis', 
      desc: 'Enable AI-powered insights for every market alert.',
      icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      color: 'emerald'
    },
    { 
      key: 'terminal_audio', 
      label: 'Sound Notifications', 
      desc: 'Play a sound alert when new high-priority news breaks.',
      icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z',
      color: 'rose'
    }
  ];

  return (
    <div className="flex-grow p-4 md:p-10 lg:p-14 animate-in fade-in duration-700 w-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Terminal Settings</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Customize how you receive market intelligence and alerts.</p>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900/50 px-4 py-2 rounded-xl border border-white/10">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settings Node Active</span>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {settingsList.map((item) => (
            <div 
              key={item.key} 
              className={`bg-[#111621] border transition-all duration-300 rounded-[2.5rem] p-8 md:p-10 group relative overflow-hidden flex flex-col justify-between h-full ${
                activeSaveKey === item.key ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] scale-[1.01]' : 'border-white/5 hover:border-white/10 hover:bg-slate-900/30'
              }`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <Toggle 
                    enabled={!!data[item.key as keyof SettingsData]} 
                    onChange={(val) => handleToggle(item.key as keyof SettingsData, val)}
                    loading={activeSaveKey === item.key}
                  />
                </div>
                
                <div>
                  <h4 className="text-white font-black uppercase tracking-tight text-lg mb-2">{item.label}</h4>
                  <p className="text-slate-500 text-[13px] font-medium leading-relaxed max-w-[240px]">{item.desc}</p>
                </div>
              </div>

              {activeSaveKey === item.key && (
                <div className="absolute inset-x-0 bottom-0 py-1 bg-emerald-500 text-center text-[8px] font-black text-slate-900 uppercase tracking-[0.3em] animate-in slide-in-from-bottom-full">
                  Applying Changes...
                </div>
              )}

              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/5 blur-[50px] rounded-full group-hover:bg-emerald-500/10 transition-all"></div>
            </div>
          ))}
        </div>

        <footer className="p-8 bg-slate-950/40 border border-white/5 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-xs text-slate-500 font-medium">Settings are automatically synchronized across all your devices.</p>
          </div>
          <div className="px-6 py-2 rounded-full border border-white/5 bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Last Sync: Just Now
          </div>
        </footer>
      </div>
    </div>
  );
};

const AlertHistorySection: React.FC<{ data: AlertData[]; loading: boolean }> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Retrieving Dispatch Logs...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-12 text-center opacity-30">
        <div className="w-20 h-20 bg-sky-500/10 rounded-3xl flex items-center justify-center text-sky-500 mb-6 border border-sky-500/20">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">No Alerts Dispatched</h3>
        <p className="text-slate-500 text-sm max-w-xs font-medium uppercase tracking-widest leading-loose">The secure dispatch tunnel is currently clear of notification history.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 md:p-10 lg:p-14 animate-in fade-in duration-700 w-full overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Alert Dispatch History</h2>
            <p className="text-slate-500 text-sm mt-3 font-medium">Review your historical stock alert transmission telemetry.</p>
          </div>
          <div className="bg-sky-500/10 px-4 py-2 rounded-xl border border-sky-500/20 flex items-center space-x-3">
             <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Tunnel Sync: Real-Time</span>
          </div>
        </header>

        <div className="space-y-4">
          {data.map((alert, idx) => (
            <div key={idx} className="bg-[#111621] border border-white/5 rounded-3xl p-6 md:p-8 hover:bg-slate-900/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform flex-shrink-0">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.44.02.16.02.32 0 .44z"/></svg>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-white font-black uppercase tracking-tight text-base">{alert.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">{alert.channel}</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-2xl">{alert.message}</p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                  alert.delivery_status.toLowerCase() === 'delivered' || alert.delivery_status.toLowerCase() === 'success'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {alert.delivery_status}
                </div>
                <div className="text-right">
                  <p className="text-white font-mono text-[10px] font-bold">{new Date(alert.delivered_at || alert.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                  <p className="text-slate-600 font-mono text-[9px]">{new Date(alert.delivered_at || alert.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const coreSyncStarted = useRef(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'terminal' | 'account' | 'notifications' | 'settings' | 'billing'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [alertData, setAlertData] = useState<AlertData[]>([]);
  const [loadingCore, setLoadingCore] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [loadingAlerts, setLoadingAlerts] = useState(false);

  const handleLogout = () => {
    document.cookie = "sm_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  const fetchCoreData = async () => {
    if (coreSyncStarted.current) return;
    coreSyncStarted.current = true;
    
    setLoadingCore(true);
    try {
      const token = getAuthToken();
      if (!token) return navigate('/login');
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      // 1. Fetch Subscription
      const subResp = await fetch(`${API_BASE}/control-center`, { method: 'GET', headers });
      const subJson = await subResp.json();
      if (subResp.status === 401 || subJson.error === 'unauthorized') return handleLogout();
      const subData = subJson.subscription || (subJson.data && subJson.data.subscription);
      if (subData) setSubscriptionData(subData);

      // 2. Fetch Profile
      const profResp = await fetch(`${API_BASE}/profile`, { method: 'GET', headers });
      const profJson = await profResp.json();
      if (profResp.status === 401 || profJson.error === 'unauthorized') return handleLogout();
      const finalProf = profJson.data || profJson.profile || profJson;
      if (finalProf && finalProf.name) setProfileData(finalProf);
    } catch (e) {
      console.error("Core Data Sync Failure", e);
    } finally {
      setLoadingCore(false);
    }
  };

  const fetchSettingsData = async () => {
    setLoadingSettings(true);
    try {
      const token = getAuthToken();
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const setResp = await fetch(`${API_BASE}/settings`, { method: 'GET', headers });
      const setJson = await setResp.json();
      if (setResp.status === 401 || setJson.error === 'unauthorized') return handleLogout();
      if (setJson.settings) {
        setSettingsData({
          telegram_push: !!Number(setJson.settings.telegram_push),
          daily_email: !!Number(setJson.settings.daily_email),
          ai_insight: !!Number(setJson.settings.ai_insight),
          terminal_audio: !!Number(setJson.settings.terminal_audio),
        });
      }
    } catch (e) {
      console.error("Settings Sync Failure", e);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchAlertsData = async () => {
    setLoadingAlerts(true);
    try {
      const token = getAuthToken();
      if (!token) return;
      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

      const alertResp = await fetch(`${API_BASE}/alerts`, { method: 'GET', headers });
      const alertJson = await alertResp.json();
      if (alertResp.status === 401 || alertJson.error === 'unauthorized') return handleLogout();
      const finalAlerts = alertJson.alerts || alertJson.data || alertJson;
      if (Array.isArray(finalAlerts)) setAlertData(finalAlerts);
    } catch (e) {
      console.error("Alerts Sync Failure", e);
    } finally {
      setLoadingAlerts(false);
    }
  };

  // Initial mount: Sync Core Data
  useEffect(() => {
    document.title = "Terminal Dashboard | StockManch";
    fetchCoreData();
  }, []);

  // Handle Tab-based Lazy Loading
  useEffect(() => {
    if (activeSection === 'settings') {
      fetchSettingsData();
    } else if (activeSection === 'notifications') {
      fetchAlertsData();
    }
  }, [activeSection]);

  const handleUpdateSettings = async (updated: SettingsData) => {
    const originalState = settingsData;
    setSettingsData(updated);
    try {
      const token = getAuthToken();
      if (!token) return;
      const body = new FormData();
      body.append('telegram_push', updated.telegram_push ? '1' : '0');
      body.append('daily_email', updated.daily_email ? '1' : '0');
      body.append('ai_insight', updated.ai_insight ? '1' : '0');
      body.append('terminal_audio', updated.terminal_audio ? '1' : '0');
      const response = await fetch(`${API_BASE}/settings`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body });
      const result = await response.json();
      if (!response.ok || result.status === 'error') throw new Error("Server Update Failed");
    } catch (e) {
      setSettingsData(originalState);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'terminal', label: 'Market Terminal', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'notifications', label: 'Alert History', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'account', label: 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'billing', label: 'Subscription', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { id: 'settings', label: 'App Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const sectionTitles = {
    overview: 'Overview',
    terminal: 'Market Terminal',
    notifications: 'Recent Alerts',
    account: 'My Profile',
    settings: 'App Settings',
    billing: 'Subscription'
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
      <div className={`p-8 border-b border-white/5 bg-slate-950/20 ${isSidebarCollapsed ? 'items-center' : ''} flex flex-col`}>
        <div className="flex items-center space-x-3 mb-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div></div>
        {!isSidebarCollapsed && <div className="space-y-1"><h2 className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Terminal Node</h2><p className="text-[8px] text-slate-600 font-mono uppercase">Online - Mumbai Secure</p></div>}
      </div>
      <nav className="flex-grow py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button key={item.id} onClick={() => { setActiveSection(item.id as any); setIsMobileSidebarOpen(false); }} className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all group ${activeSection === item.id ? 'bg-emerald-500 text-slate-900 shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`} title={isSidebarCollapsed ? item.label : ''}>
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
            <span className={`${isSidebarCollapsed ? 'hidden' : 'block'} uppercase tracking-[0.15em] text-[10px] font-black truncate`}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-8 border-t border-white/5 bg-slate-950/20">
        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="flex w-full items-center justify-center p-2 rounded-xl text-slate-700 hover:text-white transition-all bg-white/5 border border-white/5"><svg className={`w-5 h-5 transition-transform duration-500 ${isSidebarCollapsed ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg></button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#0b0f1a] flex flex-col text-slate-300 overflow-hidden relative">
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden bg-black/80 backdrop-blur-md" onClick={() => setIsMobileSidebarOpen(false)}>
          <div className="w-72 h-full bg-[#0d121f] shadow-2xl animate-in slide-in-from-left duration-300" onClick={e => e.stopPropagation()}><SidebarContent /></div>
        </div>
      )}

      {!isFullScreenMode && (
        <header className="w-full bg-[#111621] px-6 md:px-10 py-5 flex items-center justify-between shrink-0 border-b border-white/10 z-[50]">
          <div className="flex items-center space-x-3 md:space-x-8">
            <button onClick={(e) => { e.stopPropagation(); setIsMobileSidebarOpen(true); }} className="lg:hidden p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/10" aria-label="Toggle Menu"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
            <div className="flex items-center space-x-6">
              <Logo className="h-7 w-auto hidden sm:block" />
              <div className="h-6 w-px bg-white/10 hidden md:block"></div>
              <h2 className="text-white font-black uppercase tracking-[0.2em] text-xs hidden md:block">{sectionTitles[activeSection]}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{subscriptionData?.plan_code || '---'}</span>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-tight">{profileData?.name || 'SYNCING...'}</span>
            </div>
            <button onClick={handleLogout} className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>
          </div>
        </header>
      )}

      <div className="flex-grow flex overflow-hidden relative">
        {!isFullScreenMode && <aside className={`hidden lg:flex ${isSidebarCollapsed ? 'w-24' : 'w-72'} bg-[#0d121f] border-r border-white/5 flex-col shrink-0 z-10 transition-all duration-500`}><SidebarContent /></aside>}
        <main className="flex-grow flex flex-col min-w-0 bg-[#0b0f1a] relative overflow-hidden">
          <div className="flex-grow flex flex-col overflow-hidden">
            {activeSection === 'terminal' && <MarketTerminal onToggleFullScreen={setIsFullScreenMode} />}
            {activeSection === 'overview' && <OverviewSection data={subscriptionData} loading={loadingCore} onNavigate={setActiveSection} />}
            {activeSection === 'account' && <ProfileSection data={profileData} loading={loadingCore} />}
            {activeSection === 'notifications' && <AlertHistorySection data={alertData} loading={loadingAlerts} />}
            {activeSection === 'settings' && <SettingsSection data={settingsData} loading={loadingSettings} onUpdate={handleUpdateSettings} />}
            {activeSection === 'billing' && <div className="p-10 flex flex-col items-center justify-center h-full text-center"><div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div><h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Billing Ledger</h3><p className="text-slate-500 text-sm max-w-xs">Subscription billing cycles and payment gateway configuration.</p></div>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;