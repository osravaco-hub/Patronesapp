import { Sparkles, ArrowRight } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
      {/* Header */}
      <header className="border-b border-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center">
              <span className="text-text font-bold text-sm">GP</span>
            </div>
            <h1 className="text-xl font-bold text-text font-[family-name:var(--font-display)]">
              GeoPattern
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-accent-blue mb-8">
            <Sparkles className="w-10 h-10 text-text" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6 font-[family-name:var(--font-display)] leading-tight">
            Generador de Patrones Geométricos
          </h2>
          
          <p className="text-lg sm:text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
            Crea patrones únicos y personalizables. Descarga en PNG y SVG sin marca de agua.
          </p>
          
          <button
            onClick={onStart}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-text font-semibold rounded-lg hover:opacity-90 transition-all duration-200 text-lg"
          >
            Comienza a generar tu patrón
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-text mb-2">21 Patrones</h3>
              <p className="text-sm text-text-secondary">
                Desde círculos concéntricos hasta fractales complejos
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-text mb-2">Personalización Total</h3>
              <p className="text-sm text-text-secondary">
                Colores, densidad, rotación, escala y más
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-background-secondary border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-text mb-2">Sin Marca de Agua</h3>
              <p className="text-sm text-text-secondary">
                Descarga en alta resolución listo para usar
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border transition-colors duration-300 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-text-secondary">
          © 2024 GeoPattern. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
