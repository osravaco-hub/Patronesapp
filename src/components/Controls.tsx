import { PatternConfig } from '../lib/patterns';
import PatternSelector from './PatternSelector';
import { UserPlan } from '../lib/userTier';
import { Shuffle, RotateCcw } from 'lucide-react';

interface ControlsProps {
  config: PatternConfig;
  onChange: (config: PatternConfig) => void;
  onRandomize: () => void;
  onReset: () => void;
  plan: UserPlan;
  onPremiumClick: () => void;
}

const PRESET_PALETTES = [
  { name: 'Océano', colors: ['#2563EB', '#06B6D4', '#0EA5E9', '#3B82F6', '#1D4ED8'] },
  { name: 'Bosque', colors: ['#10B981', '#059669', '#34D399', '#047857', '#6EE7B7'] },
  { name: 'Atardecer', colors: ['#F59E0B', '#EF4444', '#EC4899', '#F97316', '#FB923C'] },
  { name: 'Noche', colors: ['#8B5CF6', '#6366F1', '#A78BFA', '#7C3AED', '#4F46E5'] },
  { name: 'Pastel', colors: ['#FCA5A5', '#FCD34D', '#86EFAC', '#93C5FD', '#C4B5FD'] },
  { name: 'Neón', colors: ['#FF006E', '#FB5607', '#FFBE0B', '#3A86FF', '#8338EC'] },
];

export default function Controls({ config, onChange, onRandomize, onReset, plan, onPremiumClick }: ControlsProps) {
  const update = (partial: Partial<PatternConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="space-y-6">
      <PatternSelector
        selected={config.type}
        onSelect={(type) => update({ type })}
        plan={plan}
        onPremiumClick={onPremiumClick}
      />

      {/* Color Palettes */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Paleta de Colores</h3>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_PALETTES.map((palette) => {
            const isActive = JSON.stringify(palette.colors) === JSON.stringify(config.colors);
            return (
              <button
                key={palette.name}
                onClick={() => update({ colors: palette.colors })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-accent-light border-2 border-accent'
                    : 'bg-white border border-border hover:border-accent/30'
                }`}
              >
                <div className="flex -space-x-1">
                  {palette.colors.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-text/70">{palette.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Ajustes</h3>

        <div className="space-y-3">
          <SliderControl
            label="Densidad"
            value={config.density}
            min={1}
            max={10}
            step={1}
            onChange={(v) => update({ density: v })}
          />
          <SliderControl
            label="Escala"
            value={config.scale}
            min={0.5}
            max={3}
            step={0.1}
            onChange={(v) => update({ scale: v })}
          />
          <SliderControl
            label="Rotación"
            value={config.rotation}
            min={0}
            max={360}
            step={5}
            onChange={(v) => update({ rotation: v })}
            suffix="°"
          />
          <SliderControl
            label="Opacidad"
            value={config.opacity}
            min={0.1}
            max={1}
            step={0.05}
            onChange={(v) => update({ opacity: v })}
          />
          <SliderControl
            label="Grosor"
            value={config.strokeWidth}
            min={0.5}
            max={5}
            step={0.5}
            onChange={(v) => update({ strokeWidth: v })}
          />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-border">
        <span className="text-sm font-medium text-text/80">Relleno sólido</span>
        <button
          onClick={() => update({ filled: !config.filled })}
          className={`w-12 h-6 rounded-full transition-all duration-200 ${
            config.filled ? 'bg-accent' : 'bg-border'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              config.filled ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRandomize}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-all shadow-md shadow-accent/20"
        >
          <Shuffle className="w-4 h-4" />
          Aleatorizar
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-text/70 rounded-xl font-medium border border-border hover:border-accent/30 hover:text-accent transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
}

function SliderControl({ label, value, min, max, step, onChange, suffix = '' }: SliderControlProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm text-text/60 w-20 shrink-0">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-2 bg-border rounded-full appearance-none cursor-pointer accent-accent"
      />
      <span className="text-sm font-mono text-text/50 w-12 text-right">
        {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{suffix}
      </span>
    </div>
  );
}
