/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      // DEV ONLY — en desarrollo los chunks de /_next/static salen con
      // `immutable, max-age=1 año`. Si el nombre del chunk no cambia (mismo
      // puerto, misma ruta), el navegador nunca los revalida y termina
      // ejecutando JS viejo contra HTML nuevo → falsos "hydration mismatch"
      // imposibles de diagnosticar. En producción los nombres llevan hash,
      // así que esto no aplica y el caching agresivo se mantiene intacto.
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              source: '/_next/static/:path*',
              headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
            },
          ]
        : []),
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(servicios|muestrario|proyectos|tecnologias|sobre-mi|contacto|gracias)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/projects/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // CSP en modo REPORT-ONLY (auditoría 2026-09-02, docs/security/AUDIT.md).
          // No bloquea nada: cada violación se manda a /api/csp-report y queda en
          // los logs de Vercel con prefijo `[csp]`. Después de 1-2 semanas sin
          // reportes legítimos, renombrar a `Content-Security-Policy`.
          // Orígenes: gtag/Google Ads (conversiones), Meta Pixel, Supabase
          // (REST + Realtime wss), microlink (capturas en vivo de /muestrario).
          // Next inyecta scripts inline (hidratación + Speculation Rules) →
          // 'unsafe-inline' es obligatorio sin nonces. Ruido esperado: el pixel
          // ads/ga-audiences usa www.google.<ccTLD> del país del visitante.
          {
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.supabase.co https://lh3.googleusercontent.com https://analytics.google.com https://www.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.com.ar https://stats.g.doubleclick.net https://www.facebook.com https://api.microlink.io",
              "font-src 'self' data:",
              "connect-src 'self' https://osoijzjxzxdkwmobctyb.supabase.co wss://osoijzjxzxdkwmobctyb.supabase.co https://analytics.google.com https://*.analytics.google.com https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://www.google.com https://connect.facebook.net https://www.facebook.com",
              "frame-src 'self' https://td.doubleclick.net https://www.googletagmanager.com https://www.facebook.com",
              "worker-src 'self' blob:",
              'report-uri /api/csp-report',
            ].join('; '),
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // /proyectos fue renombrada a /muestrario — 301 preserva el equity de la
      // URL vieja que Google todavía tiene indexada (aparece en GSC con impresiones).
      { source: '/proyectos', destination: '/muestrario', permanent: true },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
    ],
    /**
     * `optimizeCss` (critters) NO se activa: en Next 14 solo corre para el
     * Pages Router. Verificado en el árbol instalado — `critters` se importa
     * únicamente desde `next/dist/server/post-process.js`, cuyo único llamador
     * es `next/dist/server/render.js` (el renderer de pages/). El App Router
     * pasa por `server/app-render/`, que nunca lo toca.
     * Prueba empírica: con la flag en `true`, el HTML prerenderizado de la home
     * salía con dos `<link rel="stylesheet">` bloqueantes y CERO CSS crítico
     * inline. Dejarla encendida no optimizaba nada y hacía creer que el CSS ya
     * estaba resuelto — que es justamente por qué el hallazgo de "recursos que
     * bloquean el renderizado" sobrevivió tanto en PageSpeed.
     * `critters` se desinstaló el 2026-09-02.
     */
    scrollRestoration: true,
  },

  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },
}

export default nextConfig
