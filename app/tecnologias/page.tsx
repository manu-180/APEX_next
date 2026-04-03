import type { Metadata } from 'next'
import { TecnologiasContent } from './content'

export const metadata: Metadata = {
  title: { absolute: 'Tecnologías | APEX' },
  description:
    'Flutter, Next.js, Supabase, Riverpod, TypeScript y Tailwind: el stack que uso para apps móviles, backends en tiempo real y experiencias web de alto rendimiento.',
  keywords: [
    'Flutter',
    'Next.js',
    'Supabase',
    'Riverpod',
    'TypeScript',
    'Tailwind CSS',
    'stack técnico',
    'desarrollo full stack',
  ],
}

export default function TecnologiasPage() {
  return <TecnologiasContent />
}
