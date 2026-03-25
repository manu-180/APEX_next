'use client'

import { cn } from '@/lib/utils/cn'

interface GridBackgroundProps {
  className?: string
  showScanline?: boolean
  showRadialLight?: boolean
}

export function GridBackground({
  className,
  showScanline = false,
  showRadialLight = true,
}: GridBackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* HUD line grid */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-cyan) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-cyan) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial light from top center */}
      {showRadialLight && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 40% at 50% -5%, rgba(var(--color-primary-rgb), 0.12), transparent 70%),
              radial-gradient(ellipse 60% 30% at 50% 0%, rgba(6, 182, 212, 0.05), transparent 60%)
            `,
          }}
        />
      )}

      {/* Horizontal scanline */}
      {showScanline && (
        <div
          className="absolute left-0 right-0 h-px animate-scanline"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(6, 182, 212, 0.08), transparent)',
          }}
        />
      )}

      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, var(--color-surface-base) 100%)`,
        }}
      />
    </div>
  )
}
