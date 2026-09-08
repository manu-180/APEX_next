import type { Metadata } from 'next'
import { ContactoContent } from './content'
import { TopLevelBreadcrumbJsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Contacto — agendá tu consulta gratis',
  description:
    'Contratame o consultá sin compromiso. Reunión gratuita para validar tu proyecto web o app. Te respondo en menos de 1 hora. Buenos Aires, Argentina.',
  keywords: [
    'contratar desarrollador web argentina',
    'consulta gratis desarrollo web',
    'presupuesto app móvil argentina',
    'contactar programador freelance',
    'Manuel Navarro contacto',
  ],
  alternates: { canonical: '/contacto' },
}

export default function ContactoPage() {
  return (
    <>
      <TopLevelBreadcrumbJsonLd name="Contacto" path="/contacto" />
      <ContactoContent />
    </>
  )
}
