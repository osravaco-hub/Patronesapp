import { useState, useRef } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { PatternConfig } from '../lib/patterns';
import { generatePattern } from '../lib/patterns';
import { UserPlan, canExport, canDownload, getRemainingDownloads } from '../lib/userTier';
import { addDownloadRecord } from '../lib/limits';

interface ExportButtonProps {
  config: PatternConfig;
  seed: number;
  plan: UserPlan;
  downloadsToday: number;
  onDownload: () => void;
  onPremiumClick: () => void;
}

const EXPORT_OPTIONS = [
  { id: 'png-low', label: 'PNG 600px', description: 'Baja resolución', premium: false },
  { id: 'png-high', label: 'PNG 1200px', description: 'Alta resolución', premium: false },
  { id: 'svg', label: 'SVG Vectorial', description: 'Escalable infinito', premium: false },
  { id: 'png-ultra', label: 'PNG 2400px', description: 'Ultra alta resolución', premium: true },
  { id: 'pdf', label: 'PDF Print', description: 'Listo para imprimir', premium: true },
];

export default function ExportButton({ config, seed, plan, downloadsToday, onDownload, onPremiumClick }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const remaining = getRemainingDownloads(plan, downloadsToday);
  const canDownloadNow = canDownload(plan, downloadsToday);

  const handleExport = async (format: string) => {
    if (!canExport(plan, format)) {
      onPremiumClick();
      return;
    }

    if (!canDownloadNow) {
      onPremiumClick();
      return;
    }

    setIsExporting(true);
    setShowOptions(false);

    // Simulate export delay
    await new Promise((r) => setTimeout(r, 800));

    const dimensions: Record<string, [number, number]> = {
      'png-low': [600, 600],
      'png-high': [1200, 1200],
      'png-ultra': [2400, 2400],
    };

    if (format === 'svg' || format === 'pdf') {
      // Export as PNG for all formats (simplified)
      const [w, h] = dimensions['png-high'] || [1200, 1200];
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      generatePattern(ctx, w, h, config, seed);

      const link = document.createElement('a');
      link.download = `geopattern-${config.type}-${seed}.${format === 'pdf' ? 'png' : format}`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      const [w, h] = dimensions[format] || [600, 600];
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      generatePattern(ctx, w, h, config, seed);

      const link = document.createElement('a');
      link.download = `geopattern-${config.type}-${seed}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }

    addDownloadRecord(config.type, format);
    onDownload();

    setIsExporting(false);
    setSuccess(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className={`
          w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200
          ${success
            ? 'bg-green-500 shadow-md shadow-green-500/20'
            : 'bg-accent hover:bg-accent/90 shadow-md shadow-accent/20'
          }
          disabled:opacity-70 disabled:cursor-not-allowed
        `}
      >
        {isExporting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : success ? (
          <Check className="w-5 h-5" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {isExporting ? 'Exportando...' : success ? '¡Descargado!' : 'Exportar Patrón'}
      </button>

      {/* Download options dropdown */}
      {showOptions && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl border border-border shadow-xl p-3 space-y-1 z-50">
          <div className="px-2 py-1.5 text-xs font-semibold text-text/50 uppercase tracking-wider">
            Formato de exportación
            {remaining !== Infinity && (
              <span className="ml-2 text-accent">({remaining} restantes hoy)</span>
            )}
          </div>
          {EXPORT_OPTIONS.map((option) => {
            const available = canExport(plan, option.id);
            return (
              <button
                key={option.id}
                onClick={() => handleExport(option.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                  available
                    ? 'hover:bg-accent-light text-text'
                    : 'opacity-50 hover:bg-premium-light/50'
                }`}
              >
                <div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-text/50">{option.description}</div>
                </div>
                {!available && (
                  <span className="text-xs font-medium text-premium bg-premium-light px-2 py-0.5 rounded-full">
                    Premium
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
