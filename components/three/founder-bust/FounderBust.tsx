'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useApexTheme } from '@/hooks/useTheme'

/**
 * Founder 3D — busto escultórico de Manuel.
 *
 * Generado con Meshy image-to-3D desde la foto real (scripts/meshy/founder.mjs)
 * SIN textura: la malla se viste acá con un material físico tintado por el
 * theme activo (mismo tratamiento que el APEX Core). Resultado: escultura
 * monocromática theme-reactive — esquiva el uncanny valley de un clon foto-real.
 *
 * Gira lento (se apaga con prefers-reduced-motion) y sigue el cursor.
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

function Bust({ hex, reduced }: { hex: string; reduced: boolean }) {
  const { scene } = useGLTF(MODEL)
  const tilt = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Group>(null!)
  const cur = useMemo(() => new THREE.Color(hex), [])
  const tgt = useMemo(() => new THREE.Color(hex), [])

  // Material escultórico único y compartido — la malla llega sin texturas.
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(hex),
        metalness: 0.55,
        roughness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.25,
        envMapIntensity: 1.2,
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

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)

    // El color de la escultura respira el theme activo.
    cur.lerp(tgt, 0.08)
    material.color.copy(cur)
    material.emissive.copy(cur).multiplyScalar(0.12)

    // Giro lento (off con reduced-motion).
    if (spin.current && !reduced) spin.current.rotation.y += d * 0.28

    // Sigue el cursor con lerp suave.
    if (tilt.current) {
      const px = state.pointer.x
      const py = state.pointer.y
      tilt.current.rotation.y += (px * 0.55 - tilt.current.rotation.y) * 0.05
      tilt.current.rotation.x += (-py * 0.28 - tilt.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <primitive object={bust} />
      </group>
    </group>
  )
}

export default function FounderBust() {
  const { activeConfig } = useApexTheme()
  const reduced = usePrefersReducedMotion()
  const frameloop = useVisibilityFrameloop()

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.15, 3.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.1} position={[0, 3, 4]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.4} position={[-4, 1, 2]} scale={[3, 5, 1]} color={activeConfig.primary} />
          <Lightformer form="circle" intensity={1} position={[4, -2, 3]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Bust hex={activeConfig.primary} reduced={reduced} />
      </Suspense>
    </Canvas>
  )
}
