# 🚀 Guía de Despliegue en Vercel (Plan Free)

## ✅ Requisitos Previos

- Cuenta de GitHub
- Cuenta de Vercel (gratuita)
- Node.js 18+ instalado localmente
- Git instalado

## 📋 Paso 1: Preparar el Repositorio

### 1.1 Crear repositorio en GitHub

```bash
# Inicializar git si no lo has hecho
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: GeoPattern Generator"

# Crear repositorio en GitHub (reemplaza con tu usuario)
gh repo create geopattern --public --source=. --push
```

### 1.2 Verificar archivos importantes

Asegúrate de que estos archivos existan:
- ✅ `package.json` (con scripts de build)
- ✅ `vercel.json` (configuración de Vercel)
- ✅ `.gitignore` (para no subir archivos innecesarios)
- ✅ `index.html` (punto de entrada)

## 🌐 Paso 2: Desplegar en Vercel

### Método 1: Desde GitHub (Recomendado)

1. **Ve a [vercel.com](https://vercel.com)**
2. **Inicia sesión con GitHub**
3. **Click en "Add New" → "Project"**
4. **Importa tu repositorio de GitHub**
   - Busca "geopattern" en la lista
   - Click en "Import"
5. **Configura el proyecto:**
   - Framework Preset: `Vite` (detectado automáticamente)
   - Build Command: `npm run build` (automático)
   - Output Directory: `dist` (automático)
   - Install Command: `npm install` (automático)
6. **Click en "Deploy"**
7. **Espera 1-2 minutos** mientras Vercel construye tu app
8. **¡Listo!** Tu app estará en `https://geopattern-tu-usuario.vercel.app`

### Método 2: Con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar (desde la raíz del proyecto)
vercel

# Responder preguntas:
# ? Set up and deploy "~"? [Y/n] Y
# ? Which scope do you want to deploy to? (tu usuario)
# ? Link to existing project? [y/N] N
# ? What's your project's name? geopattern
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] N

# Para desplegar a producción
vercel --prod
```

## ⚙️ Paso 3: Configurar Variables de Entorno (Opcional)

Si quieres usar servicios externos (Stripe, Supabase, etc.):

1. **Ve a tu proyecto en Vercel**
2. **Settings → Environment Variables**
3. **Agrega las variables necesarias:**

```bash
# Analytics (opcional)
VITE_PLAUSIBLE_URL=https://plausible.io
VITE_UMAMI_URL=https://umami.is/script.js
VITE_UMAMI_ID=tu-id

# Stripe (si implementas pagos reales)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Supabase (si implementas backend real)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

4. **Redespliega** para aplicar los cambios:
```bash
vercel --prod
```

## 🌍 Paso 4: Configurar Dominio Personalizado (Opcional)

### 4.1 Desde Vercel Dashboard

1. **Ve a tu proyecto → Settings → Domains**
2. **Agrega tu dominio:**
   ```
   tu-dominio.com
   ```
3. **Configura los DNS en tu proveedor de dominio:**

**Opción A: Subdominio (más fácil)**
```
Tipo: CNAME
Nombre: www
Valor: cname.vercel-dns.com
```

**Opción B: Dominio raíz**
```
Tipo: A
Nombre: @
Valor: 76.76.21.21

Tipo: AAAA
Nombre: @
Valor: 2606:50c0:8000::150
```

4. **Espera 5-10 minutos** para que los DNS se propaguen
5. **Vercel generará automáticamente el certificado SSL**

### 4.2 Verificar dominio

```bash
# Verificar que el dominio apunta correctamente
nslookup tu-dominio.com
```

## 📊 Paso 5: Verificar el Despliegue

### 5.1 Checklist de verificación

- [ ] La página carga correctamente
- [ ] El generador de patrones funciona
- [ ] Los controles responden correctamente
- [ ] La exportación de patrones funciona
- [ ] El modo oscuro funciona
- [ ] Responsive design funciona en móvil
- [ ] No hay errores en la consola del navegador
- [ ] SEO meta tags están presentes
- [ ] robots.txt y sitemap.xml son accesibles

### 5.2 Comandos de verificación

