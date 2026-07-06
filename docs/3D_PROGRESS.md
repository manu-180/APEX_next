# APEX 3D — Progreso

Trabajo de integración 3D (three.js + Meshy) en el sitio. Iniciado 2026-07-05.

## Modelo
Opus 4.8 (Manuel pidió Fable; aplica desde su próximo mensaje). Para ingeniería pesada, Opus recomendado.

## Stack agregado
- `three@0.169.0`
- `@react-three/fiber@8.17.10` (v8 — React 18; NO usar v9/v10 = React 19)
- `@react-three/drei@9.114.3`
- `@react-three/postprocessing@2.16.3` (bloom)

## Hecho y verificado
- **Fundamento** instalado, build dev limpio.
- **Ruta `/lab`** (`app/lab/page.tsx` + `lab-client.tsx`), agregada a `ROUTES.lab` en `lib/constants/index.ts`.
- **APEX Core** (`components/three/apex-core/ApexCore.tsx`): icosaedro facetado, `MeshPhysicalMaterial` (metal+clearcoat+flatShading), Environment con Lightformers (uno tintado del theme), Edges, EffectComposer+Bloom, parallax de cámara.
  - Theme-reactive: lee `useApexTheme().activeConfig.primary`, lerp de color frame a frame. Verificado con riverpod (violeta) — objeto + sitio entero cambian.
  - Chips de theme en `/lab` → `applyTheme(id, e)` (con wave) + hover `previewThemeFn`.
  - LCP-safe: montado `dynamic(ssr:false)` con poster; `prefers-reduced-motion` (sin auto-spin); `frameloop` pausa en pestaña oculta.

## Meshy (agente en paralelo)
- Key en `.env.local` → `MESHY_API_KEY` (gitignored). Balance ~3100. **Revocar al terminar** (pedido de Manuel).
- Script: `scripts/meshy/generate.mjs`. Assets → `public/models/*.glb`.
- Objetos: `apex-monolith`, `apex-core-orb`, `apex-craft`, `apex-gem` (estética aeroespacial/premium).
- Llamar la API con **curl en Bash** (PowerShell manglea Bearer → 401).

## Pendiente
- [ ] Integración 3D al **hero/home** (LCP-safe, post-idle como ParticleField).
- [ ] **Museo 3D**: casos de `/servicios` como slabs flotantes (`servicios-showcase.tsx`).
- [ ] **Founder 3D** con Meshy (`founder.tsx`) — busto estilizado, no realista.
- [ ] **Micro-momentos**: logo/íconos 3D.
- [ ] Integrar assets Meshy cuando el agente termine.
- [ ] **Link a `/lab`** desde nav/home.
- [ ] `npm run build` de producción (tsc+lint) verde.
- [ ] Deploy a prod (Vercel, push a main).

## Gotchas
- Dev en Windows: hydration mismatch **fantasma** por cache de chunks tras editar clases (no ocurre en build de prod). Reiniciar server / hard reload limpia.
- WhatsApp button flotante tapa el último chip del dock en `/lab` (cosmético, revisar padding).
- Dev server actual: puerto 3210.
