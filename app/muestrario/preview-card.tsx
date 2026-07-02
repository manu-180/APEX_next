'use client'

/**
 * Card de sitio para el muestrario — nivel museo (Design Language v2).
 * Double-bezel shell + core con radios concéntricos (spec §3), tilt 3D suave
 * con SPRING_TILT (spec §8.3), spotlight border que sigue el cursor vía
 * CSS vars --mx/--my (spec §7, cero re-renders) y browser chrome compartido.
 * La card entera es un link que abre la web en vivo.
 *
 * Dos modos de preview, mismo shell (coherencia visual en toda la página):
 *  - 'image' → screenshot local optimizada (next/image). Fallback: póster de
 *     marca con el ícono del producto. Lo usan los casos reales en producción.
 *  - 'live'  → captura en vivo del sitio (servicio externo, <img>). Fallback:
 *     póster generado desde la paleta real del demo. Lo usa el laboratorio.
 *
 * Un solo acento (`--color-primary` del tema activo): la variedad cromática la
 * ponen las capturas, no la UI → coherente en los 7 temas. Motion-reduce safe.
 */

import { useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { BrowserChrome } from '@/components/ui/browser-chrome'
import { ExternalLinkIcon } from '@/components/ui/icons'
import { SPRING_TILT } from '@/lib/motion'

export type PreviewMode = 'image' | 'live'

/** Inclinación máxima del tilt 3D (spec §8.3: cards premium, máx 4–6°). */
const MAX_TILT = 4

export interface PreviewCardProps {
  href: string
  domain: string
  name: string
  blurb: string
  tags: string[]
  previewSrc: string
  previewMode: PreviewMode
  /** Badge superior (ej. "Producto propio" / "Cliente"). */
  badge?: string
  /** Pill destacada (ej. "Nuevo"). */
  flag?: string
  /** Card destacada del bento: preview más panorámica y título mayor. */
  featured?: boolean
  /** Fallback del modo 'image': ícono de marca. */
  BrandIcon?: React.FC<{ className?: string }>
  /** Fallback del modo 'live': hex codes de la paleta del demo. */
  paletteHexes?: string[]
  /** Inspector / tooltips (opcional). */
  inspectorTitle?: string
  inspectorDesc?: string
  className?: string
}

/* ── Póster de marca (fallback) ─────────────────────────────────────────── */
function BrandPoster({
  name,
  domain,
  BrandIcon,
  paletteHexes,
}: {
  name: string
  domain: string
  BrandIcon?: React.FC<{ className?: string }>
  paletteHexes?: string[]
}) {
  const hexes = paletteHexes?.filter(Boolean) ?? []
  const background =
    hexes.length >= 2
      ? `linear-gradient(140deg, ${hexes[0]} 0%, ${hexes[1]} ${hexes[2] ? '55%' : '100%'}${
          hexes[2] ? `, ${hexes[2]} 100%` : ''
        })`
      : 'radial-gradient(120% 120% at 50% 0%, rgba(var(--color-primary-rgb),0.18) 0%, transparent 60%), var(--color-surface-low)'

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 px-4 text-center" style={{ background }}>
      {/* velo para legibilidad sobre paletas claras */}
      {hexes.length >= 2 && (
        <span aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45))' }} />
      )}
      <span className="relative z-10 flex flex-col items-center gap-2">
        {BrandIcon ? (
          <BrandIcon className="size-11 opacity-95" />
        ) : (
          <ExternalLinkIcon className={cn('size-8', hexes.length >= 2 ? 'text-white/90' : 'text-[var(--color-primary)] opacity-80')} />
        )}
        <span className={cn('text-base font-extrabold tracking-tight', hexes.length >= 2 ? 'text-white' : 'text-[var(--color-on-surface)]')} style={{ fontFamily: 'var(--font-heading)' }}>
          {name}
        </span>
        <span className={cn('text-[11px]', hexes.length >= 2 ? 'text-white/70' : 'text-[var(--color-on-surface-variant)] opacity-70')}>
          {domain}
        </span>
      </span>
    </div>
  )
}

