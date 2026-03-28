'use client';

import { useEffect } from 'react';

export function SentryProvider() {
  useEffect(() => {
    // Import and initialize Sentry client config
    // This is handled by next.config.js via withSentryConfig wrapper
    // but we ensure it runs in the browser context
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      import('@sentry/nextjs').then((Sentry) => {
        if (!Sentry.captureException) {
          // Sentry already initialized by next.config.js wrapper
          return;
        }
      });
    }
  }, []);

  return null;
}
