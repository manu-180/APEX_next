import type { Metadata } from 'next'
import { ROUTES } from '@/lib/constants'
import { ConsumerRequestPage } from '@/components/legal/consumer-request-page'

export const metadata: Metadata = {
  title: 'Botón de baja de servicio',
  description:
    'Dá de baja el mantenimiento o el marketing en Google cuando quieras y sin costo. Pedilo acá, sin registrarte.',
  alternates: { canonical: ROUTES.baja },
  robots: { index: false, follow: true },
}

export default function BajaPage() {
  return <ConsumerRequestPage tipo="baja" />
}