```bash
# Verificar que el sitio carga
curl -I https://tu-app.vercel.app

# Verificar robots.txt
curl https://tu-app.vercel.app/robots.txt

# Verificar sitemap.xml
curl https://tu-app.vercel.app/sitemap.xml

# Verificar meta tags
curl -s https://tu-app.vercel.app | grep -i "og:title"
```

## 🔄 Paso 6: Actualizaciones Automáticas

### 6.1 Despliegues automáticos desde GitHub

Vercel despliega automáticamente cuando:
- Haces push a la rama `main`
- Creas un pull request (despliegue de preview)
- Haces merge de un pull request

### 6.2 Flujo de trabajo recomendado

```bash
# Crear rama para nuevas funcionalidades
git checkout -b feature/nueva-funcionalidad

# Hacer cambios
git add .
git commit -m "Agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
# Vercel creará un despliegue de preview automáticamente

# Después de aprobar, hacer merge a main
# Vercel desplegará automáticamente a producción
```

## 🎨 Paso 7: Optimizaciones para Producción

### 7.1 Verificar optimizaciones

El proyecto ya incluye:
- ✅ Minificación automática de CSS y JS
- ✅ Code splitting con Vite
- ✅ Compresión gzip/brotli (automático en Vercel)
- ✅ Cache headers para assets estáticos
- ✅ Image optimization (si usas imágenes)

### 7.2 Monitoreo de performance

1. **Ve a tu proyecto en Vercel**
2. **Analytics tab** para ver:
   - Page views
   - Performance metrics
   - Web Vitals
   - Bandwidth usage

## 🛡️ Paso 8: Seguridad

### 8.1 Headers de seguridad

Ya configurados en `vercel.json`:
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### 8.2 HTTPS automático

Vercel proporciona certificados SSL gratuitos automáticamente para todos los dominios.

## 📱 Paso 9: Testing en Diferentes Dispositivos

### 9.1 Testing manual

Prueba tu app en:
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Tablet (iPad, Android)
- [ ] Mobile (iPhone, Android)

### 9.2 Herramientas de testing

- **Chrome DevTools** - Device Mode
- **BrowserStack** - Testing en dispositivos reales
- **Lighthouse** - Performance y SEO audit

## 🐛 Troubleshooting

### Error: "Build failed"

**Solución:**
```bash
# Probar build localmente
npm run build

# Ver errores específicos
npm run typecheck
```

### Error: "Page not found" después del deploy

**Solución:**
1. Verificar que `vercel.json` tiene los rewrites correctos
2. Verificar que el build genera `dist/index.html`
3. Redesplegar: `vercel --prod`

### Error: "Assets not loading"

**Solución:**
1. Verificar que los assets están en la carpeta `public/`
2. Verificar que las rutas son absolutas (`/image.png` no `./image.png`)
3. Limpiar cache del navegador

### Error: "Environment variables not working"

**Solución:**
1. Verificar que las variables empiezan con `VITE_` (para Vite)
2. Redesplegar después de agregar variables
3. Verificar que estás usando `import.meta.env.VITE_...` en el código

## 📊 Límites del Plan Free de Vercel

- ✅ **100 GB de bandwidth/mes**
- ✅ **100,000 solicitudes de serverless functions/mes**
- ✅ **Despliegues ilimitados**
- ✅ **HTTPS automático**
- ✅ **CDN global**
- ✅ **Preview deployments**
- ⚠️ **Serverless functions: 10 segundos de ejecución máxima**
- ⚠️ **Build time: 45 minutos/mes**

**Para GeoPattern:** El plan free es más que suficiente ya que es una app frontend pura sin backend.

## 🎉 ¡Listo!

Tu aplicación GeoPattern está ahora desplegada en Vercel y accesible desde cualquier lugar del mundo.

### Próximos pasos opcionales:

1. **Compartir tu app** en redes sociales
2. **Agregar analytics** (Plausible o Umami)
3. **Implementar pagos reales** con Stripe
4. **Agregar backend** con Supabase
5. **Optimizar SEO** con más meta tags
6. **Agregar PWA** para instalación en móvil

## 📞 Soporte

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Vite Docs**: https://vitejs.dev

---

**¡Felicidades! Tu app está en producción 🚀**
