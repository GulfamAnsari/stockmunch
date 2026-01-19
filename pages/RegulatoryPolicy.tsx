import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const RegulatoryPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Regulatory Policy | StockMunch";
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-300">
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-black text-white mb-12 uppercase tracking-tighter">
            Regulatory <span className="text-emerald-500">Policy</span>
          </h1>
          
          <div className="space-y-12 text-lg leading-relaxed font-medium">
            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Compliance Framework</h2>
              <p>Compliance is our priority. StockMunch operates within the regulatory framework governing information technology and financial data dissemination in India.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">SEBI Guidelines</h2>
              <p>StockMunch operates strictly as a news aggregation and analysis tool. We adhere to SEBI (Investment Advisers) Regulations by ensuring we only provide factual data and AI-driven sentiment analysis without specific buy/sell recommendations.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Data Integrity</h2>
              <p>Our data is sourced via authorized APIs from Indian stock exchanges (NSE/BSE) and corporate filing repositories. We maintain rigorous audit trails for every piece of information processed by our AI engine.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-4 border-l-4 border-emerald-500 pl-4">Disclosure Policy</h2>
              <p>To prevent conflicts of interest, our internal algorithms and management staff are prohibited from taking trading positions in stocks mentioned in alerts during the "Lock-In" period immediately following a news event.</p>
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

export default RegulatoryPolicy;