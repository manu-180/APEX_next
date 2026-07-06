/**
 * Artefactos 3D generados con Meshy AI (texto → 3D) y optimizados a GLB
 * (texturas webp + quantize) — 0.6–1.2 MB c/u. Metadata liviana (sin three),
 * importable desde componentes no-WebGL sin arrastrar el bundle 3D.
 */
export interface Artifact {
  id: string
  name: string
  tag: string
  file: string
  scale: number
  blurb: string
}

export const ARTIFACTS: readonly Artifact[] = [
  {
    id: 'monolith',
    name: 'Monolith',
    tag: 'obelisco',
    file: '/models/apex-monolith.glb',
    scale: 2.1,
    blurb: 'Un obelisco facetado de metal y vidrio oscuro.',
  },
  {
    id: 'orb',
    name: 'Core',
    tag: 'reactor',
    file: '/models/apex-core-orb.glb',
    scale: 1.7,
    blurb: 'Un núcleo esférico con anillos concéntricos.',
  },
  {
    id: 'craft',
    name: 'Craft',
    tag: 'nave',
    file: '/models/apex-craft.glb',
    scale: 2.0,
    blurb: 'Una nave aeroespacial de silueta afilada.',
  },
  {
    id: 'gem',
    name: 'Gem',
    tag: 'cristal',
    file: '/models/apex-gem.glb',
    scale: 2.0,
    blurb: 'Una gema de facetas precisas y refracción interna.',
  },
] as const
