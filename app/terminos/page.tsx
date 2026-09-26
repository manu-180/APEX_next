import type { Metadata } from 'next'
import { ROUTES } from '@/lib/constants'
import { terminosPublicados } from '@/lib/legal/terminos'
import { TerminosPendientes, TerminosVista } from '@/components/legal/terminos-vista'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description:
    'Términos y condiciones de contratación de APEX: qué incluye tu página, cómo pagás, los cambios, el hosting, tus datos y tu derecho a arrepentirte.',
  alternates: { canonical: ROUTES.terminos },
}

export default async function TerminosPage() {
  const versiones = await terminosPublicados()
  const vigente = versiones[0]
  if (!vigente) return <TerminosPendientes />
  return <TerminosVista version={vigente} versiones={versiones} />
}
