'use client'

import { type RefObject, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

type Wave = { startTime: number }

type Emitter = {
  /** fractional position [0-1] relative to canvas */
  px: number
  py: number
  waves: Wave[]
  lastSpawn: number
  autoInterval: number
}

const WAVE_DURATION_MS = 4000
const MAX_RADIUS_PX = 380
const MAX_WAVES_PER_EMITTER = 3
const MOBILE_BREAKPOINT = 768
const CURSOR_ACTIVATION_RADIUS = 90
const CURSOR_COOLDOWN_MS = 900

// Emitter definitions: main center + 4 distributed points
const EMITTER_DEFS: Array<{ px: number; py: number; autoInterval: number }> = [
  { px: 0.5,  py: 0.44, autoInterval: 2000 }, // main center
  { px: 0.15, py: 0.35, autoInterval: 4200 },
  { px: 0.83, py: 0.28, autoInterval: 5100 },
  { px: 0.25, py: 0.72, autoInterval: 4700 },
  { px: 0.78, py: 0.68, autoInterval: 5500 },
]

function readPrimaryRgb(el: HTMLElement): string {
  const raw = getComputedStyle(el).getPropertyValue('--color-primary-rgb').trim()
  return raw.length > 0 ? raw : '128, 128, 128'
}

function makeEmitters(): Emitter[] {
  return EMITTER_DEFS.map((def) => ({
    ...def,
    waves: [],
    lastSpawn: 0,
  }))
}

export function SonarWavesBg({
  className,
  cursorRef: externalCursorRef,
}: {
  className?: string
  cursorRef?: RefObject<{ x: number; y: number; active: boolean }>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const emittersRef = useRef<Emitter[]>(makeEmitters())
  const rafIdRef = useRef(0)
  const runningRef = useRef(false)
  const internalCursorRef = useRef({ x: -1, y: -1, active: false })
  const cursorRef = externalCursorRef ?? internalCursorRef

  const isEnabled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    if (window.innerWidth < MOBILE_BREAKPOINT) return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return true
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const syncSize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      const w = Math.max(1, Math.floor(width))
      const h = Math.max(1, Math.floor(height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const stop = () => {
      runningRef.current = false
      if (rafIdRef.current !== 0) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = 0
      }
      emittersRef.current = makeEmitters()
      const lw = canvas.clientWidth
      const lh = canvas.clientHeight
      if (lw > 0 && lh > 0) ctx.clearRect(0, 0, lw, lh)
    }

    const tick = (now: number) => {
      if (!runningRef.current) return

      if (!isEnabled()) {
        stop()
        return
      }

      const lw = canvas.clientWidth
      const lh = canvas.clientHeight
      if (lw < 1 || lh < 1) {
        rafIdRef.current = requestAnimationFrame(tick)
        return
      }

      ctx.clearRect(0, 0, lw, lh)

      const rgb = readPrimaryRgb(canvas)
      const cursor = cursorRef.current ?? { x: -1, y: -1, active: false }

      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      for (const emitter of emittersRef.current) {
        const cx = emitter.px * lw
        const cy = emitter.py * lh

        // Auto-spawn
        if (emitter.lastSpawn === 0) {
          emitter.waves.push({ startTime: now })
          emitter.lastSpawn = now
        } else if (
          emitter.waves.length < MAX_WAVES_PER_EMITTER &&
          now - emitter.lastSpawn >= emitter.autoInterval
        ) {
          emitter.waves.push({ startTime: now })
          emitter.lastSpawn = now
        }

        // Cursor-activated spawn
        if (cursor.active && cursor.x >= 0) {
          const dx = cursor.x - cx
          const dy = cursor.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (
            dist < CURSOR_ACTIVATION_RADIUS &&
            emitter.waves.length < MAX_WAVES_PER_EMITTER &&
            now - emitter.lastSpawn >= CURSOR_COOLDOWN_MS
          ) {
            emitter.waves.push({ startTime: now })
            emitter.lastSpawn = now
          }
        }

        // Prune expired waves
        emitter.waves = emitter.waves.filter(
          (wave) => now - wave.startTime < WAVE_DURATION_MS
        )

        // Draw waves
        for (const wave of emitter.waves) {
          const elapsed = now - wave.startTime
          const t = Math.min(1, elapsed / WAVE_DURATION_MS)
          const radius = t * MAX_RADIUS_PX
          if (radius < 1) continue
          const opacity = 0.18 * (1 - t)
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${rgb}, ${opacity})`
          ctx.arc(cx, cy, radius, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Draw emitter dot (pulsing)
        const pulse = Math.sin(now * 0.0035 + emitter.px * 10)
        const dotR = 1.5 * (1 + 0.22 * pulse)
        const dotAlpha = 0.35 + 0.15 * pulse

        // Slightly larger + brighter dot when cursor is near
        let finalR = dotR
        let finalAlpha = dotAlpha
        if (cursor.active && cursor.x >= 0) {
          const dx = cursor.x - cx
          const dy = cursor.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CURSOR_ACTIVATION_RADIUS) {
            const proximity = 1 - dist / CURSOR_ACTIVATION_RADIUS
            finalR = dotR * (1 + 0.5 * proximity)
            finalAlpha = Math.min(dotAlpha + 0.3 * proximity, 0.9)
          }
        }

        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb}, ${finalAlpha})`
        ctx.arc(cx, cy, finalR, 0, Math.PI * 2)
        ctx.fill()
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    const start = () => {
      if (!isEnabled() || runningRef.current) return
      runningRef.current = true
      syncSize()
      emittersRef.current = makeEmitters()
      rafIdRef.current = requestAnimationFrame(tick)
    }

    const onResize = () => {
      if (!isEnabled()) {
        stop()
        return
      }
      if (runningRef.current) syncSize()
      else start()
    }

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onReduceChange = () => {
      if (!isEnabled()) stop()
      else start()
    }

    mqReduce.addEventListener('change', onReduceChange)
    window.addEventListener('resize', onResize)

    start()

    return () => {
      mqReduce.removeEventListener('change', onReduceChange)
      window.removeEventListener('resize', onResize)
      stop()
    }
  }, [isEnabled])

  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    </div>
  )
}
