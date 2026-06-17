# Optimización Google Ads APEX — 16 de mayo de 2026

> Continuación de `auditoria-2026-05-14.md`. Objetivo de Manuel: que la campaña
> traiga gente que clickee para hablar por WhatsApp. Nada más.

## Problema confirmado

La campaña generaba 305 "conversiones"/30d pero **0 mensajes reales**. Causa: la
conversión `APEX - Scroll 50pct` (PAGE_VIEW) estaba marcada como **primaria**, así
que *Maximizar conversiones* optimizaba para gente que scrollea, no que contacta.
De las 277 conversiones de PMax, ~60 eran scrolls y ~33 clics de botón.

## Cambios aplicados hoy

### 1. Tracking de scroll eliminado del código  ✅
- `lib/analytics/google-ads.ts`: borrada `trackGoogleAdsScroll50` y su label.
- `components/analytics/google-analytics-root.tsx`: borrado el componente
  `GoogleAdsScrollTracking` completo.

**Efecto**: la conversión `APEX - Scroll 50pct` ya no se dispara nunca. Aunque siga
figurando como "primaria" en la UI de Google Ads, una conversión que registra 0
eventos no puede contaminar el bidding. El problema queda neutralizado sin depender
de tocar la UI. Efectivo a partir del próximo deploy a Vercel.

### 2. Conversiones que quedan vivas (todas intención real de contacto)
- `APEX - WhatsApp Click` (CONTACT) — clic al botón flotante de WhatsApp.
- `APEX - Hero CTA Click` (LEAD_FORM) — el botón del hero **abre WhatsApp**
  (`hero.tsx` → `openWhatsAppWithThankYouPage`). Es intención real, se mantiene.
- `ceramicaapp-9abd8 (web) conversion` (CONTACT) — contacto web legado.

Con scroll muerto, *Maximizar conversiones* ahora optimiza solo para contactos
reales por WhatsApp.

### 3. Negativas nuevas (+26 por campaña)  ✅
Agregadas a **Apex search** (`23721057489`) y **APEX PMax** (`23692206380`):
job seekers (`remoto`, `remote`, `freelance`, `frontend`, `backend`, `fullstack`,
`computrabajo`, `linkedin`, `indeed`, `trabajo remoto`) y herramientas/DIY
(`wireframe`, `mockup`, `prototipo`, `curso`, `tutorial`, `gratis`, `plantilla`,
`template`, `como programar`, `aprender a programar`).
Motivo: search terms recientes filtraban `frontend remote` y `wireframe`.

### 4. Número de WhatsApp asentado  ✅
Número oficial único: **`5491134272488`**. El código ya lo usa. Corregidos
los docs desactualizados que tenían el viejo `5491168049457` (`CLAUDE.md` raíz +
`ANALISIS.md`).

## Pendiente manual en la UI (el MCP no lo permite)

Estos quedan por hacer en Google Ads, pero **ya no son críticos** porque el código
neutralizó el scroll. Son mejoras "nice to have":

1. **Apex search → bidding a "Maximizar conversiones"** (hoy está en Maximizar
   clics / TARGET_SPEND). Configuración → Ofertas. El MCP tiene un bug que impide
   hacerlo por API.
2. **Geo targeting → "Presence"** en ambas campañas (hoy "Presence or interest").
   Configuración → Ubicaciones → Opciones.
3. *(Opcional)* Pasar `APEX - Scroll 50pct` a secundaria en Herramientas →
   Conversiones. Ya da igual porque no se dispara, pero deja la cuenta prolija.

## Qué esperar

- 7-14 días de reaprendizaje del algoritmo tras el deploy.
- Las "conversiones" totales van a **bajar** (desaparecen los scrolls) — eso es
  bueno: el número ahora refleja contactos reales.
- Revisar el 2026-05-23: que los clics de WhatsApp suban.

*Última actualización: 2026-05-16*
