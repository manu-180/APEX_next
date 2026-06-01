import Link from 'next/link'
import type { BlogBlock } from '@/lib/data/blog-posts'

/**
 * Render simple de bloques de blog post. Soporta los tipos definidos en
 * BlogBlock — paragraphs, headings, listas, quotes, callouts, tablas, CTAs.
 *
 * Markdown inline soportado:
 *  - **negrita** → <strong>
 *  - [texto](/ruta) → <Link> interno (next/link) para internal linking SEO
 *  - [texto](https://…) → <a target="_blank" rel="noopener noreferrer">
 */
const INLINE_LINK_CLASS =
  'font-medium text-[var(--color-primary)] underline decoration-[var(--color-primary)]/40 underline-offset-2 transition-colors hover:decoration-[var(--color-primary)]'

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

export function BlogBlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-pretty text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-variant)] mb-5">
          {renderInline(block.text)}
        </p>
      )

    case 'heading': {
      const cls =
        block.level === 2
          ? 'font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mt-12 mb-5 leading-tight'
          : 'font-heading text-xl sm:text-2xl font-bold text-[var(--color-on-surface)] mt-8 mb-3 leading-tight'

      if (block.level === 2) {
        return <h2 className={cls}>{renderInline(block.text)}</h2>
      }
      return <h3 className={cls}>{renderInline(block.text)}</h3>
    }

    case 'list':
      if (block.ordered) {
        return (
          <ol className="list-decimal pl-6 space-y-2.5 mb-6 marker:text-[var(--color-primary)] marker:font-bold">
            {block.items.map((item, i) => (
              <li
                key={i}
                className="text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-variant)] pl-1"
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
              className="flex items-start gap-3 text-base sm:text-lg leading-relaxed text-[var(--color-on-surface-variant)]"
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
      return (
        <div className="my-8 text-center">
          <span className="text-sm font-semibold text-[var(--color-primary)]">
            {renderInline(block.text)}
          </span>
        </div>
      )

    default:
      return null
  }
}
