# HOME NOTES — estado final del refactor premium de la Home

> Escrito por el agente finalizador de Home (2026-06-12). Continúa el trabajo del
> agente anterior (hero, client-benefits, trusted-clients). Verificado contra
> `docs/refactor/AUDIT_ADDENDUM.md` y `docs/DESIGN_BRIEF.md` §3.

## Estado final (todo ✅, `npx tsc --noEmit` = 0)

| Archivo | Estado | Sección |
|---|---|---|
| `components/sections/hero.tsx` | Hecho por agente anterior + **1 fix addendum** | Hero |
| `components/sections/trusted-clients.tsx` | Hecho por agente anterior, verificado OK | 01 — prueba social |
| `components/sections/client-benefits.tsx` | Hecho por agente anterior, verificado OK | 02-03 — problema/solución/proceso |
| `components/sections/founder.tsx` | **Reescrito en esta sesión** | 04 — founder card |
| `components/sections/home-final-cta.tsx` | **Reescrito en esta sesión** | 05 — CTA final |
| `components/sections/home-below-fold.tsx` | **Reordenado** | wrapper dynamic() |
| `app/page.tsx` | Sin cambios (composición ya correcta) | — |

## Qué corregí del addendum sobre lo ya hecho

1. **Hero — CTA primario era `btn-primary-tech` (color del tema)** → ahora es
   **sólido verde WhatsApp** (`linear-gradient(135deg, #25D366 0%, #128C7E 100%)` +
   shadow verde, mismo patrón que /gracias y /servicios) con `WhatsAppIcon`.
   "Ver precios" quedó outline del tema (jerarquía correcta).
2. **trusted-clients — blur(6px)/watermark "PREVIEW"**: NO estaba (el agente
   anterior ya lo había eliminado; screenshots nítidos, hover = scale 1.03 +
   overlay "Visitar sitio"). Nada que tocar.
3. **Números canónicos**: grep en las 6 piezas de la home → cero `+150`, cero
   `4.9`/`4.8` (rating numérico solo vive en /contacto), cero "<2 hs", cero
   "20/30 min". Respuesta = "menos de 1 hora", reunión = "15 minutos".

## founder.tsx (04) — decisiones

- **Layout asimétrico** 12-col: contenido en cols 1-7, retrato en cols 9-12
  (gutter col 8), `section-number` "04" rompiendo el borde izquierdo (sigue la
  serie 01/02/03 de las secciones previas; 02 y 03 viven dentro de client-benefits).
- **Slot de foto real**: `next/image` con `src="/manuel.jpg"` y **fallback
  SSR-safe**: el avatar "MN" (gradiente del tema) es la capa base siempre
  renderizada; la foto se funde encima (`opacity-0 → 100`) solo cuando cargó OK
  (`onLoad` + chequeo `complete && naturalWidth > 0` post-mount para imágenes
  cacheadas que resolvieron antes de hidratar). Si el archivo no existe (hoy NO
  existe en `public/`), nunca se ve el glifo de imagen rota.
  **→ Pendiente para Manuel: subir `public/manuel.jpg` (retrato 4:5, ~720px ancho mínimo).**
- **Stats canónicas**: años (derivado de 2021, pre-existente), "8+ en producción",
  "<1 h respuesta". Eliminados los inventados "150+ proyectos", "100% satisfechos", "<2h".
- **Compromisos** respaldados por el FAQ real de /servicios (devolución de depósito,
  código del cliente desde el día uno, atiende la misma persona que programa).
- **Prueba**: BotLode / Botrive / Assistify con links reales de `PROJECTS`.
- **Eliminado el link a LinkedIn**: la URL era un placeholder marcado "pendiente:
  ajustar al URL real" (dato no verificado → fuera, regla "cero datos inventados").
  Si Manuel pasa la URL real, se puede reponer como link discreto.
