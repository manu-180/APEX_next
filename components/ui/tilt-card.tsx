'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TiltCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  tiltMax?: number
}

export function TiltCard({ children, className, glowColor, tiltMax = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setTransform({
      rotateX: (0.5 - y) * tiltMax,
      rotateY: (x - 0.5) * tiltMax,
    })
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={transform}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn('relative', className)}
      data-hover
    >
      {/* Cursor-tracking glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor ?? 'rgba(var(--color-primary-rgb), 0.12)'}, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  )
}
