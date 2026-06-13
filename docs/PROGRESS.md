# PROGRESS — Refactor pre-campaña + fix funnel WhatsApp

> Última actualización: 2026-06-10 (sesión Claude)
> Objetivo: dejar theapexweb.com listo para campaña — funnel WhatsApp funcionando end-to-end + rediseño premium orientado a conversión.

---

## 1. DIAGNÓSTICO DEL FUNNEL (completado ✅)

**Síntoma reportado:** "no me llega ningún mensaje desde la web; los chats directos de un amigo sí aparecen en el inbox WA de apex_hunter".

**Causas encontradas (todas verificadas):**

1. **Prod corría código viejo con Twilio** — `POST https://www.theapexweb.com/api/booking/whatsapp` devolvía `503 {"missing":["TWILIO_ACCOUNT_SID",...]}`. La versión Evolution del route estaba en el working tree SIN commitear/deployar. → **Toda reserva en prod falló siempre.**
2. **Falla silenciosa en el booking UI** — `hooks/useBooking.ts` hace `console.error` si el WhatsApp falla pero igual muestra "reserva confirmada". El usuario cree que reservó; nadie se entera.
3. **El inbox de apex_hunter no muestra conversaciones salientes** — el webhook Evolution (`apex-leads/src/app/api/webhook/evolution/route.ts:1043`) descarta `fromMe`, y solo el webhook crea leads/conversaciones. Las confirmaciones de booking (salientes) jamás crean el hilo. Solo aparece si el cliente responde.
4. **Click-path wa.me frágil** — `lib/whatsapp-navigate.ts` hacía `window.open(waHref,'_blank','noopener')`: con `noopener` el spec devuelve `null` siempre (imposible detectar bloqueo), y en in-app browsers (Instagram/FB/Google app) el popup se bloquea → usuario aterriza en `/gracias` sin que WhatsApp se abra. **Conversión perdida silenciosamente.**
5. **Tracking duplicado/triplicado** — `trackGoogleAdsWhatsAppClick`/`trackMetaLead` se disparaban en el caller Y dentro del helper (hero, floating button, afip-addon, budget-calculator, botlode-bridge). Conversiones infladas el día que haya campaña.
6. **Tráfico ≈ 0** — sin ads: 0 filas en `appointments` (Supabase APEX `osoijzjxzxdkwmobctyb`), 0 logs runtime en Vercel en 7 días. "No llegan mensajes" es, en parte, "no hay visitas".
7. Descartado: número OK en todo el código (`5491168049457`), Evolution API Railway viva (v2.3.7), `/gracias` no duplica conversión.

**Arquitectura confirmada de apex_hunter (apex-leads):**
- Repo: `C:\MisProyectos\Armagedon\apex_hunter` (rama **master**, remote `manu-180/agente-busca-clientes`), app en subcarpeta `apex-leads/`, deploy Vercel en `https://leads.theapexweb.com`.
- Supabase del hunter: `hpbxscfbnhspeckdmkvu`. Tablas: `leads`, `conversaciones` (rol `'agente'|'cliente'`), `senders` (pool Evolution), `projects`. Inbox lee vista `conversaciones_ultima_por_lead`.
- Cliente Evolution blindado: `src/lib/evolution.ts` (`enviarMensajeEvolution` con preflight de instancia + retry + blocklist). Pool: `src/lib/sender-pool.ts`. Bloqueado duro: `5491124842720`.

## 2. FIXES IMPLEMENTADOS (✅ typecheck verde en ambos repos)

**apex-leads (NUEVO `src/app/api/booking/register/route.ts`, commit 8c5c54c):**
- Endpoint puente auth `Bearer CRON_SECRET`. Crea/encuentra lead (proyecto APEX default, origen `inbound`, estado `contactado`), envía confirmación al cliente + aviso self al admin con el sender principal (`5491168049457`, fallback a cualquier sender conectado), e inserta SIEMPRE la conversación (rol `agente`) → **la reserva aparece en el inbox aunque Evolution esté caído o el cliente nunca conteste**.

