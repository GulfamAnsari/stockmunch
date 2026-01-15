import React, { useState, useEffect } from 'react';
// Added useNavigate to resolve the missing navigate reference in the success step
import { useNavigate } from 'react-router-dom';
import { Logo } from '../constants';

interface TrialFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

type Step = 'PHONE' | 'OTP' | 'PROFILE' | 'SUCCESS';

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api/auth";

const setAuthCookie = (token: string) => {
  // Set expiry to 300 seconds (5 minutes) in cookie
  document.cookie = `sm_token=${token}; max-age=300; path=/; SameSite=Lax`;
};

const TrialFlowModal: React.FC<TrialFlowModalProps> = ({ isOpen, onClose, planName }) => {
  // Initializing navigate hook for redirection
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('PHONE');
  const [formData, setFormData] = useState({ 
    phone: '', 
    otp: '', 
    password: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const needsDashboard = planName.toLowerCase().includes('dashboard');

  useEffect(() => {
    if (!isOpen) {
      setStep('PHONE');
      setFormData({ phone: '', otp: '', password: '', name: '', email: '' });
      setError(null);
      setResendTimer(0);
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

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, purpose: 'signup' })
      });
      const data = await resp.json();
      if (data.status === 'success' || data.status === 'otp_sent') {
        setResendTimer(60);
      } else {
        setError(data.message || "Resend failed.");
      }
    } catch (err) {
      setError("Communication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${API_BASE}/send-otp-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone })
      });
      const data = await resp.json();
      if (data.status === 'otp_sent' || data.status === 'success') {
        setStep('OTP');
        setResendTimer(60);
      } else {
        setError(data.message || "Could not process signup request.");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formData.phone, 
          otp: formData.otp,
          purpose: 'signup'
        })
      });
      const data = await resp.json();
      if (data.verified) {
        if (data.token) setAuthCookie(data.token);
        setStep('PROFILE');
      } else {
        setError(data.message || "Invalid verification code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          password: formData.password,
          name: formData.name,
          email: formData.email
        })
      });
      const data = await resp.json();
      if (data.status === 'password_set' || data.status === 'success') {
        if (data.token) setAuthCookie(data.token);
        setStep('SUCCESS');
      } else {
        setError(data.message || "Failed to secure account.");
      }
    } catch (err) {
      setError("Configuration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepsInfo = {
    PHONE: { progress: '25%' },
    OTP: { progress: '50%' },
    PROFILE: { progress: '75%' },
    SUCCESS: { progress: '100%' },
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl">
      <div className="w-full max-w-lg bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.1)] animate-in fade-in zoom-in duration-500">
        
        <div className="h-1 w-full bg-white/5 flex">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_10px_#10b981]" 
            style={{ width: stepsInfo[step].progress }}
          ></div>
        </div>

        <div className="p-10 md:p-14">
          <div className="flex justify-between items-start mb-10">
            <Logo className="h-8 w-auto" />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-500 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="min-h-[320px] flex flex-col justify-center">
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold animate-in fade-in">
                {error}
              </div>
            )}
            
            {step === 'PHONE' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Trial <span className="text-emerald-500">Access</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
                  Enter your mobile number to begin your 30-day trial for the <span className="text-white font-bold">{planName}</span> plan.
                </p>
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 group-focus-within:text-emerald-500 transition-colors">Primary Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-black tracking-widest">+91</span>
                      <input 
                        required
                        type="tel"
                        pattern="[0-9]{10}"
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xl text-white font-mono placeholder-slate-800 focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || formData.phone.length < 10}
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center"
                  >
                    {loading ? <LoadingSpinner /> : "Generate Signup Key"}
                  </button>
                </form>
              </div>
            )}

            {step === 'OTP' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Verify <span className="text-emerald-500">Device</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium mb-10">
                  We've sent a 6-digit code to <span className="text-emerald-400 font-mono">+91 {formData.phone}</span>.
                </p>
                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="flex justify-between gap-3">
                    {Array(6).fill(0).map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-full h-16 bg-slate-900/50 border border-white/10 rounded-xl text-center text-2xl font-black text-emerald-500 focus:outline-none focus:border-emerald-500 transition-all"
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
                  <div className="space-y-4">
                    <button 
                      type="submit"
                      disabled={loading || formData.otp.length < 6}
                      className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                    >
                      {loading ? <LoadingSpinner /> : "Verify Identity"}
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
                  <button type="button" onClick={() => setStep('PHONE')} className="w-full text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-colors">Return to phone</button>
                </form>
              </div>
            )}

            {step === 'PROFILE' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Secure <span className="text-emerald-500">Account</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium mb-6">
                  Initialize your trader credentials.
                </p>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Full Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Mohd Gulfam"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      placeholder="e.g. trader@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-1">Secure Password</label>
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl mt-4"
                  >
                    {loading ? <LoadingSpinner /> : "Deploy Profile"}
                  </button>
                </form>
              </div>
            )}

            {step === 'SUCCESS' && (
              <div className="text-center animate-in fade-in zoom-in duration-700">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-emerald-500/20">
                  <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Account <span className="text-emerald-500">Live</span>
                </h2>
                <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                  Welcome to StockManch. Your 30-day trial for <span className="text-white font-bold">{planName}</span> has been initiated.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => window.open('https://t.me/stockmanch', '_blank')}
                    className="w-full py-5 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#0088cc]/20 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.44.02.16.02.32 0 .44z" />
                    </svg>
                    <span>Connect Telegram Alerts</span>
                  </button>
                  {needsDashboard && (
                    <button 
                      onClick={() => navigate('/dashboard')}
                      className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
                    >
                      Enter Control Center
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="mt-12 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">
            StockManch Dispatch Node v3.0-SECURE
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="w-6 h-6 border-3 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
);

export default TrialFlowModal;