import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface TrialFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  onSwitchToLogin?: () => void;
}

type Step = 'PHONE' | 'OTP' | 'PROFILE' | 'SUCCESS';

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const setAuthCookie = (token: string) => {
  document.cookie = `sm_token=${token}; max-age=300; path=/; SameSite=Lax`;
};

const getAuthToken = () => {
  return document.cookie.split('; ').find(row => row.startsWith('sm_token='))?.split('=')[1] || null;
};

const TrialFlowModal: React.FC<TrialFlowModalProps> = ({ isOpen, onClose, planName, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('PHONE');
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep('PHONE');
      setFormData({ phone: '', otp: '', password: '', name: '', email: '' });
      setError(null);
      setUserExists(false);
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

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUserExists(false);
    try {
      const resp = await fetch(`${API_BASE}/send-otp-signup`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await resp.json();
      if (data.status === 'otp_sent' || data.status === 'success') {
        setStep('OTP');
        setResendTimer(60);
      } else {
        const msg = data.message || "Failed to send code.";
        if (msg.toLowerCase().includes('exist')) {
          setUserExists(true);
          setError("This mobile number is already registered.");
        } else {
          setError(msg);
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp, purpose: 'signup' })
      });
      const data = await resp.json();
      if (data.verified) {
        if (data.token) setAuthCookie(data.token);
        setStep('PROFILE');
      } else {
        setError(data.message || "Incorrect code.");
      }
    } catch (err) {
      setError("Error verifying code.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/set-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ phone: formData.phone, password: formData.password, name: formData.name, email: formData.email })
      });
      const data = await resp.json();
      if (data.status === 'password_set' || data.status === 'success') {
        if (data.token) setAuthCookie(data.token);
        setStep('SUCCESS');
      } else {
        setError(data.message || "Account setup failed.");
      }
    } catch (err) {
      setError("Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-lg bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in">
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <Logo className="h-8 w-auto" />
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          {error && (
            <div className="mb-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center animate-in fade-in">
              <span className="text-rose-500 text-xs font-bold text-center mb-3">{error}</span>
              {userExists && onSwitchToLogin && (
                <button 
                  onClick={onSwitchToLogin}
                  className="px-6 py-2 bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg"
                >
                  Sign In to Your Account
                </button>
              )}
            </div>
          )}
          
          {step === 'PHONE' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Start <span className="text-emerald-500">Trial</span></h2>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed">Enter your mobile number to get a 30-day trial for <span className="text-white font-bold">{planName}</span>.</p>
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-600 uppercase mb-3 px-1">Mobile Number</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">+91</span>
                    <input required type="tel" placeholder="98765 43210" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xl text-white focus:outline-none focus:border-emerald-500 transition-all font-mono placeholder:text-slate-700/30" />
                  </div>
                </div>
                <button type="submit" disabled={loading || formData.phone.length < 10} className="w-full py-5 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all hover:bg-emerald-400">
                  {loading ? 'Sending...' : "Send Code"}
                </button>
              </form>
            </div>
          )}

          {step === 'OTP' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Verify <span className="text-emerald-500">Device</span></h2>
              <p className="text-slate-400 text-sm mb-10">We've sent a code to <span className="text-emerald-400 font-mono">+91 {formData.phone}</span>.</p>
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <input key={i} maxLength={1} className="w-full h-16 bg-slate-900/50 border border-white/10 rounded-xl text-center text-2xl font-black text-emerald-500 focus:outline-none focus:border-emerald-500 placeholder:text-slate-700/30" placeholder="•" onChange={(e) => {
                      const val = e.target.value; if (val && i < 5) (e.currentTarget.nextElementSibling as HTMLInputElement)?.focus();
                      const newOtp = formData.otp.split(''); newOtp[i] = val; setFormData({...formData, otp: newOtp.join('')});
                    }} />
                  ))}
                </div>
                <button type="submit" disabled={loading || formData.otp.length < 6} className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl">
                  {loading ? 'Verifying...' : "Verify Code"}
                </button>
              </form>
            </div>
          )}

          {step === 'PROFILE' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Setup <span className="text-emerald-500">Account</span></h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div><label className="block text-[10px] font-black text-slate-600 uppercase mb-2 px-1">Full Name</label><input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-700/30" /></div>
                <div><label className="block text-[10px] font-black text-slate-600 uppercase mb-2 px-1">Email Address</label><input required type="email" placeholder="name@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-700/30" /></div>
                <div><label className="block text-[10px] font-black text-slate-600 uppercase mb-2 px-1">Password</label><input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-700/30" /></div>
                <button type="submit" className="w-full py-5 bg-emerald-500 text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl mt-4">Complete Setup</button>
              </form>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20"><svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Setup <span className="text-emerald-500">Done</span></h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">Your account is ready. Your trial for <span className="text-white font-bold">{planName}</span> has started.</p>
              <button onClick={() => navigate('/dashboard')} className="w-full py-5 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-xl">Enter Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialFlowModal;