import { PatternType, patternTypes } from '../lib/patterns';
import { UserPlan } from '../lib/userTier';
import { Lock } from 'lucide-react';

interface PatternSelectorProps {
  selected: PatternType;
  onSelect: (type: PatternType) => void;
  plan: UserPlan;
  onPremiumClick: () => void;
}

export default function PatternSelector({ selected, onSelect, plan, onPremiumClick }: PatternSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Tipo de Patrón</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {patternTypes.map((pattern) => {
          const isSelected = selected === pattern.id;
          const isLocked = pattern.premium && plan !== 'premium';

          return (
            <button
              key={pattern.id}
              onClick={() => {
                if (isLocked) {
                  onPremiumClick();
                } else {
                  onSelect(pattern.id);
                }
              }}
              className={`
                relative px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isSelected
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                  : isLocked
                    ? 'bg-premium-light/50 text-premium/60 border border-premium/20 hover:border-premium/40'
                    : 'bg-white text-text/70 border border-border hover:border-accent/40 hover:text-accent'
                }
              `}
            >
              {isLocked && (
                <Lock className="absolute top-1 right-1 w-3 h-3" />
              )}
              {pattern.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
