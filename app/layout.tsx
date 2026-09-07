import type { Metadata, Viewport } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeModeProvider } from '@/components/providers/theme-mode-provider'
import { ApexThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/app-shell'
import { Footer } from '@/components/layout/footer'
import { PersonJsonLd, WebSiteJsonLd, ServiceJsonLd, LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { GoogleAnalyticsRoot } from '@/components/analytics/google-analytics-root'
import { MetaPixel } from '@/components/analytics/meta-pixel'
import { APP_URL } from '@/lib/constants'
import './globals.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

/**
 * Oxanium como FUENTE VARIABLE: un solo woff2 cubre todo el eje 200-800
 * (antes: 6 archivos discretos, ~6 requests y ~100KB+). El peso 200 del
 * contraste 200/800 de .heading-display sigue siendo real — el eje variable
 * lo interpola nativamente, no lo sintetiza.
 */
const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  preload: true,
  /**
   * `display: 'optional'` impide que el navegador retrase el primer paint
   * esperando la WebFont. Si la fuente no está cacheada y no carga en ~100ms,
   * se usa la fallback del sistema para SIEMPRE (sin FOUT en el texto LCP).
   */
  display: 'optional',
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

/**
 * Speculation Rules (Chromium): prerender de la próxima página al hover
 * (eagerness moderate). Colapsa el LCP de las navegaciones internas a ~0ms.
 * Exclusiones: /gracias dispara conversiones al montarse (un prerender
 * falsearía una conversión), /lab monta WebGL (caro para especular) y /api.
 * Safari/Firefox lo ignoran — mejora progresiva, nunca regresión.
 */
const SPECULATION_RULES = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { not: { href_matches: '/gracias*' } },
          { not: { href_matches: '/lab*' } },
          { not: { href_matches: '/api/*' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
})

/**
 * cv-boot: durante el primer layout, las secciones below-the-fold quedan en
 * `content-visibility: hidden` (ver la regla en globals.css) y el navegador se
 * saltea maquetarlas. Al primer frame pintado se saca la clase y vuelven a
 * `content-visibility: auto`, su comportamiento normal.
 *
 * Seis decisiones que NO hay que revertir sin releer docs/perf/2026-09-07-app-shell-profiling.md:
 * 1. La clase la agrega ESTE script, no el HTML del server. Si el navegador no
 *    corre JS (o el script falla), la clase nunca existe y el contenido queda
 *    visible e indexable. Fail-safe por construccion.
 * 2. Doble rAF: el primero corre ANTES del paint del frame en curso, el segundo
 *    ya con el frame pintado. Con uno solo se pierde el ahorro.
 * 3. El destape va por IntersectionObserver, no por timer. Destapar todo
 *    despues del paint no ahorra nada: mueve los ~500ms de layout del
 *    below-the-fold al TBT (medido: +212ms en / y +545ms en /servicios, y
 *    escalonarlo de a una seccion por frame tampoco lo arregla). Con el
 *    observer, la seccion que nadie mira nunca se maqueta.
 * 4. `release()` esta armado por CINCO vias y todas son fail-open. El orden
 *    importa: las tres primeras se registran ANTES de pedir el rAF, porque si
 *    el rAF esta congelado nada que dependa de el llega a correr.
 *    - `visibilityState !== 'visible'` al arrancar: ni se aplica la clase.
 *      Cubre la pestana abierta en background y el prerender de speculation
 *      rules, donde el rAF nunca corre y la clase quedaba pegada para siempre.
 *    - `setTimeout(5000)` FUERA del rAF: la red que antes vivia adentro de
 *      `start` y por eso no cubria nada.
 *    - `visibilitychange` a hidden: preferimos pagar layout en background
 *      antes que dejar contenido inaccesible.
 *    - `pageshow` con `persisted`: BFCache puede restaurar el DOM con el boot
 *      a medio camino y sin re-ejecutar el script.
 *    - Navegacion client-side, y SOLO si cambia el pathname. La comparacion no
 *      es paranoia: Next llama `history.replaceState` al hidratar para
 *      normalizar la URL, asi que liberar en cualquier replaceState apagaba
 *      el boot apenas hidrataba y devolvia el destape masivo post-paint que
 *      el punto 3 evita. Verificado con `chrome --headless --dump-dom`: el
 *      `<html>` salia sin la clase incluso a 200ms de virtual-time-budget.
 * 5. Por que la navegacion libera en vez de re-observar: el script corre una
 *    sola vez y las `.cv-auto` viven en el contenido de cada ruta, no en este
 *    layout. Sin esto, navegar dentro de la ventana de boot dejaba las
 *    secciones de la ruta nueva en `hidden` (medido: 7 de 8 en /servicios,
 *    5040px en blanco). Se libera y no se re-observa porque el ahorro ya se
 *    cobro en el primer paint: en la ruta nueva React monta ya hidratado, no
 *    hay un primer layout que proteger, y `content-visibility: auto` solo
 *    alcanza. Re-observar exigia MutationObserver o un componente cliente en
 *    el shell — mas superficie y mas JS en el shell, a cambio de nada.
 * 6. `release()` saca la clase del `<html>`, NO recorre la lista inicial. Un
 *    nodo insertado justo antes de liberar vuelve a `auto` igual que el resto.
 *
 * Trade-off asumido, no resuelto: mientras dura el boot el below-the-fold esta
 * fuera del arbol de accesibilidad y del buscar-en-pagina. Es inherente a
 * `content-visibility: hidden`; la unica alternativa es no usarlo y perder los
 * 417ms. Por eso la ventana es corta y tiene cinco formas de cerrarse.
 */
const CV_BOOT_SCRIPT = `(function(){var d=document.documentElement;if(document.visibilityState!=='visible')return;d.classList.add('cv-boot');var io=null,done=false;var release=function(){if(done)return;done=true;if(io){io.disconnect();io=null}d.classList.remove('cv-boot')};setTimeout(release,5000);document.addEventListener('visibilitychange',function(){if(document.visibilityState!=='visible')release()});window.addEventListener('pageshow',function(e){if(e.persisted)release()});var path=location.pathname,check=function(){if(location.pathname!==path)release()};window.addEventListener('popstate',check);var h=window.history,wrap=function(n){var f=h[n];if(typeof f==='function'){h[n]=function(){var r=f.apply(this,arguments);check();return r}}};wrap('pushState');wrap('replaceState');var start=function(){if(done)return;var els=[].slice.call(document.querySelectorAll('.cv-auto,.cv-auto-sm'));if(!els.length||!window.IntersectionObserver){release();return}io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.setAttribute('data-cv-on','');io.unobserve(e.target)}})},{rootMargin:'200% 0px'});els.forEach(function(e){io.observe(e)})};if(window.requestAnimationFrame){requestAnimationFrame(function(){requestAnimationFrame(start)})}else{setTimeout(start,0)}})()`

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050508' },
    // Igual a --color-surface-base del modo light (antes #F4F5FA, mismatch)
    { media: '(prefers-color-scheme: light)', color: '#F4F6FB' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    // Home = página de mayor autoridad: el título lidera con la keyword comercial
    // (no con el nombre propio, que nadie busca). Marca "APEX" al final = el término
    // branded que sí es ownable ("apex web"); "Manuel Navarro" queda para el resto vía template.
    default: 'Desarrollo web y apps para PyMEs en Argentina | APEX',
    template: '%s | Manuel Navarro',
  },
  description:
    'Diseño y desarrollo de páginas web y apps a medida para PyMEs y emprendedores en Argentina. Precio fijo, boceto gratis en 48 h y entrega en 15 días.',
  keywords: ['páginas web Argentina', 'desarrollo web Argentina', 'diseño de páginas web', 'desarrollo de apps Argentina', 'web para PyMEs', 'tienda online Argentina', 'Flutter', 'Next.js', 'Supabase', 'desarrollador full-stack Argentina'],
  authors: [{ name: 'Manuel Navarro' }],
  creator: 'Manuel Navarro',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: APP_URL,
    siteName: 'APEX Portfolio',
    title: 'Páginas web y apps a medida para PyMEs argentinas | APEX',
    description:
      'Diseño premium, precio fijo y entrega en 15 días. Boceto gratis en 48 h antes de pagar nada. Web, e-commerce y apps móviles a medida.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'APEX — Desarrollo de páginas web y apps en Argentina' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Páginas web y apps a medida para PyMEs argentinas | APEX',
    description: 'Diseño premium, precio fijo y entrega en 15 días. Boceto gratis en 48 h antes de pagar.',
    images: ['/opengraph-image'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
  // Sin `icons`: declararlo acá pisa la convención de archivos de Next. Los
  // íconos salen de app/favicon.ico + app/icon.png + app/apple-icon.png, que
  // Next linkea con el tamaño real de cada archivo. Antes los tres apuntaban a
  // /apex-logo.png (96 px) declarando "32x32" y "180x180": tamaños mentidos que
  // el navegador reescala mal, y /favicon.ico daba 404 — que es de donde Chrome
  // saca el ícono para la omnibox, el historial y los marcadores.
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning className={`dark ${oxanium.variable}`}>
      <head>
        {/*
          Sin preconnect a fonts.gstatic.com: Oxanium entra por next/font, que
          descarga el woff2 en build y lo sirve self-hosted desde /_next/static.
          El navegador nunca abre una conexión a Google Fonts, así que el
          preconnect solo gastaba un socket y un handshake TLS de más
          (PageSpeed lo reportaba como "preconexión no utilizada").
        */}
        <script dangerouslySetInnerHTML={{ __html: CV_BOOT_SCRIPT }} />
        {gaMeasurementId ? <link rel="dns-prefetch" href="https://www.googletagmanager.com" /> : null}
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ServiceJsonLd />
        <LocalBusinessJsonLd />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: SPECULATION_RULES }}
        />
      </head>
      <body className={oxanium.className}>
        <ThemeModeProvider>
          <ApexThemeProvider>
            <AppShell footer={<Footer />}>{children}</AppShell>
          </ApexThemeProvider>
        </ThemeModeProvider>
        {gaMeasurementId ? <GoogleAnalyticsRoot gaId={gaMeasurementId} /> : null}
        {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
      </body>
    </html>
  )
}
