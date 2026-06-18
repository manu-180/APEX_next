import type { Metadata } from 'next'
import { MuestrarioHero } from './muestrario-hero'
import { MuestrarioGallery } from './muestrario-gallery'
import { MuestrarioCta } from './muestrario-cta'
import { getLabDemos, LAB_REVALIDATE_SECONDS } from '@/lib/data/lab-demos'
import { SHOWCASE_TIERS } from '@/lib/data/showcase'

export const metadata: Metadata = {
  title: 'Muestrario — sitios reales en vivo',
  description:
    'Galería de sitios web hechos por APEX: productos propios y clientes reales en producción, más un laboratorio de diseño que suma un sitio premium nuevo cada semana. Abrí cualquiera en vivo.',
  keywords: [
    'muestrario diseño web',
    'portfolio desarrollo web argentina',
    'ejemplos páginas web',
    'diseño web premium',
    'sitios web en vivo',
    'next.js portfolio',
  ],
  alternates: { canonical: '/muestrario' },
  openGraph: {
    title: 'Muestrario APEX — sitios reales en vivo',
    description:
      'Sitios en producción + un laboratorio de diseño que crece solo cada semana. Abrí cualquiera y tocalo.',
    url: '/muestrario',
  },
}

/** ISR: la grilla del laboratorio se re-consulta sola cada media hora. */
export const revalidate = 1800

// Mantener alineado con el fetch de getLabDemos (documenta la intención).
void LAB_REVALIDATE_SECONDS

export default async function MuestrarioPage() {
  const demos = await getLabDemos()
  const produccionCount = new Set(
    SHOWCASE_TIERS.flatMap((t) => t.sites.map((s) => s.slug)),
  ).size

  return (
    <>
      <MuestrarioHero totalCount={produccionCount + demos.length} labCount={demos.length} />
      <MuestrarioGallery demos={demos} />
      <MuestrarioCta />
    </>
  )
}
