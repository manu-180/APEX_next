'use client'

import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react'
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
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const baseX = restTilt?.x ?? 0
  const baseY = restTilt?.y ?? 0
  const [tilt, setTilt] = useState({ x: baseX, y: baseY })

  useEffect(() => {
    if (!isHovered) setTilt({ x: baseX, y: baseY })
  }, [baseX, baseY, isHovered])

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })

    const tiltX = ((y - 50) / 50) * -tiltIntensity
    const tiltY = ((x - 50) / 50) * tiltIntensity
    setTilt({ x: tiltX, y: tiltY })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: baseX, y: baseY })
    setMousePos({ x: 50, y: 50 })
  }

  const glowGradient = glowColor
    ? `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 60%)`
    : `radial-gradient(300px circle at ${mousePos.x}% ${mousePos.y}%, rgba(var(--color-primary-rgb), 0.15), transparent 60%)`

  return (
    <div
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
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered
          ? 'transform 0.1s ease-out'
          : 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Mouse-tracking radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glowGradient }}
      />

      {/* Inner glow on hover */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow: 'inset 0 0 60px rgba(var(--color-primary-rgb), 0.06)',
        }}
      />

      {/* Content */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}
