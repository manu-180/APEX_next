# APEX 3D — Progreso

Integración 3D (three.js + Meshy) en APEX_next. Iniciado 2026-07-05.

## Estado: DEPLOYADO a producción ✅ (tanda 2: museo `85c4047` + founder `fb01d87`, live en theapexweb.com)

### Tanda 3 (2026-07-06) — interacción + founder premium (pedido de Manuel)
- **Rotación por drag** en ApexCore, MeshyShowroom y FounderBust: `OrbitControls` (drei) con `enablePan/Zoom=false`, `enableDamping` (inercia), `rotateSpeed 0.9`, sin límites polares → se agarra y gira para cualquier lado. Cursor `grab`/`grabbing` vía `className="cursor-grab active:cursor-grabbing"` en el `<Canvas>`. `touchAction: 'pan-y'` (mobile: swipe horizontal = tornamesa, vertical = scroll de página; NO atrapa el scroll). El auto-spin se pausa mientras se arrastra (ref `dragging` compartido con `onStart/onEnd`).
- **Cambio de forma/tema al CLICK, no al hover**: se sacó el `previewThemeFn` (onMouseEnter/Leave) de los swatches de `/lab` (lab-client) y home (home-3d-showcase). Quedó solo `applyTheme` en onClick. Se quitó el follow-cursor y el CameraRig de ApexCore (los reemplaza OrbitControls).
- **Founder 3D premium con color**: material iridiscente (`iridescence:1`, `iridescenceThicknessRange [120,500]`) + clearcoat + sheen tintado por theme + `Environment` con lightformers de color (violeta/rosa/cian) → escultura tornasol, deja de ser monocromática. Bloom sutil agregado. Verificado visualmente en prod.
- **Copy /lab**: título "De un prompt a un objeto" → "De la idea a un objeto real" (Manuel: "prompt queda como que es re fácil"); subcopy reescrito (craft + "agarrá uno y movelo"). Se sacaron los números 01–04 del selector de artefactos. Hints actualizados ("arrastrá para rotar").
- **CTAs /lab**: "Quiero algo así para mi marca" → `WhatsAppOutboundLink` con `WA_MSG_LAB` (pide boceto gratis, número 5491134272488). "Ver qué cuesta cada nivel" → `Link` directo (sin `<button>` anidado) a `/servicios#casos-reales`.
- **Crash de /lab**: NO era bug del código. Build de prod local renderiza /lab sin crash bajo todos los themes (incl. logo/SVGLoader) y con las secciones below-fold montadas. Era deploy viejo en Vercel / chunks cacheados en el browser de Manuel → lo resuelve el redeploy + hard-refresh.

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
- [x] **Founder 3D**: HECHO y deployado (commit `fb01d87`, 2026-07-05). Busto Meshy image-to-3D sin textura (`public/models/apex-founder.glb`, 810 KB) + material theme-reactive; toggle "Verme en 3D" en el retrato de `founder.tsx`, chunk on-demand. Script: `scripts/meshy/founder.mjs`.
- [x] **Micro-momentos**: HECHO y deployado (2026-07-06). ApexCore muta a la forma del LOGO 3D del theme activo (flutter/nextjs/supabase/riverpod/typescript → SVG extruido con SVGLoader+ExtrudeGeometry; el resto cae al icosaedro). `lib/three/logo-shapes.ts` + `lib/three/logoGeometry.ts` (cache + fallback), swap animado encoge→pop en `ApexCore.tsx`. Aplica en /lab Y home. `three-stdlib` quedó pineado como dep directa.
- [ ] Pulir iluminación del showroom Meshy (los objetos metálicos se ven algo grises en algunos ángulos).

> Nota: la "coordinación multi-sesión" del 2026-07-05 quedó resuelta — el trabajo del morph había quedado huérfano (sesión terminada sin commitear); se verificó (tsc+build+visual) y se commiteó el 2026-07-06. La key de Meshy en `.env.local` es válida.

## Gotchas
- Dev en Windows: hydration mismatch **fantasma** por cache de chunks al editar clases (NO en prod). Verificar con `npm run build` + `npm start`.
- Git push: el Credential Manager tiene cacheado INSIGHTSAPPS; pushear con `git push "https://manu-180:$(gh auth token)@github.com/manu-180/APEX_next.git" HEAD:main`.
- Regenerar modelos Meshy: `export MESHY_API_KEY=$(grep -E '^MESHY_API_KEY=' .env.local | cut -d= -f2)` y `node scripts/meshy/generate.mjs`. Luego re-optimizar con gltf-transform.

(La key temporal original ya fue revocada; la actual en `.env.local` es la nueva, verificada 2026-07-05.)

## Handoff para nueva sesión
> Leé `docs/3D_PROGRESS.md`, `APEX_next/CLAUDE.md` y la memoria `project-apex-3d-system` primero. El sistema 3D base está live. Próxima tarea: elegir una de las 3 pendientes (Museo de casos = mayor ROI). Patrón establecido: Canvas en `components/three/`, `dynamic(ssr:false)` + poster, IntersectionObserver para montar, `useApexTheme().activeConfig.primary` para color reactivo, reduced-motion siempre.
> 🤖 MODELO: Opus · RAZONAMIENTO: Alto (código en prod, decisiones de diseño)
