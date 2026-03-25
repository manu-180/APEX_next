import type { Metadata } from 'next'
import { Oxanium } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

// ─── Oxanium Variable Font ───────────────────────────────────────────────────
const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

// ─── Metadata ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    template: '%s | Manuel Navarro',
  },
  description:
    'Especializado en crear experiencias de usuario fluidas y eficientes con Flutter, Supabase y Riverpod.',
  keywords: ['Flutter', 'Supabase', 'Riverpod', 'Full-Stack', 'Mobile', 'Next.js', 'Argentina'],
  authors: [{ name: 'Manuel Navarro' }],
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    title: 'Manuel Navarro — Desarrollador Full-Stack & Mobile',
    description:
      'Especializado en crear experiencias de usuario fluidas y eficientes con Flutter, Supabase y Riverpod.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Root Layout ─────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={oxanium.variable}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* Global floating widgets, navbar, footer go here once built */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
