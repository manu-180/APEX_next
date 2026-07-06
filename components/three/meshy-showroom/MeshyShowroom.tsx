'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer, Float, Center, ContactShadows, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react'
import * as THREE from 'three'

/**
 * Stage 3D del muestrario. Muestra UNA pieza (file+scale) grande, flotando,
 * que se agarra y rota con OrbitControls (mouse o dedo); el giro automático
 * se pausa mientras se arrastra.
 *
 * IMPORTANTE — carga lazy: NO se precargan los 40 GLB (eso bajaría decenas de
 * MB al abrir /lab). Cada GLB se trae por-demanda al elegir la pieza; el
 * selector calienta el cache con un fetch en hover. useGLTF cachea por URL.
 */

function LoaderMesh() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, d) => {
    if (!ref.current) return
    ref.current.rotation.y += d * 0.9
    ref.current.rotation.x += d * 0.35
  })
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.15, 1]} />
      <meshBasicMaterial wireframe color="#8ea2ff" transparent opacity={0.16} />
    </mesh>
  )
}

/** Tamaño objetivo (unidades del mundo) al que se normaliza la dimensión mayor
 *  de cualquier modelo, para que espada, esfera o nave llenen el frame parejo.
 *  La cámara (z=6, fov=42) muestra ~4.6 de alto → 2.8 deja margen para el Float. */
const TARGET_SIZE = 2.8

function Model({ file, scale }: { file: string; scale: number }) {
  const { scene } = useGLTF(file)
  const { object, norm } = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    // Normalizar por bounding box: la dimensión mayor pasa a valer TARGET_SIZE.
    const size = new THREE.Box3().setFromObject(c).getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return { object: c, norm: TARGET_SIZE / maxDim }
  }, [scene])
  return (
    <Center>
      {/* scale de artifacts.ts queda como fino ajuste (default 1) sobre el normalizado */}
      <primitive object={object} scale={norm * scale} />
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
        <Suspense fallback={<LoaderMesh />}>
          {/* key por archivo → al cambiar de pieza se remonta limpio el modelo */}
          <Model key={file} file={file} scale={scale} />
        </Suspense>
      </group>
    </Float>
  )
}

export default function MeshyShowroom({ file, scale }: { file: string; scale: number }) {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  const dragging = useRef(false)

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
        <Spinner file={file} scale={scale} reduced={reduced} dragging={dragging} />
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
