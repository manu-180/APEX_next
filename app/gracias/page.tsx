import type { Metadata } from 'next'
import { GraciasContent } from './content'

export const metadata: Metadata = {
  title: 'Gracias por tu consulta | APEX',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return <GraciasContent />
}
