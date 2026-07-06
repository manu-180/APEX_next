'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, Float, Center, ContactShadows, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'
import { ARTIFACTS } from '@/lib/three/artifacts'

/**
 * Artefactos generados con Meshy AI (texto → 3D) y traídos a WebGL.
 * Un objeto grande flotando + selector para cambiar entre los 4.
 * Se puede AGARRAR y rotar para cualquier lado (mouse o dedo) con OrbitControls;
 * mientras se arrastra, el giro automático se pausa.
 * GLB optimizados (webp + quantize) ~0.6–1.2 MB c/u.
 */

ARTIFACTS.forEach((a) => useGLTF.preload(a.file))

function Model({ file, scale }: { file: string; scale: number }) {
  const { scene } = useGLTF(file)
  const cloned = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    return c
  }, [scene])
  return (
    <Center>
      <primitive object={cloned} scale={scale} />
    </Center>
  )
}

function Spinner({
  file,
  scale,
  reduced,
  dragging,
}: {
  file: string
  scale: number
  reduced: boolean
  dragging: MutableRefObject<boolean>
}) {
  const ref = useRef<THREE.Group>(null!)
  useFrame((_, d) => {
    if (ref.current && !reduced && !dragging.current) ref.current.rotation.y += Math.min(d, 0.05) * 0.42
  })
  return (
    <Float speed={reduced ? 0 : 1.5} rotationIntensity={reduced ? 0 : 0.3} floatIntensity={reduced ? 0 : 0.7}>
      <group ref={ref}>
        <Suspense fallback={null}>
          <Model file={file} scale={scale} />
        </Suspense>
      </group>
    </Float>
  )
}

export default function MeshyShowroom({ index }: { index: number }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const dragging = useRef(false)
  const active = ARTIFACTS[index] ?? ARTIFACTS[0]

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.3, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      className="cursor-grab active:cursor-grabbing"
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 6, 4]} intensity={1.3} castShadow />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={2.4} position={[0, 3, 4]} scale={[5, 5, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.6} position={[-4, 1, 2]} scale={[3, 6, 1]} color="#8ea2ff" />
          <Lightformer form="circle" intensity={1.2} position={[4, -1, 3]} scale={[3, 3, 1]} color="#ffffff" />
        </Environment>
        <Spinner file={active.file} scale={active.scale} reduced={reduced} dragging={dragging} />
        <ContactShadows position={[0, -2.1, 0]} opacity={0.45} blur={2.6} scale={9} far={4.5} />
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
          <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.65} luminanceSmoothing={0.4} radius={0.7} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
