import type { Metadata, Viewport } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { AppShell } from '@/components/layout/app-shell'
import { PersonJsonLd, WebSiteJsonLd, ServiceJsonLd, AggregateRatingJsonLd } from '@/components/seo/json-ld'
import { APP_URL } from '@/lib/constants'
import './globals.css'

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#111318' },
    { media: '(prefers-color-scheme: light)', color: '#F4F6F8' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    template: '%s | Manuel Navarro',
  },
  description:
    'Especializado en crear experiencias de usuario fluidas y eficientes. Apps móviles con Flutter y webs de alto rendimiento con Next.js.',
  keywords: ['Flutter', 'Next.js', 'Supabase', 'Riverpod', 'TypeScript', 'Full-Stack', 'Mobile', 'Argentina', 'Desarrollo web', 'Apps móviles'],
  authors: [{ name: 'Manuel Navarro' }],
  creator: 'Manuel Navarro',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: APP_URL,
    siteName: 'APEX Portfolio',
    title: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    description: 'Apps móviles con Flutter y webs de alto rendimiento con Next.js. Consultá precios y agendá tu reunión gratis.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Manuel Navarro — APEX Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    description: 'Apps móviles con Flutter y webs de alto rendimiento con Next.js.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: APP_URL },
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
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
