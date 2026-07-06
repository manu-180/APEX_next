'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, artifactsOf, type Artifact, type CategoryId } from '@/lib/three/artifacts'
import { cn } from '@/lib/utils/cn'

/**
 * Selector premium del muestrario, en dos niveles:
 *  1. Tabs de categoría con un indicador de acento que se desliza (framer layoutId).
 *  2. Rail de cards con el thumbnail renderizado de cada pieza.
 *
 * Controlado: el estado (categoría / pieza activa) vive en el padre (lab-client).
 * En hover de una card se calienta el cache del GLB con un fetch liviano, así
 * al hacer clic el modelo entra al stage casi instantáneo.
 */

const num2 = (n: number) => String(n + 1).padStart(2, '0')

/** Warm the browser HTTP cache for a GLB the user is about to click. */
function prefetchGlb(file: string) {
  try {
    fetch(file, { cache: 'force-cache' }).catch(() => {})
  } catch {
    /* no-op */
  }
}

function PieceThumb({ art, accent }: { art: Artifact; accent: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          background: `radial-gradient(120% 100% at 50% 22%, ${accent}22, transparent 70%), linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))`,
        }}
      >
        <span className="text-2xl font-extrabold" style={{ color: `${accent}cc` }}>
          {art.name.charAt(0)}
        </span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={art.thumb}
      alt={art.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export function MuestrarioSelector({
  activeCat,
  activeId,
  onSelectCategory,
  onSelectArtifact,
}: {
  activeCat: CategoryId
  activeId: string
  onSelectCategory: (cat: CategoryId) => void
  onSelectArtifact: (art: Artifact) => void
}) {
  const pieces = artifactsOf(activeCat)
  const accent = CATEGORIES.find((c) => c.id === activeCat)?.accent ?? 'var(--color-primary)'

  // Centrar en el rail la card activa al cambiar de pieza (scroll horizontal, sin mover la página).
  const railRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const rail = railRef.current
    const btn = activeRef.current
    if (!rail || !btn) return
    const target = btn.offsetLeft - rail.clientWidth / 2 + btn.clientWidth / 2
    rail.scrollTo({ left: Math.max(0, target), behavior: 'smooth' })
  }, [activeId, activeCat])

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* ── Nivel 1 — categorías ── */}
      <div
        role="tablist"
        aria-label="Categorías del muestrario"
        className="flex snap-x gap-1 overflow-x-auto pb-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:justify-center"
      >
        {CATEGORIES.map((c) => {
          const active = c.id === activeCat
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={active}
              onClick={() => onSelectCategory(c.id)}
              className="relative shrink-0 snap-start rounded-lg px-3.5 py-2 text-left transition-colors duration-300"
            >
              <span
                className="block text-[13px] font-extrabold leading-none tracking-tight transition-colors duration-300"
                style={{ color: active ? '#EAF0FA' : 'rgba(255,255,255,0.5)' }}
              >
                {c.label}
              </span>
              <span
                className="mt-1 block font-mono text-[9px] uppercase leading-none tracking-[0.18em] transition-colors duration-300"
                style={{ color: active ? accent : 'rgba(255,255,255,0.3)' }}
              >
                {c.kicker}
              </span>
              {active && (
                <motion.span
                  layoutId="muestrario-cat-underline"
                  className="absolute -bottom-0.5 left-3 right-3 h-[2px] rounded-full"
                  style={{ background: c.accent, boxShadow: `0 0 10px 0 ${c.accent}` }}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Blurb de la categoría + conteo */}
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/5 pt-3">
        <p className="text-[13px] font-light text-white/50">
          {CATEGORIES.find((c) => c.id === activeCat)?.blurb}
        </p>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
          {num2(pieces.length - 1)} piezas
        </span>
      </div>

      {/* ── Nivel 2 — rail de piezas ── */}
      <motion.div
        ref={railRef}
        key={activeCat}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 flex snap-x gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent)',
          maskImage: 'linear-gradient(90deg, transparent, #000 24px, #000 calc(100% - 24px), transparent)',
        }}
      >
        {pieces.map((a, i) => {
          const active = a.id === activeId
          return (
            <button
              key={a.id}
              ref={active ? activeRef : undefined}
              onClick={() => onSelectArtifact(a)}
              onMouseEnter={() => prefetchGlb(a.file)}
              onFocus={() => prefetchGlb(a.file)}
              aria-label={`Ver ${a.name}`}
              aria-pressed={active}
              className={cn(
                'group relative shrink-0 snap-start rounded-xl p-2 text-left transition-transform duration-300',
                'hover:-translate-y-1 focus-visible:outline-none focus-visible:-translate-y-1',
              )}
              style={{ width: 118 }}
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-square overflow-hidden rounded-lg border transition-all duration-300"
                style={{
                  borderColor: active ? `${accent}99` : 'rgba(255,255,255,0.08)',
                  boxShadow: active ? `0 10px 30px -12px ${accent}, inset 0 0 0 1px ${accent}55` : 'none',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <PieceThumb art={a} accent={accent} />
                {/* índice editorial */}
                <span className="absolute left-1.5 top-1 font-mono text-[9px] tracking-wider text-white/40">
                  {num2(i)}
                </span>
                {/* velo inferior para legibilidad del nombre en el hover */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Nombre + tag */}
              <div className="mt-1.5 px-0.5">
                <span
                  className="block truncate text-[12px] font-semibold leading-tight transition-colors duration-300"
                  style={{ color: active ? '#EAF0FA' : 'rgba(255,255,255,0.62)' }}
                >
                  {a.name}
                </span>
                <span className="block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-white/32">
                  {a.tag}
                </span>
              </div>
            </button>
          )
        })}
      </motion.div>
    </div>
  )
}
