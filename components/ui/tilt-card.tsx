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

export function TiltCard({ children, className, glowColor, tiltMax = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const lastTime = useRef(0)
  const lastPos = useRef({ x: 0.5, y: 0.5 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const now = Date.now()
    const dt = now - lastTime.current
    if (dt > 0) {
      const speed = Math.sqrt(
        (x - lastPos.current.x) ** 2 + (y - lastPos.current.y) ** 2
      ) / (dt / 1000)
      const destabilize = Math.min(speed * 2, 1.5)
      const dynamicTilt = tiltMax * (1 + destabilize * 0.6)

      setTransform({
        rotateX: (0.5 - y) * dynamicTilt,
        rotateY: (x - 0.5) * dynamicTilt,
      })
    }

    lastTime.current = now
    lastPos.current = { x, y }
    setGlowPos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={transform}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      style={{ perspective: 900, transformStyle: 'preserve-3d' }}
      className={cn('group relative', className)}
      data-hover
    >
      {/* Mouse-tracking glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at ${glowPos.x}% ${glowPos.y}%, ${
            glowColor ?? 'rgba(var(--color-primary-rgb), 0.15)'
          }, transparent 60%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </motion.div>
  )
}
