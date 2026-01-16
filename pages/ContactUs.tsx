import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = "https://lavender-goldfish-594505.hostingersite.com/api";

const ContactUs: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us | StockManch";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formState.name.length < 2) {
      setError("Please enter a valid full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setError("Please provide a valid corporate or personal email.");
      return;
    }
    if (formState.subject.length < 3) {
      setError("Subject must be at least 3 characters long.");
      return;
    }
    if (formState.message.length < 10) {
      setError("Please provide more detail in your message (min 10 characters).");
      return;
    }

    setLoading(true);
    try {
      const body = new FormData();
      body.append('name', formState.name);
      body.append('email', formState.email);
      body.append('subject', formState.subject);
      body.append('message', formState.message);

      const response = await fetch(`${API_BASE}/send-inquery`, {
        method: 'POST',
        body: body
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setSubmitted(true);
      } else {
        throw new Error(result.message || "Failed to dispatch inquiry.");
      }
    } catch (err: any) {
      setError(err.message || "Network transmission failure. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300 selection:bg-emerald-500/30">
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Info Side */}
            <div className="space-y-12">
              <div>
                <div className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[11px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20 mb-8">
                  Get in Touch
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tighter leading-tight">
                  Reach Out to <br />
                  <span className="text-emerald-500">The Team</span>
                </h1>
                <p className="text-lg text-slate-400 font-medium max-w-md">
                  Have questions about our API, institutional data feeds, or your subscription? We're here to help you win.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#161b27] border border-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-1">Email Support</h3>
                    <p className="text-slate-500 font-mono text-sm">support@stockmanch.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#161b27] border border-white/5 flex items-center justify-center text-sky-400 group-hover:bg-sky-500/10 group-hover:border-sky-500/20 transition-all">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.52-1.4.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.45-.42-1.39-.89.03-.25.38-.51 1.05-.78 4.12-1.79 6.87-2.97 8.24-3.54 3.92-1.63 4.73-1.91 5.26-1.92.12 0 .38.03.55.17.14.12.18.28.2.44.02.16.02.32 0 .44z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-1">Telegram Community</h3>
                    <p className="text-slate-500 font-mono text-sm">@stockmanch_support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-[#161b27]/40 border border-white/5 p-10 md:p-14 rounded-[3rem] backdrop-blur-md shadow-2xl relative overflow-hidden">
              {submitted && (
                <div className="absolute inset-0 z-20 bg-emerald-500/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                  <div>
                    <div className="w-20 h-20 bg-emerald-500 text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-black shadow-[0_0_40px_rgba(16,185,129,0.3)]">✓</div>
                    <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Transmission Successful</h3>
                    <p className="text-slate-300 font-medium mb-8">A support engineer will review your node log and reach out shortly.</p>
                    <button 
                      onClick={() => { setSubmitted(false); setFormState({ name: '', email: '', subject: '', message: '' }); }}
                      className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all border border-white/10"
                    >
                      New Message
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center space-x-3 animate-in slide-in-from-top-2">
                    <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-rose-500 text-xs font-bold leading-tight">{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Trader Name"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                      className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-800 ${error && formState.name.length < 2 ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500/50'}`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Email Protocol</label>
                    <input 
                      required
                      type="email" 
                      placeholder="name@terminal.com"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                      className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-800 ${error && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email) ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500/50'}`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Subject</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Inquiry Topic"
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                    className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-800 ${error && formState.subject.length < 3 ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500/50'}`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Detailed Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="How can our technical team assist your workflow?"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className={`w-full bg-slate-950/50 border rounded-2xl px-6 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-800 resize-none ${error && formState.message.length < 10 ? 'border-rose-500 bg-rose-500/5' : 'border-white/10 focus:border-emerald-500/50'}`}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl ${loading ? 'bg-slate-800 text-slate-600' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-emerald-500/20'}`}
                >
                  {loading ? 'Transmitting...' : 'Dispatch Inquiry'}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-white/5">
             <Link 
              to="/"
              className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;