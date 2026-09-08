import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { YEARS_EXP } from '@/lib/constants'
import { SobreMiContent } from './content'
import { TopLevelBreadcrumbJsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  title: 'Manuel Navarro — dev full-stack en Buenos Aires',
  description:
    'El mismo que diseña, programa y entrega tu proyecto de principio a fin. Sin agencias ni intermediarios: web y apps para PyMEs argentinas, 1 o 2 clientes por vez.',
  keywords: [
    'desarrollador web Buenos Aires',
    'programador freelance Argentina',
    'Manuel Navarro desarrollador',
    'dev full stack argentina',
    'flutter next.js developer argentina',
  ],
  alternates: { canonical: '/sobre-mi' },
}

/**
 * Chequeo estático en build/render del server: si `public/manuel.jpg` no existe,
 * el cliente ni intenta cargar la foto y muestra el avatar "MN" — sin 404 ni broken image.
 * TODO Manuel: subir public/manuel.jpg (foto real, cuadrada, ~640px).
 */
const HAS_FOUNDER_PHOTO = existsSync(join(process.cwd(), 'public', 'manuel.jpg'))

export default function SobreMiPage() {
  return (
    <>
      <TopLevelBreadcrumbJsonLd name="Sobre mí" path="/sobre-mi" />
      <SobreMiContent hasFounderPhoto={HAS_FOUNDER_PHOTO} yearsExp={YEARS_EXP} />
    </>
  )
}
