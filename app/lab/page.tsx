import type { Metadata } from 'next'
import { LabClient } from './lab-client'

export const metadata: Metadata = {
  // El template global agrega "| Manuel Navarro".
  title: 'Lab — experimentos 3D interactivos en vivo',
  description:
    'El laboratorio de APEX: WebGL y 3D interactivo en tiempo real. Lo que se puede construir cuando la web deja de ser plana — tocá, arrastrá, cambiá el tema.',
  keywords: [
    'web 3D argentina',
    'webgl interactivo',
    'three.js portfolio',
    'experiencias web premium',
    'diseño web 3D',
  ],
  alternates: { canonical: '/lab' },
  openGraph: {
    title: 'APEX Lab — 3D interactivo en vivo',
    description: 'Experimentos WebGL en tiempo real. Tocá, arrastrá, cambiá el tema y mirá cómo responde.',
    url: '/lab',
  },
}

export default function LabPage() {
  return <LabClient />
}
