# 🚀 Guía de Despliegue - GeoPattern

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de Servicios](#configuración-de-servicios)
3. [Despliegue en Vercel](#despliegue-en-vercel)
4. [Configuración Post-Despliegue](#configuración-post-despliegue)
5. [Verificación](#verificación)
6. [Troubleshooting](#troubleshooting)

---

## Requisitos Previos

### Cuentas Necesarias

- [ ] **GitHub** - Para alojar el código
- [ ] **Vercel** - Para despliegue
- [ ] **Stripe** - Para pagos
- [ ] **Supabase** - Para base de datos
- [ ] **Google Cloud** - Para OAuth
- [ ] **Resend** - Para emails (opcional)
- [ ] **Plausible/Umami** - Para analytics (opcional)

### Herramientas Locales

```bash
# Verificar Node.js (18+)
node --version

# Verificar npm
npm --version

# Instalar Vercel CLI (opcional)
npm i -g vercel
```

---

## Configuración de Servicios

### 1. GitHub Repository

```bash
# Inicializar repositorio
git init
git add .
git commit -m "Initial commit"

# Crear repositorio en GitHub
gh repo create geopattern --public --source=. --push
```

### 2. Supabase (Base de Datos)

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia las credenciales:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Ejecuta el SQL para crear las tablas:

```sql
-- Ir a SQL Editor en Supabase Dashboard

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

-- Índices para performance
CREATE INDEX idx_downloads_user_id ON downloads(user_id);
CREATE INDEX idx_downloads_created_at ON downloads(created_at);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 3. Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Ve a "APIs & Services" → "Credentials"
4. Crea "OAuth 2.0 Client ID"
5. Configura:
   - Application type: Web application
   - Authorized JavaScript origins: `https://tuapp.vercel.app`
   - Authorized redirect URIs: `https://tuapp.vercel.app/api/auth/callback/google`
6. Copia:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### 4. Stripe (Pagos)

1. Ve a [stripe.com](https://stripe.com)
2. Crea una cuenta (o usa modo test)
3. Ve a "Developers" → "API keys"
4. Copia:
   - `STRIPE_SECRET_KEY` (sk_test_... o sk_live_...)
   - `STRIPE_PUBLIC_KEY` (pk_test_... o pk_live_...)

5. Crea productos y precios:
   - Producto: "GeoPattern Premium"
   - Precio mensual: $4.99/mes
   - Precio anual: $39.99/año
   - Copia los Price IDs

6. Configura webhook:
   - Ve a "Developers" → "Webhooks"
   - Agrega endpoint: `https://tuapp.vercel.app/api/webhook`
   - Selecciona eventos:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
   - Copia `STRIPE_WEBHOOK_SECRET` (whsec_...)

### 5. Resend (Emails - Opcional)

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Verifica tu dominio
4. Ve a "API Keys"
5. Copia `RESEND_API_KEY`

### 6. Analytics (Opcional)

#### Plausible (Recomendado)

1. Self-host en Vercel o usa [plausible.io](https://plausible.io)
2. Copia `NEXT_PUBLIC_PLAUSIBLE_URL`

#### Umami (Alternativa)

1. Self-host en Vercel o usa [umami.is](https://umami.is)
2. Crea un website
3. Copia:
   - `NEXT_PUBLIC_UMAMI_URL`
   - `NEXT_PUBLIC_UMAMI_ID`

---

## Despliegue en Vercel

### Método 1: Vercel Dashboard (Recomendado)

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. Configura las variables de entorno (ver siguiente sección)
6. Click en "Deploy"

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar
vercel

# Seguir las instrucciones interactivas
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - What's your project's name? geopattern
# - In which directory is your code located? ./
# - Want to override the settings? No
```

---

## Configuración de Variables de Entorno

### En Vercel Dashboard

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables:

```bash
# Autenticación
NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
NEXTAUTH_URL=https://tuapp.vercel.app

# Google OAuth
GOOGLE_CLIENT_ID=<tu-google-client-id>
GOOGLE_CLIENT_SECRET=<tu-google-client-secret>

# Stripe
STRIPE_SECRET_KEY=<sk_test_... o sk_live_...>
STRIPE_WEBHOOK_SECRET=<whsec_...>
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<pk_test_... o pk_live_...>
STRIPE_PRICE_MONTHLY=<price_monthly_id>
STRIPE_PRICE_YEARLY=<price_yearly_id>

# Supabase
SUPABASE_URL=<https://tu-project.supabase.co>
SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>

# Resend (opcional)
RESEND_API_KEY=<re_...>

# Analytics (opcional)
NEXT_PUBLIC_PLAUSIBLE_URL=<https://plausible.tudominio.com>
# O
NEXT_PUBLIC_UMAMI_URL=<https://umami.tudominio.com/script.js>
NEXT_PUBLIC_UMAMI_ID=<tu-umami-id>

# Configuración
NEXT_PUBLIC_SITE_URL=https://tuapp.vercel.app
NODE_ENV=production
```

### Generar NEXTAUTH_SECRET

```bash
# En macOS/Linux
openssl rand -base64 32

# En Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

## Configuración Post-Despliegue

### 1. Actualizar URLs en Servicios

#### Google OAuth
- Actualiza "Authorized JavaScript origins" a `https://tuapp.vercel.app`
- Actualiza "Authorized redirect URIs" a `https://tuapp.vercel.app/api/auth/callback/google`

#### Stripe Webhook
- Actualiza la URL del webhook a `https://tuapp.vercel.app/api/webhook`
- Verifica que el webhook esté activo

### 2. Configurar Dominio Personalizado (Opcional)

```bash
# En Vercel CLI
vercel domains add tuapp.com

# O en Vercel Dashboard
# Settings → Domains → Add
```

Configura los DNS en tu proveedor de dominio:
- Type: A
- Name: @
- Value: 76.76.21.21

- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

### 3. Configurar Email de Resend (Opcional)

1. Ve a Resend Dashboard
2. Agrega tu dominio
3. Configura los registros DNS (MX, SPF, DKIM, DMARC)
4. Verifica el dominio

---

## Verificación

### Checklist Post-Despliegue

- [ ] La página carga correctamente
- [ ] El generador de patrones funciona
- [ ] La autenticación con Google funciona
- [ ] Las descargas funcionan
- [ ] Los límites de descarga se aplican correctamente
- [ ] El checkout de Stripe funciona (modo test)
- [ ] El webhook de Stripe se ejecuta
- [ ] Los emails se envían (si configuraste Resend)
- [ ] Analytics está trackeando eventos
- [ ] SEO meta tags están presentes
- [ ] El sitio es responsive (mobile, tablet, desktop)
- [ ] robots.txt y sitemap.xml están accesibles

### Comandos de Verificación

```bash
# Verificar que el sitio carga
curl -I https://tuapp.vercel.app

# Verificar robots.txt
curl https://tuapp.vercel.app/robots.txt

# Verificar sitemap.xml
curl https://tuapp.vercel.app/sitemap.xml

# Verificar meta tags
curl -s https://tuapp.vercel.app | grep -i "og:title"
```

---

## Troubleshooting

### Error: "Cannot find module 'stripe'"

```bash
npm install stripe
```

### Error: "Invalid NEXTAUTH_SECRET"

Genera un nuevo secret y actualiza en Vercel:

```bash
openssl rand -base64 32
```

### Webhook de Stripe no funciona

1. Verifica que la URL sea accesible:
   ```bash
   curl https://tuapp.vercel.app/api/webhook
   ```

2. Usa Stripe CLI para testing local:
   ```bash
   stripe listen --forward-to localhost:5173/api/webhook
   ```

3. Verifica que `STRIPE_WEBHOOK_SECRET` sea correcto

### Los patrones no se renderizan

- Verifica que el canvas tenga dimensiones válidas
- Abre la consola del navegador para ver errores
- Verifica que el navegador soporte Canvas API

### Errores de CORS

Verifica que las URLs en Google OAuth y Stripe estén configuradas correctamente.

### Emails no se envían

1. Verifica que `RESEND_API_KEY` sea correcto
2. Verifica que el dominio esté verificado en Resend
3. Revisa los logs en Vercel:
   ```bash
   vercel logs https://tuapp.vercel.app
   ```

### Analytics no trackea

1. Verifica que las variables de entorno estén configuradas
2. Abre la consola del navegador y busca logs de analytics
3. Verifica que el script de analytics esté cargando

---

## Monitoreo

### Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Analytics tab
3. Monitorea:
   - Page views
   - Performance metrics
   - Web vitals

### Stripe Dashboard

1. Monitorea pagos y suscripciones
2. Revisa logs de webhooks
3. Configura alertas de fallos

### Supabase Dashboard

1. Monitorea uso de base de datos
2. Revisa logs de API
3. Configura backups automáticos

---

## Actualizaciones

### Desplegar Actualizaciones

```bash
# Hacer cambios locales
git add .
git commit -m "Update description"
git push

# Vercel desplegará automáticamente
```

### Rollback

```bash
# En Vercel Dashboard
# Deployments → Select deployment → Promote to Production
```

---

## Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs

---

## Checklist Final

Antes de lanzar a producción:

- [ ] Todas las variables de entorno configuradas
- [ ] Base de datos inicializada
- [ ] Webhook de Stripe configurado y probado
- [ ] Google OAuth funcionando
- [ ] Emails configurados (si aplica)
- [ ] Analytics funcionando
- [ ] Dominio personalizado configurado (si aplica)
- [ ] SSL/HTTPS activo (automático en Vercel)
- [ ] Pruebas completadas en modo test
- [ ] Documentación actualizada
- [ ] Plan de backup configurado

---

¡Listo! Tu aplicación GeoPattern está desplegada y funcionando. 🎉
