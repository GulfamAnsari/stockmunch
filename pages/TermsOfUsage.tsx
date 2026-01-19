import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsOfUsage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Terms of Usage | StockMunch";
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300">
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter">
            Terms of <span className="text-emerald-500">Usage</span>
          </h1>
          
          <div className="space-y-12 text-lg leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Agreement to Terms</h2>
              <p>By accessing StockMunch.com and using our alert services, you agree to be bound by these terms. If you do not agree, please discontinue use of the platform immediately.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Nature of Service</h2>
              <p>StockMunch provides information and alerts based on public filings and exchange data. We are a technology-driven information aggregator. We are not a registered investment advisor (RIA) or a broker-dealer.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">No Financial Advice</h2>
              <p>Information provided on the dashboard or via Telegram alerts does not constitute financial, investment, or legal advice. All data is for informational purposes only. Always consult with a certified professional before making trading decisions.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Accuracy and Latency</h2>
              <p>While we strive for millisecond precision and institutional-grade accuracy, technical latencies, exchange errors, or upstream data provider failures are beyond our control. StockMunch is not liable for losses resulting from data delays.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Subscription and Billing</h2>
              <p>Subscriptions are billed in advance. Alerts-only and Dashboard-only plans are priced at ₹150/mo, while the Bundle is ₹250/mo. Subscriptions can be canceled at any time, but partial month refunds are not provided.</p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5">
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

export default TermsOfUsage;