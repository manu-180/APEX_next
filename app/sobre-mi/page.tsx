import type { Metadata } from 'next'
import { SobreMiContent } from './content'

export const metadata: Metadata = {
  title: 'Sobre Mí',
  description: 'Manuel Navarro — 3 años de experiencia en desarrollo Full-Stack & Mobile con Flutter, Supabase y Riverpod.',
}

export default function SobreMiPage() {
  return <SobreMiContent />
}
