import type { Metadata, Viewport } from 'next'
import { Oxanium, Syne } from 'next/font/google'
import { ThemeModeProvider } from '@/components/providers/theme-mode-provider'
import { ApexThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/app-shell'
import { PersonJsonLd, WebSiteJsonLd, ServiceJsonLd, LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { GoogleAnalyticsRoot } from '@/components/analytics/google-analytics-root'
import { MetaPixel } from '@/components/analytics/meta-pixel'
import { SentryProvider } from '@/components/providers/sentry-provider'
import { PostHogProviderWrapper, PostHogPageView } from '@/components/providers/posthog-provider'
import { APP_URL, BRAND_IMAGE_SRC } from '@/lib/constants'
import './globals.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  // El peso 200 es OBLIGATORIO: el contraste 200/800 de .heading-display debe
  // ser real, no sintetizado (APEX Design Language v2 §10).
  weight: ['200', '300', '400', '600', '700', '800'],
  preload: true,
  /**
   * `display: 'optional'` impide que el navegador retrase el primer paint
   * esperando la WebFont. Si la fuente no está cacheada y no carga en ~100ms,
   * se usa la fallback del sistema para SIEMPRE (sin FOUT en el texto LCP).
   * Tradeoff aceptado: usuarios first-visit ven Oxanium recién en la 2da visita.
   * Esto convierte una solicitud render-blocking de ~200ms en cero.
   */
  display: 'optional',
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
})

/**
 * Syne 700/800 — display font (headings vía --font-heading en globals.css).
 * `display: 'optional'` igual que Oxanium: el h1 del hero (LCP) usa
 * .heading-display, así que cero FOUT y cero layout shift; en first-visit con
 * red lenta renderiza la fallback y Syne aparece desde la segunda vista.
 */
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['700', '800'],
  preload: true,
  display: 'optional',
  adjustFontFallback: true,
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
  icons: {
    icon: [{ url: BRAND_IMAGE_SRC, type: 'image/png', sizes: '32x32' }],
    apple: [{ url: BRAND_IMAGE_SRC, sizes: '180x180', type: 'image/png' }],
    shortcut: BRAND_IMAGE_SRC,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning className={`dark ${oxanium.variable} ${syne.variable}`}>
      <head>
        {/* Preconnect a dominios críticos de third-party — TLS handshake en paralelo */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {gaMeasurementId ? <link rel="dns-prefetch" href="https://www.googletagmanager.com" /> : null}
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ServiceJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className={oxanium.className}>
        <PostHogProviderWrapper>
          <PostHogPageView />
          <ThemeModeProvider>
            <ApexThemeProvider>
              <AppShell>{children}</AppShell>
            </ApexThemeProvider>
          </ThemeModeProvider>
        </PostHogProviderWrapper>
        <SentryProvider />
        {gaMeasurementId ? <GoogleAnalyticsRoot gaId={gaMeasurementId} /> : null}
        {metaPixelId ? <MetaPixel pixelId={metaPixelId} /> : null}
      </body>
    </html>
  )
}
