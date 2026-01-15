import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'OTP' | 'PASSWORD'>('OTP');
  const [step, setStep] = useState<'INPUT' | 'VERIFY'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '' });
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (method === 'OTP') {
        const resp = await fetch(`${API_BASE}/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone })
        });
        const data = await resp.json();
        if (data.status === 'success') {
          setStep('VERIFY');
        } else {
          setError(data.message || "Failed to send OTP.");
        }
      } else {
        const resp = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await resp.json();
        if (data.token) {
          localStorage.setItem('sm_token', data.token);
          onClose();
          navigate('/dashboard');
        } else {
          setError(data.message || "Invalid credentials.");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp })
      });
      const data = await resp.json();
      if (data.verified) {
        // Since verify-otp doesn't return a token in this implementation, 
        // normally we'd login here or redirect.
        onClose();
        navigate('/dashboard');
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
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

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-10 border border-white/5">
            <button 
              onClick={() => { setMethod('OTP'); setStep('INPUT'); setError(null); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === 'OTP' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              OTP Login
            </button>
            <button 
              onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); }}
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
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-800 shadow-inner"
                  />
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center"
              >
                {loading ? <LoadingSpinner /> : (method === 'OTP' ? 'Send OTP' : 'System Login')}
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
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !e.currentTarget.value && i > 0) {
                          (e.currentTarget.previousElementSibling as HTMLInputElement)?.focus();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && i < 5) {
                          (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus();
                        }
                        const newOtp = formData.otp.split('');
                        newOtp[i] = val;
                        setFormData({...formData, otp: newOtp.join('')});
                      }}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center"
              >
                {loading ? <LoadingSpinner /> : 'Confirm Access'}
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

const LoadingSpinner = () => (
  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
);

export default LoginModal;