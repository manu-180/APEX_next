/**
 * Muestrario 3D — 40 artefactos generados con Meshy AI (texto → 3D),
 * optimizados a GLB (webp + quantize, ~0.6–1.2 MB) y agrupados en 5 categorías.
 *
 * Metadata liviana (sin three) → importable desde componentes no-WebGL sin
 * arrastrar el bundle 3D. Cada pieza tiene un `thumb` (webp liviano) para las
 * cards del selector; el `file` (GLB pesado) se carga sólo al elegir la pieza.
 *
 * FUENTE HERMANA: scripts/meshy/roster.mjs (prompts de generación). Mantener
 * los `name`/categorías en sync al agregar o quitar piezas.
 */

export type CategoryId = 'reliquias' | 'cosmos' | 'fantasia' | 'criaturas' | 'flora'

export interface Category {
  id: CategoryId
  label: string
  kicker: string
  blurb: string
  /** Acento fijo de identidad (hex). Se usa con mesura sobre el tema activo. */
  accent: string
}

export interface Artifact {
  id: string
  name: string
  tag: string
  category: CategoryId
  file: string
  thumb: string
  scale: number
  blurb: string
}

export const CATEGORIES: readonly Category[] = [
  {
    id: 'reliquias',
    label: 'Reliquias',
    kicker: 'tech · artefacto',
    blurb: 'Objetos de metal cepillado y vidrio oscuro. La línea insignia.',
    accent: '#8EA2FF',
  },
  {
    id: 'cosmos',
    label: 'Cosmos',
    kicker: 'espacio',
    blurb: 'Naves, estaciones y cuerpos orbitales. Sci-fi limpio.',
    accent: '#5CC8FF',
  },
  {
    id: 'fantasia',
    label: 'Fantasía',
    kicker: 'mito · arcano',
    blurb: 'Reliquias encantadas: oro, gemas y runas grabadas.',
    accent: '#C79BFF',
  },
  {
    id: 'criaturas',
    label: 'Criaturas',
    kicker: 'fauna',
    blurb: 'Bestias esculpidas, de dragones a medusas etéreas.',
    accent: '#F5A25D',
  },
  {
    id: 'flora',
    label: 'Flora',
    kicker: 'botánica',
    blurb: 'Botánica premium en cristal, jade y bioluminiscencia.',
    accent: '#5FD9A6',
  },
] as const

/** Helper local para no repetir las rutas en cada entrada. */
const glb = (n: string) => `/models/${n}.glb`
const thumb = (n: string) => `/models/thumbs/${n}.webp`

