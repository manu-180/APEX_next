import { NextResponse } from 'next/server'
import { APP_URL, WHATSAPP_NUMBER } from '@/lib/constants'
import { WEB_PLANS, APP_PLANS } from '@/lib/types/services'
import { BLOG_POSTS } from '@/lib/data/blog-posts'
import { VERTICALS } from '@/lib/data/verticals'
import { SHOWCASE_TIERS } from '@/lib/data/showcase'

/**
 * /llms.txt — formato del estándar llmstxt.org: H1, blockquote de resumen,
 * prosa breve y secciones `##` con listas de **enlaces Markdown**
 * `- [texto](url): nota`. Un llms.txt sin enlaces no cumple el estándar
 * (es lo que reportaba PageSpeed: "el archivo no contiene ningún enlace").
 *
 * Precios, rutas y proyectos se derivan de las MISMAS fuentes que renderiza el
 * sitio (`lib/types/services.ts`, `lib/data/*`), así que no pueden quedar
 * desfasados de las páginas: si cambia un precio en el código, cambia acá.
 */

const BASE = APP_URL.replace(/\/$/, '')

/** ARS sin símbolo de moneda ni espacios raros: "300.000". */
const ars = (n: number) => new Intl.NumberFormat('es-AR').format(n)

function planLine(p: (typeof WEB_PLANS)[number]): string {
  const price =
    p.price === null
      ? 'presupuesto por proyecto'
      : `ARS ${ars(p.price)}${p.billing === 'month' ? ' por mes' : ''}`
  return `- [${p.name}](${BASE}/servicios): ${price}. ${p.description}`
}

function buildLlmsTxt(): string {
  const showcase = SHOWCASE_TIERS.flatMap((tier) => tier.sites)

  return `# APEX — Manuel Navarro

> Desarrollo de páginas web y aplicaciones móviles a medida para PyMEs y emprendedores de Argentina. Precio fijo publicado, boceto gratis antes de pagar y entrega en 15 días.

APEX es el estudio de Manuel Navarro, desarrollador full-stack y mobile con base en Buenos Aires. Trabaja 100% remoto con clientes de todo el país y atiende 1 o 2 proyectos por vez: el que diseña, programa y entrega es siempre la misma persona, sin agencia ni vendedores de por medio.

Cómo funciona la contratación: charla de 15 minutos por WhatsApp, boceto gratis de la página en 24-48 h y recién ahí la primera de 3 cuotas sin interés. La entrega es a 15 días desde que se aprueba el boceto, con la fecha pactada por escrito — si no se cumple, se devuelve el depósito. El código vive desde el primer día en un repositorio a nombre del cliente. Después del lanzamiento hay 3 meses de soporte incluido, y mantenimiento mensual opcional desde ARS 50.000.

## Servicios y precios

Precios en pesos argentinos, publicados y fijos (nada de "a cotizar"). Los planes web se pagan una vez, por proyecto; las apps móviles funcionan con un fee mensual que incluye desarrollo activo, soporte y publicación en las tiendas.

${WEB_PLANS.map(planLine).join('\n')}
${APP_PLANS.map(planLine).join('\n')}

## Páginas principales

- [Inicio](${BASE}/): propuesta de valor, proyectos en producción y precios de un vistazo.
- [Servicios y precios](${BASE}/servicios): los tres planes web y los tres de app en detalle, proceso paso a paso, formas de pago y preguntas frecuentes.
- [Muestrario](${BASE}/muestrario): galería de sitios reales en producción, todos abribles en vivo, más un laboratorio de diseño que suma un sitio nuevo cada semana.
- [Tecnologías](${BASE}/tecnologias): Flutter, Next.js, Supabase, Riverpod y TypeScript, y qué gana el negocio con cada una.
- [Sobre mí](${BASE}/sobre-mi): trayectoria de Manuel Navarro y cómo trabaja.
- [Contacto](${BASE}/contacto): reserva de una reunión gratuita, reseñas de clientes y contacto directo por WhatsApp.
- [Opiniones](${BASE}/opiniones): dónde dejan su reseña los clientes que ya trabajaron con APEX.

## Páginas por profesión

- ${VERTICALS.map((v) => `[Web para ${v.nounPlural}](${BASE}/${v.slug}): ${v.subheadline}`).join('\n- ')}

## Blog

Artículos con precios y comparativas concretas del mercado argentino, sin relleno.

- ${BLOG_POSTS.map((p) => `[${p.title}](${BASE}/blog/${p.slug}): ${p.description}`).join('\n- ')}
- [Índice del blog](${BASE}/blog): todos los artículos ordenados por fecha.

## Proyectos en producción

Sitios y productos hechos por APEX que están online ahora mismo.

- ${showcase.map((p) => `[${p.name}](${p.url}): ${p.blurb}`).join('\n- ')}

## Contacto

- [WhatsApp directo](https://wa.me/${WHATSAPP_NUMBER}): el canal principal. Respuesta en menos de 1 hora en horario hábil.
- [Agendar una reunión](${BASE}/contacto): consulta gratuita de 15 minutos, sin compromiso.
- [Sitemap](${BASE}/sitemap.xml): todas las URLs indexables del sitio.

## Stack tecnológico

Next.js, TypeScript, Tailwind CSS, Supabase (PostgreSQL, auth y realtime), Flutter y Dart para iOS y Android, y despliegue en Vercel. Integraciones habituales: MercadoPago, WhatsApp, Google Calendar y facturación electrónica.
`
}

export function GET() {
  return new NextResponse(buildLlmsTxt(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
