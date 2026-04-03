'use client'

import { useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'

interface Particle {
  x: number
  y: number
  homeX: number
  homeY: number
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
  /** Escala del impulso aplicado por frame al repeler (0–1 típico) */
  mouseImpulseScale?: number
  /** ms sin mover el cursor antes de activar el resorte de vuelta al hogar */
  returnDelayMs?: number
  externalMouse?: React.RefObject<MousePosition>
  /** Radio mínimo de cada punto (px lógicos) */
  particleRadiusMin?: number
  /** Radio máximo de cada punto */
  particleRadiusMax?: number
  /** Opacidad base mínima (0–1) */
  particleAlphaMin?: number
  /** Opacidad base máxima (0–1) */
  particleAlphaMax?: number
  /** Opacidad máxima de las líneas entre partículas cercanas (0–1) */
  lineAlphaMax?: number
  /** Grosor de las líneas de conexión (px) */
  lineWidth?: number
}

const COLORS = [
  '6, 182, 212',   // cyan
  '59, 130, 246',  // blue
  '124, 58, 237',  // violet
]

const RETURN_FORCE_IDLE = 0.006
const VELOCITY_DAMPING = 0.955
const RESET_INTERVAL_MS = 5000
const RESET_WINDOW_MS = 900
const RETURN_FORCE_RESET = 0.02

export function ParticleField({
  className,
  particleCount = 160,
  connectionDistance = 120,
  mouseRadius = 180,
  mouseForce = 0.8,
  mouseImpulseScale = 0.4,
  returnDelayMs = 2000,
  externalMouse,
  particleRadiusMin = 0.6,
  particleRadiusMax = 2.4,
  particleAlphaMin = 0.15,
  particleAlphaMax = 0.5,
  lineAlphaMax = 0.12,
  lineWidth: lineWidthPx = 0.5,
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
        const x = Math.random() * w
        const y = Math.random() * h
        const rRange = particleRadiusMax - particleRadiusMin
        const aRange = particleAlphaMax - particleAlphaMin
        particles.push({
          x,
          y,
          homeX: x,
          homeY: y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * rRange + particleRadiusMin,
          baseAlpha: Math.random() * aRange + particleAlphaMin,
          alpha: 0,
          color: colorRgb,
        })
      }
      return particles
    },
    [particleCount, particleRadiusMin, particleRadiusMax, particleAlphaMin, particleAlphaMax]
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
    let lastMouseActiveAt = performance.now()

    const animate = () => {
      const w = canvas.width / dprRef.current
      const h = canvas.height / dprRef.current
      const particles = particlesRef.current
      const mouse = mouseRef.current ?? { x: -9999, y: -9999, active: false }
      const now = performance.now()
      const isResetWindow = now % RESET_INTERVAL_MS < RESET_WINDOW_MS

      if (mouse.active && !isResetWindow) {
        lastMouseActiveAt = now
      }

      const idleTime = now - lastMouseActiveAt
      const returnForce = isResetWindow
        ? RETURN_FORCE_RESET
        : idleTime > returnDelayMs
          ? RETURN_FORCE_IDLE
          : 0

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        if (mouse.active && !isResetWindow) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist > 0.001 && dist < mouseRadius) {
            const force = (1 - dist / mouseRadius) * mouseForce
            p.vx += (dx / dist) * force * mouseImpulseScale
            p.vy += (dy / dist) * force * mouseImpulseScale
            p.alpha = Math.min(1, p.baseAlpha + (1 - dist / mouseRadius) * 0.6)
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.02
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.02
        }

        // "Spring" suave hacia su posición original para recuperar la composición.
        p.vx += (p.homeX - p.x) * returnForce
        p.vy += (p.homeY - p.y) * returnForce
        p.vx *= VELOCITY_DAMPING
        p.vy *= VELOCITY_DAMPING
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) {
          p.x = 0
          p.vx *= -0.35
        } else if (p.x > w) {
          p.x = w
          p.vx *= -0.35
        }

        if (p.y < 0) {
          p.y = 0
          p.vy *= -0.35
        } else if (p.y > h) {
          p.y = h
          p.vy *= -0.35
        }

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
            const alpha = (1 - dist / connectionDistance) * lineAlphaMax
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${p.color}, ${alpha})`
            ctx.lineWidth = lineWidthPx
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
  }, [
    createParticles,
    connectionDistance,
    mouseRadius,
    mouseForce,
    mouseImpulseScale,
    returnDelayMs,
    externalMouse,
    lineAlphaMax,
    lineWidthPx,
  ])

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0', className)}
      aria-hidden="true"
    />
  )
}
