# APEX 3D — Progreso

Integración 3D (three.js + Meshy) en APEX_next. Iniciado 2026-07-05.

## Estado: DEPLOYADO a producción ✅ (commit `5aa7dfc`, live en theapexweb.com)

## Modelo
Opus 4.8 (Manuel pidió Fable; el switch aplica desde su próximo mensaje). Ingeniería pesada → Opus recomendado.

## Stack agregado
- `three@0.169.0` · `@react-three/fiber@8.17.10` (v8 — React 18; NO v9/v10) · `@react-three/drei@9.114.3` · `@react-three/postprocessing@2.16.3`

## Hecho, verificado en prod y deployado
- **`/lab`** (`app/lab/`): (1) **APEX Core** — icosaedro theme-reactive (bloom, MeshPhysicalMaterial, Lightformers). (2) **Showroom Meshy** — 4 artefactos IA con selector.
- **Home**: interludio 3D below-fold (`components/sections/home-3d-showcase.tsx`) entre proceso y founder. Lazy (IntersectionObserver), no toca LCP.
- **Navbar**: link `/lab`.
- **Meshy**: 4 GLB generados (`scripts/meshy/generate.mjs`) + optimizados (31MB→3.5MB, webp+quantize) en `public/models/`. Metadata: `lib/three/artifacts.ts`.
- Build verde, three code-split (home 120kB / lab 118kB First Load), 0 errores en prod.

## Pendiente (siguiente tanda — cada una es un bloque sustancial)
- [ ] **Museo de casos**: los 15 casos reales de `/servicios` (`servicios-showcase.tsx`) como slabs 3D flotantes con profundidad. Alto impacto en conversión.
- [ ] **Founder 3D**: busto estilizado (Meshy image-to-3D desde foto) en `founder.tsx` — NO realista (uncanny).
- [ ] **Micro-momentos**: logo APEX que se ensambla en el load; íconos de feature cards del hero como mini-objetos 3D.
- [ ] Pulir iluminación del showroom Meshy (los objetos metálicos se ven algo grises en algunos ángulos).

## Gotchas
- Dev en Windows: hydration mismatch **fantasma** por cache de chunks al editar clases (NO en prod). Verificar con `npm run build` + `npm start`.
- Git push: el Credential Manager tiene cacheado INSIGHTSAPPS; pushear con `git push "https://manu-180:$(gh auth token)@github.com/manu-180/APEX_next.git" HEAD:main`.
- Regenerar modelos Meshy: `export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)` y `node scripts/meshy/generate.mjs`. Luego re-optimizar con gltf-transform.

## ⚠️ Acción de Manuel: revocar la API key de Meshy (era temporal para esta sesión).

## Handoff para nueva sesión
> Leé `docs/3D_PROGRESS.md`, `APEX_next/CLAUDE.md` y la memoria `project-apex-3d-system` primero. El sistema 3D base está live. Próxima tarea: elegir una de las 3 pendientes (Museo de casos = mayor ROI). Patrón establecido: Canvas en `components/three/`, `dynamic(ssr:false)` + poster, IntersectionObserver para montar, `useApexTheme().activeConfig.primary` para color reactivo, reduced-motion siempre.
> 🤖 MODELO: Opus · RAZONAMIENTO: Alto (código en prod, decisiones de diseño)
