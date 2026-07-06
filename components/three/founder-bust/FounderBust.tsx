'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useApexTheme } from '@/hooks/useTheme'

/**
 * Founder 3D — busto escultórico de Manuel, versión premium.
 *
 * Generado con Meshy image-to-3D desde la foto real (scripts/meshy/founder.mjs)
 * SIN textura: la malla se viste acá con un material físico iridiscente. En vez
 * de un clon foto-real (uncanny valley), se lo trata como una ESCULTURA de
 * cromo/nácar: metal + clearcoat + iridiscencia (thin-film) que tornasola en
 * varios colores según el ángulo, más un tinte base que respira el theme activo.
 * El entorno suma lightformers de color para que la iridiscencia tenga de dónde
 * refractar. Resultado: pieza premium, colorida, que no imita una foto.
 *
 * Se puede AGARRAR y rotar para cualquier lado (mouse con cursor manita, o dedo
 * en mobile). Gira lento solo cuando no se lo toca (off con reduced-motion).
 * Se monta on-demand (toggle en founder.tsx) → cero costo para quien no lo abre.
 */

const MODEL = '/models/apex-founder.glb'

useGLTF.preload(MODEL)

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

function Bust({
  hex,
  reduced,
  dragging,
}: {
  hex: string
  reduced: boolean
  dragging: MutableRefObject<boolean>
}) {
  const { scene } = useGLTF(MODEL)
  const spin = useRef<THREE.Group>(null!)
  const cur = useMemo(() => new THREE.Color(hex), [])
  const tgt = useMemo(() => new THREE.Color(hex), [])

  // Material escultórico premium — la malla llega sin texturas. Metal pulido con
  // clearcoat + iridiscencia (tornasol multicolor) + sheen tintado por el theme.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        metalness: 0.9,
        roughness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        iridescence: 1,
        iridescenceIOR: 1.32,
        iridescenceThicknessRange: [120, 500],
        sheen: 0.6,
        sheenRoughness: 0.4,
        sheenColor: new THREE.Color(hex),
        envMapIntensity: 1.6,
      }),
    [],
  )

  // Clon normalizado: material propio, centrado y escalado a altura constante.
  const bust = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = material
    })
    const box = new THREE.Box3().setFromObject(c)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s = 2.6 / Math.max(size.x, size.y, size.z)
    c.scale.setScalar(s)
    c.position.set(-center.x * s, -center.y * s, -center.z * s)
    return c
  }, [scene, material])

  useEffect(() => {
    tgt.set(hex)
  }, [hex, tgt])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)

    // El tinte base y el sheen respiran el theme activo (la iridiscencia aporta
    // el resto de los colores, independiente del theme).
    cur.lerp(tgt, 0.08)
    material.color.copy(cur)
    material.sheenColor.copy(cur)
    material.emissive.copy(cur).multiplyScalar(0.08)

    // Giro lento solo cuando no se lo agarra (off con reduced-motion).
    if (spin.current && !reduced && !dragging.current) spin.current.rotation.y += d * 0.28
  })

  return (
    <group ref={spin}>
      <primitive object={bust} />
    </group>
  )
}

export default function FounderBust() {
  const { activeConfig } = useApexTheme()
  const reduced = usePrefersReducedMotion()
  const frameloop = useVisibilityFrameloop()
  const dragging = useRef(false)

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.15, 3.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="cursor-grab active:cursor-grabbing"
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        {/* Entorno con lightformers de color → la iridiscencia refracta un
            arcoíris sutil (violeta / rosa / cian) sobre el metal. */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.1} position={[0, 3, 4]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[-4, 1, 2]} scale={[3, 5, 1]} color={activeConfig.primary} />
          <Lightformer form="circle" intensity={1.2} position={[4, -2, 3]} scale={[3, 3, 1]} color="#7c5cff" />
          <Lightformer form="rect" intensity={1.05} position={[3, 2.5, -2]} scale={[3, 3, 1]} color="#ff8fc7" />
          <Lightformer form="circle" intensity={0.9} position={[-3, -2, -1]} scale={[2.5, 2.5, 1]} color="#38d6ff" />
        </Environment>
        <Bust hex={activeConfig.primary} reduced={reduced} dragging={dragging} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.85}
          target={[0, 0, 0]}
          onStart={() => {
            dragging.current = true
          }}
          onEnd={() => {
            dragging.current = false
          }}
        />
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.5} luminanceThreshold={0.6} luminanceSmoothing={0.4} radius={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
