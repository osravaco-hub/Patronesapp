import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PatternCanvas from '../components/PatternCanvas';
import Controls from '../components/Controls';
import ExportButton from '../components/ExportButton';
import PricingModal from '../components/PricingModal';
import { PatternConfig, defaultConfig } from '../lib/patterns';
import {
  UserState,
  getDefaultUser,
  simulateLogin,
  simulatePremiumUpgrade,
  recordDownload,
  DOWNLOAD_LIMITS,
} from '../lib/userTier';
import { Sparkles, LogIn, Crown, Menu, X } from 'lucide-react';

interface LandingProps {
  onNavigateDashboard: () => void;
}

export default function Landing({ onNavigateDashboard }: LandingProps) {
  const [config, setConfig] = useState<PatternConfig>(defaultConfig);
  const [seed, setSeed] = useState(42);
  const [user, setUser] = useState<UserState>(getDefaultUser());
  const [showPricing, setShowPricing] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleRandomize = useCallback(() => {
    setSeed(Math.floor(Math.random() * 100000));
    // Also randomize config values
    setConfig((prev) => ({
      ...prev,
      density: Math.floor(Math.random() * 100),
      rotation: Math.floor(Math.random() * 360 / 5) * 5,
      scale: Math.round((0.5 + Math.random() * 1.5) * 10) / 10,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setConfig(defaultConfig);
    setSeed(42);
  }, []);

  const handleDownload = useCallback(() => {
    setUser((prev) => recordDownload(prev));
  }, []);

  const handleUpgrade = useCallback(() => {
    setUser((prev) => simulatePremiumUpgrade(prev));
    setShowPricing(false);
  }, []);

  const handleLogin = useCallback((email: string) => {
    setUser(simulateLogin(email));
    setShowAuth(false);
  }, []);

  const limit = DOWNLOAD_LIMITS[user.tier];
  const remainingText = limit === Infinity
    ? 'Descargas ilimitadas ✨'
    : `${Math.max(0, limit - user.downloadsToday)} descargas restantes hoy`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-premium flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold font-[family-name:var(--font-display)]">
              GeoPattern
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#generator" className="text-sm text-text/60 hover:text-accent transition-colors">
              Generador
            </a>
            <button
              onClick={() => setShowPricing(true)}
              className="text-sm text-text/60 hover:text-premium transition-colors flex items-center gap-1"
            >
              <Crown className="w-3.5 h-3.5" />
              Premium
            </button>
            {user.isLoggedIn ? (
              <button
                onClick={onNavigateDashboard}
                className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/90 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="px-4 py-2 bg-white text-text text-sm font-medium rounded-lg border border-border hover:border-accent/30 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-border/50"
          >
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-border bg-white p-4 space-y-3">
            <a href="#generator" className="block text-sm text-text/60 py-2">Generador</a>
            <button
              onClick={() => { setShowPricing(true); setMobileMenu(false); }}
              className="block text-sm text-premium py-2 w-full text-left"
            >
              Premium
            </button>
            {user.isLoggedIn ? (
              <button
                onClick={() => { onNavigateDashboard(); setMobileMenu(false); }}
                className="block w-full text-center px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setMobileMenu(false); }}
                className="block w-full text-center px-4 py-2 bg-white text-text text-sm font-medium rounded-lg border border-border"
              >
                Iniciar Sesión
              </button>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-light text-accent rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            100% Gratis • Sin Anuncios
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text max-w-3xl mx-auto leading-tight font-[family-name:var(--font-display)]">
            Genera patrones geométricos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-premium">
              únicos
            </span>
          </h2>
          <p className="text-lg text-text/60 mt-6 max-w-xl mx-auto">
            12 patrones desde círculos concéntricos hasta fractales. Personaliza colores, densidad y escala. Exporta sin límites.
          </p>
        </motion.div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Canvas Area */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-24">
              <PatternCanvas
                config={config}
                seed={seed}
                tier={user.tier}
                width={600}
                height={600}
                onLockedClick={() => setShowPricing(true)}
              />

              {/* Export section */}
              <div className="mt-6">
                <ExportButton
                  config={config}
                  seed={seed}
                  tier={user.tier}
                  downloadsToday={user.downloadsToday}
                  onDownload={handleDownload}
                  onPremiumClick={() => setShowPricing(true)}
                />
                <p className="text-center text-xs text-text/40 mt-3">
                  {remainingText}
                  {user.tier !== 'premium' && (
                    <>
                      {' • '}
                      <button onClick={() => setShowPricing(true)} className="text-premium hover:underline">
                        Upgrade a Premium
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Controls Panel */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <Controls
                config={config}
                onChange={setConfig}
                onRandomize={handleRandomize}
                onReset={handleReset}
                tier={user.tier}
                onPremiumClick={() => setShowPricing(true)}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h3 className="text-3xl font-bold text-center mb-12 font-[family-name:var(--font-display)]">
            12 patrones, 3 niveles
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            <FeatureCard
              emoji="◎"
              title="Ultra-Básicos"
              description="Círculos concéntricos, líneas diagonales y cuadrículas. Gratis para todos."
              badge="Gratis"
              badgeColor="bg-green-50 text-green-600"
            />
            <FeatureCard
              emoji="∿"
              title="Básicos"
              description="Ondas, triángulos, espirales y cruces escandinavas. Al registrarte."
              badge="Free"
              badgeColor="bg-accent-light text-accent"
            />
            <FeatureCard
              emoji="⬡"
              title="Avanzados"
              description="Voronoi, Art Deco, teselados y fractales. Solo Premium."
              badge="Premium"
              badgeColor="bg-premium-light text-premium"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <p className="text-sm text-text/40">
          GeoPattern © 2024 — Generador de patrones geométricos. Sin anuncios, para siempre.
        </p>
      </footer>

      {/* Modals */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onUpgrade={handleUpgrade}
        currentTier={user.tier}
      />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

function FeatureCard({ emoji, title, description, badge, badgeColor }: {
  emoji: string; title: string; description: string; badge: string; badgeColor: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="text-4xl mb-4">{emoji}</div>
      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3 ${badgeColor}`}>
        {badge}
      </span>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-sm text-text/60">{description}</p>
    </div>
  );
}

function AuthModal({ onClose, onLogin }: { onClose: () => void; onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
        <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-display)]">Iniciar Sesión</h3>
        <p className="text-sm text-text/60 mb-6">
          Ingresa tu email para desbloquear patrones básicos y acceder al dashboard.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
          />
          <button
            onClick={() => {
              if (email.trim()) onLogin(email.trim());
            }}
            className="w-full py-3 bg-accent text-white font-medium rounded-xl hover:bg-accent/90 transition-all"
          >
            Continuar con Email
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-text/40">o</span>
            </div>
          </div>

          <button
            onClick={() => onLogin('demo@geopattern.app')}
            className="w-full py-3 bg-white text-text font-medium rounded-xl border border-border hover:border-accent/30 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google (Demo)
          </button>
        </div>
      </div>
    </div>
  );
}
