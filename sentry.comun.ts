export const SENTRY_DSN =
  'https://d8addd0b60bf958218ff3b539193aa5c@o4512158652039168.ingest.us.sentry.io/4512158723211264';

export const sentryActivo = process.env.NODE_ENV === 'production';

export const sentryEntorno = process.env.VERCEL_ENV ?? 'development';

// Los formularios de contacto traen nombre, teléfono y la idea del lead: se
// manda el error y el stack, nada más.
export const sentryDatos = {
  userInfo: false,
  cookies: false,
  httpHeaders: false,
  httpBodies: [],
  urlQueryParams: false,
  genAI: { inputs: false, outputs: false },
  databaseQueryData: false,
  queues: false,
  stackFrameVariables: false,
};
