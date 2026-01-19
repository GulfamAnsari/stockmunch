import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface TrialFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planId?: string;
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

const getMappedPlanId = (pid?: string) => {
  switch (pid) {
    case 'alerts-only': return 'ALERT';
    case 'dashboard-only': return 'DASHBOARD';
    case 'alerts-dashboard': return 'ALERT_DASH';
    default: return 'ALERT';
  }
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
    <span>Processing...</span>
  </div>
);

const TrialFlowModal: React.FC<TrialFlowModalProps> = ({ isOpen, onClose, planName, planId, onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('PHONE');
  const [formData, setFormData] = useState({ phone: '', otp: '', password: '', name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userExists, setUserExists] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    if (formData.phone.length !== 10) {
      setError("Enter exactly 10 digits.");
      return;
    }
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
        setFormData({ ...formData, otp: '' });
      } else {
        if (data.error === 'user_exists') {
          setUserExists(true);
          setError("User already registered.");
        } else {
          setError(data.message || data.error || "Failed to send OTP.");
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
    if (formData.otp.length < 6) {
      setError("Enter 6-digit code.");
      return;
    }
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
        setError(data.message || "Incorrect OTP entered.");
      }
    } catch (err) {
      setError("Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val && !/^\d+$/.test(val)) return;
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
      } else if (formData.otp[index]) {
        const newOtpArr = formData.otp.split('');
        newOtpArr[index] = '';
        setFormData({ ...formData, otp: newOtpArr.join('') });
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Provide a valid email address.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const mappedPlanId = getMappedPlanId(planId);
      const resp = await fetch(`${API_BASE}/set-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({ 
          phone: formData.phone, 
          password: formData.password, 
          name: formData.name, 
          email: formData.email,
          plan_id: mappedPlanId
        })
      });
      const data = await resp.json();
      if (data.status === 'password_set' || data.status === 'success') {
        if (data.token) setAuthCookie(data.token);
        setStep('SUCCESS');
      } else {
        setError(data.message || "Setup failed.");
      }
    } catch (err) {
      setError("Error creating account.");
    } finally {
      setLoading(false);
    }
  };

  const isProfileDisabled = formData.password.length < 6 || formData.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-lg bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in">
        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <Logo className="h-8 w-auto" />
            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          {error && (
            <div className="mb-6 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex flex-col items-center animate-shake">
              <span className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</span>
              {userExists && onSwitchToLogin && (
                <button onClick={onSwitchToLogin} className="mt-3 px-6 py-2 bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-400 transition-all shadow-lg">Sign In</button>
              )}
            </div>
          )}
          
          {step === 'PHONE' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Start <span className="text-emerald-500">Trial</span></h2>
              <p className="text-slate-400 text-sm mb-10 leading-relaxed opacity-70">Register with mobile for <span className="text-white font-bold">{planName}</span>.</p>
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Mobile Number*</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black">+91</span>
                    <input 
                      required 
                      type="tel" 
                      placeholder="98765 43210" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} 
                      className={`w-full bg-slate-900/50 border rounded-2xl pl-16 pr-6 py-5 text-xl text-white focus:outline-none transition-all font-mono placeholder:text-slate-800/40 ${error && formData.phone.length !== 10 ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 focus:border-emerald-500'}`} 
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || formData.phone.length !== 10} 
                  className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all ${formData.phone.length !== 10 ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'}`}
                >
                  {loading ? <LoadingSpinner /> : "Send OTP"}
                </button>
              </form>
            </div>
          )}

          {step === 'OTP' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Verify <span className="text-emerald-500">Device</span></h2>
              <p className="text-slate-400 text-sm mb-6">Code sent to <span className="text-emerald-400 font-mono">+91 {formData.phone}</span>.</p>
              <p className="text-[10px] font-medium text-amber-500/90 text-center mb-6 uppercase tracking-tight leading-relaxed px-4">
                We will call you to provide the OTP. <br />Please pick up the call for OTP.
              </p>
              <form onSubmit={handleOtpSubmit} className="space-y-8">
                <div className="flex justify-between gap-3">
                  {Array(6).fill(0).map((_, i) => (
                    <input 
                      key={i} 
                      ref={el => { otpRefs.current[i] = el; }}
                      maxLength={1} 
                      className={`w-full h-16 bg-slate-900/50 border rounded-xl text-center text-2xl font-black text-emerald-500 focus:outline-none focus:border-emerald-500 placeholder:text-slate-800/40 ${error ? 'border-rose-500/50 bg-rose-500/5' : 'border-white/10'}`} 
                      placeholder="•" 
                      value={formData.otp[i] || ''}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
                <button 
                  type="submit" 
                  disabled={loading || formData.otp.length < 6} 
                  className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all ${formData.otp.length < 6 ? 'bg-slate-800 text-slate-600' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'}`}
                >
                  {loading ? <LoadingSpinner /> : "Verify OTP"}
                </button>
                <button type="button" onClick={() => { setStep('PHONE'); setError(null); setUserExists(false); }} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Change Number</button>
              </form>
            </div>
          )}

          {step === 'PROFILE' && (
            <div className="animate-in slide-in-from-right">
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Setup <span className="text-emerald-500">Account</span></h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name*</label><input required type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-800/40" /></div>
                <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Address*</label><input required type="email" placeholder="name@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full bg-slate-900/50 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all placeholder:text-slate-800/40 ${error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 focus:border-emerald-500'}`} /></div>
                <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Set Password* (min 6 chars)</label><input required type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className={`w-full bg-slate-900/50 border rounded-2xl px-6 py-4 text-white focus:outline-none transition-all placeholder:text-slate-800/40 ${error && formData.password.length < 6 ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 focus:border-emerald-500'}`} /></div>
                <button 
                  type="submit" 
                  disabled={loading || isProfileDisabled} 
                  className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl shadow-xl mt-4 transition-all ${isProfileDisabled ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'}`}
                >
                  {loading ? <LoadingSpinner /> : "Complete Setup"}
                </button>
              </form>
            </div>
          )}

          {step === 'SUCCESS' && (
            <div className="text-center animate-in zoom-in">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20"><svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
              <h2 className="text-4xl font-black text-white uppercase mb-4 tracking-tighter">Setup <span className="text-emerald-500">Done</span></h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto leading-relaxed">System operational. Enter your terminal.</p>
              <button onClick={() => { onClose(); navigate('/dashboard'); }} className="w-full py-5 bg-emerald-500 text-slate-950 font-black uppercase tracking-widest rounded-2xl shadow-xl">Enter Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialFlowModal;