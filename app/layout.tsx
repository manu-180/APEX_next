import type { Metadata, Viewport } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeModeProvider } from '@/components/providers/theme-mode-provider'
import { ApexThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/app-shell'
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
            <AppShell>{children}</AppShell>
          </ApexThemeProvider>
        </ThemeModeProvider>
        {gaMeasurementId ? <GoogleAnalyticsRoot gaId={gaMeasurementId} /> : null}
        {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
      </body>
    </html>
  )
}
