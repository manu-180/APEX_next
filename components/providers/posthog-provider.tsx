'use client';

import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import type { PostHog } from 'posthog-js';

const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

let posthogInstance: PostHog | null = null;
let posthogLoadPromise: Promise<PostHog | null> | null = null;

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

function whenIdle(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const ric = (window as Window & {
    requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    cancelIdleCallback?: (handle: number) => void;
  }).requestIdleCallback;
  if (typeof ric === 'function') {
    const id = ric(() => cb(), { timeout: 3000 });
    return () => {
      const cic = (window as Window & {
        cancelIdleCallback?: (handle: number) => void;
      }).cancelIdleCallback;
      if (typeof cic === 'function') cic(id);
    };
  }
  const t = window.setTimeout(cb, 2000);
  return () => window.clearTimeout(t);
}

function PostHogPageViewInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname || typeof window === 'undefined' || !posthogToken) return;
    loadPosthog().then((ph) => {
      if (!ph) return;
      let url = window.location.origin + pathname;
      const q = searchParams?.toString();
      if (q) url += `?${q}`;
      ph.capture('$pageview', { $current_url: url });
    });
  }, [pathname, searchParams]);

  return null;
}

export function PostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageViewInner />
    </Suspense>
  );
}

export function PostHogProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!posthogToken) return;
    const cancel = whenIdle(() => {
      loadPosthog().then(() => setReady(true));
    });
    return cancel;
  }, []);

  // En vez de cargar el provider de posthog-js/react al inicio (~50KB),
  // diferimos completamente hasta que el browser quede idle.
  // Los children se renderizan inmediatamente sin esperar al provider.
  if (!ready) return <>{children}</>;

  return <PosthogProviderLazy>{children}</PosthogProviderLazy>;
}

function PosthogProviderLazy({ children }: { children: React.ReactNode }) {
  const [Provider, setProvider] = useState<React.ComponentType<{
    client: PostHog;
    children: React.ReactNode;
  }> | null>(null);

  useEffect(() => {
    import('posthog-js/react').then((mod) => {
      setProvider(() => mod.PostHogProvider);
    });
  }, []);

  if (!Provider || !posthogInstance) return <>{children}</>;
  return <Provider client={posthogInstance}>{children}</Provider>;
}