/* ── Área de preview ────────────────────────────────────────────────────── */
function Preview(props: PreviewCardProps) {
  const { previewSrc, previewMode, name, domain, featured, BrandIcon, paletteHexes } = props
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const showPoster = failed || !previewSrc

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-[var(--color-surface-base)]',
        featured ? 'aspect-[16/8]' : 'aspect-[16/10]',
      )}
    >
      {showPoster ? (
        <BrandPoster name={name} domain={domain} BrandIcon={BrandIcon} paletteHexes={paletteHexes} />
      ) : previewMode === 'image' ? (
        <Image
          src={previewSrc}
          alt={`Captura del sitio ${name} (${domain})`}
          fill
          sizes={
            featured
              ? '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 720px'
              : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 540px'
          }
          className="object-cover object-top transition-transform duration-[1.1s] ease-out will-change-transform group-hover/card:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          {/* skeleton mientras carga la captura en vivo (anti-CLS, sin spinner):
              shimmer-sweep de foundation — solo background-position */}
          {!loaded && <span aria-hidden className="shimmer-sweep absolute inset-0" />}
          {/* eslint-disable-next-line @next/next/no-img-element -- captura externa que cambia con el deploy; next/image la cachearía 1 año */}
          <img
            src={previewSrc}
            alt={`Captura en vivo de ${name} (${domain})`}
            loading="lazy"
            decoding="async"
            className={cn(
              'absolute inset-0 size-full object-cover object-top transition-[transform,opacity] duration-700 ease-out will-change-transform',
              'group-hover/card:scale-[1.05] motion-reduce:transform-none',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </>
      )}

      {/* velo inferior + overlay "Ver en vivo" en hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:transition-none"
        style={{ background: 'linear-gradient(to top, rgba(var(--color-primary-rgb),0.28), transparent)' }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white opacity-0 backdrop-blur-md transition-[transform,opacity] duration-300 group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
        style={{ background: 'rgba(var(--color-primary-rgb),0.92)' }}
      >
        Ver en vivo
        <ExternalLinkIcon className="size-3" />
      </span>
    </div>
  )
}

/* ── Card ───────────────────────────────────────────────────────────────── */
export function PreviewCard(props: PreviewCardProps) {
  const { href, name, blurb, tags, badge, flag, featured = false, inspectorTitle, inspectorDesc, className } = props
  const prefersReducedMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  // Tilt 3D (spec §8.3): motion values + spring, nunca useState en mousemove.
  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const tiltX = useSpring(tiltXTarget, SPRING_TILT)
  const tiltY = useSpring(tiltYTarget, SPRING_TILT)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Spotlight (spec §7): CSS vars con setProperty — cero re-renders.
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    if (prefersReducedMotion) return
    tiltXTarget.set(((y / rect.height) * 2 - 1) * -MAX_TILT)
    tiltYTarget.set(((x / rect.width) * 2 - 1) * MAX_TILT)
  }

  const handleMouseLeave = () => {
    setHovered(false)
    tiltXTarget.set(0)
    tiltYTarget.set(0)
  }

  return (
    <div className={cn('h-full', className)} style={{ perspective: 1000 }}>
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          // Shell del double-bezel (spec §3): rounded-2xl (1rem) − p-1.5 (6px)
          // → core rounded-[0.625rem]. Radio interior = exterior − padding.
          'group/card relative flex h-full flex-col rounded-2xl p-1.5',
          'border border-[var(--glass-border)] bg-[var(--color-surface-low)]',
          'transition-[box-shadow,border-color] duration-300',
          'hover:border-[rgba(var(--color-primary-rgb),0.4)] hover:shadow-card-hover',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
        )}
        style={prefersReducedMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        data-hover
        data-inspector-title={inspectorTitle}
        data-inspector-desc={inspectorDesc}
        data-inspector-cat="Muestrario · Prueba de diseño"
      >
        {/* Spotlight border (spec §7): anillo de 1px que sigue el cursor,
            primary 0.4 fundiendo a --glass-border al 70%. Solo opacity. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
          style={{
            padding: '1px',
            background:
              'radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--color-primary-rgb),0.4), var(--glass-border) 70%)',
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Core del bezel: radio concéntrico + filo interior */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[0.625rem] bg-[var(--color-surface)] ring-1 ring-inset ring-[var(--glass-border)]">
          {/* acento superior del tema */}
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 z-20 h-[2px]"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--color-primary-rgb),0.85) 50%, transparent)' }}
          />

          {/* flag destacada (ej. "Nuevo") */}
          {flag && (
            <span
              className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm"
              style={{ background: 'rgba(var(--color-primary-rgb),0.95)' }}
            >
              <span className="size-1.5 rounded-full bg-white/90" />
              {flag}
            </span>
          )}

          <div className="relative w-full">
            <BrowserChrome domain={props.domain} isHovered={hovered} />
            <Preview {...props} />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-2 flex items-center gap-2.5">
              <h4 className={cn('font-bold leading-none text-[var(--color-on-surface)]', featured ? 'text-xl' : 'text-base')}>
                {name}
              </h4>
              {badge && (
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em]"
                  style={{
                    color: 'var(--color-on-surface-variant)',
                    background: 'rgba(var(--color-primary-rgb),0.08)',
                    border: '1px solid rgba(var(--color-primary-rgb),0.18)',
                  }}
                >
                  {badge}
                </span>
              )}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{blurb}</p>

            {tags.length > 0 && (
              <ul className="mt-auto mb-4 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <li
                    key={t}
                    className="inline-flex items-center rounded-md px-2 py-1 text-[10px] font-semibold text-[var(--color-on-surface)]"
                    style={{
                      background: 'rgba(var(--color-primary-rgb),0.07)',
                      border: '1px solid rgba(var(--color-primary-rgb),0.16)',
                    }}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA pill: gana fondo primary en hover del card (spec §8.4) */}
            <span
              className={cn(
                'inline-flex items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-xs font-bold text-[var(--color-primary)]',
                'border-[rgba(var(--color-primary-rgb),0.25)] transition-[background-color,border-color] duration-300',
                'group-hover/card:border-[rgba(var(--color-primary-rgb),0.4)] group-hover/card:bg-[rgba(var(--color-primary-rgb),0.1)]',
                tags.length === 0 && 'mt-auto',
              )}
            >
              Abrir sitio real
              <ExternalLinkIcon className="size-3.5 transition-transform duration-300 group-hover/card:translate-x-1 motion-reduce:transform-none" />
            </span>
          </div>
        </div>
      </motion.a>
    </div>
  )
}
