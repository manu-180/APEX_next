# Perfilado del app-shell — por qué el LCP no baja (2026-09-07)

Setup: build de producción + `next start`, `npx lighthouse@12 --preset mobile
--throttling-method=devtools`. Rutas: `/` y `/servicios`.

## Conclusión corta

**El JS del app-shell no participa del LCP.** Con `--blocked-url-patterns=*/_next/static/chunks/*`
(o sea, cero JavaScript ejecutado) el FCP no mejora: 2226 / 2388 / 2514 ms contra
2253 ms del baseline normal. Si sacar TODO el JS no mueve la aguja, sacar una
parte tampoco puede.

El piso compartido entre `/` y `/servicios` es otro:

| Fase del LCP (home, trace de Chrome) | ms |
|---|---|
| TTFB | 16 |
| Load Delay / Load Time | 0 |
| **Render Delay** | **2259 (99 %)** |
| └ espera del CSS render-blocking | ~1590 |
| └ `Layout` (2 pasadas: 133 y 463 objetos) | 590 |
| └ `UpdateLayoutTree` | 80 |

`FCP == LCP`: no se pinta nada hasta que llega el CSS y el motor hace un layout
completo del DOM ya parseado. El párrafo del hero es el elemento LCP y se pinta
en el mismo frame que el primer paint.

## Atribución por bisección

CSS inyectado sobre el build ya compilado, JS bloqueado (régimen de baja
varianza), mediana de 3. Control: FCP 2160 / Style&Layout 819.

| Experimento | Δ FCP | Δ Style&Layout |
|---|---|---|
| `.cv-auto` → `content-visibility: hidden` | **−417** | −424 |
| below-the-fold entero `display:none` | −271 | −289 |
| navbar + footer ocultos | −106 | −106 |
| └ solo footer | −97 | −88 |
| └ solo navbar | −36 | −33 |
| hero oculto | −130 | −161 |
| grano sin `mix-blend-mode` | **−82** | −71 |
| grano `display:none` (tope) | −104 | −97 |
| `backdrop-filter: none` en todo | −35 | −36 |
| `text-wrap: balance/pretty` → `wrap` | −34 | −32 |

El dato incómodo: **`content-visibility: auto` no ahorra la PRIMERA pasada de
layout.** Chrome decide qué saltear recién después del primer rendering
opportunity, así que en el primer paint las 8 secciones below-the-fold se
maquetan igual. `contain-intrinsic-size` fijo (sin `auto`) y `contain: strict`
no cambian nada (probados: −49 y −68, dentro del ruido).

## Qué se aplicó

Todo en el shell, compartido por las 30+ rutas:

- `mix-blend-mode: overlay` fuera de las dos capas de grano (`body::after` y
  `.noise-overlay::after`), con la opacidad recalibrada.
- `MobileDrawer` a `next/dynamic({ssr:false})`, montado en `pointerdown`/`focus`
  del hamburguesa. Antes viajaba en el chunk del layout.
- `Footer` a server component; el parallax del watermark salió a
  `components/layout/footer-watermark.tsx`. El shell lo recibe como slot desde
  `app/layout.tsx`.
- `ToastProvider` fuera del shell: viaja con el calendario de `/contacto`, su
  único consumidor en todo el sitio.
- Navbar: el underline, el `ResizeObserver` y el `document.fonts.ready` gateados
  a `md+`. En mobile medían cajas con `display:none` (reflow sincrónico durante
  la hidratación, cero píxeles de resultado).
- Hamburguesa: dos componentes de framer-motion → transform CSS.

Chunk del layout: 39.4 → 29.0 kB crudo (11.9 → 10.1 kB gzip). Un request menos,
7 kB menos de JS. Documento: +842 B (el árbol del footer ahora va en el payload
RSC en vez de en el bundle).

## Qué movió (A/B intercalado, orden alternado por ronda, n=10 pares)

Dos servidores simultáneos, uno por build, verificados por hash de chunk. El
orden se alterna porque en un diseño con `base` siempre primero, la variante que
corre segunda sale sistemáticamente peor (+150 a +500 ms) y el sesgo se come la señal.

| | `/` antes → después | `/servicios` antes → después |
|---|---|---|
| LCP | 2118 → 2102 (**−8**) | 2218 → 2206 (**+20**) |
| TBT | 47 → 34 (**−14**) | 87 → 56 (**−27**) |
| Script Evaluation | 746 → 726 (−43 pareado) | 923 → 856 (−26 pareado) |

**LCP: sin cambio medible, como predecía el diagnóstico.** TBT y Script
Evaluation sí bajan, consistente en 7/10 y 8/10 de los pares.

## Lo que falta, ordenado por upside medido

1. **La primera pasada de layout del below-the-fold: −417 ms.** El único cambio
   que mueve el `elementRenderDelay` de verdad. Diseño fail-safe posible: un
   script inline en `<head>` agrega `cv-boot` a `<html>`, la regla
   `.cv-boot .cv-auto { content-visibility: hidden }` aplica durante el primer
   layout, y un `requestAnimationFrame` saca la clase apenas se pintó. Sin JS la
   clase nunca se agrega → contenido visible → cero riesgo de indexación. **No se
   aplicó**: toca contenido de páginas que son landings de Ads y la decisión es de
   Manuel, no del perfilado.
2. **CSS crítico inline: hasta −1400 ms teóricos.** El CSS bloquea el paint hasta
   los ~1350 ms *incluso sin nada compitiendo por ancho de banda*. Con el CSS
   crítico en el `<head>` el primer paint podría ocurrir con el DOM parcial (solo
   el hero). Requiere volver no-bloqueante la hoja completa → riesgo de FOUC, y
   `critters`/`optimizeCss` no funciona en App Router. Ojo: buena parte de esos
   1350 ms es latencia de `next start` en Windows (`maxServerLatency` 601 ms);
   en el CDN de Vercel el premio es bastante menor. **Medir en producción antes
   de invertir acá.**
3. Grano completo fuera (`display:none`): −22 ms extra sobre lo ya aplicado.
4. `text-wrap: balance` fuera de `.heading-display`: −34 ms, a costa de la firma
   tipográfica del sitio.

## Falsos culpables descartados con medición

- **Hidratación del shell**: bloquear todo el JS no mejora el FCP.
- **Contención de ancho de banda de los 36 chunks**: sin ellos el CSS llega a
  1350 ms en vez de 1588 (−240 ms) y el FCP queda igual.
- `InspectorGadget`, `APEXbot` y `PresenceBadge` **ya no existen en el repo**
  (quedaron nombrados en `CLAUDE.md`). El único flotante vivo es
  `WhatsAppFloatingButton` y ya estaba diferido a `requestIdleCallback`.

## Nota de método

Con hidratación activa la varianza corrida a corrida es de ±150 ms y con la
máquina cargada llega a ±1000 ms. Cualquier medición de una sola corrida acá es
ruido. Lo que sirve: A/B intercalado con orden alternado y deltas pareados, o
bien medir en el régimen sin JS, donde la dispersión cae a ±30 ms.
