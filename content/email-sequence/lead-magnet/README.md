# Secuencia de emails — Lead Magnet "Guía Precios 2026"

5 emails que se envían a quien descarga la guía. El objetivo es convertir el
lead en consulta WhatsApp / call agendada.

## Cadencia recomendada

| # | Día | Asunto |
|---|-----|--------|
| 0 | inmediato | Acá va la guía + lo que NO está en el PDF |
| 1 | +1 día | El error #1 que cometen las PyMEs al contratar dev |
| 2 | +3 días | Caso real: cómo X cliente bajó 40% el costo migrando de Wix |
| 3 | +6 días | ¿Sabés cuándo NO conviene una app móvil? |
| 4 | +10 días | Cierre suave: si te quedó alguna duda, agendá 15 min |

## Setup

1. Crear Edge Function en Supabase `send-lead-magnet` que:
   - Reciba `{ email, name, projectType, pdfPath }`
   - Mande email 0 con Resend (template `email-0.md`)
   - Encole los 4 emails siguientes con `pg_cron` o `pg_net` (o un job externo)
2. Configurar Resend con dominio verificado (envío desde manuel@theapexweb.com)
3. Templates en HTML — convertir los .md a HTML con un layout simple (logo + footer
   con unsubscribe link)
4. Cada email tiene un `?unsub=<token>` que marca `unsubscribed_at` en la tabla

## Notas para conversion

- Email 0: foco en delivery + setear expectativas — entrega clara, no vender
- Email 1: dolor + cómo evitarlo — establece authority
- Email 2: case study con métricas reales — proof
- Email 3: contrarian take — diferenciación
- Email 4: CTA suave — "si te quedó algo, hablemos 15 min"

NUNCA vender en email 0-2. Solo email 3-4 pueden tener CTA directo.
