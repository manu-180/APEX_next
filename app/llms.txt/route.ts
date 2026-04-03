import { NextResponse } from 'next/server'

const LLMS_TXT = `# APEX — Manuel Navarro

> Desarrollo web y mobile para pymes y emprendedores en Argentina.
> Sitio: https://www.theapexweb.com

APEX es un estudio de desarrollo web y aplicaciones móviles dirigido por Manuel Navarro, desarrollador full-stack y mobile con base en Buenos Aires, Argentina. Trabaja con emprendedores y pequeñas empresas (pymes) de todo el país de forma 100% remota, entregando proyectos con precio fijo, fecha garantizada y comunicación directa — sin intermediarios ni equipos de ventas.

Todos los proyectos incluyen revisiones. Si el cliente no está conforme al finalizar, se devuelve el depósito sin discusiones. El soporte post-entrega está incluido durante 3 meses en todos los planes.

## Servicios y precios

- Landing Page: ARS 300.000 — entrega en 2-3 semanas. Página de conversión con diseño premium que captura consultas 24/7.
- Web Interactiva: ARS 600.000 — entrega en 4-5 semanas. Incluye reservas, cotizaciones o pagos automatizados.
- Tienda Online (E-commerce): ARS 900.000 — entrega en 5-6 semanas. Catálogo, carrito y medios de pago integrados.
- App Móvil MVP: desde ARS 580.000/mes — tu negocio en iOS y Android con fee mensual sin permanencia.
- App Móvil + Operaciones: desde ARS 1.150.000/mes — app para clientes y panel admin para pedidos, roles y reportes.

## Diferenciadores clave

- Precio fijo acordado antes de empezar — sin sorpresas ni costos extra
- Entrega garantizada en 15 días o se devuelve el depósito
- 3 meses de soporte incluido en todos los proyectos
- Comunicación directa con el desarrollador (no con un vendedor)
- Revisiones incluidas en el precio
- Clientes en toda Argentina: Buenos Aires, Córdoba, Rosario, Mendoza y más

## Proyectos destacados

- simonmindset.com — sitio para coach de desarrollo personal
- metalwailers.com — web para banda de metal
- botrive.com — plataforma de automatización con IA
- pulpiprint.com — tienda de impresión online
- mnltecno.com — empresa de tecnología

## Páginas del sitio

- https://www.theapexweb.com — inicio, propuesta de valor y proyectos
- https://www.theapexweb.com/servicios — planes y precios
- https://www.theapexweb.com/sobre-mi — trayectoria y stack tecnológico de Manuel Navarro
- https://www.theapexweb.com/contacto — reservas, reseñas y formulario de contacto

## Contacto

- WhatsApp: https://wa.me/5491124842720
- Sitio web: https://www.theapexweb.com
- Sitemap: https://www.theapexweb.com/sitemap.xml

## Stack tecnológico

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Supabase, Flutter, Dart, React Native, PostgreSQL, Vercel.
`

export function GET() {
  return new NextResponse(LLMS_TXT, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
