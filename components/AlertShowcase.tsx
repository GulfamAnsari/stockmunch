import React from 'react';

const AlertShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-[#0b0f1a] relative overflow-hidden border-t border-white/[0.05] selection:bg-emerald-600/20">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-600/[0.02] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-sky-600/[0.02] blur-[100px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Side (Column 1-5) */}
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-1.5 bg-sky-600/10 text-sky-500 text-[11px] font-black uppercase tracking-widest rounded-full border border-sky-600/20 mb-8">
              Real-Time Push Engine
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-slate-200 mb-8 tracking-tighter uppercase leading-[0.9]">
              Receive News <br /><span className="text-emerald-600 italic">The Moment</span> It Breaks
            </h2>
            <p className="text-slate-500 text-lg lg:text-xl font-medium mb-10 leading-relaxed opacity-90">
              Our high-speed alerting engine is directly connected to exchange data feeds. We don't just curate news; we transmit it in real-time. 
              <br /><br />
              <span className="text-slate-300 font-bold italic">Whenever a critical update is received by our system, it is instantly pushed to your device.</span> Stay ahead of the crowd with the fastest dispatch in the Indian market.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="p-6 bg-[#161b27]/40 border border-white/[0.05] rounded-2xl flex items-center space-x-4">
                <div className="w-10 h-10 bg-emerald-600/10 rounded-full flex items-center justify-center text-emerald-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-slate-300 font-bold text-sm uppercase tracking-tight">Telegram Protocol</div>
                  <div className="text-emerald-600 text-[8px] font-black uppercase tracking-widest">Active & Operational</div>
                </div>
              </div>
              
              <div className="p-6 bg-[#161b27]/40 border border-white/[0.03] rounded-2xl flex items-center space-x-4 opacity-80 group">
                <div className="w-10 h-10 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center text-slate-600 group-hover:text-emerald-500 group-hover:bg-emerald-600/5 transition-all">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.551 4.189 1.598 6.048L0 24l6.105-1.602a11.834 11.834 0 005.937 1.598h.005c6.637 0 12.032-5.398 12.035-12.032.003-3.213-1.248-6.234-3.522-8.508z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-slate-600 font-bold text-sm uppercase tracking-tight">WhatsApp Protocol</div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-[#161b27]/40 border border-white/[0.03] rounded-2xl flex items-center space-x-4 opacity-80 group">
                <div className="w-10 h-10 bg-white/[0.02] border border-white/[0.05] rounded-full flex items-center justify-center text-slate-600 group-hover:text-sky-500 group-hover:bg-sky-600/5 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-slate-600 font-bold text-sm uppercase tracking-tight">Android & iOS Apps</div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-slate-700 text-[8px] font-black uppercase tracking-widest">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Side: Two Mobile Frames (Column 6-12) */}
          <div  id="alerts" className="lg:col-span-7 flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-0 lg:relative lg:h-[700px]">
            
            {/* Frame 1: Notification Stack (Left/Back) */}
            <div className="lg:absolute lg:left-0 lg:top-0 transform lg:-rotate-6 lg:hover:rotate-0 lg:hover:z-30 transition-all duration-500">
              <div className="relative border-gray-900 bg-gray-900 border-[8px] rounded-[2.5rem] h-[580px] w-[280px] shadow-2xl overflow-hidden ring-1 ring-white/10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[25px] bg-black rounded-b-2xl z-20"></div>
                <div className="w-full h-full bg-[#0c0c0e] pt-12 px-3 space-y-2 overflow-y-auto custom-scrollbar">
                  <div className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-4 px-1">Notifications</div>
                  {[
                    { title: "RailTel Reshuffles Roles", time: "33m ago" },
                    { title: "Teamo Productions Q3 Results", time: "33m ago" },
                    { title: "Integra Essentia Q3 Net ₹1.26 Cr", time: "2h ago" },
                    { title: "Gretex Q3 PBT at ₹264L", time: "2h ago" },
                    { title: "DMart CEO Step Down", time: "2h ago" },
                    { title: "PFC to Issue ₹5,000 Cr NCDs", time: "2h ago" },
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1c1c1e]/90 backdrop-blur-md rounded-xl p-2.5 flex items-start space-x-2 border border-white/5">
                      <div className="w-7 h-7 rounded-full bg-emerald-700/50 flex items-center justify-center flex-shrink-0 text-[8px] font-black text-white">SM</div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-[8px] font-bold text-slate-600 uppercase">Stock Alerts</span>
                          <span className="text-[7px] text-slate-700">{item.time}</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-300 truncate leading-tight">News: 🖼️ {item.title}</p>
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
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">S</div>
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
                          src="https://placehold.co/400x400/white/0b0f1a?text=RailTel+News" 
                          alt="RailTel" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="text-[11px] font-bold text-slate-200 mb-2 leading-snug uppercase tracking-tight">RailTel Reshuffles Top Management Roles</h3>
                        <p className="text-[9px] text-slate-400 leading-relaxed mb-4">
                          RailTel announces senior management changes under SEBI Regulation 30.
                          <br /><br />
                          Dr. Sharad Sharma, Sh. Deepak Garg, and Sh. Ramphool Chandel re-designated as EDs in different roles.
                        </p>
                        <div className="text-[9px] font-mono space-y-1.5 text-slate-500 border-t border-white/5 pt-3">
                          <p>Source: <span className="text-sky-600">BSE</span></p>
                          <p>Sentiment: <span className="text-amber-600">neutral</span></p>
                          <p>Confidence level: <span className="text-emerald-600">72.36%</span></p>
                          <p className="pt-2 text-[8px] opacity-20 uppercase tracking-tighter">Published at: 10/1/2026, 10:25:50 pm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Telegram Message Input Area Mockup */}
                  <div className="p-2 pb-6 border-t border-white/5 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-700">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div className="flex-grow bg-[#17212b] rounded-full px-4 py-2 text-[10px] text-slate-700">Message</div>
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-700">
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