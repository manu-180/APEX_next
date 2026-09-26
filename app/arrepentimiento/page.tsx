import type { Metadata } from 'next'
import { ROUTES } from '@/lib/constants'
import { ConsumerRequestPage } from '@/components/legal/consumer-request-page'

export const metadata: Metadata = {
  title: 'Botón de arrepentimiento',
  description:
    'Tenés 10 días corridos desde que contratás para arrepentirte, sin dar motivos y sin costo. Pedilo acá, sin registrarte.',
  alternates: { canonical: ROUTES.arrepentimiento },
  robots: { index: false, follow: true },
}

export default function ArrepentimientoPage() {
  return <ConsumerRequestPage tipo="arrepentimiento" />
}