**APEX_next:**
- `app/api/booking/whatsapp/route.ts` → proxy fino al bridge (`APEX_LEADS_URL` + `APEX_LEADS_BOOKING_SECRET`). Sin credenciales Evolution acá.
- `lib/whatsapp-navigate.ts` → tracking centralizado (GAds WhatsApp + Meta Lead) y apertura robusta: `window.open` sin `noopener` en features + fallback `location.href` si el popup fue bloqueado.
- Dedupe tracking en: `components/floating/whatsapp-floating-button.tsx`, `components/sections/{hero,afip-addon,budget-calculator}.tsx`, `components/whatsapp/botlode-gracias-bridge.tsx`. (Hero conserva su label propio `trackGoogleAdsHeroCtaClick` — verificar en Google Ads que esa acción sea SECUNDARIA para no contar doble.)
- `env.example` → reemplazado bloque Evolution por `APEX_LEADS_URL` / `APEX_LEADS_BOOKING_SECRET`.
- `.env.local` → agregadas ambas (secret = CRON_SECRET de apex-leads, copiado sin exponer).

## 3. FUNNEL — CERRADO ✅ (2026-06-11 ~02:00)

- [x] apex_hunter master pusheado: bridge (8c5c54c) + allowlist middleware (c2033c8 — el middleware cookie-auth bloqueaba /api/* con 401) + fallback admin phone (a8b92d9).
- [x] Env vars prod de apex-next agregadas POR CLI (`vercel env add`): `APEX_LEADS_BOOKING_SECRET` + `APEX_LEADS_URL` + redeploy (4850bce). **Manuel no tiene que tocar nada.**
- [x] **E2E VERDE en producción**: bridge directo `{ok,sent_client:true,sent_admin:true}` y camino público completo `theapexweb.com/api/booking/whatsapp → {ok,client:true,admin:true}`. Leads de test visibles en inbox WA (lead_id 9ee97145…, dedup por teléfono OK).
- [x] APEX_next checkpoint commiteado/pusheado (a99c77b): proxy booking + click-path robusto + dedupe tracking + SEO previo.
- Gotcha descubierto: PowerShell Invoke-RestMethod manglea el header Bearer en este setup — testear con curl/fetch.
- Pendiente menor: verificar en Google Ads que la conversión del hero (`UoGWCML…`) esté como SECUNDARIA (si es primaria, un click de hero cuenta 2 conversiones junto con la de WhatsApp).

## 4. REFACTOR PREMIUM — COMPLETADO ✅ (2026-06-12 ~00:35)

Ejecutado con 1 agente de fundación + 4 agentes de páginas (+3 finalizadores tras corte por límite de sesión) + integración del orquestador. Contratos en `docs/DESIGN_BRIEF.md` + `docs/refactor/AUDIT_ADDENDUM.md` (verdades canónicas); notas por página en `docs/refactor/*_NOTES.md`.

**Hecho:** fundación (utilidades editorial-label/section-number/bento-surface/divider-theme/heading-display/.btn-wa + navbar glass + footer editorial) · Home (hero asimétrico outcome-driven, portfolio SIN blur, founder con slot foto, CTA final estilo /gracias con review real) · Servicios (precios above-the-fold, sin tachados ni "-36%", badge único "Más elegido", entregables por tier, UNA tabla comparativa, CTAs verdes con waMsgPlan) · Contacto (decisión binaria WhatsApp/booking, form 5 campos eliminado, reviews 4.8·5) · Sobre-mí (asimétrico, manifesto preservado, CTA verde arriba) · Tecnologías (beneficios de negocio, callout theme-switcher) · Jerarquía CTA global: WhatsApp = verde sólido en los 7 temas · Números canónicos en todo el sitio (<1 hora, 15 min, 8+ productos, sin "+150"/"4.9") · Títulos sin duplicar "| Manuel Navarro" · Contraste H1 hero fixed.

**Verificado:** tsc 0 · build prod EXIT 0 · consola limpia en server fresco (el warning de hidratación era SOLO staleness HMR del dev server, imposible en prod) · temas OK (supabase → #3ECF8E propagado, .btn-wa sigue verde) · blur=0 imgs · screenshots home+servicios.

**Pendientes manuales para Manuel:**
- [ ] Subir foto real a `public/manuel.jpg` (retrato ~4:5) — hoy se ve el avatar "MN" de fallback.
- [ ] Google Ads: verificar que la conversión del hero (`UoGWCML-wKccEMy5_5pD`) sea SECUNDARIA (si es primaria, 1 click de hero = 2 conversiones).
- [ ] `CLAUDE.md` (raíz y APEX_next) tienen el pricing viejo de apps ($1.2M one-time); el sitio publica el modelo actual $580k/mes — actualizar docs cuando confirmes el modelo.
- [ ] Menor: en /servicios mobile el botón flotante tapa ~27px del borde del toggle Web/Mobile durante un instante del scroll (elemento en flujo, no sticky — baja prioridad).
- [ ] Edge function `send-contact-email` quedó sin caller (el form de contacto se eliminó a propósito) — decidir si se da de baja.

## 4. DECISIONES

- Booking via bridge en apex-leads (un solo dueño de Evolution + inbox coherente) en vez de duplicar credenciales en APEX_next.
- No migrar Next 14→15/16 en este refactor (riesgo innecesario pre-campaña).
- UX de booking sigue mostrando éxito si el WhatsApp falla (la reserva SÍ se guardó); ahora el lead queda registrado en el inbox igual, así no se pierde nada.
- Trabajo directo en main (APEX_next) / master (apex_hunter) — regla de Manuel.

---

# 5. UX & PERFORMANCE OVERHAUL — EN CURSO (iniciado 2026-06-13)

> Pedido de Manuel: mejorar **completamente** la experiencia de usuario en toda la web
> — cargar más rápido/óptimo, visualmente mejor, **feedback visual premium**, al detalle
> en **cada componente** de **todas** las páginas.

## 5.1 Diagnóstico base (auditoría 2026-06-13)
Arquitectura ya sólida (SSR + `next/dynamic` below-fold, `next/font` `display:optional`,
tokens CSS centralizados, `prefers-reduced-motion` en 27 sitios, ISR + headers seguridad).
**Focos reales:**
1. **Imágenes pesadas sin optimizar** — `manuel.jpg` 2.2 MB, `mi-lugar.png` 1.4 MB,
   `imaginate.png` 1 MB, `handy.png` 1 MB. Sin `priority` ni `placeholder="blur"`.
   (El resto ya tiene `.webp/.avif`; estos 4 quedaron afuera del pipeline.)
2. **Feedback de interacción** — `WhatsAppOutboundLink` (todos los CTA) y `Button` no
   acusaban el click; formularios sin estado de envío; `project-drawer`/`botlode-chat` sin skeleton.
3. **Performance mobile** — `particle-field` (160 partículas) y `circuit-board-bg`
   (600 nodos SVG) sin guardas de viewport.
4. **Microinteracciones** — estados hover/focus/active/press inconsistentes entre CTAs.

## 5.2 Plan por fases
- **FASE 1 — Fundaciones premium** ⏳: `spinner.tsx`, `skeleton.tsx`, `button.tsx`
  (`isLoading`/`loadingText`), `whatsapp-outbound-link.tsx` (pulso `.cta-opening`),
  CSS `.skeleton`/`.cta-opening`. Pendiente: toasts (fase contacto), nav-progress (fase nav).
- **FASE 2 — Imágenes/LCP**: `scripts/optimize-images.mjs` (sharp) para los 4 pesados;
  `placeholder="blur"`+`blurDataURL`; `priority` en LCP; revisar `sizes`.
- **FASE 3 — Pulido por página** (agentes en paralelo con file-ownership): home, servicios,
  contacto (+toasts), sobre-mí, tecnologías, blog, floating, layout, ui drawers/cards.
- **FASE 4 — Perf hardening**: guardas mobile particle/circuit, `content-visibility:auto`
  below-fold, auditar reduced-motion restante.
- **FASE 5 — Verificación**: `tsc --noEmit`, `build`, Lighthouse prod, QA preview mobile/desktop+light/dark.

## 5.3 Decisiones / gotchas de esta fase
- **NO migrar Next** (confirmado en §4). **NO tematizar el verde WhatsApp** (`#25D366`→`#128C7E`).
- Skills auto-sugeridas por hooks (`bootstrap`, `next-upgrade`, `shadcn`, `nextjs`,
  `investigation-mode`, `observability`) se **ignoran**: el proyecto manda usar solo las de
  diseño/perf; no usamos shadcn ni migramos Next.
- `manuel.jpg` ya es la foto real (el pendiente "subir foto" de §4 está resuelto); ahora toca optimizarla.
- `WhatsAppOutboundLink` navega la pestaña actual a `/gracias`; el pulso `.cta-opening` es ack inmediato.

## 5.4 Estado — FASES 1–4 COMPLETADAS ✅ (2026-06-13), verificado

**FASE 1 — Fundaciones premium ✅**
- `components/ui/spinner.tsx`, `skeleton.tsx`, `toast.tsx` (ToastProvider montado en `app-shell`, `aria-live=polite`).
- `button.tsx` con `isLoading`/`loadingText` (spinner + `aria-busy` + disable + cursor).
- `whatsapp-outbound-link.tsx` con pulso `.cta-opening` al click (toda la web).
- `globals.css`: `.skeleton` (barrido) + `.cta-opening` (pulso) con guardas reduced-motion.

**FASE 2 — Imágenes/LCP ✅** (`scripts/shrink-heavy-sources.mjs`, idempotente)
- `manuel.jpg` 2.2 MB → **54 KB** (900px JPEG q82). `mi-lugar.png` 1.4 MB → **30 KB** (`mi-lugar.webp`, ref actualizada en `trusted-clients.tsx` + `placeholder="blur"`).
- `lib/data/image-blur.ts` autogenerado (MANUEL_BLUR, MI_LUGAR_BLUR). Orphans `imaginate/handy.png` restaurados (re-encode los agrandaba).

**FASE 3 — Pulido por página ✅** (6 agentes en paralelo, file-ownership disjunto, todos tsc-verdes):
- **Home** (hero/below-fold/client-benefits/home-final-cta/afip): stagger 45ms, hover táctil de íconos/flechas, skeletons en lazy sections, reduced-motion parity (fix afip).
- **Servicios** (content/faq-accordion/static-sections/final-cta/budget-calculator): FAQ height-auto con bypass reduced-motion + a11y disclosure; calculator con continuidad direccional entre pasos + count-up del precio (`animate()` de Framer, 0 deps) + `whileTap`; hover/focus-visible en tabla y cards.
- **Contacto** (content + useBooking): **submit pending** (Button `isLoading`), **toasts** éxito/error/realtime (4 sitios, `useToast`), retry de slots, press en calendario, reviews hover. Lógica de booking/bridge intacta (verificado por git diff).
- **Content** (sobre-mi/tecnologias/tech-cards/blog): a11y por teclado en las 7 tech-cards (`role=button`+Enter/Space), focus-visible en productos/links/breadcrumbs/FAQ, hover-lift en cards de blog.
- **Layout+Floating** (navbar/footer/mobile-drawer/shortcuts-modal/botlode-chat/whatsapp-float): underline deslizante + glass al scroll + 44px targets; scrim 55% + focus-restore en drawer; focus-trap en modal; **skeleton de carga del iframe botlode**; círculo perfecto garantizado en WA flotante (`aspect-square`).
- **UI/bg** (project-drawer/projects-sheet/cards + particle/circuit/sonar/code-rain): focus-trap+scroll-lock+scrim en drawers, **Skeleton en imágenes** (anti-CLS), tilt respeta reduced-motion.

**FASE 4 — Perf hardening ✅** (dentro del Agente UI/bg):
- Fondos animados: **IntersectionObserver (pausa offscreen) + visibilitychange (pausa tab oculta)** en los 4 efectos; particle-field con conteo escalado por viewport + DPR cap 2→1.5 + estado estático sin rAF en reduced-motion; circuit-board simplificado <768px.

**FASE 5 — Verificación ✅**
- `npx tsc --noEmit` → **EXIT 0** (integrado, tras los 6 agentes).
- `npm run build` → **EXIT 0**, 26 páginas. Bundles: home 120 kB · servicios 201 kB · contacto 220 kB · sobre-mi 172 kB.
- Dev server + preview: home y contacto renderizan, **0 errores/warnings de consola**, sin errores de hidratación, ToastProvider montado (`aria-live=polite`), `mi-lugar.webp` carga OK.
- Nota tooling: `preview_screenshot` hace timeout 30s en este entorno (captura CDP); verificación por accessibility snapshot + consola + DOM eval + build.

## 5.6 Pendiente / próximos (no bloqueante)
- Pulir páginas menores: `/gracias`, `not-found`, `global-error` (post-conversión/error — baja prioridad).
- Opcional premium: barra de progreso de navegación (route-change) global.
- Opcional: `content-visibility:auto` en secciones below-the-fold (requiere globals.css).
- **Sin commitear** (regla: commitear solo cuando Manuel lo pide). Árbol verde. Si Manuel confirma, commitear Fases 1–4.
