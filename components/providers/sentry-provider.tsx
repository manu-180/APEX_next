'use client';

import { useEffect } from 'react';

const FIRST_INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'touchstart',
  'keydown',
  'scroll',
  'mousemove',
];

/**
 * Sentry se inicializa dynamically tras la primera interacción del usuario
 * (o 20s después como failsafe). No impacta el bundle inicial ni el critical path.
 */
export function SentryProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;

    let triggered = false;

    const init = async () => {
      if (triggered) return;
      triggered = true;
      cleanup();
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
        // Si falla, no rompemos el sitio.
      }
    };

    const cleanup = () => {
      FIRST_INTERACTION_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, init, { capture: true } as EventListenerOptions),
      );
      if (timer != null) window.clearTimeout(timer);
    };

    FIRST_INTERACTION_EVENTS.forEach((evt) =>
      window.addEventListener(evt, init, { passive: true, capture: true }),
    );
    const timer = window.setTimeout(init, 20000);

    return cleanup;
  }, []);

  return null;
}
