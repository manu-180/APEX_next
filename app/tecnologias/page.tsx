import type { Metadata } from 'next'
import { TecnologiasContent } from './content'

export const metadata: Metadata = {
  title: 'Stack tecnológico | Flutter, Next.js y Supabase | Manuel Navarro',
  description:
    'Flutter, Next.js, Supabase, Riverpod y TypeScript: el stack que elijo para apps móviles y webs rápidas en Argentina. Cada tecnología tiene una razón de ser.',
  keywords: [
    'flutter developer argentina',
    'next.js developer argentina',
    'supabase argentina',
    'stack flutter next.js',
    'TypeScript',
    'Tailwind CSS',
    'desarrollo full stack argentina',
    'apps móviles flutter',
  ],
  alternates: { canonical: '/tecnologias' },
}

export default function TecnologiasPage() {
  return <TecnologiasContent />
}
