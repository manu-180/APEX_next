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
/** Cap de devicePixelRatio: 1.5 ya se ve nítido y evita duplicar el costo de
 *  rasterizado en pantallas Retina/4K con GPUs integradas (spec de perf). */
const MAX_DPR = 1.5

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

  const isMobile = useCallback((): boolean => {
    return typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
  }, [])

  const prefersReducedMotion = useCallback((): boolean => {
    return (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  /** Vía rápida animada (rAF): ni mobile ni reduced-motion. */
  const isEnabled = useCallback((): boolean => {
    if (typeof window === 'undefined') return false
    if (isMobile()) return false
    if (prefersReducedMotion()) return false
    return true
  }, [isMobile, prefersReducedMotion])

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
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
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

    /**
     * prefers-reduced-motion: un único frame estático — los puntos de los
     * emisores en reposo, sin pulso ni ondas — y CERO rAF. Se repinta solo
     * ante resize; no depende de IntersectionObserver/visibility porque no
     * hay loop que pausar (ya es gratis en reposo).
     */
    const drawStaticFrame = () => {
      syncSize()
      const lw = canvas.clientWidth
      const lh = canvas.clientHeight
      if (lw < 1 || lh < 1) return
      ctx.clearRect(0, 0, lw, lh)
      const rgb = readPrimaryRgb(canvas)
      for (const def of EMITTER_DEFS) {
        const cx = def.px * lw
        const cy = def.py * lh
        ctx.beginPath()
        ctx.fillStyle = `rgba(${rgb}, 0.35)`
        ctx.arc(cx, cy, 1.5, 0, Math.PI * 2)
        ctx.fill()
      }
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

    // Pausa cooperativa por viewport (IntersectionObserver) + pestaña activa
    // (visibilitychange): no propagamos ondas mientras nadie las mira. Solo
    // gatean la vía ANIMADA — el frame estático de reduced-motion no tiene
    // loop que pausar.
    let isIntersecting = true
    let isPageVisible = !document.hidden

    const start = () => {
      if (!isEnabled() || runningRef.current || !isIntersecting || !isPageVisible) return
      runningRef.current = true
      syncSize()
      emittersRef.current = makeEmitters()
      rafIdRef.current = requestAnimationFrame(tick)
    }

    /** Único punto de entrada tras cualquier cambio de condición (mount,
     *  resize, toggle de reduced-motion): decide entre animado / frame
     *  estático / nada (mobile), sin duplicar la lógica de gating. */
    const applyMode = () => {
      if (isMobile()) {
        stop()
        return
      }
      if (prefersReducedMotion()) {
        stop()
        drawStaticFrame()
        return
      }
      if (runningRef.current) syncSize()
      else start()
    }

    const onResize = () => applyMode()
    const onReduceChange = () => applyMode()

    const io = new IntersectionObserver(
      (entries) => {
        isIntersecting = entries[0]?.isIntersecting ?? true
        // El frame estático (mobile o reduced-motion) no depende de
        // intersección: no hay rAF corriendo que valga la pena pausar.
        if (isMobile() || prefersReducedMotion()) return
        if (isIntersecting) start()
        else stop()
      },
      { rootMargin: '120px' }
    )
    io.observe(canvas)

    const handleVisibility = () => {
      isPageVisible = !document.hidden
      if (isMobile() || prefersReducedMotion()) return
      if (isPageVisible) start()
      else stop()
    }
    document.addEventListener('visibilitychange', handleVisibility)

    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    mqReduce.addEventListener('change', onReduceChange)
    window.addEventListener('resize', onResize)

    applyMode()

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', handleVisibility)
      mqReduce.removeEventListener('change', onReduceChange)
      window.removeEventListener('resize', onResize)
      stop()
    }
  }, [isEnabled, isMobile, prefersReducedMotion])

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
