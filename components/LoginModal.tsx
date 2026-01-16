
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup?: () => void;
}

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const setAuthCookie = (token: string) => {
  document.cookie = `sm_token=${token}; max-age=300; path=/; SameSite=Lax`;
};

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [method, setMethod] = useState<'OTP' | 'PASSWORD' | 'RESET'>('OTP');
  const [step, setStep] = useState<'INPUT' | 'VERIFY' | 'SUCCESS'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notRegistered, setNotRegistered] = useState(false);
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '' });
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setMethod('OTP');
      setStep('INPUT');
      setError(null);
      setNotRegistered(false);
      setFormData({ phone: '', otp: '', password: '' });
    }
  }, [isOpen]);

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

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError(null);
    setNotRegistered(false);
    try {
      if (method === 'OTP') {
        const resp = await fetch(`${API_BASE}/send-otp-login`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ phone: formData.phone })
        });
        const data = await resp.json();
        if (data.status === 'otp_sent' || data.status === 'success') {
          setStep('VERIFY');
          setResendTimer(60);
        } else {
          if (data.error === 'not_registered') {
            setNotRegistered(true);
            setError("This mobile number is not registered with StockManch.");
          } else {
            setError(data.message || data.error || "Failed to send OTP.");
          }
        }
      } else if (method === 'PASSWORD') {
        const resp = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ phone: formData.phone, password: formData.password })
        });
        const data = await resp.json();
        if (data.token) {
          setAuthCookie(data.token);
          onClose();
          navigate('/dashboard');
        } else {
          setError(data.message || data.error || "Incorrect login details.");
        }
      } else if (method === 'RESET') {
        const resp = await fetch(`${API_BASE}/send-otp-reset`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ phone: formData.phone })
        });
        const data = await resp.json();
        if (data.status === 'otp_sent' || data.status === 'success') {
          setStep('VERIFY');
          setResendTimer(60);
        } else {
          setError(data.message || data.error || "Reset failed.");
        }
      }
    } catch (err) {
      setError("Network connection error.");
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
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ phone: formData.phone, otp: formData.otp, password: formData.password })
        });
        const data = await resp.json();
        if (data.status === 'password_reset' || data.status === 'success') {
          if (data.token) setAuthCookie(data.token);
          setStep('SUCCESS');
        } else {
          setError(data.message || data.error || "Reset failed.");
        }
      } else {
        const resp = await fetch(`${API_BASE}/verify-otp`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify({ phone: formData.phone, otp: formData.otp, purpose: 'login' })
        });
        const data = await resp.json();
        if (data.verified) {
          if (data.token) setAuthCookie(data.token);
          onClose();
          navigate('/dashboard');
        } else {
          setError(data.message || "Incorrect OTP entered.");
        }
      }
    } catch (err) {
      setError("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const newOtpArr = formData.otp.split('');
    newOtpArr[index] = val;
    const newOtpStr = newOtpArr.join('');
    setFormData({ ...formData, otp: newOtpStr });

    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!formData.otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        const newOtpArr = formData.otp.split('');
        newOtpArr[index - 1] = '';
        setFormData({ ...formData, otp: newOtpArr.join('') });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="w-full max-w-md bg-[#0b0f1a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in">
        <div className="p-10">
          <div className="flex justify-between items-start mb-10">
            <Logo className="h-10 w-auto" />
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 opacity-90">{method === 'RESET' ? 'Reset Password' : 'Sign In'}</h2>
            <p className="text-slate-500 text-sm opacity-60">Access your StockManch terminal.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex flex-col items-center animate-in fade-in">
              <span className="text-rose-500 text-xs font-bold text-center mb-3">{error}</span>
              {notRegistered && onSwitchToSignup && (
                <button 
                  onClick={onSwitchToSignup}
                  className="px-6 py-2 bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-all shadow-lg"
                >
                  Sign Up
                </button>
              )}
            </div>
          )}

          {method !== 'RESET' && step !== 'SUCCESS' && (
            <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-10 border border-white/5">
              <button onClick={() => { setMethod('OTP'); setStep('INPUT'); setError(null); setNotRegistered(false); }} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${method === 'OTP' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}>OTP Login</button>
              <button onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); setNotRegistered(false); }} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${method === 'PASSWORD' ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'text-slate-500'}`}>Password</button>
            </div>
          )}
          
          {step === 'INPUT' ? (
            <form onSubmit={handleInitialSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase px-1">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">+91</span>
                  <input required type="tel" placeholder="98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:border-emerald-500 font-mono placeholder:text-slate-800/40" />
                </div>
              </div>
              {method === 'PASSWORD' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-600 uppercase">Password</label>
                    <button type="button" onClick={() => { setMethod('RESET'); setStep('INPUT'); setError(null); setNotRegistered(false); }} className="text-[9px] font-black text-emerald-500 uppercase">Forgot?</button>
                  </div>
                  <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800/40" />
                </div>
              )}
              <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase rounded-2xl shadow-xl transition-all hover:bg-emerald-400">
                {loading ? 'Sending...' : (method === 'PASSWORD' ? 'Sign In' : "Send OTP")}
              </button>
            </form>
          ) : step === 'VERIFY' ? (
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-600 uppercase text-center block">Enter OTP</label>
                <div className="flex justify-between gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <input 
                      key={i} 
                      // @google/genai fix: Wrap assignment in curly braces to ensure the callback returns void.
                      ref={el => { otpRefs.current[i] = el; }}
                      maxLength={1} 
                      required 
                      className="w-full h-14 bg-slate-950/50 border border-white/10 rounded-xl text-center text-xl text-emerald-500 font-black focus:outline-none focus:border-emerald-500 placeholder:text-slate-800/40" 
                      placeholder="•" 
                      value={formData.otp[i] || ''}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
              </div>
              {method === 'RESET' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-600 uppercase px-1">Set New Password</label>
                  <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800/40" />
                </div>
              )}
              <div className="space-y-4">
                <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase rounded-2xl shadow-xl">{loading ? 'Wait...' : "Verify OTP"}</button>
                <button type="button" onClick={() => { setStep('INPUT'); setError(null); setNotRegistered(false); }} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest transition-colors hover:text-white">Change Mobile Number</button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <h3 className="text-2xl font-black text-white uppercase mb-4 tracking-tighter">Updated</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed opacity-60">Password updated. Please sign in with your new credentials.</p>
              <button onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); setNotRegistered(false); }} className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase tracking-widest rounded-2xl">Sign In</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
