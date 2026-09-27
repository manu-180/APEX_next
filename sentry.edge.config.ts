import * as Sentry from '@sentry/nextjs';

import { SENTRY_DSN, sentryActivo, sentryDatos, sentryEntorno } from './sentry.comun';

Sentry.init({
  dsn: SENTRY_DSN,
  enabled: sentryActivo,
  environment: sentryEntorno,
  tracesSampleRate: 0.1,
  dataCollection: sentryDatos,
});
