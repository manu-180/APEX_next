/**
 * Museo de casos — metadata liviana (sin three) para los slabs 3D del /lab.
 * Deriva de SHOWCASE_TIERS (lib/data/showcase.ts): misma fuente de verdad que
 * la sección "Prueba real" de /servicios, así los casos nunca divergen.
 */
import { SHOWCASE_TIERS } from '@/lib/data/showcase'

export interface MuseumCase {
  slug: string
  name: string
  domain: string
  url: string
  /** Screenshot 16:10 (mismo asset que /servicios). */
  image: string
  /** Nivel de inversión al que pertenece (I / II / III). */
  tierNumeral: string
  tierLabel: string
  blurb: string
}

export const MUSEUM_CASES: readonly MuseumCase[] = SHOWCASE_TIERS.flatMap((tier) =>
  tier.sites.map((site) => ({
    slug: site.slug,
    name: site.name,
    domain: site.domain,
    url: site.url,
    image: site.image ?? `/projects/showcase/${site.slug}.webp`,
    tierNumeral: tier.numeral,
    tierLabel: tier.label,
    blurb: site.blurb,
  })),
)
