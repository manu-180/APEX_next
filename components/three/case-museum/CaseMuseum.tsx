'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MUSEUM_CASES, type MuseumCase } from '@/lib/three/museum'

/**
 * Museo de casos — los sitios reales de /servicios flotando como piezas 3D.
 *
 * Cada caso es un "slab" de tres capas (placa trasera + screenshot + barra de
 * browser) suspendido en un espacio oscuro. Hover: el slab se agranda, rota
 * hacia el cursor y las capas se separan en Z (parallax real de profundidad).
 * Click/tap abre el sitio en producción — misma promesa que la sección 2D.
 *
 * Mismo ADN que ApexCore/MeshyShowroom:
 *  - client-only (dynamic ssr:false desde lab-client) + IO para montar
 *  - prefers-reduced-motion: sin bobbing idle; el hover (user-initiated) queda
 *  - frameloop pausa con la pestaña oculta
 *  - theme-reactive: la luz y el glow del slab activo respiran el primary
 */

MUSEUM_CASES.forEach((c) => useTexture.preload(c.image))

/** Aspect 16:10 — mismo ratio que los screenshots de /servicios. */
const SLAB_W = 1.6
const SLAB_H = 1.0

interface SlabSpot {
  x: number
  y: number
  z: number
  rotY: number
  rotX: number
}

/** Layout desktop: dos filas (4 + 3) con jitter de museo. Unidades three. */
const LAYOUT_WIDE: SlabSpot[] = [
  { x: -2.62, y: 0.68, z: -0.16, rotY: 0.14, rotX: -0.02 },
  { x: -0.88, y: 0.76, z: 0.1, rotY: 0.05, rotX: 0.03 },
  { x: 0.88, y: 0.7, z: -0.22, rotY: -0.06, rotX: -0.02 },
  { x: 2.62, y: 0.78, z: 0.04, rotY: -0.14, rotX: 0.02 },
  { x: -1.75, y: -0.58, z: 0.16, rotY: 0.1, rotX: 0.04 },
  { x: 0, y: -0.66, z: -0.1, rotY: 0, rotX: -0.03 },
  { x: 1.75, y: -0.6, z: 0.2, rotY: -0.1, rotX: 0.04 },
]

/** Layout mobile/vertical: dos columnas × cuatro filas. */
const LAYOUT_NARROW: SlabSpot[] = [
  { x: -0.92, y: 1.98, z: -0.1, rotY: 0.1, rotX: 0 },
  { x: 0.92, y: 1.72, z: 0.08, rotY: -0.1, rotX: 0 },
  { x: -0.92, y: 0.62, z: 0.12, rotY: 0.08, rotX: 0 },
  { x: 0.92, y: 0.36, z: -0.12, rotY: -0.08, rotX: 0 },
  { x: -0.92, y: -0.74, z: -0.08, rotY: 0.1, rotX: 0 },
  { x: 0.92, y: -1.0, z: 0.1, rotY: -0.1, rotX: 0 },
  { x: 0, y: -2.08, z: 0.05, rotY: 0, rotX: 0 },
]

/** Bounding box (w, h) de cada layout para el fit-to-viewport. */
const BOUNDS = {
  wide: { w: 7.0, h: 2.6 },
  narrow: { w: 3.5, h: 5.2 },
} as const

