
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyCharter: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Charter | StockManch";
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300">
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter">
            Privacy <span className="text-emerald-500">Charter</span>
          </h1>
          
          <div className="space-y-12 text-lg leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Introduction</h2>
              <p>At StockManch, we recognize that privacy is a fundamental right. This Charter outlines our commitment to protecting your personal data and maintaining the trust you place in us as your stock market alert partner.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Information We Collect</h2>
              <p>We collect your phone number and email address strictly for the delivery of stock alerts. When you use our professional terminal, we may collect technical data such as IP addresses and device information to ensure secure access and optimize performance.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Data Usage</h2>
              <p>Your usage patterns within the terminal are anonymized. This data is used exclusively to improve our AI sentiment delivery engine and enhance the speed of our notification dispatch. We do not sell your personal data to third-party marketing firms.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Security Infrastructure</h2>
              <p>All communication between your device and our servers is encrypted using industry-standard TLS 1.3 protocols. Our database architecture utilizes advanced hashing algorithms to protect your sensitive authentication data.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Policy Updates</h2>
              <p>We may update this charter from time to time to reflect changes in regulatory requirements or our service infrastructure. Significant changes will be communicated via our Telegram alert channel.</p>
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

export default PrivacyCharter;
