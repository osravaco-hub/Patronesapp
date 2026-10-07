# GeoPattern - Generador de Patrones Geométricos

![GeoPattern](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-purple)
![License](https://img.shields.io/badge/License-MIT-green)

Generador de patrones geométricos elegante y personalizable. Crea patrones únicos en segundos con 12 diseños diferentes, exportación en PNG/SVG y sistema de suscripción.

![GeoPattern Preview](public/og-image.png)

## ✨ Características

- **12 patrones geométricos** únicos (círculos, triángulos, ondas, voronoi, art deco, fractales)
- **3 niveles de usuario**: Guest, Free y Premium
- **Exportación múltiple**: PNG (1000px, 2000px, 3000px) y SVG vectorial
- **Personalización completa**: colores, densidad, rotación, escala, fondo transparente
- **Sin marca de agua** en todos los niveles
- **Sistema de pagos** con Stripe (mensual/anual)
- **Emails transaccionales** con Resend
- **Analytics** con Plausible/Umami
- **100% responsive** (mobile, tablet, desktop)
- **SEO optimizado** con meta tags y schema.org
- **Sin anuncios** - modelo freemium puro

## 🚀 Demo en Vivo

[Ver Demo](https://geopattern.vercel.app)

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Stripe (para pagos)
- Cuenta de Supabase (para base de datos)
- Cuenta de Resend (para emails)
- Cuenta de Google Cloud (para OAuth)

## 🛠️ Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/yourusername/geopattern.git
cd geopattern
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa las variables:

```bash
# Autenticación
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:5173

# Google OAuth (obtener de Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Stripe (obtener de Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...

# Supabase (obtener de Supabase Dashboard)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (obtener de Resend Dashboard)
RESEND_API_KEY=re_...
```

### 4. Configurar base de datos Supabase

Ejecuta el SQL en tu proyecto de Supabase:

```sql
-- Tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de descargas
CREATE TABLE downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL,
  format TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de suscripciones
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
```

### 5. Configurar Stripe Webhook

En Stripe Dashboard, crea un webhook apuntando a:

```
https://tuapp.vercel.app/api/webhook
```

Eventos a escuchar:
- `checkout.session.completed`
- `customer.subscription.deleted`

### 6. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo (http://localhost:5173)

# Producción
npm run build        # Compila para producción
npm run start        # Inicia servidor de producción
npm run preview      # Vista previa de build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
npm run typecheck    # Verifica tipos TypeScript
```

## 🏗️ Estructura del Proyecto

```
geopattern/
├── src/
│   ├── components/       # Componentes React reutilizables
│   │   ├── PatternCanvas.tsx      # Canvas con renderizado de patrones
│   │   ├── Controls.tsx           # Panel de controles
│   │   ├── PatternSelector.tsx    # Selector de patrones
│   │   ├── ExportButton.tsx       # Botón de exportación
│   │   └── PricingModal.tsx       # Modal de precios
│   ├── pages/            # Páginas principales
│   │   ├── NewLanding.tsx         # Landing page completa
│   │   ├── Landing.tsx            # Generador principal
│   │   └── Dashboard.tsx          # Panel de usuario
│   ├── lib/              # Lógica de negocio
│   │   ├── patterns.ts           # Generación de patrones (Canvas + SVG)
│   │   ├── userTier.ts           # Gestión de niveles de usuario
│   │   ├── limits.ts             # Sistema de límites de descarga
│   │   ├── export.ts             # Lógica de exportación
│   │   ├── stripe.ts             # Integración con Stripe
│   │   ├── emails.ts             # Emails transaccionales (Resend)
│   │   └── analytics.ts          # Analytics (Plausible/Umami)
│   ├── App.tsx           # Componente raíz con routing
│   ├── main.tsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── public/               # Assets estáticos
│   ├── og-image.png      # Imagen para Open Graph
│   └── favicon.ico       # Icono del sitio
├── .env.example          # Variables de entorno de ejemplo
├── tailwind.config.js    # Configuración de Tailwind CSS
├── vite.config.ts        # Configuración de Vite
├── tsconfig.json         # Configuración de TypeScript
└── package.json          # Dependencias y scripts
```

## 🎨 Patrones Disponibles

### Ultra-básicos (Guest/Free/Premium)
1. **Círculos concéntricos** - Anillos repetitivos
2. **Líneas diagonales** - Rayas en ángulo
3. **Cuadrícula de puntos** - Puntos en rejilla

### Básicos (Free/Premium)
4. **Líneas onduladas** - Ondas suaves
5. **Triángulos en grid** - Triángulos repetidos
6. **Espiral cuadrada** - Espiral geométrica
7. **Cruz escandinava** - Cruces nórdicas
8. **Rayas verticales** - Bandas verticales

### Avanzados (solo Premium)
9. **Voronoi** - Células orgánicas
10. **Art Deco** - Líneas geométricas doradas
11. **Tessellation** - Teselado complejo
12. **Fractal Tree** - Árbol fractal

## 💰 Modelos de Suscripción

### Guest (Sin registro)
- ✅ Descargas ilimitadas
- ✅ 3 patrones ultra-básicos
- ✅ PNG + SVG sin marca de agua
- ✅ Resolución 1000px

### Free (Registro gratuito)
- ✅ 3 descargas/semana
- ✅ 8 patrones básicos
- ✅ PNG + SVG sin marca de agua
- ✅ Resolución 1000px

### Premium ($4.99/mes o $39.99/año)
- ✅ Descargas ilimitadas
- ✅ 12 patrones (todos)
- ✅ PNG + SVG sin marca de agua
- ✅ Resolución hasta 3000px
- ✅ Aleatorizar colores con paletas curadas
- ✅ Fondo transparente
- ✅ Pack de 50 patrones prediseñados
- ✅ Historial de descargas

## 🚀 Despliegue en Vercel

### 1. Conectar repositorio

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel
```

### 2. Configurar variables de entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto → Settings → Environment Variables y agrega todas las variables de `.env.example`.

### 3. Configurar dominio personalizado (opcional)

```bash
vercel domains add tuapp.com
```

### 4. Configurar webhook de Stripe

Actualiza la URL del webhook en Stripe Dashboard:

```
https://tuapp.vercel.app/api/webhook
```

## 📊 Analytics

### Plausible (Recomendado)

1. Self-host Plausible en Vercel o usa [plausible.io](https://plausible.io)
2. Configura `NEXT_PUBLIC_PLAUSIBLE_URL` en variables de entorno
3. Los eventos se trackean automáticamente

### Umami (Alternativa)

1. Self-host Umami en Vercel o usa [umami.is](https://umami.is)
2. Configura `NEXT_PUBLIC_UMAMI_URL` y `NEXT_PUBLIC_UMAMI_ID`
3. Los eventos se trackean automáticamente

### Eventos trackeados

- `pattern_generated` - Patrón generado
- `download_started` - Descarga iniciada
- `download_completed` - Descarga completada
- `registration_completed` - Registro completado
- `checkout_started` - Checkout iniciado
- `checkout_completed` - Checkout completado

## 📧 Emails Transaccionales

Configurados con [Resend](https://resend.com):

1. **Email de bienvenida** - Al registrarse
2. **Confirmación de pago** - Al suscribirse a Premium
3. **Recordatorio de descargas** - Opcional, semanal

Personaliza los templates en `src/lib/emails.ts`.

## 🔒 Seguridad

- Autenticación con NextAuth + Google OAuth
- Webhooks de Stripe verificados con firma
- Variables de entorno sensibles no expuestas al cliente
- Rate limiting en APIs
- CORS configurado correctamente

## 🌐 SEO

- Meta tags optimizados (title, description, Open Graph, Twitter Card)
- Schema.org WebApplication
- Sitemap.xml generado automáticamente
- Robots.txt configurado
- Imagen OG personalizada (1200x630px)

## 🎨 Personalización

### Colores

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      background: '#FAFAFA',
      text: '#1A1A1A',
      accent: '#2563EB',
      premium: '#8B5CF6',
      border: '#E5E7EB',
    },
  },
}
```

### Fuentes

Edita `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
```

## 🐛 Troubleshooting

### Error: "Cannot find module 'stripe'"

```bash
npm install stripe
```

### Error: "Invalid NEXTAUTH_SECRET"

Genera un nuevo secret:

```bash
openssl rand -base64 32
```

### Los patrones no se renderizan

Verifica que el canvas tenga dimensiones válidas y que el navegador soporte Canvas API.

### Webhook de Stripe no funciona

1. Verifica que la URL sea accesible públicamente
2. Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto
3. Usa Stripe CLI para testing local:

```bash
stripe listen --forward-to localhost:5173/api/webhook
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Stripe](https://stripe.com/) - Procesamiento de pagos
- [Supabase](https://supabase.com/) - Base de datos
- [Resend](https://resend.com/) - Emails transaccionales
- [Plausible](https://plausible.io/) - Analytics

## 📞 Contacto

- Email: contact@geopattern.app
- Twitter: [@geopattern](https://twitter.com/geopattern)
- GitHub: [github.com/yourusername/geopattern](https://github.com/yourusername/geopattern)

---

Hecho con ❤️ por la comunidad de desarrolladores