export const ARTIFACTS: readonly Artifact[] = [
  // ─────────── RELIQUIAS ───────────
  { id: 'monolith', name: 'Monolith', tag: 'obelisco', category: 'reliquias', file: glb('apex-monolith'), thumb: thumb('apex-monolith'), scale: 1, blurb: 'Un obelisco facetado de metal y vidrio oscuro.' },
  { id: 'core', name: 'Core', tag: 'reactor', category: 'reliquias', file: glb('apex-core-orb'), thumb: thumb('apex-core-orb'), scale: 1, blurb: 'Un núcleo esférico con anillos concéntricos.' },
  { id: 'gem', name: 'Gem', tag: 'cristal', category: 'reliquias', file: glb('apex-gem'), thumb: thumb('apex-gem'), scale: 1, blurb: 'Una gema de facetas precisas y refracción interna.' },
  { id: 'sarcofago', name: 'Sarcófago', tag: 'cápsula', category: 'reliquias', file: glb('apex-reliquia-sarcofago'), thumb: thumb('apex-reliquia-sarcofago'), scale: 1, blurb: 'Cápsula criogénica sellada por una costura de luz.' },
  { id: 'sello', name: 'Sello', tag: 'sigilo', category: 'reliquias', file: glb('apex-reliquia-sello'), thumb: thumb('apex-reliquia-sello'), scale: 1, blurb: 'Disco-sigilo con anillos mecánicos grabados.' },
  { id: 'reactor', name: 'Reactor', tag: 'doble anillo', category: 'reliquias', file: glb('apex-reliquia-reactor'), thumb: thumb('apex-reliquia-reactor'), scale: 1, blurb: 'Doble anillo giroscópico sobre una esfera de energía.' },
  { id: 'prisma', name: 'Prisma', tag: 'tótem', category: 'reliquias', file: glb('apex-reliquia-prisma'), thumb: thumb('apex-reliquia-prisma'), scale: 1, blurb: 'Tótem-prisma de vidrio oscuro con borde encendido.' },
  { id: 'nucleo', name: 'Núcleo', tag: 'dodecaedro', category: 'reliquias', file: glb('apex-reliquia-nucleo'), thumb: thumb('apex-reliquia-nucleo'), scale: 1, blurb: 'Dodecaedro de titanio con costuras luminosas.' },

  // ─────────── COSMOS ───────────
  { id: 'craft', name: 'Craft', tag: 'nave', category: 'cosmos', file: glb('apex-craft'), thumb: thumb('apex-craft'), scale: 1, blurb: 'Una nave aeroespacial de silueta afilada.' },
  { id: 'estacion', name: 'Estación', tag: 'orbital', category: 'cosmos', file: glb('apex-cosmos-estacion'), thumb: thumb('apex-cosmos-estacion'), scale: 1, blurb: 'Estación orbital modular con paneles solares.' },
  { id: 'sonda', name: 'Sonda', tag: 'explorador', category: 'cosmos', file: glb('apex-cosmos-sonda'), thumb: thumb('apex-cosmos-sonda'), scale: 1, blurb: 'Sonda de espacio profundo con antena parabólica.' },
  { id: 'casco', name: 'Casco', tag: 'astronauta', category: 'cosmos', file: glb('apex-cosmos-casco'), thumb: thumb('apex-cosmos-casco'), scale: 1, blurb: 'Casco de astronauta con visor dorado.' },
  { id: 'planeta', name: 'Planeta', tag: 'anillado', category: 'cosmos', file: glb('apex-cosmos-planeta'), thumb: thumb('apex-cosmos-planeta'), scale: 1, blurb: 'Planeta anillado de superficie mate y aro elegante.' },
  { id: 'satelite', name: 'Satélite', tag: 'órbita', category: 'cosmos', file: glb('apex-cosmos-satelite'), thumb: thumb('apex-cosmos-satelite'), scale: 1, blurb: 'Satélite de comunicaciones compacto.' },
  { id: 'modulo', name: 'Módulo', tag: 'lunar', category: 'cosmos', file: glb('apex-cosmos-modulo'), thumb: thumb('apex-cosmos-modulo'), scale: 1, blurb: 'Módulo lunar de foil dorado sobre patas.' },
  { id: 'rover', name: 'Rover', tag: 'explorador', category: 'cosmos', file: glb('apex-cosmos-rover'), thumb: thumb('apex-cosmos-rover'), scale: 1, blurb: 'Rover explorador de seis ruedas articuladas.' },

  // ─────────── FANTASÍA ───────────
  { id: 'espada', name: 'Espada', tag: 'rúnica', category: 'fantasia', file: glb('apex-fantasia-espada'), thumb: thumb('apex-fantasia-espada'), scale: 1, blurb: 'Espada rúnica de acero pulido y pomo de gema.' },
  { id: 'amuleto', name: 'Amuleto', tag: 'arcano', category: 'fantasia', file: glb('apex-fantasia-amuleto'), thumb: thumb('apex-fantasia-amuleto'), scale: 1, blurb: 'Amuleto de filigrana de oro y gema encendida.' },
  { id: 'cofre', name: 'Cofre', tag: 'tesoro', category: 'fantasia', file: glb('apex-fantasia-cofre'), thumb: thumb('apex-fantasia-cofre'), scale: 1, blurb: 'Cofre del tesoro con herrajes de oro y joya.' },
  { id: 'cristal', name: 'Cristal', tag: 'maná', category: 'fantasia', file: glb('apex-fantasia-cristal'), thumb: thumb('apex-fantasia-cristal'), scale: 1, blurb: 'Racimo de cristal de maná con luz interior.' },
  { id: 'yelmo', name: 'Yelmo', tag: 'caballero', category: 'fantasia', file: glb('apex-fantasia-casco'), thumb: thumb('apex-fantasia-casco'), scale: 1, blurb: 'Yelmo de caballero grabado con penacho.' },
  { id: 'grimorio', name: 'Grimorio', tag: 'tomo', category: 'fantasia', file: glb('apex-fantasia-grimorio'), thumb: thumb('apex-fantasia-grimorio'), scale: 1, blurb: 'Tomo arcano con broche de gema y esquinas de oro.' },
  { id: 'corona', name: 'Corona', tag: 'real', category: 'fantasia', file: glb('apex-fantasia-corona'), thumb: thumb('apex-fantasia-corona'), scale: 1, blurb: 'Corona real de oro con gemas incrustadas.' },
  { id: 'portal', name: 'Portal', tag: 'arco rúnico', category: 'fantasia', file: glb('apex-fantasia-portal'), thumb: thumb('apex-fantasia-portal'), scale: 1, blurb: 'Arco de piedra rúnica con campo de energía.' },

  // ─────────── CRIATURAS ───────────
  { id: 'dragon', name: 'Dragón', tag: 'wyrm', category: 'criaturas', file: glb('apex-criatura-dragon'), thumb: thumb('apex-criatura-dragon'), scale: 1, blurb: 'Dragón enroscado de escamas metálicas.' },
  { id: 'fenix', name: 'Fénix', tag: 'ave', category: 'criaturas', file: glb('apex-criatura-fenix'), thumb: thumb('apex-criatura-fenix'), scale: 1, blurb: 'Fénix de plumas iridiscentes, alas abiertas.' },
  { id: 'bestia', name: 'Bestia', tag: 'mecánica', category: 'criaturas', file: glb('apex-criatura-bestia'), thumb: thumb('apex-criatura-bestia'), scale: 1, blurb: 'Guardián-pantera mecánico de costuras encendidas.' },
  { id: 'pez', name: 'Pez abisal', tag: 'biolumi', category: 'criaturas', file: glb('apex-criatura-pez'), thumb: thumb('apex-criatura-pez'), scale: 1, blurb: 'Pez abisal translúcido y bioluminiscente.' },
  { id: 'escarabajo', name: 'Escarabajo', tag: 'metal', category: 'criaturas', file: glb('apex-criatura-escarabajo'), thumb: thumb('apex-criatura-escarabajo'), scale: 1, blurb: 'Escarabajo de caparazón iridiscente pulido.' },
  { id: 'buho', name: 'Búho', tag: 'cristal', category: 'criaturas', file: glb('apex-criatura-buho'), thumb: thumb('apex-criatura-buho'), scale: 1, blurb: 'Búho de cristal facetado y acentos metálicos.' },
  { id: 'lobo', name: 'Lobo', tag: 'espectral', category: 'criaturas', file: glb('apex-criatura-lobo'), thumb: thumb('apex-criatura-lobo'), scale: 1, blurb: 'Lobo espectral de cuerpo etéreo y translúcido.' },
  { id: 'medusa', name: 'Medusa', tag: 'etérea', category: 'criaturas', file: glb('apex-criatura-medusa'), thumb: thumb('apex-criatura-medusa'), scale: 1, blurb: 'Medusa etérea de campana luminosa y tentáculos.' },

  // ─────────── FLORA ───────────
  { id: 'flor', name: 'Flor', tag: 'cristal', category: 'flora', file: glb('apex-flora-flor'), thumb: thumb('apex-flora-flor'), scale: 1, blurb: 'Flor de vidrio con pétalos translúcidos.' },
  { id: 'bonsai', name: 'Bonsái', tag: 'luminoso', category: 'flora', file: glb('apex-flora-bonsai'), thumb: thumb('apex-flora-bonsai'), scale: 1, blurb: 'Bonsái de hojas de cristal encendidas.' },
  { id: 'hongo', name: 'Hongo', tag: 'biolumi', category: 'flora', file: glb('apex-flora-hongo'), thumb: thumb('apex-flora-hongo'), scale: 1, blurb: 'Hongos bioluminiscentes de sombreros translúcidos.' },
  { id: 'suculenta', name: 'Suculenta', tag: 'jade', category: 'flora', file: glb('apex-flora-suculenta'), thumb: thumb('apex-flora-suculenta'), scale: 1, blurb: 'Suculenta de jade con bordes dorados.' },
  { id: 'loto', name: 'Loto', tag: 'dorado', category: 'flora', file: glb('apex-flora-loto'), thumb: thumb('apex-flora-loto'), scale: 1, blurb: 'Loto de oro pulido sobre una hoja de agua.' },
  { id: 'cactus', name: 'Cactus', tag: 'florecido', category: 'flora', file: glb('apex-flora-cactus'), thumb: thumb('apex-flora-cactus'), scale: 1, blurb: 'Cactus florecido en maceta de cerámica.' },
  { id: 'helecho', name: 'Helecho', tag: 'cristalino', category: 'flora', file: glb('apex-flora-helecho'), thumb: thumb('apex-flora-helecho'), scale: 1, blurb: 'Fronda de helecho en vidrio cristalino.' },
  { id: 'orquidea', name: 'Orquídea', tag: 'exótica', category: 'flora', file: glb('apex-flora-orquidea'), thumb: thumb('apex-flora-orquidea'), scale: 1, blurb: 'Orquídea exótica de pétalos iridiscentes.' },
] as const

/** Piezas de una categoría, en orden de definición. */
export function artifactsOf(cat: CategoryId): Artifact[] {
  return ARTIFACTS.filter((a) => a.category === cat)
}
