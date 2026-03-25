'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseAlpha: number
  alpha: number
  color: string
}

export interface MousePosition {
  x: number
  y: number
  active: boolean
}

interface ParticleFieldProps {
  className?: string
  particleCount?: number
  connectionDistance?: number
  mouseRadius?: number
  mouseForce?: number
  externalMouse?: React.RefObject<MousePosition>
}

const COLORS = [
  '6, 182, 212',   // cyan
  '59, 130, 246',  // blue
  '124, 58, 237',  // violet
]

export function ParticleField({
  className,
  particleCount = 160,
  connectionDistance = 120,
  mouseRadius = 180,
  mouseForce = 0.8,
  externalMouse,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const internalMouseRef = useRef<MousePosition>({ x: -9999, y: -9999, active: false })
  const rafRef = useRef<number>(0)
  const dprRef = useRef(1)

  const createParticles = useCallback(
    (w: number, h: number) => {
      const particles: Particle[] = []
      for (let i = 0; i < particleCount; i++) {
        const colorRgb = COLORS[Math.floor(Math.random() * COLORS.length)]
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 1.8 + 0.6,
          baseAlpha: Math.random() * 0.35 + 0.15,
          alpha: 0,
          color: colorRgb,
        })
      }
      return particles
    },
    [particleCount]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    dprRef.current = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const dpr = dprRef.current
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = createParticles(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    let handleMouse: ((e: MouseEvent) => void) | null = null
    let handleMouseLeave: (() => void) | null = null

    if (!externalMouse) {
      handleMouse = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        internalMouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        }
      }
      handleMouseLeave = () => {
        internalMouseRef.current.active = false
      }
      canvas.addEventListener('mousemove', handleMouse)
      canvas.addEventListener('mouseleave', handleMouseLeave)
    }

    const mouseRef = externalMouse ?? internalMouseRef

    const animate = () => {
      const w = canvas.width / dprRef.current
      const h = canvas.height / dprRef.current
      const particles = particlesRef.current
      const mouse = mouseRef.current ?? { x: -9999, y: -9999, active: false }

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * mouseForce
            p.vx += (dx / dist) * force * 0.3
            p.vy += (dy / dist) * force * 0.3
            p.alpha = Math.min(1, p.baseAlpha + (1 - dist / mouseRadius) * 0.6)
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.02
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.02
        }

        p.vx *= 0.98
        p.vy *= 0.98
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      if (handleMouse) canvas.removeEventListener('mousemove', handleMouse)
      if (handleMouseLeave) canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [createParticles, connectionDistance, mouseRadius, mouseForce, externalMouse])

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
    />
  )
}
