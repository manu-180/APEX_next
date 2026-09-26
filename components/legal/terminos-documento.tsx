import Link from 'next/link'
import { Children, isValidElement, type ReactNode } from 'react'
import Markdown, { type Components } from 'react-markdown'
import { cn } from '@/lib/utils/cn'
import { FOCO } from '@/components/legal/estilos'

function textoPlano(nodo: ReactNode): string {
  return Children.toArray(nodo)
    .map((hijo) => {
      if (typeof hijo === 'string' || typeof hijo === 'number') return String(hijo)
      if (isValidElement<{ children?: ReactNode }>(hijo)) return textoPlano(hijo.props.children)
      return ''
    })
    .join('')
}

function ancla(nodo: ReactNode): string {
  return textoPlano(nodo)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const TITULO_2 = 'scroll-mt-28 font-heading text-2xl font-extrabold tracking-tight text-[var(--color-on-surface)]'

const COMPONENTES: Components = {
  h1: ({ children }) => (
    <h2 id={ancla(children)} className={cn(TITULO_2, 'mt-14')}>
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 id={ancla(children)} className={cn(TITULO_2, 'mt-14 first:mt-0')}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      id={ancla(children)}
      className="mt-10 scroll-mt-28 font-heading text-lg font-bold text-[var(--color-on-surface)]"
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className="mt-8 font-heading text-base font-bold text-[var(--color-on-surface)]">{children}</h4>,
  p: ({ children }) => (
    <p className="mt-4 text-[15px] leading-7 text-[var(--color-on-surface-reading)]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2.5 pl-5 marker:text-[var(--color-primary)]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2.5 pl-5 marker:font-semibold marker:text-[var(--color-on-surface-variant)]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 text-[15px] leading-7 text-[var(--color-on-surface-reading)] [&>p]:mt-0">{children}</li>
  ),
  strong: ({ children }) => <strong className="font-semibold text-[var(--color-on-surface)]">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l-2 border-[rgba(var(--color-primary-rgb),0.45)] pl-4 [&>p]:text-sm [&>p]:italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="divider-theme my-12" />,
  a: ({ href, children }) => {
    const clase = cn(
      'rounded font-medium text-[var(--color-on-surface)] underline decoration-[rgba(var(--color-primary-rgb),0.5)] underline-offset-4 hover:decoration-[var(--color-primary)]',
      FOCO,
    )
    if (href?.startsWith('/')) {
      return (
        <Link href={href} prefetch={false} className={clase}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={clase}>
        {children}
      </a>
    )
  },
  code: ({ children }) => <code className="rounded bg-[var(--color-surface-high)] px-1.5 py-0.5 text-[0.9em]">{children}</code>,
  img: () => null,
}

export function TerminosMarkdown({ markdown }: { markdown: string }) {
  return (
    <Markdown components={COMPONENTES} skipHtml>
      {markdown}
    </Markdown>
  )
}