- CTA: verde WhatsApp sólido con mensaje contextual de founder + link discreto
  "Conocé mi historia" → /sobre-mi.

## home-final-cta.tsx (05) — decisiones

- **Una sola acción dominante**: botón verde WhatsApp h-14 ("Empezar mi proyecto
  por WhatsApp") vía `WhatsAppOutboundLink` (que ya llama
  `openWhatsAppWithThankYouPage` → tracking Google Ads + Meta centralizado,
  **cero track\* manual agregado**). Mensaje contextual de cierre que referencia
  los 15 minutos canónicos.
- El viejo CTA tenía la jerarquía **invertida** ("Agendar llamada" primary del
  tema + WhatsApp outline) y doble botón → reemplazado. Lo de agendar quedó como
  link de texto discreto ("Reunión de 15 minutos, gratis" → /contacto).
- **De-riskers** (addendum): boceto gratis 24-48 h · respuesta <1 h · precio
  cerrado por escrito.
- **Review real**: cita de Laura P. tomada de `lib/data/reviews.ts` (id 2, misma
  fuente que /contacto — sin duplicar el string), estrellas = su rating real (5),
  sin rating agregado numérico en home (regla addendum). Link "Ver todas las
  opiniones" → /contacto. `lib/data/reviews.ts` NO se editó.
- `section-number` "05" + `heading-display` + `editorial-label--primary` de
  FOUNDATION_NOTES. Se eliminó el card 3D-tilt anterior (efecto pesado, jerarquía
  confusa) en favor del patrón editorial de las secciones 01-04.

## home-below-fold.tsx

Orden cambiado a: **TrustedClients (01) → ClientBenefits (02-03) → Founder (04) →
FinalCta (05)** según brief §3 (prueba social inmediata después del hero).
Patrón `dynamic()` con SSR intacto.

## Reglas duras — cómo se cumplen

- **7 temas**: todo via `--color-primary(-rgb)` / superficies / utilidades de
  fundación. Único hex: verde WhatsApp en CTAs WhatsApp (excepción del brief).
- **Dark + light**: superficies y alphas de vars; el verde WhatsApp es idéntico
  en ambos (igual que /gracias).
- **Reduced motion**: `useReducedMotion()` en todos los `motion.*` nuevos
  (`initial={false}` + variante sin desplazamiento). Hovers son CSS (el global
  los anula bajo `prefers-reduced-motion`).
- **Tracking**: ningún `trackGoogleAdsWhatsAppClick`/`trackMetaLead` manual en
  callers. Hero conserva su `trackGoogleAdsHeroCtaClick` pre-existente (label
  propio del hero, distinto del de WhatsApp — ya estaba así y es intencional).
- No se tocaron: `globals.css`, `layout/`, `lib/`, `hooks/`, otras páginas,
  `lib/data/reviews.ts` (solo lectura).

## Riesgos / pendientes para el orquestador

1. **`public/manuel.jpg` no existe** — la home muestra el fallback "MN" hasta que
   Manuel suba la foto (también la necesita /sobre-mi según addendum).
2. `SectionReveal` (components/ui) **no usa `useReducedMotion`** internamente;
   por eso las secciones nuevas usan `motion` directo. Otras páginas que lo usan
   dependen solo del kill-switch CSS global. Fix transversal si se quiere (no era
   scope de home).
3. El **footer/navbar** usan `btn-primary-tech` para su CTA WhatsApp
   (FOUNDATION_NOTES §2-3). El addendum dice que el CTA de dinero es siempre
   verde; el genérico de navbar/footer está permitido como excepción de mensaje,
   pero el **color** quedaría a criterio del orquestador (transversal, no home).
4. Anti-double-numbering: si alguna sección nueva se agrega a la home, la serie
   editorial va por 06.
5. Lint: el repo no tiene script `lint` configurado (`next lint` pide setup
   interactivo). Gate usado: `npx tsc --noEmit` = 0.
