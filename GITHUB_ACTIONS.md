# 🔧 Configuración de GitHub Actions con Vercel

## Configuración automática (Recomendado)

Si usas el método de importar desde GitHub en Vercel, **no necesitas configurar GitHub Actions**. Vercel despliega automáticamente en cada push.

---

## Configuración manual con GitHub Actions

Si prefieres usar GitHub Actions para tener más control:

### Paso 1: Obtener tokens de Vercel

1. **Ve a [vercel.com/account/tokens](https://vercel.com/account/tokens)**
2. **Click en "Create Token"**
3. **Nombre**: `GitHub Actions`
4. **Scope**: Selecciona tu cuenta
5. **Expiration**: Sin expiración (o tu preferencia)
6. **Copia el token** (solo se muestra una vez)

### Paso 2: Obtener IDs del proyecto

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Link al proyecto
vercel link

# Esto creará un archivo .vercel/project.json con los IDs
cat .vercel/project.json
```

Verás algo como:
```json
{
  "projectId": "prj_XXXXXXXXXXXXX",
  "orgId": "team_XXXXXXXXXXXXX"
}
```

### Paso 3: Agregar secrets a GitHub

1. **Ve a tu repositorio en GitHub**
2. **Settings → Secrets and variables → Actions**
3. **Click en "New repository secret"**
4. **Agrega estos 3 secrets:**

```
VERCEL_TOKEN: (el token que copiaste en Paso 1)
VERCEL_ORG_ID: team_XXXXXXXXXXXXX (del Paso 2)
VERCEL_PROJECT_ID: prj_XXXXXXXXXXXXX (del Paso 2)
```

### Paso 4: Verificar el workflow

El archivo `.github/workflows/deploy.yml` ya está configurado. Verifica que:

- ✅ Se ejecuta en push a `main`
- ✅ Se ejecuta en pull requests
- ✅ Usa los secrets correctos
- ✅ Deploya a producción solo en `main`

### Paso 5: Probar el workflow

```bash
# Hacer un cambio
git add .
git commit -m "Test GitHub Actions"
git push origin main

# Ver el workflow en GitHub
# Ve a la pestaña "Actions" en tu repositorio
```

---

## Ventajas de GitHub Actions vs Despliegue automático de Vercel

### Despliegue automático de Vercel (Recomendado)
- ✅ Más simple
- ✅ Más rápido
- ✅ Menos configuración
- ✅ Preview deployments automáticos en PRs
- ✅ Integración nativa con GitHub

### GitHub Actions
- ✅ Más control sobre el proceso de build
- ✅ Puedes agregar tests antes de desplegar
- ✅ Puedes desplegar a múltiples plataformas
- ✅ Logs más detallados
- ✅ Puedes personalizar el workflow

---

## Workflow personalizado

Si quieres agregar tests antes de desplegar, modifica `.github/workflows/deploy.yml`:

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      # Agregar tests aquí
      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Troubleshooting

### Error: "VERCEL_TOKEN is not defined"

**Solución:**
1. Verifica que agregaste los secrets en GitHub
2. Verifica que los nombres de los secrets son correctos
3. Verifica que el workflow usa `${{ secrets.VERCEL_TOKEN }}`

### Error: "Project not found"

**Solución:**
1. Verifica que `VERCEL_PROJECT_ID` es correcto
2. Verifica que el token tiene acceso al proyecto
3. Regenera el token si es necesario

### Error: "Build failed"

**Solución:**
1. Verifica que el build funciona localmente: `npm run build`
2. Revisa los logs en GitHub Actions
3. Verifica que todas las dependencias están en `package.json`

---

## Recursos

- [Vercel Action for GitHub](https://github.com/marketplace/actions/vercel-action)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/deployments/git/vercel-auth-for-github)

---

**¡Tu CI/CD está listo!** 🚀
