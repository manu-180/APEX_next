import type { Metadata, Viewport } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { ApexThemeProvider } from '@/hooks/useTheme'
import { AppShell } from '@/components/layout/app-shell'
import { PersonJsonLd, WebSiteJsonLd, ServiceJsonLd, AggregateRatingJsonLd } from '@/components/seo/json-ld'
import { GoogleAnalyticsRoot } from '@/components/analytics/google-analytics-root'
import { APP_URL, BRAND_IMAGE_SRC } from '@/lib/constants'
import './globals.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

const oxanium = Oxanium({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-oxanium',
  weight: 'variable',
  display: 'swap',
  adjustFontFallback: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
    <html lang="es" suppressHydrationWarning className={oxanium.variable}>
      <head>
        <PersonJsonLd />
        <WebSiteJsonLd />
        <ServiceJsonLd />
        <AggregateRatingJsonLd />
      </head>
      <body className={oxanium.className}>
        {gaMeasurementId ? <GoogleAnalyticsRoot gaId={gaMeasurementId} /> : null}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <ApexThemeProvider>
            <AppShell>{children}</AppShell>
          </ApexThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
