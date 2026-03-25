import type { Metadata } from 'next'
import { ContactoContent } from './content'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Agendá una reunión gratuita con Manuel Navarro para validar tu idea de proyecto.',
}

export default function ContactoPage() {
  return <ContactoContent />
}
