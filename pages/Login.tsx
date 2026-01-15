import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const setAuthCookie = (token: string) => {
  document.cookie = `sm_token=${token}; max-age=300; path=/; SameSite=Lax`;
};

const Login: React.FC = () => {
  const [method, setMethod] = useState<'OTP' | 'PASSWORD' | 'RESET'>('OTP');
  const [step, setStep] = useState<'INPUT' | 'VERIFY' | 'SUCCESS'>('INPUT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '' });
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Login | StockManch";
  }, []);

  useEffect(() => {
    let interval: number;
    if (resendTimer > 0) {
      interval = window.setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, purpose: method === 'RESET' ? 'reset' : 'login' })
      });
      const data = await resp.json();
      if (data.status === 'success' || data.status === 'otp_sent') {
        setResendTimer(60);
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch (err) {
      setError("Connection error.");
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
          setError(data.message || "Could not send code.");
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
          navigate('/dashboard');
        } else {
          setError(data.message || "Incorrect password or number.");
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
      if (method === 'RESET') {
        const resp = await fetch(`${API_BASE}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, otp: formData.otp, password: formData.password })
        });
        const data = await resp.json();
        if (data.status === 'password_reset' || data.status === 'success') {
          if (data.token) setAuthCookie(data.token);
          setStep('SUCCESS');
        } else {
          setError(data.message || "Could not reset password.");
        }
      } else {
        const resp = await fetch(`${API_BASE}/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formData.phone, otp: formData.otp, purpose: 'login' })
        });
        const data = await resp.json();
        if (data.verified) {
          if (data.token) setAuthCookie(data.token);
          navigate('/dashboard');
        } else {
          setError(data.message || "Incorrect code.");
        }
      }
    } catch (err) {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center p-6">
      <Link to="/" className="mb-12"><Logo className="h-12 w-auto" /></Link>
      <div className="w-full max-w-md bg-[#161b27] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
            {step === 'SUCCESS' ? 'Password Reset' : method === 'RESET' ? 'Reset Password' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 text-sm">{step === 'SUCCESS' ? 'Your password has been updated.' : 'Login to your StockManch account.'}</p>
        </div>

        {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold text-center">{error}</div>}

        {method !== 'RESET' && step !== 'SUCCESS' && (
          <div className="flex bg-slate-950/50 rounded-2xl p-1 mb-10 border border-white/5">
            <button onClick={() => { setMethod('OTP'); setStep('INPUT'); setError(null); }} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${method === 'OTP' ? 'bg-emerald-500 text-slate-900' : 'text-slate-500'}`}>Mobile Code</button>
            <button onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); }} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${method === 'PASSWORD' ? 'bg-emerald-500 text-slate-900' : 'text-slate-500'}`}>Password</button>
          </div>
        )}

        {step === 'INPUT' ? (
          <form onSubmit={handleInitialSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase px-1">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">+91</span>
                <input required type="tel" placeholder="98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-16 pr-6 py-5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
            {method === 'PASSWORD' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-600 uppercase">Password</label>
                  <button type="button" onClick={() => { setMethod('RESET'); setStep('INPUT'); setError(null); }} className="text-[9px] font-black text-emerald-500 uppercase">Forgot?</button>
                </div>
                <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase rounded-2xl transition-all shadow-xl">{loading ? 'Please wait...' : (method === 'OTP' ? 'Send Login Code' : 'Sign In')}</button>
          </form>
        ) : step === 'VERIFY' ? (
          <form onSubmit={handleVerify} className="space-y-8 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-600 uppercase text-center block">Enter 6-digit Code</label>
              <div className="flex justify-between gap-2">
                {Array(6).fill(0).map((_, i) => (
                  <input key={i} maxLength={1} required className="w-12 h-14 bg-slate-950/50 border border-white/5 rounded-xl text-center text-xl text-emerald-500 font-black focus:outline-none focus:border-emerald-500" placeholder="•" onChange={(e) => {
                    const val = e.target.value; if (val && i < 5) (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus();
                    const newOtp = formData.otp.split(''); newOtp[i] = val; setFormData({...formData, otp: newOtp.join('')});
                  }} />
                ))}
              </div>
            </div>
            {method === 'RESET' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-slate-600 uppercase px-1">New Password</label>
                <input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-emerald-500" />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase rounded-2xl shadow-xl">{loading ? 'Verifying...' : 'Login'}</button>
            <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || loading} className="w-full text-[10px] font-black text-slate-600 uppercase">{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</button>
          </form>
        ) : (
          <div className="text-center animate-in zoom-in py-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
            <h3 className="text-2xl font-black text-white uppercase mb-4">Successful</h3>
            <p className="text-slate-500 text-sm mb-10">Your password has been changed. Please login now.</p>
            <button onClick={() => { setMethod('PASSWORD'); setStep('INPUT'); setError(null); }} className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase rounded-2xl">Sign In</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;