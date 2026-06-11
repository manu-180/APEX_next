import type { Metadata } from 'next'
import { SobreMiContent } from './content'

export const metadata: Metadata = {
  title: 'Sobre mí | Manuel Navarro — Dev Full-Stack en Buenos Aires',
  description:
    'El mismo que diseña, programa y entrega tu proyecto de principio a fin. Sin agencias, sin intermediarios. Web y apps para PyMEs argentinas que quieren vender. 1-2 clientes por vez.',
  keywords: [
    'desarrollador web Buenos Aires',
    'programador freelance Argentina',
    'Manuel Navarro desarrollador',
    'dev full stack argentina',
    'flutter next.js developer argentina',
  ],
  alternates: { canonical: '/sobre-mi' },
}

export default function SobreMiPage() {
  return <SobreMiContent />
}
