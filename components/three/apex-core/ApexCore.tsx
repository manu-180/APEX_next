'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, Edges, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { useApexTheme } from '@/hooks/useTheme'
import type { ThemeId } from '@/lib/types/theme'
import { getShapeGeometry } from '@/lib/three/logoGeometry'

/**
 * APEX Core — el "theme engine hecho materia".
 *
 * Un icosaedro facetado con material físico (metal + clearcoat) que refracta
 * el color del theme activo. Replica el ADN de ParticleField:
 *  - client-only (montado con next/dynamic ssr:false por quien lo consume)
 *  - respeta prefers-reduced-motion (sin auto-spin)
 *  - pausa el render loop cuando la pestaña queda oculta (ahorra CPU/batería)
 *
 * Interacción: gira solo, suave. Se puede AGARRAR con el mouse (cursor manita)
 * o con el dedo (touch) y rotar para cualquier lado con inercia — OrbitControls
 * sobre la cámara. Mientras se arrastra, el auto-spin se pausa.
 *
 * El color viene de useApexTheme().activeConfig.primary y se interpola suave
 * frame a frame.
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

/** easeOutBack — leve overshoot al final, para el "pop" de la forma nueva. */
function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function Artifact({
  themeId,
  hex,
  reduced,
  dragging,
}: {
  themeId: ThemeId
  hex: string
  reduced: boolean
  dragging: MutableRefObject<boolean>
}) {
  const spin = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.MeshPhysicalMaterial>(null!)
  const cur = useMemo(() => new THREE.Color(hex), [])
  const tgt = useMemo(() => new THREE.Color(hex), [])

  // Forma actualmente montada vs la del theme activo. Cuando difieren se anima un
  // "swap": la forma vieja se encoge a un punto, se cambia la geometría y la nueva
  // crece con un pop. El color se interpola aparte → sigue fluido durante el swap.
  const [renderId, setRenderId] = useState<ThemeId>(themeId)
  const phase = useRef(1) // 0 = punto · 1 = tamaño completo

  const { geometry, isCore } = useMemo(() => getShapeGeometry(renderId), [renderId])

  useEffect(() => {
    tgt.set(hex)
  }, [hex, tgt])

  // flatShading solo para el núcleo (facetado); los logos van lisos.
  useEffect(() => {
    if (mat.current) {
      mat.current.flatShading = isCore
      mat.current.needsUpdate = true
    }
  }, [isCore])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)

    // Transición suave del color hacia el theme activo.
    cur.lerp(tgt, 0.08)
    if (mat.current) {
      mat.current.color.copy(cur)
      mat.current.emissive.copy(cur).multiplyScalar(0.42)
    }

    // Transición de forma: encoger → swap de geometría → crecer con pop.
    const changing = renderId !== themeId
    if (reduced) {
      if (changing) setRenderId(themeId) // sin motion: swap inmediato
      phase.current = 1
      if (spin.current) spin.current.scale.setScalar(1)
    } else {
      if (changing) {
        phase.current = Math.max(0, phase.current - d * 5) // ~0.2s hasta el punto
        if (phase.current <= 0.001) setRenderId(themeId) // swap en el punto
      } else {
        phase.current = Math.min(1, phase.current + d * 3.4) // crecer de vuelta
      }
      if (spin.current) {
        const s = changing ? phase.current : Math.max(0.0001, easeOutBack(phase.current))
        spin.current.scale.setScalar(s)
      }
    }

    // Auto-spin (con boost durante el swap). Se pausa mientras el usuario
    // arrastra para rotar a mano, y con reduced-motion.
    if (spin.current && !reduced && !dragging.current) {
      const boost = changing ? 2.6 : 1
      spin.current.rotation.y += d * 0.34 * boost
      spin.current.rotation.x += d * 0.08
    }
  })

  return (
    <mesh ref={spin} geometry={geometry} dispose={null}>
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
      {isCore && <Edges threshold={12} scale={1.003} color="#ffffff" />}
    </mesh>
  )
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
  const dragging = useRef(false)

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 4.5], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="cursor-grab active:cursor-grabbing"
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 5]} intensity={1.4} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.2} position={[0, 3, 4]} scale={[4, 4, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[-4, 1, 2]} scale={[3, 5, 1]} color={activeConfig.primary} />
          <Lightformer form="circle" intensity={1.1} position={[4, -2, 3]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Artifact themeId={activeConfig.id} hex={activeConfig.primary} reduced={reduced} dragging={dragging} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
          onStart={() => {
            dragging.current = true
          }}
          onEnd={() => {
            dragging.current = false
          }}
        />
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.35} radius={0.75} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
