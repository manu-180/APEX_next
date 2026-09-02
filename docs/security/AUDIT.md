# Blindaje theapexweb.com — Auditoría de seguridad

Fecha: 2026-09-02 · Worktree: meshy-refund-380d60 · Proyecto Supabase: osoijzjxzxdkwmobctyb

## VEREDICTO GLOBAL: NO PASA

Motivo: dos dominios load-bearing quedan en NO VERIFICABLE por falta de
`service_role` / acceso al dashboard (no por descuido), y hay una exposición de
PII de lectura CONFIRMADA en `profiles`. Los vectores de abuso/bot y el saneo de
input SÍ quedaron cerrados en código y verificados.

## Matriz (16 dominios)

| # | Dominio | Estado | Evidencia |
|---|---------|--------|-----------|
| 1 | RLS por tabla | VERIFICADO | Live: INSERT anon en appointments/comments/profiles → 42501 (RLS activo con policies). advisor no disponible (MCP de este proyecto no conectado); suplido con sondeo. |
| 2 | Lectura PII | NO PASA | `profiles` anon SELECT → 200, 19 filas con `full_name`+`avatar_url` (nombres/fotos de cuentas Google). `comments` anon → expone `user_id` (correlación). `appointments.contact_info` → 200 `[]` con 0 filas: NO VERIFICABLE si filtra o está vacía (no puedo sembrar sin service_role). |
| 3 | Escritura + escalada | VERIFICADO | INSERT anon bloqueado (42501). UPDATE/DELETE anon sobre filas reales (comment 15, profile real) → 204/200 con **0 filas afectadas** (return=representation `[]`); datos intactos post-prueba. |
| 4 | Authz server-side | VERIFICADO | Única route `app/api/booking/whatsapp` es pública por diseño (proxy). No hay endpoints con `id` de recurso → sin IDOR. Ahora con rate-limit+honeypot+origen. |
| 5 | Secrets en bundle | VERIFICADO | `.next/static` (75 files): 0 hits de APEX_LEADS_BOOKING_SECRET y MESHY_API_KEY. anon JWT role=`anon`. `.env.local` no trackeado (git ls-files). |
| 6 | Deps / CVEs | INDICIO | `npm audit --omit=dev`: 5 high (next, postcss, nanoid, ws, @next/third-parties), 2 moderate. Fix de `next`/`postcss` solo en v16 (major); `nanoid`/`ws` con fix menor. No load-bearing. |
| 7 | Headers / CSP | VERIFICADO (con hueco) | `curl -sD -` a www: HSTS, X-Frame SAMEORIGIN, nosniff, Referrer-Policy, Permissions-Policy presentes. **CSP ausente**. Bloque Report-Only propuesto para next.config (no lo poseo). |
| 8 | Endpoints públicos: abuso | VERIFICADO (fix aplicado) | Antes: sin rate limit. Ahora: middleware (30/min/IP) + route (5/10min/IP) + honeypot + content-type + tope 2KB. Lógica probada en node (5 ok, resto 429). |
| 9 | Superficie LLM | no aplica | No existe endpoint LLM: sin ruta `/api` de chat, sin import openai/anthropic, APEXbot sin superficie de red. |
| 10 | Webhooks entrantes | no aplica | No hay route que reciba webhooks; el flujo de booking es saliente (fetch al bridge con Bearer). |
| 11 | Auth / OAuth | INDICIO | Google OAuth vía Supabase. Allowlist de redirect vive en el dashboard de Supabase (no verificable desde el repo). |
| 12 | Logs / PII | INDICIO | `console.error('[booking] bridge ... ', res.status, json)` puede loguear el body del bridge (posible phone) ante fallo. Deuda menor. |
| 13 | Subida de archivos | no aplica | Sin `input type=file` ni endpoint de upload en el repo. |
| 14 | Middleware bypass CVE-2025-29927 | VERIFICADO | `next@^14.2.35` ≥ 14.2.25 (parcheado). Además el middleware nuevo no hace authz. |
| 15 | Supabase Realtime | NO VERIFICABLE | `useBooking` suscribe anon a `postgres_changes` de `appointments` (event `*`). Si Realtime Authorization no aplica RLS, un anónimo recibe el payload del row (contact_info/phone/client_name) en vivo. Config vive en el dashboard; no verificable sin acceso. |
| 16 | Server Actions / cache | VERIFICADO | Sin Server Actions (solo route handler). Cache `s-maxage` es sobre HTML de marketing público, sin datos por-usuario. |

