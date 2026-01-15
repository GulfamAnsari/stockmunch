import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const setAuthCookie = (token: string) => {
  // Set expiry to 300 seconds (5 minutes) in cookie
  document.cookie = `sm_token=${token}; max-age=300; path=/; SameSite=Lax`;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [method, setMethod] = useState<'OTP' | 'PASSWORD' | 'RESET'>('OTP');
  const [step, setStep] = useState<'INPUT' | 'VERIFY' | 'SUCCESS'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '' });
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const purpose = method === 'RESET' ? 'reset' : 'login';
      const resp = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, purpose })
      });
      const data = await resp.json();
      if (data.status === 'success' || data.status === 'otp_sent') {
        setResendTimer(60);
      } else {
        setError(data.message || "Resend failed.");
      }
    } catch (err) {
      setError("Communication failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (method === 'OTP') {
        const resp = await fetch(`${API_BASE}/send-otp-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone })
        });
        const data = await resp.json();
        if (data.status === 'otp_sent' || data.status === 'success') {
          setStep('VERIFY');
          setResendTimer(60);
        } else {
          setError(data.message || "Login OTP request failed.");
        }
      } else if (method === 'PASSWORD') {
        const resp = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await resp.json();
        if (data.token) {
          setAuthCookie(data.token);
          onClose();
          navigate('/dashboard');
        } else {
          setError(data.message || "Invalid trader credentials.");
        }
      } else if (method === 'RESET') {
        const resp = await fetch(`${API_BASE}/send-otp-reset`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone })
        });
        const data = await resp.json();
        if (data.status === 'otp_sent' || data.status === 'success') {
          setStep('VERIFY');
          setResendTimer(60);
        } else {
          setError(data.message || "Reset request failed.");
        }
      }
    } catch (err) {
      setError("Authorization server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (method === 'RESET') {
        const resp = await fetch(`${API_BASE}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: formData.phone, 
            otp: formData.otp,
            password: formData.password
          })
        });
        const data = await resp.json();
        if (data.status === 'password_reset' || data.status === 'success') {
          if (data.token) setAuthCookie(data.token);
          setStep('SUCCESS');
        } else {
          setError(data.message || "Reset process failed.");
        }
      } else {
        const resp = await fetch(`${API_BASE}/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phone: formData.phone, 
            otp: formData.otp,
            purpose: 'login'
          })
        });
        const data = await resp.json();
        if (data.verified) {
          if (data.token) setAuthCookie(data.token);
          onClose();
          navigate('/dashboard');
        } else {
          setError(data.message || "Incorrect verification token.");
        }
      }
    } catch (err) {
      setError("Identity verification failed.");
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
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
              {method === 'RESET' ? 'Secure Reset' : 'Trader Login'}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              {method === 'RESET' ? 'Re-establish terminal access link.' : 'Synchronize with your market workflow.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {method !== 'RESET' && step !== 'SUCCESS' && (
            <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-10 border border-white/5">
              <button 
                onClick={() => { setMethod('OTP'); setStep('INPUT'); setError(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === 'OTP' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                OTP Access
              </button>
              <button 
                onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); }}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${method === 'PASSWORD' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                Secure Key
              </button>
            </div>
          )}

          {step === 'INPUT' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">Registered Phone</label>
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
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Trader Password</label>
                    <button type="button" onClick={() => { setMethod('RESET'); setStep('INPUT'); setError(null); }} className="text-[9px] font-black text-emerald-500 uppercase hover:text-white transition-colors">Forgot Key?</button>
                  </div>
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
                {loading ? <LoadingSpinner /> : (method === 'OTP' ? 'Generate Login Key' : method === 'RESET' ? 'Send Recovery Code' : 'Establish Link')}
              </button>
              
              {method === 'RESET' && (
                <button type="button" onClick={() => { setMethod('PASSWORD'); setError(null); }} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Back to Login</button>
              )}
            </form>
          ) : step === 'VERIFY' ? (
            <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1 text-center block">Verification Key</label>
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

              {method === 'RESET' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-1">New Terminal Password</label>
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

              <div className="space-y-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center"
                >
                  {loading ? <LoadingSpinner /> : method === 'RESET' ? 'Reset & Authenticate' : 'Authenticate Link'}
                </button>
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || loading}
                  className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
                >
                  {resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Credentials'}
                </button>
              </div>
              <button type="button" onClick={() => setStep('INPUT')} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Change Phone</button>
            </form>
          ) : (
            <div className="text-center animate-in zoom-in duration-500 py-6">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Reset Successful</h3>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">
                Your master terminal password has been updated. Please login with your new credentials.
              </p>
              <button 
                onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); }}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
              >
                Proceed to Login
              </button>
            </div>
          )}

          <p className="mt-10 text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.3em]">
            StockManch Terminal v4.0-STABLE
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