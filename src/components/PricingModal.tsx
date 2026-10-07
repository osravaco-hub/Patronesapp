import { X, Crown, Zap, Shield } from 'lucide-react';
import { UserTier } from '../lib/userTier';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  currentTier: UserTier;
}

export default function PricingModal({ isOpen, onClose, onUpgrade, currentTier }: PricingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-premium/10 via-accent/5 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-border/50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-text/50" />
        </button>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-premium-light mb-4">
              <Crown className="w-7 h-7 text-premium" />
            </div>
            <h2 className="text-2xl font-bold text-text font-[family-name:var(--font-display)]">
              Desbloquea Premium
            </h2>
            <p className="text-text/60 mt-2">
              Accede a patrones avanzados y exportación ilimitada
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <FeatureItem
              icon={<Zap className="w-5 h-5 text-accent" />}
              title="Patrones avanzados"
              description="Voronoi, Art Deco, Tessellation y Fractal Tree"
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5 text-accent" />}
              title="Exportación ilimitada"
              description="Descargas sin límite, PNG hasta 2400px"
            />
            <FeatureItem
              icon={<Crown className="w-5 h-7 text-premium" />}
              title="Todos los patrones básicos"
              description="Ondas, triángulos, espirales, cruces y rayas"
            />
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-premium/5 to-accent/5 rounded-2xl p-6 border border-premium/10 mb-6">
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-4xl font-bold text-text">$0</span>
              <span className="text-text/50">/ siempre</span>
            </div>
            <p className="text-center text-sm text-text/50">
              100% gratis — Sin anuncios, sin compromisos
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onUpgrade}
            className="w-full py-4 bg-gradient-to-r from-premium to-accent text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-premium/20"
          >
            {currentTier === 'premium' ? '✓ Ya eres Premium' : 'Activar Premium Gratis'}
          </button>

          <p className="text-center text-xs text-text/40 mt-4">
            Sin tarjeta de crédito • Sin anuncios • Para siempre
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div>
        <div className="font-medium text-text text-sm">{title}</div>
        <div className="text-xs text-text/50">{description}</div>
      </div>
    </div>
  );
}
