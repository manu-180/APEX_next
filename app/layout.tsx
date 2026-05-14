import type { Metadata, Viewport } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeModeProvider } from '@/components/providers/theme-mode-provider'
import { ApexThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/app-shell'
import { PersonJsonLd, WebSiteJsonLd, ServiceJsonLd, AggregateRatingJsonLd } from '@/components/seo/json-ld'
import { GoogleAnalyticsRoot } from '@/components/analytics/google-analytics-root'
import { SentryProvider } from '@/components/providers/sentry-provider'
import { PostHogProviderWrapper, PostHogPageView } from '@/components/providers/posthog-provider'
import { APP_URL, BRAND_IMAGE_SRC } from '@/lib/constants'
import './globals.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['300', '400', '600', '700', '800'],
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


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050508' },
    { media: '(prefers-color-scheme: light)', color: '#F4F5FA' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    template: '%s | Manuel Navarro',
  },
  description:
    'Especializado en crear experiencias fluidas, eficientes y con diseño premium. Apps móviles con Flutter y webs de alto rendimiento con Next.js.',
  keywords: ['Flutter', 'Next.js', 'Supabase', 'Riverpod', 'TypeScript', 'Full-Stack', 'Mobile', 'Argentina', 'Desarrollo web', 'Apps móviles', 'Diseño premium', 'UX'],
  authors: [{ name: 'Manuel Navarro' }],
  creator: 'Manuel Navarro',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: APP_URL,
    siteName: 'APEX Portfolio',
    title: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    description:
      'Experiencias con diseño premium: apps con Flutter y webs de alto rendimiento con Next.js. Consultá precios y agendá tu reunión gratis.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Manuel Navarro — Desarrollo Web & Mobile | APEX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    description: 'Experiencias fluidas con diseño premium: Flutter, Next.js y más.',
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
    <html lang="es" suppressHydrationWarning className={`dark ${oxanium.variable}`}>
      <head>
        {/* Preconnect a dominios críticos de third-party — TLS handshake en paralelo */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {gaMeasurementId ? <link rel="dns-prefetch" href="https://www.googletagmanager.com" /> : null}
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ServiceJsonLd />
        <AggregateRatingJsonLd />
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
      </body>
    </html>
  )
}
