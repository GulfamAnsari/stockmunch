import React from 'react';

const AlertShowcase: React.FC = () => {
  return (
    <section id="alerts" className="py-24 bg-[#0b0f1a] relative overflow-hidden border-t border-white/5">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-sky-500/5 blur-[100px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Side (Column 1-5) */}
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-1.5 bg-sky-500/10 text-sky-400 text-[11px] font-black uppercase tracking-widest rounded-full border border-sky-500/20 mb-8">
              Real-Time Push Engine
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.9]">
              Receive News <br /><span className="text-emerald-500 italic">The Moment</span> It Breaks
            </h2>
            <p className="text-slate-400 text-lg lg:text-xl font-medium mb-10 leading-relaxed opacity-90">
              Our high-speed alerting engine is directly connected to exchange data feeds. We don't just curate news; we transmit it in real-time. 
              <br /><br />
              <span className="text-white font-bold italic">Whenever a critical update is received by our system, it is instantly pushed to your device.</span> Stay ahead of the crowd with the fastest dispatch in the Indian market.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="p-6 bg-[#161b27] border border-white/5 rounded-2xl flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm uppercase tracking-tight">Zero-Delay Dispatch</div>
                  <div className="text-slate-500 text-xs">Direct API connections to BSE/NSE data</div>
                </div>
              </div>
              <div className="p-6 bg-[#161b27] border border-white/5 rounded-2xl flex items-center space-x-4">
                <div className="w-10 h-10 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-bold text-sm uppercase tracking-tight">Full Context Alerts</div>
                  <div className="text-slate-500 text-xs">AI sentiment analysis included in every push</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side: Two Mobile Frames (Column 6-12) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-0 lg:relative lg:h-[700px]">
            
            {/* Frame 1: Notification Stack (Left/Back) */}
            <div className="lg:absolute lg:left-0 lg:top-0 transform lg:-rotate-6 lg:hover:rotate-0 lg:hover:z-30 transition-all duration-500">
              <div className="relative border-gray-900 bg-gray-900 border-[8px] rounded-[2.5rem] h-[580px] w-[280px] shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[25px] bg-black rounded-b-2xl z-20"></div>
                <div className="w-full h-full bg-[#0c0c0e] pt-12 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                  <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-4 px-1">Notifications</div>
                  {[
                    { title: "RailTel Reshuffles Roles", time: "33m ago" },
                    { title: "Teamo Productions Q3 Results", time: "33m ago" },
                    { title: "Integra Essentia Q3 Net ₹1.26 Cr", time: "2h ago" },
                    { title: "Gretex Q3 PBT at ₹264L", time: "2h ago" },
                    { title: "DMart CEO Step Down", time: "2h ago" },
                    { title: "PFC to Issue ₹5,000 Cr NCDs", time: "2h ago" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1c1c1e]/90 backdrop-blur-md rounded-xl p-2.5 flex items-start space-x-2 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 text-[8px] font-black text-white">SM</div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Stock Alerts</span>
                          <span className="text-[7px] text-slate-600">{item.time}</span>
                        </div>
                        <p className="text-[9px] font-bold text-white truncate leading-tight">News: 🖼️ {item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Frame 2: Detailed Telegram View (Right/Front) */}
            <div className="lg:absolute lg:right-0 lg:bottom-0 transform lg:rotate-3 lg:hover:rotate-0 lg:hover:z-30 transition-all duration-500">
              <div className="relative border-gray-900 bg-gray-900 border-[8px] rounded-[2.5rem] h-[600px] w-[300px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-b-2xl z-20"></div>
                <div className="w-full h-full bg-[#0e1621] relative flex flex-col">
                  {/* Telegram Header */}
                  <div className="bg-[#242f3d] p-3 pt-10 flex items-center space-x-3 border-b border-white/5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold">S</div>
                    <div>
                      <p className="text-[10px] font-bold text-white leading-none">StockManch(Stock...</p>
                      <p className="text-[8px] text-slate-400">5 members</p>
                    </div>
                  </div>
                  {/* Telegram Body */}
                  <div className="p-3 flex-grow overflow-y-auto">
                    <div className="bg-[#182533] rounded-xl overflow-hidden border border-white/5">
                      <div className="aspect-square bg-white flex items-center justify-center p-8">
                        <img 
                          src="/public/images/dump/placeholder.txt" 
                          alt="RailTel" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback if the dump placeholder isn't an actual image
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/white/0b0f1a?text=RailTel+News';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-[11px] font-bold text-white mb-2 leading-snug uppercase tracking-tight">RailTel Reshuffles Top Management Roles</h3>
                        <p className="text-[9px] text-slate-300 leading-relaxed mb-4">
                          RailTel announces senior management changes under SEBI Regulation 30.
                          <br /><br />
                          Dr. Sharad Sharma, Sh. Deepak Garg, and Sh. Ramphool Chandel re-designated as EDs in different roles.
                        </p>
                        <div className="text-[9px] font-mono space-y-1.5 text-slate-400 border-t border-white/5 pt-3">
                          <p>Source: <span className="text-sky-400">BSE</span></p>
                          <p>Sentiment: <span className="text-amber-500">neutral</span></p>
                          <p>Confidence level: <span className="text-emerald-500">72.36%</span></p>
                          <p className="pt-2 text-[8px] opacity-40 uppercase tracking-tighter">Published at: 10/1/2026, 10:25:50 pm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Telegram Message Input Area Mockup */}
                  <div className="p-2 pb-6 border-t border-white/5 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div className="flex-grow bg-[#17212b] rounded-full px-4 py-2 text-[10px] text-slate-500">Message</div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-500">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AlertShowcase;