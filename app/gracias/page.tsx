import type { Metadata } from 'next'
import { GraciasContent } from './content'

export const metadata: Metadata = {
  title: '¡Recibimos tu consulta! | APEX',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return <GraciasContent />
}
