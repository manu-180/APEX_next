import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { terminosPublicados } from '@/lib/legal/terminos'
import { TerminosVista } from '@/components/legal/terminos-vista'

export const revalidate = 600
export const dynamicParams = true

const ETIQUETA_VALIDA = /^[a-z0-9][a-z0-9._-]{0,31}$/i

export async function generateStaticParams() {
  const versiones = await terminosPublicados()
  return versiones.map((v) => ({ version: v.etiqueta }))
}

export async function generateMetadata({ params }: { params: { version: string } }): Promise<Metadata> {
  const etiqueta = decodeURIComponent(params.version)
  return {
    title: `Términos y condiciones, versión ${etiqueta}`,
    alternates: { canonical: `${ROUTES.terminos}/${encodeURIComponent(etiqueta)}` },
    robots: { index: false, follow: true },
  }
}

export default async function TerminosVersionPage({ params }: { params: { version: string } }) {
  const etiqueta = decodeURIComponent(params.version)
  if (!ETIQUETA_VALIDA.test(etiqueta)) notFound()
  const versiones = await terminosPublicados()
  const version = versiones.find((v) => v.etiqueta === etiqueta)
  if (!version) notFound()
  return <TerminosVista version={version} versiones={versiones} />
}
