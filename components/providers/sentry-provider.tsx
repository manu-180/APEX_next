'use client';

import { useEffect } from 'react';

/**
 * Inicializa Sentry dynamically (no impacta el bundle inicial).
 * Solo se ejecuta si NEXT_PUBLIC_SENTRY_DSN está configurado.
 */
export function SentryProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    }).requestIdleCallback;

    const init = async () => {
      try {
        const Sentry = await import('@sentry/nextjs');
        Sentry.init({
          dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
          tracesSampleRate: 0.1,
          environment: process.env.NODE_ENV,
          debug: false,
          beforeSend(event) {
            if (process.env.NODE_ENV === 'development') return null;
            return event;
          },
        });
      } catch {
        // Silent: si falla la carga de Sentry, no rompemos el sitio.
      }
    };

    if (typeof ric === 'function') {
      ric(() => { void init(); }, { timeout: 5000 });
    } else {
      window.setTimeout(() => { void init(); }, 3000);
    }
  }, []);

  return null;
}
