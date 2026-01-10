
import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#0b0f1a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar text-slate-400 leading-relaxed font-medium">
            {content.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all uppercase text-xs tracking-widest"
            >
              Close Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
