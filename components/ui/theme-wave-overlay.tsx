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

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y, colorRgb } = (e as CustomEvent<WaveConfig>).detail
      setWave({ key: Date.now(), x, y, colorRgb })
    }
    window.addEventListener('apex:wave', handler)
    return () => window.removeEventListener('apex:wave', handler)
  }, [])

  if (!wave) return null

  return (
    <WaveEffect
      key={wave.key}
      x={wave.x}
      y={wave.y}
      colorRgb={wave.colorRgb}
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
  onDone,
}: {
  x: number
  y: number
  colorRgb: string
  onDone: () => void
}) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 9998 }}
    >
      {/* ── Layer 1: Expanding glow wash ─────────────────────────────────── */}
      {/* clip-path circle expands from click origin; reveals new-theme color  */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: `circle(0px at ${x}px ${y}px)` }}
        animate={{ clipPath: `circle(200vmax at ${x}px ${y}px)` }}
        transition={{ duration: 1.0, ease: [0.25, 0.0, 0.25, 1.0] }}
        style={{
          background: `radial-gradient(
            ellipse 60% 60% at ${x}px ${y}px,
            rgba(${colorRgb}, 0.13) 0%,
            rgba(${colorRgb}, 0.06) 35%,
            rgba(${colorRgb}, 0.02) 60%,
            transparent 80%
          )`,
        }}
        onAnimationComplete={onDone}
      />

      {/* ── Layer 2: Scan-line overlay ────────────────────────────────────── */}
      {/* Thin horizontal scanlines flash as the wave passes */}
      <motion.div
        className="absolute inset-0"
        initial={{ clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 }}
        animate={{ clipPath: `circle(200vmax at ${x}px ${y}px)`, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.2, 0, 0.4, 1] }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(${colorRgb}, 0.025) 3px,
            rgba(${colorRgb}, 0.025) 4px
          )`,
        }}
      />

      {/* ── Layer 3: Primary glowing shockwave ring ───────────────────────── */}
      {/* Scale a 200×200 circle from 0 → 22× to cover the viewport.          */}
      {/* At scale 22: effective diameter = 4400px — covers any screen.        */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 100,
          top: y - 100,
          width: 200,
          height: 200,
          border: `0.7px solid rgba(${colorRgb}, 1)`,
          boxShadow: [
            `0 0 0 1px rgba(${colorRgb}, 0.25)`,
            `0 0 18px 2px rgba(${colorRgb}, 0.55)`,
            `0 0 50px 5px rgba(${colorRgb}, 0.18)`,
            `inset 0 0 18px rgba(${colorRgb}, 0.08)`,
          ].join(', '),
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 22, opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.12, 0, 0.30, 1] }}
      />

      {/* ── Layer 4: Secondary faster ring ───────────────────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 70,
          top: y - 70,
          width: 140,
          height: 140,
          border: `0.5px solid rgba(${colorRgb}, 0.7)`,
          boxShadow: `0 0 12px 2px rgba(${colorRgb}, 0.35)`,
        }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 24, opacity: 0 }}
        transition={{ duration: 0.65, ease: [0.12, 0, 0.30, 1] }}
      />

      {/* ── Layer 5: Tertiary slow outer ring ────────────────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 160,
          top: y - 160,
          width: 320,
          height: 320,
          border: `0.3px solid rgba(${colorRgb}, 0.35)`,
        }}
        initial={{ scale: 0, opacity: 0.6 }}
        animate={{ scale: 16, opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.08, 0, 0.25, 1] }}
      />

      {/* ── Layer 6: Origin burst (radial flash) ─────────────────────────── */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: x - 50,
          top: y - 50,
          width: 100,
          height: 100,
          background: `radial-gradient(
            circle,
            rgba(${colorRgb}, 0.9) 0%,
            rgba(${colorRgb}, 0.4) 30%,
            rgba(${colorRgb}, 0.1) 60%,
            transparent 80%
          )`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 3.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.0, 0, 0.2, 1] }}
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
          boxShadow: `0 0 20px 8px rgba(${colorRgb}, 0.6), 0 0 40px 16px rgba(${colorRgb}, 0.2)`,
        }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </div>
  )
}
