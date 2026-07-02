'use client'

/**
 * CTA de cierre con inclinación 3D — shell compartido (spec §8.3).
 * Extracción del CTA de /tecnologias para que /tecnologias y /muestrario
 * consuman la misma pieza: perspective 1000 + SPRING_TILT + glare + blob,
 * con profundidad REAL de preserve-3d (contenido a +28px, blob a −20px).
 *
 * El contenido (headings, WhatsAppOutboundLink, botones) lo aporta el
 * consumidor vía children — acá solo vive la física y la superficie.
 */

import { type ReactNode } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useTheme } from '@/components/providers/theme-mode-provider'
import { SPRING_TILT } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'

interface TiltCtaCardProps {
  children: ReactNode
  /** Clases extra del panel (permite ajustar padding/radius por página). */
  className?: string
  /** Inclinación máxima en grados (spec §8.3: máx 4–6). */
  maxTilt?: number
  /** Passthrough del modo inspector (X-Ray). */
  inspectorTitle?: string
  inspectorDesc?: string
  inspectorCat?: string
}

export function TiltCtaCard({
  children,
  className,
  maxTilt = 6,
  inspectorTitle,
  inspectorDesc,
  inspectorCat,
}: TiltCtaCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const isLight = resolvedTheme === 'light'

  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const glareXTarget = useMotionValue(50)
  const tiltX = useSpring(tiltXTarget, SPRING_TILT)
  const tiltY = useSpring(tiltYTarget, SPRING_TILT)
  const glareX = useSpring(glareXTarget, SPRING_TILT)

  // Sombra reactiva al tilt — SIEMPRE tintada (spec §5), nunca negro puro.
  const cardShadow = useTransform([tiltX, tiltY], ([rx, ry]) => {
    const x = rx as number
    const y = ry as number
    return isLight
      ? `0 ${12 + Math.abs(x) * 2}px ${36 + Math.abs(y) * 4}px rgba(var(--shadow-tint-rgb), 0.08), ${y * 1.5}px ${-x * 1.5}px 28px rgba(var(--color-primary-rgb), 0.12)`
      : `0 ${14 + Math.abs(x) * 3}px ${42 + Math.abs(y) * 5}px rgba(var(--shadow-tint-rgb), 0.55), ${y * 2}px ${-x * 2}px 38px rgba(var(--color-primary-rgb), 0.16)`
  })

  const glareGradient = useTransform(glareX, (gx) =>
    isLight
      ? `linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) ${gx}%, rgba(0,0,0,0.025) ${Math.min(gx + 11, 100)}%, rgba(0,0,0,0) ${Math.min(gx + 24, 100)}%)`
      : `linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) ${gx}%, rgba(255,255,255,0.06) ${Math.min(gx + 11, 100)}%, rgba(255,255,255,0) ${Math.min(gx + 24, 100)}%)`,
  )

  const staticShadow = isLight
    ? '0 12px 36px rgba(var(--shadow-tint-rgb), 0.08), 0 0 28px rgba(var(--color-primary-rgb), 0.12)'
    : '0 14px 42px rgba(var(--shadow-tint-rgb), 0.55), 0 0 38px rgba(var(--color-primary-rgb), 0.16)'

  const staticGlare = isLight
    ? 'linear-gradient(118deg, rgba(0,0,0,0) 34%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.025) 61%, rgba(0,0,0,0) 74%)'
    : 'linear-gradient(118deg, rgba(255,255,255,0) 34%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.06) 61%, rgba(255,255,255,0) 74%)'

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        data-hover
        data-inspector-title={inspectorTitle}
        data-inspector-desc={inspectorDesc}
        data-inspector-cat={inspectorCat}
        className={cn(
          'relative rounded-3xl border p-7 sm:p-10',
          // Sin preserve-3d (reduced): recorte clásico del blob en el shell
          prefersReducedMotion && 'overflow-hidden',
          className,
        )}
        style={{
          borderColor: 'var(--glass-border)',
          background:
            'linear-gradient(155deg, color-mix(in srgb, var(--color-surface-high) 92%, var(--color-primary) 8%) 0%, var(--color-surface-base) 100%)',
          ...(prefersReducedMotion
            ? {
                transform: 'none',
                boxShadow: staticShadow,
              }
            : {
                rotateX: tiltX,
                rotateY: tiltY,
                translateZ: 0,
                boxShadow: cardShadow,
                transformStyle: 'preserve-3d',
              }),
        }}
        onMouseMove={(e) => {
          if (prefersReducedMotion) return
          const rect = e.currentTarget.getBoundingClientRect()
          const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1
          const relY = ((e.clientY - rect.top) / rect.height) * 2 - 1
          tiltXTarget.set(relY * -maxTilt)
          tiltYTarget.set(relX * maxTilt)
          glareXTarget.set(((e.clientX - rect.left) / rect.width) * 100)
        }}
        onMouseLeave={() => {
          tiltXTarget.set(0)
          tiltYTarget.set(0)
          glareXTarget.set(50)
        }}
      >
        {/* Glare — recorta por su propio radio (rounded-[inherit]): el shell no
            puede llevar overflow-hidden porque aplastaría el preserve-3d */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: prefersReducedMotion ? staticGlare : glareGradient,
            opacity: prefersReducedMotion ? (isLight ? 0.45 : 0.35) : isLight ? 0.55 : 0.7,
            transition: 'opacity 260ms var(--ease-out)',
          }}
        />

        {/* Blob a −20px: detrás del plano del panel, ocluido por la superficie
            y visible como halo en el borde (profundidad real del preserve-3d) */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full opacity-60 blur-3xl"
          style={{
            background: 'rgba(var(--color-primary-rgb), 0.26)',
            ...(prefersReducedMotion ? {} : { transform: 'translateZ(-20px)' }),
          }}
        />

        {/* Contenido a +28px — se despega del panel al inclinar */}
        <div
          className="relative"
          style={prefersReducedMotion ? undefined : { transform: 'translateZ(28px)' }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
