'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'
import { type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'
import { cn } from '@/lib/utils/cn'
import {
  ExternalLinkIcon,
  ArrowRightIcon,
  BotLodeIcon,
  AssistifyIcon,
  ContactEngineIcon,
  LumaInvitaIcon,
  CheckIcon,
} from '@/components/ui/icons'
import { Badge } from '@/components/ui/badge'

const PROJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'contact-engine': ContactEngineIcon,
  'luma-invita': LumaInvitaIcon,
}

interface ProjectCardPremiumProps {
  project: ProjectItem
  isActive: boolean
  onApplyTheme: (themeId: ThemeId, e?: React.MouseEvent) => void
  onOpenDrawer: (project: ProjectItem) => void
  className?: string
}

export function ProjectCardPremium({
  project,
  isActive,
  onApplyTheme,
  onOpenDrawer,
  className,
}: ProjectCardPremiumProps): JSX.Element {
  const cardRef = useRef<HTMLElement>(null)
  const shimmerRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useRef(false)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const shimmerEl = shimmerRef.current
    if (!shimmerEl) return
    const controls = animate(0, 360, {
      duration: 6,
      repeat: Infinity,
      ease: 'linear',
      onUpdate: (v) => shimmerEl.style.setProperty('--shimmer-angle', `${v}deg`),
    })
    return () => controls.stop()
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReducedMotion.current) return
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      rotateX.set(((rect.height / 2 - y) / (rect.height / 2)) * 8)
      rotateY.set(((x - rect.width / 2) / (rect.width / 2)) * 8)
      if (spotlightRef.current) {
        spotlightRef.current.style.setProperty('--mx', `${x}px`)
        spotlightRef.current.style.setProperty('--my', `${y}px`)
      }
    },
    [rotateX, rotateY],
  )

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion.current) return
    if (spotlightRef.current) spotlightRef.current.style.opacity = '1'
  }, [])

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0)
    rotateY.set(0)
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0'
  }, [rotateX, rotateY])

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      onApplyTheme(project.themeId as ThemeId, e)
      onOpenDrawer(project)
    },
    [project, onApplyTheme, onOpenDrawer],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onApplyTheme(project.themeId as ThemeId)
        onOpenDrawer(project)
      }
    },
    [project, onApplyTheme, onOpenDrawer],
  )

  const Icon = PROJECT_ICONS[project.themeId]
  const thumbSrc = PROJECT_THUMB_SRC[project.themeId as ThemeId]
  const visibleFeatures = project.features.slice(0, 2)
  const extraFeatures = project.features.length - 2

  const tierLabel =
    project.themeId === 'assistify'
      ? 'App Store + Play Store'
      : project.themeId === 'luma-invita'
        ? 'Invitaciones · Web'
        : 'SaaS'

  return (
    <div style={{ perspective: '1200px' }} className={className}>
      <motion.article
        ref={cardRef as React.RefObject<HTMLElement>}
        role="button"
        tabIndex={0}
        aria-label={`Abrir caso ${project.title}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: springX, rotateY: springY }}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer',
          'bg-[var(--color-surface-low)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]',
        )}
        data-hover
        data-inspector-title="Tarjeta Premium 3D"
        data-inspector-desc="Tilt 3D con spotlight radial siguiendo el cursor y borde shimmer animado. Click aplica el tema del proyecto y abre el drawer."
        data-inspector-cat="3D · Spotlight"
      >
        {/* Spotlight — radial gradient that follows the cursor */}
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
          style={{
            opacity: 0,
            background:
              'radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--color-primary-rgb), 0.18), transparent 40%)',
          }}
        />

        {/* Shimmer border — conic-gradient rotated via framer-motion animate() */}
        <div
          ref={shimmerRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
          style={
            {
              padding: '1px',
              background: `conic-gradient(from var(--shimmer-angle, 0deg), transparent, rgba(var(--color-primary-rgb), ${isActive ? '0.6' : '0.3'}), transparent 30%)`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            } as React.CSSProperties
          }
        />

        {/* ── Visual hero ──────────────────────────────────────────────── */}
        <div className="relative h-44 flex-shrink-0 overflow-hidden md:h-48">
          {thumbSrc ? (
            <Image
              src={thumbSrc}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : Icon ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)' }}
            >
              {/* Subtle dot grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.3) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <Icon className="relative z-10 w-[80px] h-[80px] opacity-25 text-[var(--color-primary)] theme-transition" />
            </div>
          ) : null}

          {/* Readability gradient — bottom-up */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
            style={{ background: 'linear-gradient(to top, var(--color-surface-low), transparent)' }}
          />

          {/* External link button */}
          {project.url && !project.url.startsWith('/') && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Ver ${project.title} en vivo`}
              className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-lg bg-black/30 text-white/70 backdrop-blur-sm transition-colors duration-200 hover:bg-black/50 hover:text-white"
            >
              <ExternalLinkIcon className="size-3.5" />
            </a>
          )}

          {/* Active indicator badge */}
          {isActive && (
            <div
              className="absolute left-3 top-3 z-20 flex size-7 items-center justify-center rounded-full"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                boxShadow: '0 0 12px rgba(var(--color-primary-rgb), 0.5)',
              }}
              aria-label="Tema activo"
            >
              <CheckIcon className="size-3.5" />
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col p-6">
          {/* Header */}
          <div>
            <h3 className="font-heading text-2xl font-extrabold leading-tight text-[var(--color-on-surface)]">
              {project.title}
            </h3>
            <p
              className="mt-0.5 text-sm font-medium glow-text theme-transition"
              style={{ color: 'var(--color-primary)' }}
            >
              {project.subtitle}
            </p>
          </div>

          {/* Tagline */}
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            {project.tagline}
          </p>

          {/* Features (max 2) */}
          <ul className="mt-4 flex-1 space-y-2" aria-label="Características del proyecto">
            {visibleFeatures.map((f) => (
              <li key={f.title} className="flex items-start gap-2">
                <ArrowRightIcon className="mt-0.5 size-3.5 flex-shrink-0 text-[var(--color-primary)] theme-transition" />
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5">
                  <span className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {f.title}
                  </span>
                  <span className="text-xs text-[var(--color-on-surface-variant)]">
                    {f.description}
                  </span>
                </div>
              </li>
            ))}
            {extraFeatures > 0 && (
              <li>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDrawer(project)
                  }}
                  className="text-xs font-medium hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  +{extraFeatures} más →
                </button>
              </li>
            )}
          </ul>

          {/* ── Footer ─────────────────────────────────────────────────── */}
          <div
            className="mt-6 flex items-center justify-between pt-4"
            style={{
              borderTop: '1px solid',
              borderImage:
                'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.2), transparent) 1',
            }}
          >
            <Badge variant="default" className="text-[10px]">
              {tierLabel}
            </Badge>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium"
              style={{ color: 'var(--color-primary)' }}
            >
              Explorar
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                <ArrowRightIcon className="size-3" />
              </span>
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
