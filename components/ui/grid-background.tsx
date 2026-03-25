'use client'

import { cn } from '@/lib/utils/cn'

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-on-surface) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Primary gradient vignette */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(var(--color-primary-rgb), 0.15), transparent)',
        }}
      />
    </div>
  )
}
