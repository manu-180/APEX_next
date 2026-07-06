'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Edges } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useApexTheme } from '@/hooks/useTheme'

/**
 * APEX Core — el "theme engine hecho materia".
 *
 * Un icosaedro facetado con material físico (metal + clearcoat) que refracta
 * el color del theme activo. Replica el ADN de ParticleField:
 *  - client-only (montado con next/dynamic ssr:false por quien lo consume)
 *  - respeta prefers-reduced-motion (sin auto-spin; solo reacciona al cursor)
 *  - pausa el render loop cuando la pestaña queda oculta (ahorra CPU/batería)
 *
 * El color viene de useApexTheme().activeConfig.primary y se interpola suave
 * frame a frame (mismo efecto que el mockup que validamos).
 */

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

function Artifact({ hex, reduced }: { hex: string; reduced: boolean }) {
  const tilt = useRef<THREE.Group>(null!)
  const spin = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!)
  const cur = useMemo(() => new THREE.Color(hex), [])
  const tgt = useMemo(() => new THREE.Color(hex), [])

  useEffect(() => {
    tgt.set(hex)
  }, [hex, tgt])

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)

    // Transición suave del color hacia el theme activo.
    cur.lerp(tgt, 0.08)
    if (mat.current) {
      mat.current.color.copy(cur)
      mat.current.emissive.copy(cur).multiplyScalar(0.42)
    }

    // Auto-spin (se apaga con reduced-motion).
    if (spin.current && !reduced) {
      spin.current.rotation.y += d * 0.34
      spin.current.rotation.x += d * 0.08
    }

    // Tilt hacia el cursor, con lerp (el objeto "sigue" el mouse).
    if (tilt.current) {
      const px = state.pointer.x
      const py = state.pointer.y
      tilt.current.rotation.y += (px * 0.5 - tilt.current.rotation.y) * 0.05
      tilt.current.rotation.x += (-py * 0.4 - tilt.current.rotation.x) * 0.05
    }
  })

  return (
    <group ref={tilt}>
      <mesh ref={spin}>
        <icosahedronGeometry args={[1.45, 0]} />
        <meshPhysicalMaterial
          ref={mat}
          color={hex}
          emissive={hex}
          emissiveIntensity={0.55}
          metalness={0.92}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.18}
          envMapIntensity={1.35}
          flatShading
        />
        <Edges threshold={12} scale={1.003} color="#ffffff" />
      </mesh>
    </group>
  )
}

/** Parallax sutil de cámara con el cursor — refuerza la profundidad. */
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x += (state.pointer.x * 0.45 - state.camera.position.x) * 0.03
    state.camera.position.y += (state.pointer.y * 0.32 - state.camera.position.y) * 0.03
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

/** Pausa el render loop cuando la pestaña no está visible. */
function useVisibilityFrameloop(): 'always' | 'never' {
  const [mode, setMode] = useState<'always' | 'never'>('always')
  useEffect(() => {
    const on = () => setMode(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])
  return mode
}

export default function ApexCore() {
  const { activeConfig } = useApexTheme()
  const reduced = usePrefersReducedMotion()
  const frameloop = useVisibilityFrameloop()

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 3, 4]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[-4, 1, 2]} scale={[3, 5, 1]} color={activeConfig.primary} />
          <Lightformer form="circle" intensity={1.1} position={[4, -2, 3]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Artifact hex={activeConfig.primary} reduced={reduced} />
        <CameraRig />
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.35} radius={0.75} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
