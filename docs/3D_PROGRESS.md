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
- [x] **Museo de casos**: HECHO y deployado (commit `85c4047`, 2026-07-05). Los 7 casos reales (no eran 15) como slabs 3D en `/lab#museo` (`components/three/case-museum/`), + link desde `/servicios`.
- [ ] **Founder 3D**: EN CURSO — **sesión A** (museo). GLB crudo ya generado (`public/models/apex-founder-raw.glb`, image-to-3D sin textura → se renderiza como escultura theme-reactive). Script: `scripts/meshy/founder.mjs`.
- [ ] **Micro-momentos**: EN CURSO — **sesión B** (paralela): ApexCore muta a la forma del logo del theme (`lib/three/logo-shapes.ts`, `lib/three/logoGeometry.ts`, edits a `ApexCore.tsx` + copy de `home-3d-showcase.tsx`). Sesión A NO toca esos archivos.
- [ ] Pulir iluminación del showroom Meshy (los objetos metálicos se ven algo grises en algunos ángulos).

### ⚠️ Coordinación multi-sesión (2026-07-05)
Hay DOS sesiones trabajando en el mismo working tree. Reparto: **A** = museo (hecho) + founder 3D · **B** = micro-momentos/ApexCore logo morph. Antes de commitear: `git add` SOLO archivos propios; no rehacer tareas del otro. La key de Meshy en `.env.local` es válida (verificada 2026-07-05).

## Gotchas
- Dev en Windows: hydration mismatch **fantasma** por cache de chunks al editar clases (NO en prod). Verificar con `npm run build` + `npm start`.
- Git push: el Credential Manager tiene cacheado INSIGHTSAPPS; pushear con `git push "https://manu-180:$(gh auth token)@github.com/manu-180/APEX_next.git" HEAD:main`.
- Regenerar modelos Meshy: `export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)` y `node scripts/meshy/generate.mjs`. Luego re-optimizar con gltf-transform.

## ⚠️ Acción de Manuel: revocar la API key de Meshy (era temporal para esta sesión).

## Handoff para nueva sesión
> Leé `docs/3D_PROGRESS.md`, `APEX_next/CLAUDE.md` y la memoria `project-apex-3d-system` primero. El sistema 3D base está live. Próxima tarea: elegir una de las 3 pendientes (Museo de casos = mayor ROI). Patrón establecido: Canvas en `components/three/`, `dynamic(ssr:false)` + poster, IntersectionObserver para montar, `useApexTheme().activeConfig.primary` para color reactivo, reduced-motion siempre.
> 🤖 MODELO: Opus · RAZONAMIENTO: Alto (código en prod, decisiones de diseño)
