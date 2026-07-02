'use client'

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import { SPRING_TILT } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  active?: boolean
  tiltIntensity?: number
  /** Inclinación base en reposo (grados), visible sin hover — útil para alinear con secciones tipo “tecnologías”. */
  restTilt?: { x: number; y: number }
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

/**
 * GlowCard v2 (spec §7/§8.3): tilt 3D con useMotionValue + useSpring y
 * spotlight radial vía useMotionTemplate — cero re-renders en mousemove.
 * API pública idéntica a v1.
 */
export function GlowCard({
  children,
  className,
  glowColor,
  active = false,
  tiltIntensity = 8,
  restTilt,
  onClick,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)
  const baseX = restTilt?.x ?? 0
  const baseY = restTilt?.y ?? 0

  // Posición del cursor en % (spotlight) + tilt en grados — motion values
  // seteados en onMouseMove, nunca useState (spec §7).
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const tiltX = useMotionValue(baseX)
  const tiltY = useMotionValue(baseY)
  const springX = useSpring(tiltX, SPRING_TILT)
  const springY = useSpring(tiltY, SPRING_TILT)

  useEffect(() => {
    if (!isHovered) {
      tiltX.set(baseX)
      tiltY.set(baseY)
    }
  }, [baseX, baseY, isHovered, tiltX, tiltY])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    mx.set(x)
    my.set(y)

    // Sin inclinación 3D bajo prefers-reduced-motion; el resplandor que sigue
    // al cursor (opacidad/posición, sin rotar) permanece como feedback de hover.
    if (prefersReducedMotion) return
    tiltX.set(((y - 50) / 50) * -tiltIntensity)
    tiltY.set(((x - 50) / 50) * tiltIntensity)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    tiltX.set(baseX)
    tiltY.set(baseY)
    mx.set(50)
    my.set(50)
  }

  // Spotlight (spec §7): radial que sigue el cursor, fundiendo a transparente.
  const glowGradient = useMotionTemplate`radial-gradient(300px circle at ${mx}% ${my}%, ${
    glowColor ?? 'rgba(var(--color-primary-rgb), 0.15)'
  }, transparent 60%)`

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'group relative overflow-hidden rounded-xl',
        'glass-card',
        'transition-[border-color,box-shadow] duration-300',
        active && 'animate-glow-pulse glow-border-active',
        !active && isHovered && 'glow-border',
        onClick && 'cursor-pointer select-none',
        className
      )}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-hover
    >
      {/* Mouse-tracking radial glow overlay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowGradient }}
      />

      {/* Inner glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: 'inset 0 0 60px rgba(var(--color-primary-rgb), 0.06)',
        }}
      />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </motion.div>
  )
}
