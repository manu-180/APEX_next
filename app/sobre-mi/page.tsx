import { existsSync } from 'node:fs'
import { join } from 'node:path'
import type { Metadata } from 'next'
import { SobreMiContent } from './content'

export const metadata: Metadata = {
  title: 'Sobre mí | Dev Full-Stack en Buenos Aires',
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

/**
 * Chequeo estático en build/render del server: si `public/manuel.jpg` no existe,
 * el cliente ni intenta cargar la foto y muestra el avatar "MN" — sin 404 ni broken image.
 * TODO Manuel: subir public/manuel.jpg (foto real, cuadrada, ~640px).
 */
const HAS_FOUNDER_PHOTO = existsSync(join(process.cwd(), 'public', 'manuel.jpg'))

/**
 * Años de experiencia calculados en el SERVER y pasados como prop: el cliente
 * ya no llama a `new Date()` en scope de módulo, así el HTML del server y la
 * hidratación siempre coinciden (fix del mismatch en el cambio de año).
 */
const YEARS_EXP = new Date().getFullYear() - 2021

export default function SobreMiPage() {
  return <SobreMiContent hasFounderPhoto={HAS_FOUNDER_PHOTO} yearsExp={YEARS_EXP} />
}