function Slab({
  data,
  spot,
  index,
  hex,
  reduced,
  hovered,
  onHover,
}: {
  data: MuseumCase
  spot: SlabSpot
  index: number
  hex: string
  reduced: boolean
  hovered: boolean
  onHover: (i: number | null) => void
}) {
  const group = useRef<THREE.Group>(null!)
  const inner = useRef<THREE.Group>(null!)
  const back = useRef<THREE.Mesh>(null!)
  const bar = useRef<THREE.Group>(null!)
  const backMat = useRef<THREE.MeshPhysicalMaterial>(null!)
  const texture = useTexture(data.image)
  const tint = useMemo(() => new THREE.Color(hex), [])
  const tgt = useMemo(() => new THREE.Color(hex), [])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
  }, [texture])

  useEffect(() => {
    tgt.set(hex)
  }, [hex, tgt])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    // Bobbing idle (se apaga con reduced-motion).
    const bob = reduced ? 0 : Math.sin(t * 0.7 + index * 1.7) * 0.035
    group.current.position.y += (spot.y + bob - group.current.position.y) * 0.08

    // Hover: crece, mira al cursor; idle: vuelve a su pose de museo.
    const s = hovered ? 1.09 : 1
    inner.current.scale.x += (s - inner.current.scale.x) * 0.1
    inner.current.scale.y += (s - inner.current.scale.y) * 0.1
    const ry = hovered ? state.pointer.x * 0.22 : spot.rotY
    const rx = hovered ? -state.pointer.y * 0.16 : spot.rotX
    inner.current.rotation.y += (ry - inner.current.rotation.y) * 0.09
    inner.current.rotation.x += (rx - inner.current.rotation.x) * 0.09

    // Separación de capas en Z — el "parallax real" del hover.
    const backZ = hovered ? -0.26 : -0.06
    const barZ = hovered ? 0.16 : 0.035
    back.current.position.z += (backZ - back.current.position.z) * 0.1
    bar.current.position.z += (barZ - bar.current.position.z) * 0.1

    // Glow de la placa trasera respira el color del theme al hover.
    tint.lerp(tgt, 0.08)
    if (backMat.current) {
      backMat.current.emissive.copy(tint)
      const e = hovered ? 0.55 : 0.05
      backMat.current.emissiveIntensity += (e - backMat.current.emissiveIntensity) * 0.1
    }
  })

  return (
    <group ref={group} position={[spot.x, spot.y, spot.z]}>
      <group
        ref={inner}
        rotation={[spot.rotX, spot.rotY, 0]}
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(index)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          onHover(null)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          window.open(data.url, '_blank', 'noopener,noreferrer')
        }}
      >
        {/* Placa trasera — la capa que se hunde y emite el glow del theme */}
        <mesh ref={back} position={[0, 0, -0.06]}>
          <planeGeometry args={[SLAB_W + 0.1, SLAB_H + 0.16]} />
          <meshPhysicalMaterial
            ref={backMat}
            color="#0b0f16"
            metalness={0.85}
            roughness={0.32}
            emissive={hex}
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Screenshot — unlit: se lee como una pantalla encendida en la sala */}
        <mesh position={[0, -0.03, 0]}>
          <planeGeometry args={[SLAB_W, SLAB_H]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Barra de browser — la capa que flota hacia adelante */}
        <group ref={bar} position={[0, SLAB_H / 2 + 0.015, 0.035]}>
          <mesh>
            <planeGeometry args={[SLAB_W, 0.09]} />
            <meshPhysicalMaterial color="#141a24" metalness={0.7} roughness={0.4} />
          </mesh>
          {[-0.72, -0.66, -0.6].map((x, i) => (
            <mesh key={i} position={[x, 0, 0.002]}>
              <circleGeometry args={[0.014, 12]} />
              <meshBasicMaterial color={['#ff5f57', '#febc2e', '#28c840'][i]} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

/** Escala el conjunto para que el layout entre en el viewport actual. */
function Gallery({
  hex,
  reduced,
  onHoverChange,
}: {
  hex: string
  reduced: boolean
  onHoverChange?: (c: MuseumCase | null) => void
}) {
  const viewport = useThree((s) => s.viewport)
  const [hovered, setHovered] = useState<number | null>(null)

  const narrow = viewport.aspect < 1.05
  const layout = narrow ? LAYOUT_NARROW : LAYOUT_WIDE
  const b = narrow ? BOUNDS.narrow : BOUNDS.wide
  const scale = Math.min(viewport.width / b.w, viewport.height / b.h, 1.4) * 0.94

  const handleHover = (i: number | null) => {
    setHovered(i)
    onHoverChange?.(i === null ? null : MUSEUM_CASES[i])
  }

  return (
    <group scale={scale}>
      {MUSEUM_CASES.map((c, i) => (
        <Slab
          key={c.slug}
          data={c}
          spot={layout[i]}
          index={i}
          hex={hex}
          reduced={reduced}
          hovered={hovered === i}
          onHover={handleHover}
        />
      ))}
    </group>
  )
}

/** Parallax sutil de cámara — misma receta que ApexCore. */
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.35 - state.camera.position.x) * 0.03
    state.camera.position.y += (state.pointer.y * 0.22 - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

function useVisibilityFrameloop(): 'always' | 'never' {
  const [mode, setMode] = useState<'always' | 'never'>('always')
  useEffect(() => {
    const on = () => setMode(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return mode
}

export default function CaseMuseum({
  themeHex,
  onHoverChange,
}: {
  themeHex: string
  onHoverChange?: (c: MuseumCase | null) => void
}) {
  const reduced = usePrefersReducedMotion()
  const frameloop = useVisibilityFrameloop()

  // Si el pointer sale del canvas sin pasar por otro slab, limpiar cursor.
  useEffect(() => () => {
    document.body.style.cursor = 'auto'
  }, [])

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 6]} intensity={0.9} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.8} position={[0, 3, 5]} scale={[6, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.3} position={[-5, 0, 3]} scale={[3, 6, 1]} color={themeHex} />
          <Lightformer form="circle" intensity={0.9} position={[5, -2, 4]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Gallery hex={themeHex} reduced={reduced} onHoverChange={onHoverChange} />
        <CameraRig />
      </Suspense>
    </Canvas>
  )
}
