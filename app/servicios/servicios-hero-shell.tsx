'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { CircuitBoardBg } from '@/components/ui/circuit-board-bg'

type CursorState = { x: number; y: number; active: boolean }

export function ServiciosHeroShell({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef<CursorState>({ x: -1, y: -1, active: false })
  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [
      'linear-gradient(to bottom, black 80%, transparent 100%)',
      'linear-gradient(to bottom, black 0%, transparent 60%)',
    ],
  )

  return (
    <motion.section
      ref={headerRef}
      className="relative pt-20 pb-12 overflow-hidden"
      style={{
        opacity: headerOpacity,
        maskImage: headerMask,
        WebkitMaskImage: headerMask,
      }}
      data-hover
      data-inspector-title="Hero que respira con el scroll"
      data-inspector-desc="Mientras bajás, esta zona se desvanece y la máscara suaviza el borde inferior como un monitor que se apaga de a poco. El fondo de placa de circuito reacciona al mouse: cerca del cursor se duplican nodos (gemelos), las conexiones brillan y los pulsos de luz son más densos."
      data-inspector-cat="Performance"
      onMouseMove={(e) => {
        const rect = headerRef.current?.getBoundingClientRect()
        if (rect) {
          bgCursorRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
          }
        }
      }}
      onMouseLeave={() => {
        bgCursorRef.current = { x: -1, y: -1, active: false }
      }}
    >
      <GridBackground />
      <CircuitBoardBg cursorRef={bgCursorRef} />
      <div className="relative z-10 mx-auto max-w-4xl px-6">{children}</div>
    </motion.section>
  )
}
