import type { Metadata } from 'next'
import { SobreMiContent } from './content'

export const metadata: Metadata = {
  title: 'Sobre mí — Por qué existe APEX',
  description:
    'Manuel Navarro. No soy agencia. Hago web y apps móviles para PyMEs argentinas que necesitan vender. Stack: Flutter, Next.js, Supabase. Trabajo con 1-2 clientes por vez.',
}

export default function SobreMiPage() {
  return <SobreMiContent />
}
