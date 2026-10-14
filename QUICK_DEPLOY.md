# 🚀 Despliegue Rápido en Vercel

## Despliegue en 3 pasos:

### 1️⃣ Sube tu código a GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/geopattern.git
git push -u origin main
```

### 2️⃣ Importa en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Click en "Import Git Repository"
3. Selecciona tu repositorio `geopattern`
4. Vercel detectará automáticamente que es un proyecto Vite
5. Click en "Deploy"

### 3️⃣ ¡Listo!

Tu app estará disponible en: `https://geopattern-TU-USUARIO.vercel.app`

---

## Configuración automática

Vercel detectará automáticamente:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

No necesitas configurar nada más.

---

## Despliegues automáticos

Cada vez que hagas push a la rama `main`, Vercel desplegará automáticamente:

```bash
git add .
git commit -m "Nueva funcionalidad"
git push origin main
# Vercel desplegará automáticamente en ~1 minuto
```

---

## Dominio personalizado (opcional)

1. Ve a tu proyecto en Vercel → Settings → Domains
2. Agrega tu dominio: `tu-dominio.com`
3. Configura DNS:
   - CNAME `www` → `cname.vercel-dns.com`
   - A `@` → `76.76.21.21`

---

## Variables de entorno (opcional)

Si necesitas variables de entorno:

1. Ve a Settings → Environment Variables
2. Agrega variables con prefijo `VITE_`:
   ```
   VITE_API_URL=https://api.ejemplo.com
   VITE_ANALYTICS_ID=tu-id
   ```
3. Redeploy: `vercel --prod`

---

## Comandos útiles

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar desde CLI
vercel

# Desplegar a producción
vercel --prod

# Ver logs
vercel logs

# Listar despliegues
vercel ls
```

---

## ¿Problemas?

- **Build falla**: Ejecuta `npm run build` localmente para ver errores
- **Assets no cargan**: Verifica que están en la carpeta `public/`
- **404 en rutas**: Verifica que `vercel.json` tiene los rewrites correctos

---

## Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía completa de despliegue](./VERCEL_DEPLOYMENT.md)
- [Soporte de Vercel](https://vercel.com/support)

---

**¡Tu app estará en producción en menos de 5 minutos!** 🎉
