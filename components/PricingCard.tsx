import React from 'react';
import { PricingPlan } from '../types';

interface PricingCardProps {
  plan: PricingPlan;
  isActive?: boolean;
  isLoading?: boolean;
  onSelect: (id: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  compact?: boolean;
  showTrialBadge?: boolean;
  buttonLabel?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  isActive, 
  isLoading, 
  onSelect, 
  onMouseEnter, 
  onMouseLeave,
  compact = false,
  showTrialBadge = true,
  buttonLabel
}) => {
  const activeStyles = isActive 
    ? 'border-emerald-500 bg-[#161b27] shadow-[0_32px_64px_-16px_rgba(31,168,79,0.3)] scale-105 z-10 translate-y-[-8px]' 
    : 'border-white/5 bg-[#161b27]/40 scale-100';

  const compactStyles = compact 
    ? 'p-8 rounded-[2rem]' 
    : 'p-12 rounded-[2.5rem]';

  return (
    <div 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative border transition-all duration-500 flex flex-col ${activeStyles} ${compactStyles} group`}
    >
      {showTrialBadge && (
        <div className="absolute top-4 right-6 bg-emerald-500/20 text-emerald-400 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter border border-emerald-500/30">
          30-Day Trial
        </div>
      )}
      
      {isActive && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-bottom-2">
          {plan.popular ? 'Best Value' : 'Selected'}
        </div>
      )}

      <h3 className={`${compact ? 'text-xl' : 'text-3xl'} font-bold text-white mb-3 uppercase tracking-tight`}>
        {plan.name}
      </h3>

      <div className={`flex items-center ${compact ? 'mb-6' : 'mb-10'} justify-center`}>
        <span className={`${compact ? 'text-xl' : 'text-3xl'} text-slate-500 mr-2 font-black`}>₹</span>
        <span className={`${compact ? 'text-5xl' : 'text-7xl'} font-black text-white tracking-tighter`}>
          {plan.price}
        </span>
        <span className="text-slate-600 ml-3 text-lg font-bold">/mo</span>
      </div>

      <ul className={`${compact ? 'space-y-3 mb-8' : 'space-y-5 mb-12'} text-left flex-grow`}>
        {plan.features.map((f: string, i: number) => (
          <li key={i} className="flex items-start text-sm text-slate-300 font-medium">
            <svg className={`w-5 h-5 ${f.includes('Trial') ? 'text-sky-400' : 'text-emerald-500'} mr-4 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className={compact ? 'text-[11px]' : 'text-sm'}>{f}</span>
          </li>
        ))}
      </ul>

      <button 
        onClick={() => onSelect(plan.id)}
        disabled={isLoading || buttonLabel === 'Current Plan'}
        className={`w-full ${compact ? 'py-4' : 'py-5'} rounded-2xl font-black uppercase tracking-widest transition-all ${
          isActive && buttonLabel !== 'Current Plan'
            ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20' 
            : buttonLabel === 'Current Plan'
            ? 'bg-white/5 text-slate-500 border border-white/10 cursor-default'
            : 'bg-slate-800 text-slate-400 hover:text-white border border-white/5'
        } ${isLoading ? 'animate-pulse cursor-wait' : ''}`}
      >
        {isLoading ? 'Processing...' : (buttonLabel || plan.cta)}
      </button>
    </div>
  );
};

export default PricingCard;