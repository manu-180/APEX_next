'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

const CHARS = ['{', '}', '(', ')', '=', '>', '<', '/', ';', '0', '1'] as const

type Column = {
  x: number
  headY: number
  speed: number
  tailLen: number
  maxAlpha: number
  fontSize: number
  hueMix: number
  chars: string[]
  lineSpacing: number
}

type CursorState = { x: number; y: number; active: boolean }

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)]!
}

function initColumns(width: number, height: number): Column[] {
  if (width <= 0) return []
  const count = 15 + Math.floor(Math.random() * 11)
  const cols: Column[] = []
  for (let i = 0; i < count; i++) {
    const tailLen = 4 + Math.floor(Math.random() * 5)
    const fontSize = 12 + Math.floor(Math.random() * 3)
    const lineSpacing = fontSize * 1.15
    cols.push({
      x: Math.random() * width,
      headY: Math.random() * height - height * 0.25,
      speed: 30 + Math.random() * 50,
      tailLen,
      maxAlpha: 0.12 + Math.random() * 0.13,
      fontSize,
      hueMix: Math.random() * 0.45,
      chars: Array.from({ length: tailLen }, randomChar),
      lineSpacing,
    })
  }
  return cols
}

function mixColor(hueMix: number, alpha: number): string {
  const r = Math.round(6 + (139 - 6) * hueMix)
  const g = Math.round(182 + (92 - 182) * hueMix)
  const b = Math.round(212 + (246 - 212) * hueMix)
  return `rgba(${r},${g},${b},${alpha})`
}

export function CodeRainBg({
  className,
  cursorRef: externalCursorRef,
}: {
  className?: string
  cursorRef?: RefObject<CursorState>
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const columnsRef = useRef<Column[]>([])
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)
  const internalCursorRef = useRef<CursorState>({ x: -1, y: -1, active: false })
  const cursorRef = externalCursorRef ?? internalCursorRef

  const [graphicsOn, setGraphicsOn] = useState(false)

  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setGraphicsOn(window.innerWidth >= 768 && !mqReduce.matches)
    }
    sync()
    mqReduce.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    return () => {
      mqReduce.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [])

  const drawFrame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = container.clientWidth
    const h = container.clientHeight
    if (w <= 0 || h <= 0) {
      rafRef.current = requestAnimationFrame(drawFrame)
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const targetW = Math.floor(w * dpr)
    const targetH = Math.floor(h * dpr)

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
      columnsRef.current = initColumns(w, h)
    }

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp
    }
    const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1)
    lastTimeRef.current = timestamp

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)

    const fontStack =
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

    const cursor = cursorRef.current ?? { x: -1, y: -1, active: false }

    for (const col of columnsRef.current) {
      col.headY += col.speed * dt

      const offBottom = h + col.tailLen * col.lineSpacing + 48
      if (col.headY > offBottom) {
        col.headY = -col.tailLen * col.lineSpacing - Math.random() * h * 0.6
        col.x = Math.random() * w
        for (let k = 0; k < col.tailLen; k++) {
          col.chars[k] = randomChar()
        }
      }

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `${col.fontSize}px ${fontStack}`

      // Cursor proximity boost
      let alphaMultiplier = 1
      if (cursor.active && cursor.x >= 0) {
        const dx = Math.abs(col.x - cursor.x)
        if (dx < 120) {
          alphaMultiplier = 1 + 0.65 * (1 - dx / 120)
        }
      }

      const denom = col.tailLen <= 1 ? 1 : col.tailLen - 1
      for (let i = 0; i < col.tailLen; i++) {
        const y = col.headY - i * col.lineSpacing
        const t = col.tailLen <= 1 ? 0 : i / denom
        const alpha = Math.min(col.maxAlpha * alphaMultiplier * (1 - t * 0.88), 0.6)
        ctx.fillStyle = mixColor(col.hueMix, alpha)
        ctx.fillText(col.chars[i]!, col.x, y)
      }
    }

    rafRef.current = requestAnimationFrame(drawFrame)
  }, [])

  useEffect(() => {
    if (!graphicsOn) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      lastTimeRef.current = 0
      columnsRef.current = []
      return
    }

    lastTimeRef.current = 0
    rafRef.current = requestAnimationFrame(drawFrame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      lastTimeRef.current = 0
    }
  }, [graphicsOn, drawFrame])

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {graphicsOn ? (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
      ) : null}
    </div>
  )
}
