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

## 3. PENDIENTE

- [ ] **Push apex_hunter master** (commit 8c5c54c hecho; primer push falló por rama main vs master — reintentado).
- [ ] **INPUT MANUEL (Vercel `apex-next`)**: agregar env vars de producción: `APEX_LEADS_BOOKING_SECRET` (= CRON_SECRET de apex-leads, está en `APEX_next/.env.local`) y opcional `APEX_LEADS_URL=https://leads.theapexweb.com`. Sin esto el booking prod sigue 503 (ahora con mensaje claro).
- [ ] E2E del bridge contra prod una vez deployado (POST de prueba → debe llegar WhatsApp self + lead en inbox).
- [ ] Build APEX_next (corriendo) → commit checkpoint + push (deploya fixes de click-path/tracking ya).
- [ ] Tareas #3-#8: dirección de diseño premium, auditoría visual (screenshots dev server), refactor Home / Servicios+Contacto / Sobre-mí+Tecnologías+shared, verificación final.
- [ ] Research de landings: informe completo ya generado (estructura PAS, WhatsApp-first, pricing 3 tiers con entregables, social proof con pocos clientes, anti-patterns). Está en el historial de sesión; sintetizar en `docs/DESIGN_BRIEF.md` antes de refactorizar.

## 4. DECISIONES

- Booking via bridge en apex-leads (un solo dueño de Evolution + inbox coherente) en vez de duplicar credenciales en APEX_next.
- No migrar Next 14→15/16 en este refactor (riesgo innecesario pre-campaña).
- UX de booking sigue mostrando éxito si el WhatsApp falla (la reserva SÍ se guardó); ahora el lead queda registrado en el inbox igual, así no se pierde nada.
- Trabajo directo en main (APEX_next) / master (apex_hunter) — regla de Manuel.
