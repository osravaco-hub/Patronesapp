import { PatternConfig } from '../lib/patterns';
import PatternSelector from './PatternSelector';
import { UserTier } from '../lib/userTier';
import { Shuffle, RotateCcw } from 'lucide-react';

interface ControlsProps {
  config: PatternConfig;
  onChange: (config: PatternConfig) => void;
  onRandomize: () => void;
  onReset: () => void;
  tier: UserTier;
  onPremiumClick: () => void;
}

const PRESET_COLORS = [
  { name: 'Azul', color: '#2563EB' },
  { name: 'Púrpura', color: '#8B5CF6' },
  { name: 'Rosa', color: '#EC4899' },
  { name: 'Verde', color: '#10B981' },
  { name: 'Ámbar', color: '#F59E0B' },
  { name: 'Rojo', color: '#EF4444' },
  { name: 'Cian', color: '#06B6D4' },
  { name: 'Negro', color: '#1A1A1A' },
];

const PRESET_BG = [
  { name: 'Blanco', color: '#FAFAFA' },
  { name: 'Crema', color: '#FEF3C7' },
  { name: 'Lavanda', color: '#EDE9FE' },
  { name: 'Menta', color: '#D1FAE5' },
  { name: 'Rosa claro', color: '#FCE7F3' },
  { name: 'Oscuro', color: '#1A1A1A' },
];

export default function Controls({ config, onChange, onRandomize, onReset, tier, onPremiumClick }: ControlsProps) {
  const update = (partial: Partial<PatternConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="space-y-6">
      <PatternSelector
        selected={config.type}
        onSelect={(type) => update({ type })}
        tier={tier}
        onPremiumClick={onPremiumClick}
      />

      {/* Color */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Color del Patrón</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) => {
            const isActive = config.color === preset.color;
            return (
              <button
                key={preset.color}
                onClick={() => update({ color: preset.color })}
                className={`w-9 h-9 rounded-full border-2 transition-all ${
                  isActive ? 'border-accent scale-110 shadow-md' : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            );
          })}
          {/* Custom color input */}
          <div className="relative">
            <input
              type="color"
              value={config.color}
              onChange={(e) => update({ color: e.target.value })}
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-border overflow-hidden"
              title="Color personalizado"
            />
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Color de Fondo</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_BG.map((preset) => {
            const isActive = config.backgroundColor === preset.color;
            return (
              <button
                key={preset.color}
                onClick={() => update({ backgroundColor: preset.color })}
                className={`w-9 h-9 rounded-full border-2 transition-all ${
                  isActive ? 'border-accent scale-110 shadow-md' : 'border-border hover:scale-105'
                }`}
                style={{ backgroundColor: preset.color }}
                title={preset.name}
              />
            );
          })}
          <div className="relative">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => update({ backgroundColor: e.target.value })}
              className="w-9 h-9 rounded-full cursor-pointer border-2 border-border overflow-hidden"
              title="Fondo personalizado"
            />
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text/70 uppercase tracking-wider">Parámetros</h3>

        <div className="space-y-3">
          <SliderControl
            label="Densidad"
            value={config.density}
            min={0}
            max={100}
            step={1}
            onChange={(v) => update({ density: v })}
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
            label="Escala"
            value={config.scale}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={(v) => update({ scale: v })}
          />
        </div>
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
      <span className="text-sm font-mono text-text/50 w-14 text-right">
        {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(1) : value}{suffix}
      </span>
    </div>
  );
}
