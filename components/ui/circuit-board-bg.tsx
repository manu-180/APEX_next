'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

type VecNode = { x: number; y: number }

type CircuitGraph = {
  nodes: VecNode[]
  edges: [number, number][]
  adj: number[][]
}

const COLS = 30
const ROWS = 20
const NODE_COUNT = COLS * ROWS

function idx(i: number, j: number): number {
  return j * COLS + i
}

function buildCircuit(w: number, h: number): CircuitGraph {
  const padX = w * 0.06
  const padY = h * 0.06
  const cellW = (w - 2 * padX) / (COLS - 1)
  const cellH = (h - 2 * padY) / (ROWS - 1)

  const nodes: VecNode[] = []
  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      nodes.push({ x: padX + i * cellW, y: padY + j * cellH })
    }
  }

  const adj: number[][] = Array.from({ length: NODE_COUNT }, () => [])
  const edges: [number, number][] = []

  const addEdge = (a: number, b: number) => {
    if (adj[a].includes(b)) return
    adj[a].push(b)
    adj[b].push(a)
    edges.push([a, b])
  }

  for (let j = 0; j < ROWS; j++) {
    for (let i = 0; i < COLS; i++) {
      const id = idx(i, j)
      if (i < COLS - 1 && Math.random() < 0.42) {
        addEdge(id, idx(i + 1, j))
      }
      if (j < ROWS - 1 && Math.random() < 0.42) {
        addEdge(id, idx(i, j + 1))
      }
    }
  }

  for (let k = 0; k < 28; k++) {
    const i = Math.floor(Math.random() * (COLS - 1))
    const j = Math.floor(Math.random() * ROWS)
    const id = idx(i, j)
    if (Math.random() < 0.55) addEdge(id, idx(i + 1, j))
  }
  for (let k = 0; k < 28; k++) {
    const i = Math.floor(Math.random() * COLS)
    const j = Math.floor(Math.random() * (ROWS - 1))
    const id = idx(i, j)
    if (Math.random() < 0.55) addEdge(id, idx(i, j + 1))
  }

  return { nodes, edges, adj }
}

function randomPath(adj: number[][], minSeg: number, maxSeg: number): number[] | null {
  const starters = adj
    .map((n, i) => (n.length > 0 ? i : -1))
    .filter((i) => i >= 0)
  if (starters.length === 0) return null

  const segCount = minSeg + Math.floor(Math.random() * (maxSeg - minSeg + 1))
  const start = starters[Math.floor(Math.random() * starters.length)]!
  const path: number[] = [start]
  let prev = -1
  let cur = start

  for (let s = 0; s < segCount; s++) {
    const neighbors = adj[cur]!.filter((n) => n !== prev)
    if (neighbors.length === 0) break
    const next = neighbors[Math.floor(Math.random() * neighbors.length)]!
    path.push(next)
    prev = cur
    cur = next
  }

  if (path.length < 2) return null
  return path
}

function pathFromNode(adj: number[][], startNode: number, minSeg: number, maxSeg: number): number[] | null {
  const segCount = minSeg + Math.floor(Math.random() * (maxSeg - minSeg + 1))
  const path: number[] = [startNode]
  let prev = -1
  let cur = startNode

  for (let s = 0; s < segCount; s++) {
    const neighbors = adj[cur]!.filter((n) => n !== prev)
    if (neighbors.length === 0) break
    const next = neighbors[Math.floor(Math.random() * neighbors.length)]!
    path.push(next)
    prev = cur
    cur = next
  }

  if (path.length < 2) return null
  return path
}

function readPrimaryRgb(): string {
  if (typeof document === 'undefined') return '128, 128, 128'
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary-rgb')
    .trim()
  return raw.length > 0 ? raw : '128, 128, 128'
}

function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false
  if (window.innerWidth < 768) return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return true
}

type Pulse = {
  path: number[]
  startTime: number
  duration: number
  /** Disparado por hover: más luminoso, grueso y con glow */
  intense?: boolean
}

type CursorState = { x: number; y: number; active: boolean }

