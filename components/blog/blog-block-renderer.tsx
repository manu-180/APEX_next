'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { BlogBlock } from '@/lib/data/blog-posts'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'
import { SPRING_FOCUS } from '@/lib/motion'

/**
 * Render simple de bloques de blog post. Soporta los tipos definidos en
 * BlogBlock — paragraphs, headings, listas, quotes, callouts, tablas, CTAs.
 *
 * Markdown inline soportado:
 *  - **negrita** → <strong>
 *  - [texto](/ruta) → <Link> interno (next/link) para internal linking SEO
 *  - [texto](https://…) → <a target="_blank" rel="noopener noreferrer">
 *
 * Módulo client (APEX Design Language v2): además del renderer exporta
 * ReadingProgress (barra de progreso de lectura) y BlogToc (índice sticky
 * con estado activo por IntersectionObserver). El contenido sigue llegando
 * server-rendered en el HTML estático (SSR de client components).
 */
const INLINE_LINK_CLASS =
  'rounded-sm font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/40 underline-offset-2 transition-colors hover:decoration-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] focus-visible:decoration-[var(--color-primary)]'

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let key = 0
  // Matchea **negrita** O [texto](url) en una sola pasada (sin estado global).
  const inlineRegex = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g
  for (const match of text.matchAll(inlineRegex)) {
    const idx = match.index ?? 0
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx))
    }
    if (match[1] !== undefined) {
      parts.push(
        <strong key={`b${key++}`} className="font-bold text-[var(--color-on-surface)]">
          {match[1]}
        </strong>,
      )
    } else {
      const label = match[2]
      const href = match[3]
      const isInternal = href.startsWith('/') || href.startsWith('#')
      parts.push(
        isInternal ? (
          <Link key={`l${key++}`} href={href} className={INLINE_LINK_CLASS}>
            {label}
          </Link>
        ) : (
          <a
            key={`l${key++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={INLINE_LINK_CLASS}
          >
            {label}
          </a>
        ),
      )
    }
    lastIndex = idx + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length === 0 ? text : parts
}

const CALLOUT_STYLES = {
  info: {
    bg: 'rgba(var(--color-primary-rgb), 0.08)',
    border: 'rgba(var(--color-primary-rgb), 0.25)',
    color: 'var(--color-primary)',
    label: 'Nota',
  },
  tip: {
    bg: 'rgba(34, 197, 94, 0.08)',
    border: 'rgba(34, 197, 94, 0.25)',
    color: 'rgb(74, 222, 128)',
    label: 'Tip',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.08)',
    border: 'rgba(245, 158, 11, 0.25)',
    color: 'rgb(251, 191, 36)',
    label: 'Cuidado',
  },
} as const

interface BlogBlockRendererProps {
  block: BlogBlock
  /**
   * id de anchor para headings (lo calcula la page server-side con el mismo
   * slugify que alimenta el TOC — el renderer solo lo consume).
   */
  headingId?: string
  /** Primer párrafo del post → drop cap editorial (spec §10). */
  isFirst?: boolean
}

export function BlogBlockRenderer({ block, headingId, isFirst }: BlogBlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p
          className={cn(
            'text-pretty text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-reading)] mb-5',
            isFirst &&
              'first-letter:float-left first-letter:mr-3 first-letter:font-heading first-letter:text-5xl first-letter:font-extrabold first-letter:leading-none first-letter:text-[var(--color-primary)]',
          )}
        >
          {renderInline(block.text)}
        </p>
      )

    case 'heading': {
      const cls =
        block.level === 2
          ? 'font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mt-12 mb-5 leading-tight'
          : 'font-heading text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] mt-8 mb-3 leading-tight'

      // Anchor visible en hover/focus — deep-linking editorial (spec blog).
      const anchorCls = cn(cls, headingId && 'group scroll-mt-24')
      const anchor = headingId ? (
        <a
          href={`#${headingId}`}
          aria-label="Enlace directo a esta sección"
          className="ml-2 rounded-sm font-normal text-[var(--color-primary)] no-underline opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        >
          #
        </a>
      ) : null

      if (block.level === 2) {
        return (
          <h2 id={headingId} className={anchorCls}>
            {renderInline(block.text)}
            {anchor}
          </h2>
        )
      }
      return (
        <h3 id={headingId} className={anchorCls}>
          {renderInline(block.text)}
          {anchor}
        </h3>
      )
    }

    case 'list':
      if (block.ordered) {
        return (
          <ol className="list-decimal pl-6 space-y-2.5 mb-6 marker:text-[var(--color-primary)] marker:font-bold">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-reading)] pl-1"
              >
                {renderInline(item)}
              </li>
            ))}
          </ol>
        )
      }
      return (
        <ul className="space-y-2.5 mb-6">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-reading)]"
            >
              <span
                aria-hidden
                className="mt-2.5 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )

    case 'quote':
      return (
        <figure
          className="my-8 border-l-2 pl-6 py-2"
          style={{ borderColor: 'var(--color-primary)' }}
        >
          <blockquote className="text-xl sm:text-2xl leading-relaxed font-light italic text-[var(--color-on-surface)]">
            {renderInline(block.text)}
          </blockquote>
          {block.author && (
            <figcaption className="mt-2 text-sm text-[var(--color-on-surface-variant)]">
              — {block.author}
            </figcaption>
          )}
        </figure>
      )

    case 'callout': {
      const s = CALLOUT_STYLES[block.variant]
      return (
        <aside
          className="my-6 rounded-xl p-5 border"
          style={{ backgroundColor: s.bg, borderColor: s.border }}
          role="note"
        >
          <span
            className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
            style={{ color: s.color }}
          >
            {s.label}
          </span>
          <p className="text-sm sm:text-base leading-relaxed text-[var(--color-on-surface)]">
            {renderInline(block.text)}
          </p>
        </aside>
      )
    }

    case 'table':
      return (
        <div className="my-8 overflow-x-auto rounded-xl border" style={{ borderColor: 'var(--glass-border)' }}>
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr
                className="text-left text-xs uppercase tracking-wider font-bold"
                style={{
                  backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="transition-colors duration-150 hover:bg-[rgba(var(--color-primary-rgb),0.04)]"
                  style={{
                    borderTop: idx === 0 ? 'none' : '1px solid var(--glass-border)',
                  }}
                >
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="px-4 py-3 text-sm text-[var(--color-on-surface)]"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'cta':
      // Mini-banner accionable hacia la página money (spec blog editorial).
      return (
        <div
          className="my-10 rounded-2xl border p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-7"
          style={{
            backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
            borderColor: 'rgba(var(--color-primary-rgb), 0.22)',
          }}
        >
          <p className="mb-4 text-base font-semibold leading-relaxed text-[var(--color-on-surface)] sm:mb-0">
            {renderInline(block.text)}
          </p>
          <Link
            href="/servicios"
            className="group btn-tech btn-primary-tech inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold
              active:scale-[0.97]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
          >
            Ver servicios y precios
            <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
          </Link>
        </div>
      )

    default:
      return null
  }
}

/**
 * Barra de progreso de lectura — 2px bajo el navbar, solo transform
 * (scaleX con spring, spec §1). Con reduced-motion sigue el scroll sin
 * suavizado (scroll-linked directo, sin animación autónoma).
 */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const smoothed = useSpring(scrollYProgress, SPRING_FOCUS)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 z-40 h-0.5 origin-left"
      style={{
        top: 'calc(4rem + env(safe-area-inset-top, 0px))',
        scaleX: prefersReducedMotion ? scrollYProgress : smoothed,
        backgroundColor: 'var(--color-primary)',
      }}
    />
  )
}

export interface TocHeading {
  id: string
  text: string
  level: 2 | 3
}

/**
 * Índice sticky del post (solo xl+) con estado activo por
 * IntersectionObserver sobre los headings anclados.
 */
export function BlogToc({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const targets = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      // Banda de lectura: el heading "activo" es el que cruza el primer
      // tercio del viewport.
      { rootMargin: '-20% 0px -70% 0px' },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <nav aria-label="Contenido del artículo" className="text-xs">
      <p className="editorial-label mb-3">Contenido</p>
      <ul className="space-y-0.5 border-l" style={{ borderColor: 'var(--glass-border)' }}>
        {headings.map((h) => {
          const isActive = activeId === h.id
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  '-ml-px block border-l py-1 pr-2 leading-snug transition-colors duration-150',
                  h.level === 3 ? 'pl-6' : 'pl-3',
                  isActive
                    ? 'border-[var(--color-primary)] font-semibold text-[var(--color-primary)]'
                    : 'border-transparent text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]',
                  'focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-sm',
                )}
              >
                {h.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
