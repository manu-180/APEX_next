import type { Metadata } from 'next'
import { ContactoContent } from './content'

export const metadata: Metadata = {
  title: 'Contacto | Agendá tu consulta gratis — Manuel Navarro',
  description:
    'Contratame o consultá sin compromiso. Reunión gratuita para validar tu proyecto web o app. Respondemos en menos de 24 h. Buenos Aires, Argentina.',
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
  return <ContactoContent />
}
