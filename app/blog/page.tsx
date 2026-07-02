import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/data/blog-posts'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { ArrowRightIcon } from '@/components/ui/icons'
import { APP_URL } from '@/lib/constants'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { SectionReveal } from '@/components/ui/section-reveal'
import { STAGGER_BASE } from '@/lib/motion'
import { cn } from '@/lib/utils/cn'

export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog APEX — Precios, stack, casos y estrategia para PyMEs argentinas',
  description:
    'Artículos honestos sobre precios reales de desarrollo web y apps en Argentina 2026, comparativas de tecnología, casos de estudio y cómo elegir bien tu proveedor.',
  alternates: { canonical: `${APP_URL.replace(/\/$/, '')}/blog` },
  keywords: [
    'blog desarrollo web argentina',
    'precios software argentina',
    'next.js vs wordpress',
    'app móvil flutter',
    'integrar mercadopago afip',
  ],
}

const CATEGORY_LABELS: Record<string, string> = {
  pricing: 'Precios',
  tecnologia: 'Tecnología',
  cro: 'Conversión',
  estrategia: 'Estrategia',
}

export default function BlogPage() {
  // Posts sorted por fecha publicación (más nuevo primero)
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  const [featured, ...rest] = posts

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Blog', url: `${APP_URL.replace(/\/$/, '')}/blog` },
        ]}
      />

      {/* ── Hero editorial ──────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-32 md:pt-40 pb-12 md:pb-16 overflow-hidden">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 12% -5%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="mb-6 flex items-center gap-3">
            <span
              className="font-mono text-[10px] font-bold tracking-[0.32em] uppercase"
              style={{ color: 'var(--color-primary)' }}
            >
              / Blog · Recursos
            </span>
            <span
              aria-hidden
              className="h-px flex-1 max-w-[120px]"
              style={{
                background:
                  'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), transparent)',
              }}
            />
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <Badge variant="primary">{posts.length} artículos</Badge>
            <Badge variant="outline">Actualizado 2026</Badge>
          </div>

          <h1 className="font-heading text-balance leading-[0.95] mb-6 max-w-4xl">
            <span className="block text-4xl sm:text-6xl md:text-7xl font-extralight text-[var(--color-on-surface-variant)]">
              Sin venta
            </span>
            <span className="block text-5xl sm:text-7xl md:text-[5.5rem] font-extrabold text-[var(--color-on-surface)] tracking-tight">
              encubierta.
            </span>
          </h1>

          <p className="text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed">
            Artículos honestos sobre precios reales del mercado argentino, comparativas de
            tecnología y casos. Si después querés contratarme, bien. Si no, también.
          </p>
        </div>
      </section>

      {/* ── Featured post — double-bezel E3 (spec §3) ──────────────── */}
      {featured && (
        <section className="relative pb-12">
          <div className="mx-auto max-w-6xl px-6">
            <SectionReveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="group bezel-shell block overflow-hidden
                  transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
                  hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
                  hover:shadow-[0_18px_50px_-22px_rgba(var(--color-primary-rgb),0.45)]
                  active:translate-y-0 active:scale-[0.985] active:duration-100
                  focus-visible:outline-none focus-visible:-translate-y-1
                  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
                  motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                style={{
                  background:
                    'linear-gradient(155deg, rgba(var(--color-primary-rgb), 0.08) 0%, rgba(var(--color-primary-rgb), 0.03) 45%, transparent 75%), var(--color-surface-low)',
                  borderColor: 'rgba(var(--color-primary-rgb), 0.2)',
                }}
              >
                <div className="bezel-core p-8 sm:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      N.º 01
                    </span>
                    <Badge variant="primary">Más reciente</Badge>
                    <Badge variant="outline">{CATEGORY_LABELS[featured.category]}</Badge>
                    <span className="text-[var(--color-on-surface-variant)] opacity-60">
                      {featured.readingMinutes} min de lectura
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--color-on-surface)] leading-tight mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                    {featured.title}
                  </h2>

                  <p className="text-pretty text-base text-[var(--color-on-surface-variant)] leading-relaxed mb-5 max-w-3xl">
                    {featured.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                    Leer artículo completo
                    <ArrowRightIcon className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                  </span>
                </div>
              </Link>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── Grid de posts — ritmo bento: 2 anchas / 3 angostas ───────── */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-6">
            {rest.map((post, i) => {
              // Patrón de 5: las 2 primeras del ciclo anchas (col-span-3),
              // las 3 siguientes angostas (col-span-2).
              const isWide = i % 5 < 2
              return (
                <SectionReveal
                  key={post.slug}
                  delay={(i % 5) * STAGGER_BASE}
                  className={cn(
                    'h-full [&>div]:h-full',
                    isWide ? 'md:col-span-3' : 'md:col-span-2',
                  )}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className={cn(
                      `group flex h-full flex-col rounded-2xl border
                      transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
                      hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
                      hover:shadow-[var(--shadow-card-hover)]
                      active:translate-y-0 active:scale-[0.985] active:duration-100
                      focus-visible:outline-none focus-visible:-translate-y-1
                      focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
                      motion-reduce:transition-none motion-reduce:hover:translate-y-0`,
                      isWide ? 'p-8' : 'p-6',
                    )}
                    style={{
                      backgroundColor: 'var(--color-surface-low)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <div className="mb-3 flex items-center gap-2 text-xs">
                      <Badge variant="outline">{CATEGORY_LABELS[post.category]}</Badge>
                      <span className="text-[var(--color-on-surface-variant)] opacity-60">
                        {post.readingMinutes} min
                      </span>
                    </div>

                    <h3
                      className={cn(
                        'font-heading font-extrabold text-[var(--color-on-surface)] leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors',
                        isWide ? 'text-xl' : 'text-lg',
                      )}
                    >
                      {post.title}
                    </h3>

                    <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-3 mb-4 flex-1">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <time
                        dateTime={post.publishedAt}
                        className="text-[10px] text-[var(--color-on-surface-variant)] opacity-60 uppercase tracking-wider tabular-nums"
                      >
                        {new Date(post.publishedAt).toLocaleDateString('es-AR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <ArrowRightIcon
                        className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                        style={{ color: 'var(--color-primary)' }}
                      />
                    </div>
                  </Link>
                </SectionReveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
