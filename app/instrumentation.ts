/**
 * Server-side instrumentation.
 * Sentry se inicializa dynamically solo si NEXT_PUBLIC_SENTRY_DSN está configurado.
 * Esto evita arrastrar el SDK al bundle cuando no se usa.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  const Sentry = await import('@sentry/nextjs')
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    environment: process.env.NODE_ENV,
    debug: false,
  })
}