## Bloqueantes (acción de Manuel — requieren service_role/dashboard)

1. **profiles legibles por anónimo (PII)** — cualquiera lee nombre+foto de las 19
   cuentas. Si es intencional (autores de reseñas), acotar a lo mínimo o exponer
   vía vista `security_invoker` que solo muestre lo público. Verificar policy de
   SELECT.
2. **appointments SELECT** — sembrar 1 fila con service_role y reintentar como
   anon. Si aparece `contact_info`, es fuga P0 (teléfonos/emails de quienes
   reservaron). Fix: SELECT policy que exponga solo `date_slot,hour_slot` (vía
   vista), no la fila completa.
3. **Realtime de appointments** — confirmar en Supabase → Realtime que la
   autorización aplica RLS, o dejar de emitir columnas PII por el canal.
4. **lead_magnet_subscribers** — la migración `20260521` (aún NO aplicada: la
   tabla da 404 en REST) trae una policy UPDATE `using(true)`. Aplicar la
   correctiva `20260902_fix_lead_magnet_rls.sql` ANTES o JUNTO con la original.

## Fix headers para next.config.mjs (lo integra el dueño del archivo)

CSP en **Report-Only** (no rompe nada; solo reporta). Agregar al array del
matcher `/(.*)`:

```js
{
  key: 'Content-Security-Policy-Report-Only',
  value: [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    // Next inyecta scripts inline (hidratación) + Speculation Rules inline.
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://px.ads.linkedin.com",
    "font-src 'self' data:",
    "connect-src 'self' https://osoijzjxzxdkwmobctyb.supabase.co wss://osoijzjxzxdkwmobctyb.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://connect.facebook.net https://www.facebook.com https://us.i.posthog.com https://us-assets.i.posthog.com https://*.ingest.sentry.io https://vitals.vercel-insights.com",
    "frame-src 'self' https://td.doubleclick.net https://www.facebook.com",
    "worker-src 'self' blob:",
  ].join('; '),
},
```

A CONFIRMAR (no verificado leyendo el código, no inventar sin chequear):
posthog/sentry solo si están activos (envs presentes en .env.example);
`vitals.vercel-insights.com` solo si se usa @vercel/analytics/speed-insights;
LinkedIn solo si hay Insight Tag. Correr 1-2 semanas en Report-Only, mirar
violaciones reales y recién ahí pasar a `Content-Security-Policy` enforcing.

## Cambio de UI para el honeypot (lo aplica el dueño de booking-calendar.tsx)

`app/contacto/booking-calendar.tsx`:
1. Estado: `const [company, setCompany] = useState('')`
2. Dentro del `<form>`, un campo trampa oculto a humanos y lectores de pantalla,
   pero visible para bots que autocompletan:
   ```tsx
   <input
     type="text" name="company" tabIndex={-1} autoComplete="off"
     value={company} onChange={(e) => setCompany(e.target.value)}
     aria-hidden="true"
     style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
   />
   ```
3. En `handleSubmit`, pasar el valor: `await confirmBooking({ ..., honeypot: company })`
   (el hook `useBooking` corta ANTES del INSERT en `appointments` si el honeypot
   viene lleno, y el route lo vuelve a chequear y descarta la petición con un
   200 de la misma forma que el éxito real).
