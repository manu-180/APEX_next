import * as THREE from 'three'
import { SVGLoader } from 'three-stdlib'
import type { ThemeId } from '@/lib/types/theme'
import { getLogoPath } from './logo-shapes'

/**
 * Lado objetivo del logo (encaja el mayor de ancho/alto). Un poco menor que el
 * ⌀ del núcleo (2.9) para que los logos altos (rayo) o cuadrados (TS) no se
 * recorten al girar dentro del frame.
 */
const TARGET_SIZE = 2.5

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 7,
  bevelEnabled: true,
  bevelThickness: 0.9,
  bevelSize: 0.55,
  bevelSegments: 3,
  curveSegments: 14,
}

/**
 * Construye una geometría 3D extruida desde el path SVG de una marca
 * (viewBox 24×24, y-abajo, relleno). Centrada en el origen y normalizada a un
 * tamaño consistente con el núcleo. Lanza si el path degenera → fallback al core.
 */
function buildLogoGeometry(d: string): THREE.BufferGeometry {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${d}"/></svg>`
  const { paths } = new SVGLoader().parse(svg)

  const shapes: THREE.Shape[] = []
  for (const p of paths) shapes.push(...SVGLoader.createShapes(p))
  if (shapes.length === 0) throw new Error('logo path produced no shapes')

  const geo = new THREE.ExtrudeGeometry(shapes, EXTRUDE)

  // SVG es y-abajo: rotar π en X lo endereza sin espejarlo (rotación propia →
  // conserva winding y normales; un scale(1,-1,1) los invertiría).
  geo.rotateX(Math.PI)
  geo.center()
  geo.computeBoundingBox()
  const bb = geo.boundingBox
  if (!bb || !Number.isFinite(bb.min.x) || !Number.isFinite(bb.max.x)) {
    throw new Error('degenerate logo geometry')
  }

  const sx = bb.max.x - bb.min.x
  const sy = bb.max.y - bb.min.y
  const scale = TARGET_SIZE / Math.max(sx, sy)
  geo.scale(scale, scale, scale)
  geo.center()
  geo.computeVertexNormals()
  return geo
}

// ── Cache de geometrías por theme (la forma no depende del color) ──
// Se construye una sola vez por sesión; volver a un theme ya visto es instantáneo.
const cache = new Map<string, THREE.BufferGeometry>()
const CORE_KEY = '__core__'

function coreGeometry(): THREE.BufferGeometry {
  let g = cache.get(CORE_KEY)
  if (!g) {
    g = new THREE.IcosahedronGeometry(1.45, 0)
    cache.set(CORE_KEY, g)
  }
  return g
}

/**
 * Geometría para el theme activo. Si tiene marca extruible devuelve su logo 3D;
 * si no (o si la extrusión falla) devuelve el núcleo icosaédrico. `isCore`
 * distingue ambos casos (para flatShading / edges / textura del material).
 */
export function getShapeGeometry(id: ThemeId): { geometry: THREE.BufferGeometry; isCore: boolean } {
  const d = getLogoPath(id)
  if (!d) return { geometry: coreGeometry(), isCore: true }

  let g = cache.get(id)
  if (!g) {
    try {
      g = buildLogoGeometry(d)
      cache.set(id, g)
    } catch {
      return { geometry: coreGeometry(), isCore: true }
    }
  }
  return { geometry: g, isCore: false }
}
