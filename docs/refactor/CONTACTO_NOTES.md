# CONTACTO NOTES — Refactor premium /contacto

> Agente de página /contacto. Contrato: `docs/DESIGN_BRIEF.md` §3 · Utilidades: `docs/refactor/FOUNDATION_NOTES.md`.
> Verificación: `npx tsc --noEmit` = 0 errores (2026-06-10). Sin commit (a cargo del orquestador).

---

## 1. Qué quedó (arquitectura final de la página)

```
/contacto
├── Header editorial (scroll-fade + SonarWavesBg + GridBackground)
│     editorial-label--primary "Contacto directo" + heading-display 200/800
├── DECISIÓN BINARIA (grid asimétrico 1.1fr · "o" · 1fr)
│   ├── 01 · WhatsApp ahora  ← CTA primario de la página (bento-surface)
│   ├── divisor "o" (vertical lg / horizontal mobile, aria-hidden)
│   └── 02 · Agendar reunión ← booking existente elevado (bento-surface)
└── Opiniones (rating gigante outline + estrellas Amber + lista editorial GSAP)
```

Nada más — sin secciones de relleno, según brief §3.

## 2. Cambios principales

### Eliminado: ContactForm (5 campos → 0)
El formulario "Mandame un mensaje" (whatsapp + email + select + nombre + textarea)
violaba la regla dura del brief (**formularios >3 campos prohibidos**) y el mandato
"decisión binaria, nada más". Quien no quiere WhatsApp tiene el path email **dentro
del booking** (toggle de canal, ya existía).

> ⚠️ Efecto colateral consciente: la edge function `send-contact-email` de Supabase
> queda **sin caller en la web** (era el único uso — verificado con grep). La función
> sigue desplegada e intacta; si se quiere dar de baja es decisión aparte.

### Opción A — WhatsApp ahora (primario)
- `WhatsAppOutboundLink` + `whatsappUrl()` con mensaje contextual local a la página:
  `"Hola Manuel, tengo un proyecto y quiero arrancar. ¿Lo charlamos?"`
  (no se pudo agregar a `lib/whatsapp.ts` porque `lib/` está fuera de mi ownership).
- El tracking vive centralizado en `openWhatsAppWithThankYouPage` (interno del link).
  **NO** se agregó `trackGoogleAds*`/`trackMeta*` en callers.
- Botón gigante verde WhatsApp `#25D366→#128C7E` (única excepción de hex permitida),
  focus ring del primario del tema (patrón del sitio).
- Claims reales: respuesta <1 h (claim del footer/brief), propuesta con precio
  cerrado (claim del home), sin compromiso. Teléfono visible (`WHATSAPP_PHONE_DISPLAY`).

### Opción B — Booking (lógica 100% intacta)
- `useBooking()` sin tocar: mismo flujo POST `/api/booking/whatsapp` + insert en
  `appointments`, anti double-booking (23505), realtime, sin domingos, slots 9-19,
  toggle WhatsApp/email. `handleSubmit` idéntico salvo un snapshot UI-only
  (`lastBooking`) tomado **antes** de `confirmBooking` — necesario porque el refetch
  realtime post-insert limpia `selectedHour` y el resumen de éxito quedaría vacío.
- Estética: `glass-card glow-border` → `bento-surface` (sin `rounded-*` encima,
  el radius lo trae la clase), `editorial-label`, `heading-display`, `.section-number`
  "02" como watermark (alpha 0.14, aria-hidden).
- Éxito: fecha + hora reservada (es-AR) + feedback exacto del brief:
  **"Te llega la confirmación por WhatsApp."** (o "por email." si ese fue el canal).
- Sin campos nuevos: nombre (opcional) + WhatsApp u email, igual que antes.

### Opiniones
- Header asimétrico: título a la izquierda + **rating promedio gigante outline**
  (`.section-number` con `fontSize` override) + estrellas Amber `size-5` con glow;
  estrellas por reseña `size-3` Amber (jerarquía pedida).
