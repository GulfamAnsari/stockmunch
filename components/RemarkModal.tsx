import React, { useState, useEffect, useRef } from 'react';

interface RemarkModalProps {
  isOpen: boolean;
  currentRemark?: string;
  onClose: () => void;
  onSave: (remark: string) => void;
  onEdit?: () => void;
}

const PRESET_REMARKS = [
  { label: 'Bullish', color: '#10b981', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', textColor: 'text-emerald-400', icon: '📈' },
  { label: 'Bearish', color: '#ef4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', textColor: 'text-red-400', icon: '📉' },
  { label: 'Swing', color: '#f59e0b', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', textColor: 'text-amber-400', icon: '⚡' },
  { label: 'Long Term', color: '#06b6d4', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30', textColor: 'text-cyan-400', icon: '📅' },
  { label: 'Positioned', color: '#8b5cf6', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', textColor: 'text-violet-400', icon: '🎯' },
];

export const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  currentRemark,
  onClose,
  onSave,
  onEdit
}) => {
  const [selectedRemark, setSelectedRemark] = useState<string>(currentRemark || '');
  const [customRemark, setCustomRemark] = useState<string>(currentRemark && !PRESET_REMARKS.some(r => r.label.toLowerCase() === currentRemark.toLowerCase()) ? currentRemark : '');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(currentRemark && !PRESET_REMARKS.some(r => r.label.toLowerCase() === currentRemark.toLowerCase()) ? true : false);
  const customInputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentRemark) {
      const isPreset = PRESET_REMARKS.some(r => r.label.toLowerCase() === currentRemark.toLowerCase());
      if (isPreset) {
        const matchedPreset = PRESET_REMARKS.find(r => r.label.toLowerCase() === currentRemark.toLowerCase());
        setSelectedRemark(matchedPreset?.label || currentRemark);
        setShowCustomInput(false);
        setCustomRemark('');
      } else {
        setSelectedRemark('Custom');
        setShowCustomInput(true);
        setCustomRemark(currentRemark);
      }
    } else {
      setSelectedRemark('');
      setShowCustomInput(false);
      setCustomRemark('');
    }
  }, [currentRemark, isOpen]);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) {
      customInputRef.current.focus();
    }
  }, [showCustomInput]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleRemarkSelect = (label: string) => {
    if (label === 'Custom') {
      setSelectedRemark('Custom');
      setShowCustomInput(true);
      setCustomRemark('');
    } else {
      setSelectedRemark(label);
      setShowCustomInput(false);
      setCustomRemark('');
    }
  };

  const handleSave = () => {
    const remarkToSave = showCustomInput ? customRemark.trim() : selectedRemark;
    if (!remarkToSave) {
      alert('Please select or enter a remark');
      return;
    }
    onSave(remarkToSave);
    onClose();
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 300);
  };

  const getRemarkColor = (remark: string) => {
    const remark_obj = PRESET_REMARKS.find(r => r.label.toLowerCase() === remark.toLowerCase());
    return remark_obj || PRESET_REMARKS[0];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Desktop Modal */}
      <div 
        className="hidden md:flex fixed inset-0 bg-black/50 z-[9999] items-center justify-center pointer-events-auto"
        onClick={handleClose}
      >
        <div 
          className={`bg-gradient-to-br from-[#111621] to-[#0d0f1a] border border-white/[0.08] rounded-2xl shadow-2xl max-w-sm w-full mx-4 pointer-events-auto overflow-hidden transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-[12px] font-black text-white uppercase tracking-widest">Add Note</h2>
                  <p className="text-[9px] text-[#9ca3af] mt-0.5">Mark your notes</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="p-1 hover:bg-white/[0.08] rounded-lg text-[#9ca3af] hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Preset Remarks */}
            <div>
              <label className="block text-[9px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">Quick Notes</label>
              <div className="space-y-2">
                {PRESET_REMARKS.map((remark) => (
                  <button
                    key={remark.label}
                    onClick={(e) => { e.stopPropagation(); handleRemarkSelect(remark.label); }}
                    className={`w-full px-3 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all border flex items-center gap-2 ${
                      selectedRemark === remark.label
                        ? `${remark.bgColor} ${remark.borderColor} ${remark.textColor} ring-1 ring-offset-1 ring-offset-[#111621]`
                        : `bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border-white/[0.08]`
                    }`}
                  >
                    <span className="text-sm">{remark.icon}</span>
                    <span>{remark.label}</span>
                    {selectedRemark === remark.label && (
                      <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Remark */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black text-[#9ca3af] uppercase tracking-widest">Custom Note</label>
              <input
                ref={customInputRef}
                type="text"
                value={customRemark}
                onChange={(e) => { e.stopPropagation(); setCustomRemark(e.target.value); setSelectedRemark(''); }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Write your own note..."
                className="w-full px-3 py-2 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-[#9ca3af]/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-[11px] font-medium transition-all"
              />
            </div>

            {/* Current Remark Display */}
            {currentRemark && !customRemark && (
              <div className={`p-3 rounded-lg border ${getRemarkColor(currentRemark).bgColor} ${getRemarkColor(currentRemark).borderColor}`}>
                <p className="text-[8px] text-[#9ca3af] uppercase tracking-widest mb-1">Current Note</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{getRemarkColor(currentRemark).icon}</span>
                  <p className={`text-[11px] font-black ${getRemarkColor(currentRemark).textColor}`}>{currentRemark}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-white/[0.05] flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="flex-1 px-3 py-2 bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet */}
      <div 
        className="md:hidden fixed inset-0 bg-black/40 z-[9999] pointer-events-auto transition-opacity duration-300"
        onClick={handleClose}
        style={{ opacity: isAnimating ? 1 : 0 }}
      >
        <div 
          ref={sheetRef}
          className={`fixed bottom-0 left-0 right-0 bg-gradient-to-br from-[#111621] to-[#0d0f1a] rounded-t-3xl border-t border-white/[0.08] pointer-events-auto transition-all duration-300 transform ${
            isAnimating ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '90vh' }}
        >
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-1.5">
            <div className="w-10 h-0.5 bg-white/[0.15] rounded-full"></div>
          </div>

          {/* Sheet Header */}
          <div className="px-4 pb-2 border-b border-white/[0.05]">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 flex items-center justify-center bg-blue-500/10 rounded-md border border-blue-500/30">
                <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-[11px] font-black text-white uppercase tracking-widest">Add Note</h2>
                <p className="text-[8px] text-[#9ca3af] mt-0">Notes</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleClose(); }}
                className="p-0.5 hover:bg-white/[0.08] rounded-md text-[#9ca3af] hover:text-white transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Sheet Body */}
          <div className="px-3 pt-3 pb-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
            {/* Preset Remarks */}
            <div className="mb-3">
              <label className="block text-[8px] font-black text-[#9ca3af] uppercase tracking-widest mb-1.5">Quick Notes</label>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_REMARKS.map((remark) => (
                  <button
                    key={remark.label}
                    onClick={(e) => { e.stopPropagation(); handleRemarkSelect(remark.label); }}
                    className={`px-2 py-2 rounded-md font-black text-[9px] uppercase tracking-widest transition-all border flex flex-col items-center gap-1 ${
                      selectedRemark === remark.label
                        ? `${remark.bgColor} ${remark.borderColor} ${remark.textColor} ring-1 ring-offset-1 ring-offset-[#111621]`
                        : `bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border-white/[0.08]`
                    }`}
                  >
                    <span className="text-sm">{remark.icon}</span>
                    <span className="text-center text-[8px]">{remark.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Remark */}
            <div className="space-y-1 mb-3">
              <label className="block text-[8px] font-black text-[#9ca3af] uppercase tracking-widest">Custom Note</label>
              <input
                ref={customInputRef}
                type="text"
                value={customRemark}
                onChange={(e) => { e.stopPropagation(); setCustomRemark(e.target.value); setSelectedRemark(''); }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Write note..."
                className="w-full px-2.5 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-md text-white placeholder-[#9ca3af]/40 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-[10px] font-medium transition-all"
              />
            </div>

            {/* Current Remark Display */}
            {currentRemark && !customRemark && (
              <div className={`p-2 rounded-md border mb-3 ${getRemarkColor(currentRemark).bgColor} ${getRemarkColor(currentRemark).borderColor}`}>
                <p className="text-[7px] text-[#9ca3af] uppercase tracking-widest mb-0.5">Current</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs">{getRemarkColor(currentRemark).icon}</span>
                  <p className={`text-[10px] font-black ${getRemarkColor(currentRemark).textColor} truncate`}>{currentRemark}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sheet Footer */}
          <div className="px-3 py-2 border-t border-white/[0.05] flex gap-1.5">
            <button
              onClick={(e) => { e.stopPropagation(); handleClose(); }}
              className="flex-1 px-2 py-1.5 bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border border-white/[0.08] rounded-md font-black text-[9px] uppercase tracking-widest transition-all"
            >
              Close
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="flex-1 px-2 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/50 rounded-md font-black text-[9px] uppercase tracking-widest transition-all"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
