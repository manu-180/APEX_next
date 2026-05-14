'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { PostHog } from 'posthog-js';

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthogInstance: PostHog | null = null;
let posthogLoadPromise: Promise<PostHog | null> | null = null;
let interactionDetected = false;

const FIRST_INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'touchstart',
  'keydown',
  'scroll',
  'mousemove',
];

function loadPosthog(): Promise<PostHog | null> {
  if (posthogInstance) return Promise.resolve(posthogInstance);
  if (!posthogToken || typeof window === 'undefined') return Promise.resolve(null);
  if (posthogLoadPromise) return posthogLoadPromise;

  posthogLoadPromise = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(posthogToken, {
      api_host: posthogHost,
      person_profiles: 'identified_only',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: false,
      disable_session_recording: true,
      loaded: (ph) => {
        if (process.env.NODE_ENV === 'development') ph.debug();
      },
    });
    posthogInstance = posthog;
    return posthog;
  });

  return posthogLoadPromise;
}

function whenFirstInteraction(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  if (interactionDetected) {
    cb();
    return () => {};
  }
  let invoked = false;
  const handler = () => {
    if (invoked) return;
    invoked = true;
    interactionDetected = true;
    FIRST_INTERACTION_EVENTS.forEach((evt) =>
      window.removeEventListener(evt, handler, { capture: true } as EventListenerOptions),
    );
    if (timer != null) window.clearTimeout(timer);
    cb();
  };
  FIRST_INTERACTION_EVENTS.forEach((evt) =>
    window.addEventListener(evt, handler, { passive: true, capture: true, once: false }),
  );
  // Failsafe: si no hay interacción en 15s, cargamos igual.
  const timer = window.setTimeout(handler, 15000);
  return () => {
    if (timer != null) window.clearTimeout(timer);
    FIRST_INTERACTION_EVENTS.forEach((evt) =>
      window.removeEventListener(evt, handler, { capture: true } as EventListenerOptions),
    );
  };
}

export function PostHogPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || typeof window === 'undefined' || !posthogToken) return;
    loadPosthog().then((ph) => {
      if (!ph) return;
      const url = window.location.origin + pathname + window.location.search;
      ph.capture('$pageview', { $current_url: url });
    });
  }, [pathname]);

  return null;
}

/**
 * PostHog se carga después de la PRIMERA interacción del usuario o tras
 * 15s sin interacción (failsafe). Ningún JS de analytics pesa en el LCP/FCP.
 */
export function PostHogProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!posthogToken) return;
    return whenFirstInteraction(() => {
      void loadPosthog();
    });
  }, []);

  return <>{children}</>;
}