- **Estado vacío**: branch `REVIEWS.length === 0` con panel honesto + link WhatsApp
  ("sé el primero"). Hoy no se ve (dataset estático con 5 reseñas) pero queda listo.
- **Replies anidadas**: render listo (borde izquierdo del primario, badge "Respuesta"
  para admin, fecha). El dataset `lib/data/reviews.ts` **no tiene campo replies**
  y `lib/` está prohibido para mí → tipé localmente `ReviewWithReplies` (campo
  opcional, asignación segura). Cuando reviews venga de la DB con replies, se anidan
  sin tocar el render.
- Stagger GSAP (`useGsapReveal`, respeta reduced-motion) conservado.
- **Google OAuth/avatar**: esta página NO lo usaba para reviews (dataset estático,
  avatar = inicial generada) → nada que preservar.

## 3. Accesibilidad y motion

- `useReducedMotion()` en TODO lo nuevo/retocado: fade del header, micro-foco de
  campos, `whileHover/whileTap` de días y horarios, swaps de `AnimatePresence`,
  spring del check de éxito. GSAP (`useGsapReveal`) y `SonarWavesBg` ya se
  auto-apagan (verificado en su código).
- Labels reales (`<label htmlFor>`) para nombre / WhatsApp / email (antes solo
  placeholders); helper del teléfono linkeado con `aria-describedby`.
- `focus-visible:ring` del primario en todos los interactivos custom (días,
  horarios, toggle de canal, reintentar, links WA) — patrón del sitio.
- `aria-pressed` en días/horarios/toggle; `role="group"` con labels; estrellas como
  `role="img"` con texto ("4.8 de 5 estrellas, 5 opiniones"); decorativos con
  `aria-hidden` (números 01/02, divisor "o", comillas, barra de acento).
- Contraste light-mode: textos de error/aviso ahora `text-red-500/amber-600` con
  `dark:` variant (antes `text-red-200/amber-200` ilegibles en claro;
  `darkMode: ['class']` verificado en tailwind.config.ts).

## 4. Componentes compartidos — NO tocados (verificado con grep)

| Componente | Usos | Acción |
|---|---|---|
| `components/ui/section-reveal.tsx` | 18 archivos | Reusado sin editar. No gatea reduced-motion internamente; lo cubre el CSS global. |
| `components/ui/grid-background.tsx` | múltiples páginas | Reusado sin editar |
| `components/ui/sonar-waves-bg.tsx` | **exclusivo de /contacto** | Sin necesidad de cambios (ya respeta reduced-motion y lee `--color-primary-rgb`) — no editado |
| `components/ui/button.tsx`, `icons.tsx` | todo el sitio | Reusados sin editar |
| `components/ui/badge.tsx` | todo el sitio | Ya no se usa en /contacto (reemplazado por `editorial-label`) — no editado |
| `components/whatsapp/whatsapp-outbound-link.tsx` | todo el sitio | Reusado sin editar |
| `hooks/useBooking.ts` | prohibido por mandato | Intacto |
| `hooks/useGsapReveal.ts` | compartido | Intacto |
| `lib/data/reviews.ts` | json-ld + case-studies | Intacto (también alimenta el JSON-LD de rating) |

## 5. Archivos modificados

- `app/contacto/content.tsx` — reescrito (este refactor).
- `app/contacto/page.tsx` — **sin cambios** (metadata/SEO intacta por regla).

## 6. Pendientes / decisiones para el orquestador

1. `send-contact-email` (edge function) quedó sin caller web — ¿se mantiene para uso futuro o se deprecia?
2. El mensaje WA contextual vive como const local de la página; si se quiere
   centralizar en `lib/whatsapp.ts` (`WA_MSG_CONTACT_NOW`), lo tiene que hacer
   quien tenga ownership de `lib/`.
3. Reviews desde DB con replies: el render ya soporta `replies[]`; falta que el
   data source las provea (hoy estático).
4. Verificación visual de los 7 temas + dark/light quedó fuera de mi alcance
   (browser tools prohibidas para este agente) — pendiente de QA visual.
