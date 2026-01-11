
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [step, setStep] = useState<'INPUT' | 'VERIFY'>('INPUT');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (method === 'OTP') setStep('VERIFY');
      else {
        onClose();
        navigate('/dashboard');
      }
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md bg-[#0b0f1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] animate-in fade-in zoom-in duration-300">
        
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <Logo className="h-10 w-auto" />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Access Terminal</h2>
            <p className="text-slate-500 text-sm font-medium">Manage your professional market workflow.</p>
          </div>

          <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-10 border border-white/5">
            <button 
              onClick={() => { setMethod('OTP'); setStep('INPUT'); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === 'OTP' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              OTP Login
            </button>
            <button 
              onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === 'PASSWORD' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              Password
            </button>
          </div>

          {step === 'INPUT' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Mobile Interface</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black tracking-widest">+91</span>
                  <input 
                    required
                    type="tel" 
                    placeholder="98765 43210"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xl text-white font-mono focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800 shadow-inner"
                  />
                </div>
              </div>

              {method === 'PASSWORD' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Secure Protocol</label>
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800 shadow-inner"
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                ) : (method === 'OTP' ? 'Dispatch OTP' : 'System Login')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1 text-center block">Verification Token</label>
                <div className="flex justify-between gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <input 
                      key={i} 
                      maxLength={1} 
                      required 
                      className="w-full h-14 bg-slate-950/50 border border-white/10 rounded-xl text-center text-xl text-emerald-500 font-black focus:outline-none focus:border-emerald-500 shadow-inner" 
                      placeholder="•"
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                ) : 'Confirm Access'}
              </button>
              <button type="button" onClick={() => setStep('INPUT')} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Resend Verification</button>
            </form>
          )}

          <p className="mt-10 text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
            StockManch Security Module v2.4-STABLE
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
