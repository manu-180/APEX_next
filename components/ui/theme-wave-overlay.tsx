'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface WaveConfig {
  key: number
  x: number
  y: number
  colorRgb: string
}

// ─── ThemeWaveOverlay ─────────────────────────────────────────────────────────
// Renders an expanding shockwave from the click origin when a theme card is
// clicked. Listens to the custom DOM event 'apex:wave' dispatched by useTheme.
// Three visual layers:
//   1. Expanding glow wash (clip-path circle, new primary color at low opacity)
//   2. Primary glowing ring (scale from 0 → full viewport coverage)
//   3. Secondary faster ring + origin burst

export function ThemeWaveOverlay() {
  const [wave, setWave] = useState<WaveConfig | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [simpleMode, setSimpleMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReducedMotion(media.matches)
      // Conservador: en equipos modestos simplificamos la ola para bajar paint cost.
      setSimpleMode(media.matches || (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4))
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const handler = (e: Event) => {
      const { x, y, colorRgb } = (e as CustomEvent<WaveConfig>).detail
      setWave({ key: Date.now(), x, y, colorRgb })
    }
    window.addEventListener('apex:wave', handler)
    return () => window.removeEventListener('apex:wave', handler)
  }, [reducedMotion])

  if (!wave) return null

  return (
    <WaveEffect
      key={wave.key}
      x={wave.x}
      y={wave.y}
      colorRgb={wave.colorRgb}
      simpleMode={simpleMode}
      onDone={() => setWave(null)}
    />
  )
}

// ─── WaveEffect ───────────────────────────────────────────────────────────────
// Actual animation layers. Rendered as a fixed full-screen portal.

function WaveEffect({
  x,
  y,
  colorRgb,
  simpleMode,
  onDone,
}: {
  x: number
  y: number
  colorRgb: string
  simpleMode: boolean
  onDone: () => void
}) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 9998 }}
    >
      {/* Capa principal: flash radial suave (evita clip-path para reducir jank). */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 140,
          top: y - 140,
          width: 280,
          height: 280,
          background: `radial-gradient(circle, rgba(${colorRgb}, 0.26) 0%, rgba(${colorRgb}, 0.12) 30%, transparent 75%)`,
        }}
        initial={{ scale: 0.15, opacity: 0.45 }}
        animate={{ scale: 22, opacity: 0 }}
        transition={{ duration: 0.78, ease: [0.2, 0, 0.3, 1] }}
        onAnimationComplete={onDone}
      />

      {/* ── Layer 3: Primary glowing shockwave ring ───────────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 95,
          top: y - 95,
          width: 190,
          height: 190,
          border: `0.7px solid rgba(${colorRgb}, 1)`,
          boxShadow: `0 0 16px 2px rgba(${colorRgb}, 0.42)`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: simpleMode ? 16 : 20, opacity: 0 }}
        transition={{ duration: 0.62, ease: [0.12, 0, 0.3, 1] }}
      />

      {!simpleMode && (
        <motion.div
          className="absolute rounded-full"
          style={{
            left: x - 65,
            top: y - 65,
            width: 130,
            height: 130,
            border: `0.5px solid rgba(${colorRgb}, 0.75)`,
          }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 22, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.12, 0, 0.3, 1] }}
        />
      )}

      {/* ── Layer 6: Origin burst (radial flash) ─────────────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 44,
          top: y - 44,
          width: 88,
          height: 88,
          background: `radial-gradient(
            circle,
            rgba(${colorRgb}, 0.9) 0%,
            rgba(${colorRgb}, 0.4) 30%,
            rgba(${colorRgb}, 0.1) 60%,
            transparent 80%
          )`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3.2, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      />

      {/* ── Layer 7: Inner hot core (bright point flash) ─────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 8,
          top: y - 8,
          width: 16,
          height: 16,
          background: `rgba(${colorRgb}, 1)`,
          boxShadow: `0 0 16px 6px rgba(${colorRgb}, 0.45)`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />
    </div>
  )
}
