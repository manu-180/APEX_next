// Next.js instrumentation hook - runs on server startup
import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_ENV === 'production') {
    await Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
    });
  }
}
