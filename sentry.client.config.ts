// Sentry client-side configuration
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  debug: false,
  beforeSend(event, hint) {
    // Filter out errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
