
import React, { useState, useEffect } from 'react';
import { Logo } from '../constants';

interface TrialFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

type Step = 'PHONE' | 'OTP' | 'PASSWORD' | 'SUCCESS';

const TrialFlowModal: React.FC<TrialFlowModalProps> = ({ isOpen, onClose, planName }) => {
  const [step, setStep] = useState<Step>('PHONE');
  const [formData, setFormData] = useState({ 
    phone: '', 
    otp: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const needsDashboard = planName.toLowerCase().includes('dashboard');

  useEffect(() => {
    if (!isOpen) {
      setStep('PHONE');
      setFormData({ phone: '', otp: '', password: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (needsDashboard) {
        setStep('PASSWORD');
      } else {
        setStep('SUCCESS');
      }
    }, 800);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
    }, 1200);
  };

  const stepsInfo = {
    PHONE: { progress: '25%' },
    OTP: { progress: '50%' },
    PASSWORD: { progress: '75%' },
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
                    {loading ? <LoadingSpinner /> : "Send Verification Code"}
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
                  <button 
                    type="submit"
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                  >
                    {loading ? <LoadingSpinner /> : "Verify & Continue"}
                  </button>
                </form>
              </div>
            )}

            {step === 'PASSWORD' && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">
                  Account <span className="text-emerald-500">Security</span>
                </h2>
                <p className="text-slate-400 text-sm font-medium mb-10">
                  Set a password for your professional terminal access and personalized watchlist.
                </p>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-1">New Terminal Password</label>
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
                  >
                    {loading ? <LoadingSpinner /> : "Finalize Activation"}
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
                  Ready for <span className="text-emerald-500">Action</span>
                </h2>
                <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                  Your 30-day <span className="text-white font-bold">{planName}</span> trial is active. Get instant stock news alerts directly on your device via Telegram.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => window.open('https://t.me/stockmanch', '_blank')}
                    className="w-full py-5 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-[#0088cc]/20 flex items-center justify-center space-x-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.44.02.16.02.32 0 .44z" />
                    </svg>
                    <span>Instant Telegram Alerts</span>
                  </button>
                  {needsDashboard && (
                    <button 
                      onClick={onClose}
                      className="w-full py-5 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest rounded-2xl transition-all border border-white/10"
                    >
                      Enter Market Terminal
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="mt-12 text-center text-[10px] text-slate-700 font-bold uppercase tracking-[0.3em]">
            StockManch Secure Protocol v2.4
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