export function CircuitBoardBg({
  className,
  cursorRef: externalCursorRef,
}: {
  className?: string
  cursorRef?: RefObject<CursorState>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const graphRef = useRef<CircuitGraph | null>(null)
  /** Desplazamiento aleatorio por nodo para un “gemelo” visual solo bajo el cursor (doble densidad local). */
  const nodeTwinJitterRef = useRef<{ dx: number; dy: number }[]>([])

  const pulsesRef = useRef<Pulse[]>([])
  const nextPulseAtRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [enabled, setEnabled] = useState(false)

  const internalCursorRef = useRef<CursorState>({ x: -1, y: -1, active: false })
  const cursorRef = externalCursorRef ?? internalCursorRef
  const lastCursorPulseRef = useRef(0)

  const resizeAndRebuild = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (w < 1 || h < 1) {
      graphRef.current = null
      return
    }

    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    graphRef.current = buildCircuit(w, h)
    nodeTwinJitterRef.current = Array.from({ length: NODE_COUNT }, () => ({
      dx: (Math.random() - 0.5) * 9,
      dy: (Math.random() - 0.5) * 9,
    }))
    pulsesRef.current = []
    nextPulseAtRef.current = performance.now() + 2000 + Math.random() * 1000
  }, [])

  useEffect(() => {
    setEnabled(motionAllowed())

    const sync = () => setEnabled(motionAllowed())
    window.addEventListener('resize', sync)
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', sync)

    return () => {
      window.removeEventListener('resize', sync)
      mq.removeEventListener('change', sync)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    resizeAndRebuild()

    const onResize = () => {
      resizeAndRebuild()
    }
    window.addEventListener('resize', onResize)

    const nodeRadii: number[] = Array.from({ length: NODE_COUNT }, () => 2 + Math.floor(Math.random() * 2))

    const drawFrame = (now: number) => {
      const ctx = canvas.getContext('2d')
      const graph = graphRef.current
      if (!ctx || !graph) {
        rafRef.current = requestAnimationFrame(drawFrame)
        return
      }

      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      const rgb = readPrimaryRgb()

      ctx.clearRect(0, 0, cssW, cssH)

      const cursor = cursorRef.current ?? { x: -1, y: -1, active: false }
      /**
       * Radio de influencia del cursor (nodos, líneas y disparo del pulso).
       * Más chico que el modo “168”: mismo estilo potente pero área más contenida.
       */
      const PROXIMITY_RADIUS = 75


      ctx.lineCap = 'round'

      // Aristas: brillo fuerte cerca del cursor (modo potente, sin capa de luz global)
      for (const [a, b] of graph.edges) {
        const na = graph.nodes[a]!
        const nb = graph.nodes[b]!
        let lineAlpha = 0.05
        let lineW = 1
        if (cursor.active && cursor.x >= 0 && cursor.y >= 0) {
          const mx = (na.x + nb.x) / 2
          const my = (na.y + nb.y) / 2
          const dx = mx - cursor.x
          const dy = my - cursor.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < PROXIMITY_RADIUS) {
            const t = 1 - dist / PROXIMITY_RADIUS
            const falloff = t * t
            lineAlpha = 0.06 + 0.52 * falloff
            lineW = 1 + 2.4 * falloff
          }
        }
        ctx.lineWidth = lineW
        ctx.strokeStyle = `rgba(${rgb}, ${lineAlpha})`
        ctx.beginPath()
        ctx.moveTo(na.x, na.y)
        ctx.lineTo(nb.x, nb.y)
        ctx.stroke()
      }

      // Nodos: modo potente — brillo marcado + aro al acercarse (lo que gustaba del hover fuerte)
      for (let i = 0; i < graph.nodes.length; i++) {
        const n = graph.nodes[i]!
        const r = nodeRadii[i] ?? 2.5
        let nodeAlpha = 0.08
        let ringAlpha = 0
        let ringR = 0
        /** 0 fuera del radio del cursor; dentro, 1 en el cursor → 0 en el borde del radio */
        let proxT = 0
        if (cursor.active && cursor.x >= 0 && cursor.y >= 0) {
          const dx = n.x - cursor.x
          const dy = n.y - cursor.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < PROXIMITY_RADIUS) {
            proxT = 1 - dist / PROXIMITY_RADIUS
            const falloff = Math.pow(proxT, 1.15)
            nodeAlpha = 0.1 + 0.55 * falloff
            if (proxT > 0.45) {
              ringAlpha = 0.2 * (proxT - 0.45) / 0.55
              ringR = r + 4 + 5 * proxT
            }
          }
        }
        if (ringAlpha > 0.02) {
          ctx.beginPath()
          ctx.arc(n.x, n.y, ringR, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${rgb}, ${ringAlpha})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${nodeAlpha})`
        ctx.fill()

        // Nodo “gemelo” bajo el cursor: duplica la densidad visual en la zona del mouse
        if (proxT > 0) {
          const falloff = Math.pow(proxT, 1.15)
          const twinAlpha = (0.06 + 0.42 * falloff) * 0.92
          const jitter = nodeTwinJitterRef.current[i] ?? { dx: 0, dy: 0 }
          const tr = Math.max(1.1, r * 0.72)
          ctx.beginPath()
          ctx.arc(n.x + jitter.dx, n.y + jitter.dy, tr, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${rgb}, ${twinAlpha})`
          ctx.fill()
        }
      }

      // Pulsos por hover: el doble de capacidad vs. antes para acompañar la densidad extra de nodos
      const MAX_INTENSE_PULSES = 14
      const CURSOR_PULSE_COOLDOWN_MS = 55
      /** Duración total del recorrido — más alta = luz más pausada por segmento */
      const INTENSE_DURATION_MIN = 1050
      const INTENSE_DURATION_SPREAD = 750

      if (cursor.active && cursor.x >= 0 && cursor.y >= 0) {
        const intenseCount = pulsesRef.current.filter((p) => p.intense).length
        if (
          now - lastCursorPulseRef.current > CURSOR_PULSE_COOLDOWN_MS &&
          intenseCount < MAX_INTENSE_PULSES
        ) {
          let nearestIdx = -1
          let nearestDist = Infinity
          for (let i = 0; i < graph.nodes.length; i++) {
            const n = graph.nodes[i]!
            const dx = n.x - cursor.x
            const dy = n.y - cursor.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < nearestDist) {
              nearestDist = dist
              nearestIdx = i
            }
          }
          if (nearestIdx >= 0 && nearestDist < PROXIMITY_RADIUS * 1.08) {
            const path = pathFromNode(graph.adj, nearestIdx, 5, 12)
            if (path) {
              const duration = INTENSE_DURATION_MIN + Math.random() * INTENSE_DURATION_SPREAD
              pulsesRef.current.push({ path, startTime: now, duration, intense: true })
              lastCursorPulseRef.current = now
            }
          }
        }
      }

      // Pulso ambiental (uno a la vez cuando toca el timer y no hay otro ambiental)
      const hasAmbientPulse = pulsesRef.current.some((p) => !p.intense)
      if (!hasAmbientPulse && now >= nextPulseAtRef.current) {
        const path = randomPath(graph.adj, 4, 8)
        if (path) {
          const duration = 1100 + Math.random() * 500
          pulsesRef.current.push({ path, startTime: now, duration })
        } else {
          nextPulseAtRef.current = now + 500
        }
      }

      const pulses = pulsesRef.current
      for (let pi = pulses.length - 1; pi >= 0; pi--) {
        const pulse = pulses[pi]!
        const intense = pulse.intense === true
        const segCount = pulse.path.length - 1
        const durPerSeg = pulse.duration / segCount
        const elapsed = now - pulse.startTime
        let finished = true

        const baseAlpha = intense ? 0.62 : 0.35
        const tailFade = intense ? 0.48 : 0.72
        const risePortion = intense ? 0.16 : 0.2
        const decayPortion = intense ? 0.68 : 0.65
        const strokeW = intense ? 2.25 : 1
        const glowBlur = intense ? 7 : 0
        const nodeBoost = intense ? 1.2 : 1

        const prevShadow = ctx.shadowBlur
        const prevShadowCol = ctx.shadowColor
        if (intense) {
          ctx.shadowBlur = glowBlur
          ctx.shadowColor = `rgba(${rgb}, 0.45)`
        }

        for (let i = 0; i < segCount; i++) {
          const segElapsed = elapsed - i * durPerSeg
          if (segElapsed < 0) {
            finished = false
            continue
          }

          const pathFade = segCount <= 1 ? 1 : 1 - (i / (segCount - 1)) * tailFade
          let alpha = baseAlpha * pathFade

          const rise = Math.min(1, segElapsed / (durPerSeg * risePortion))
          alpha *= rise

          const after = segElapsed - durPerSeg
          if (after > 0) {
            const decay = Math.max(0, 1 - after / (durPerSeg * decayPortion))
            alpha *= decay
            if (decay > 0.02) finished = false
          } else {
            finished = false
          }

          const alphaFloor = intense ? 0.035 : 0.012
          if (alpha < alphaFloor) continue

          const a = pulse.path[i]!
          const b = pulse.path[i + 1]!
          const na = graph.nodes[a]!
          const nb = graph.nodes[b]!
          const col = `rgba(${rgb}, ${Math.min(1, alpha)})`

          ctx.lineWidth = strokeW
          ctx.strokeStyle = col
          ctx.beginPath()
          ctx.moveTo(na.x, na.y)
          ctx.lineTo(nb.x, nb.y)
          ctx.stroke()

          const ra = (nodeRadii[a] ?? 2.5) * nodeBoost
          const rb = (nodeRadii[b] ?? 2.5) * nodeBoost
          ctx.fillStyle = col
          ctx.beginPath()
          ctx.arc(na.x, na.y, ra, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(nb.x, nb.y, rb, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.shadowBlur = prevShadow
        ctx.shadowColor = prevShadowCol
        ctx.lineWidth = 1

        if (finished) {
          pulses.splice(pi, 1)
          // Tras un pulso intenso, el ambiental puede volver antes; si termina el ambiental, nuevo intervalo largo
          nextPulseAtRef.current =
            now + (intense ? 800 : 2000) + Math.random() * 1000
        }
      }

      rafRef.current = requestAnimationFrame(drawFrame)
    }

    rafRef.current = requestAnimationFrame(drawFrame)

    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [enabled, resizeAndRebuild])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      aria-hidden="true"
    />
  )
}
