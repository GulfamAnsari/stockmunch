import React, { useState, useEffect, useRef } from 'react';

interface RemarkModalProps {
  isOpen: boolean;
  currentRemark?: string;
  onClose: () => void;
  onSave: (remark: string) => void;
  onEdit?: () => void;
}

const PRESET_REMARKS = ['Swing', 'Positioned', 'Long Term', 'Bullish', 'Bearish', 'Custom'];

export const RemarkModal: React.FC<RemarkModalProps> = ({
  isOpen,
  currentRemark,
  onClose,
  onSave,
  onEdit
}) => {
  const [selectedRemark, setSelectedRemark] = useState<string>(currentRemark || '');
  const [customRemark, setCustomRemark] = useState<string>(currentRemark && !PRESET_REMARKS.includes(currentRemark) ? currentRemark : '');
  const [showCustomInput, setShowCustomInput] = useState<boolean>(currentRemark && !PRESET_REMARKS.includes(currentRemark) ? true : false);
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentRemark) {
      const isPreset = PRESET_REMARKS.some(r => r.toLowerCase() === currentRemark.toLowerCase());
      if (isPreset) {
        const matchedPreset = PRESET_REMARKS.find(r => r.toLowerCase() === currentRemark.toLowerCase()) || currentRemark;
        setSelectedRemark(matchedPreset);
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

  const handleRemarkSelect = (remark: string) => {
    if (remark === 'Custom') {
      setSelectedRemark('Custom');
      setShowCustomInput(true);
      setCustomRemark('');
    } else {
      setSelectedRemark(remark);
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

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] pointer-events-auto"
      onClick={onClose}
    >
      <div 
        className="bg-[#111621] border border-white/[0.06] rounded-2xl shadow-2xl max-w-sm w-full mx-4 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[16px] font-black text-white uppercase tracking-widest">Add Remark</h2>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="text-[#9ca3af] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 mb-6">
            {PRESET_REMARKS.map((remark) => (
              <button
                key={remark}
                onClick={(e) => { e.stopPropagation(); handleRemarkSelect(remark); }}
                className={`w-full px-4 py-3 rounded-lg font-black text-[12px] uppercase tracking-widest transition-all border ${
                  (remark === 'Custom' ? showCustomInput : selectedRemark === remark)
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border-white/[0.08]'
                }`}
              >
                {remark}
              </button>
            ))}
          </div>

          {showCustomInput && (
            <div className="mb-6">
              <label className="block text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">
                Custom Remark
              </label>
              <input
                ref={customInputRef}
                type="text"
                value={customRemark}
                onChange={(e) => { e.stopPropagation(); setCustomRemark(e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Enter your custom remark..."
                className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white placeholder-[#9ca3af]/50 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-[12px]"
              />
            </div>
          )}

          {currentRemark && (
            <div className="mb-6 p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest mb-1">Current Remark</p>
              <p className="text-[12px] font-semibold text-blue-400">{currentRemark}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="flex-1 px-4 py-2.5 bg-white/[0.03] text-[#9ca3af] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg font-black text-[12px] uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleSave(); }}
              className="flex-1 px-4 py-2.5 bg-emerald-600 text-slate-950 hover:bg-emerald-500 rounded-lg font-black text-[12px] uppercase tracking-widest transition-all shadow-lg"
            >
              Save Remark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
