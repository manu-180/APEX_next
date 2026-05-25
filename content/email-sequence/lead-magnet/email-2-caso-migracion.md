---
day: 3
subject: 'Cómo migramos un Wix a custom y duplicamos los pedidos online'
from: 'Manuel · APEX <manuel@theapexweb.com>'
preheader: 'Caso real, con números. Sin agencia, sin riesgo, sin perder el SEO.'
---

Hola{{ name ? ' ' + name : '' }},

Un cliente vino con esta situación:

> "Tengo mi tienda en Wix hace 3 años. Funciona, pero pago $45 USD/mes y los
> pedidos están estancados. ¿Me conviene cambiar?"

Le hice 3 preguntas:

1. ¿Cuánto vendés al mes? *"Aproximadamente $1.2M"*
2. ¿Cuánto te entran orgánicos vs pagos? *"60% orgánico de Google"*
3. ¿Sabés en qué keywords rankeás? *"No"*

**Ahí encontramos el problema.** Wix Premium rankeaba en 8 keywords, pero
todas en la posición 10-20. Imposible escalar porque la velocidad del sitio
era 38/100 en mobile y eso ya penaliza ranking.

---

**Lo que hicimos:**

1. **Auditamos las keywords actuales** con Search Console (15 min).
2. **Diseñamos en Next.js** con la misma estructura de URLs (mismas slugs,
   mismas categorías) para no perder señales SEO.
3. **Configuramos redirects 301** para cualquier URL antigua que no entraba
   en el mapa nuevo. Esto preserva el ranking transferido a la nueva URL.
4. **Migramos los datos** (productos, clientes, órdenes) directo a Supabase
   via export Wix → CSV → import.
5. **Lanzamos en 17 días** (proyecto e-commerce custom, ARS 900k).

---

**Resultados a 90 días:**

- Velocidad mobile: 38 → 96/100 (Lighthouse)
- Ranking: 4 keywords en posiciones top 5 (antes top 15-20)
- Pedidos: +47% (el lift más grande vino del checkout más rápido + mejor
  preview en WhatsApp)
- Costo recurrente: $45/mes → $0/mes (sólo dominio + hosting Vercel free)
- ROI del proyecto: 5 meses

---

**¿Aplica a tu caso?**

No necesariamente. Tres condiciones tienen que estar:

1. Tu sitio actual tiene **algún tráfico orgánico** que vale la pena preservar
   (si no rankeás en nada, migrar es menos urgente)
2. Estás **pagando suscripción mensual a una plataforma** (Wix, Shopify,
   Tiendanube)
3. Tu volumen mensual **justifica un proyecto fijo** (si vendés $200k/mes,
   probablemente Tiendanube + custom skin es mejor)

Si no estás seguro, mandame el link de tu sitio actual respondiendo este
email y te tiro un quick read en menos de 24hs. Sin compromiso.

---

Mañana o pasado te mando un contrarian take: **cuándo NO conviene una app
móvil**, aunque te lo estén ofreciendo. (Sí, yo hago apps, y a veces digo
que no.)

Manuel
[theapexweb.com](https://theapexweb.com)

*[Darme de baja]({{ unsubUrl }})*
