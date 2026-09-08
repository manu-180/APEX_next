import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { BrowserChrome } from '@/components/ui/browser-chrome'
import { GridBackground } from '@/components/ui/grid-background'
import {
  ArrowRightIcon,
  CheckIcon,
  ExternalLinkIcon,
  StarIcon,
  WhatsAppIcon,
  XIcon,
} from '@/components/ui/icons'
import { SectionReveal } from '@/components/ui/section-reveal'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { ROUTES } from '@/lib/constants'
import { AVG_RATING, REVIEW_COUNT } from '@/lib/data/reviews'
import type { ProductLanding } from '@/lib/data/product-landings'
import { STAGGER_BASE } from '@/lib/motion'
import { arsInline } from '@/lib/types/services'
import { cn } from '@/lib/utils/cn'
import { whatsappUrl } from '@/lib/whatsapp'

/**
 * Render compartido de las landings por producto (`/tienda-online`,
 * `/landing-page`). La plantilla es común; el contenido de cada página vive
 * entero en `lib/data/product-landings.ts` y no se repite entre páginas —
 * dos landings que dicen lo mismo se canibalizan y pierden las dos.
 */

const EYEBROW_CLASS =
  'mb-3 block font-mono text-[10px] font-bold uppercase tracking-[0.32em]'

const CARD_HOVER_CLASS = `group border
  transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform
  hover:-translate-y-1 hover:border-[rgba(var(--color-primary-rgb),0.4)]
  hover:shadow-[var(--shadow-card-hover)]
  active:translate-y-0 active:scale-[0.985] active:duration-100
  focus-visible:outline-none focus-visible:-translate-y-1
  focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
  motion-reduce:transition-none motion-reduce:hover:translate-y-0`

const WA_CTA_CLASS = `group inline-flex items-center justify-center gap-2.5 select-none
  h-12 min-h-12 rounded-xl px-6 text-sm font-bold text-white
  transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] active:scale-[0.97]
  motion-reduce:hover:scale-100
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
  focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]`

const CRUMB_LINK_CLASS =
  'rounded transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]'

export function ProductLandingPage({ data }: { data: ProductLanding }) {
  const waUrl = whatsappUrl(data.waMessage)

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────
          Sin SectionReveal: el LCP móvil del sitio es el párrafo del hero y
          un reveal que arranca en opacity:0 lo retrasa ~950 ms. Nada
          above-the-fold anima opacity ni filter. */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40 md:pb-20">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% -10%, rgba(var(--color-primary-rgb), 0.18), transparent 62%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <nav
            aria-label="Migas de pan"
            className="mb-6 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
          >
            <Link href="/" className={CRUMB_LINK_CLASS}>
              Inicio
            </Link>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <Link href={ROUTES.servicios} className={CRUMB_LINK_CLASS}>
              Servicios
            </Link>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <span className="font-semibold text-[var(--color-on-surface)]">{data.shortName}</span>
          </nav>

          <div className="grid items-start gap-10 md:grid-cols-[1.45fr_0.9fr] md:gap-14">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{data.eyebrow.replace('/ ', '')}</Badge>
                <Badge variant="outline">Buenos Aires · Toda la Argentina</Badge>
              </div>

              <h1 className="heading-display heading-display--tight mb-6 text-4xl text-[var(--color-on-surface)] sm:text-5xl md:text-[3.4rem]">
                {data.h1Light} <strong>{data.h1Bold}</strong>
              </h1>

              <p className="mb-8 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
                {data.subhead}
              </p>

              <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <WhatsAppOutboundLink
                  waHref={waUrl}
                  className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS, 'w-full sm:w-auto')}
                  style={{ background: WA_GRADIENT }}
                >
                  <WhatsAppIcon className="size-4 shrink-0" aria-hidden />
                  Quiero mi boceto gratis
                  <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </WhatsAppOutboundLink>

                <a
                  href="#trabajos"
                  className={cn(
                    'group btn-tech btn-outline-tech inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto',
                    'text-[var(--color-primary)] transition-transform duration-300 ease-out active:scale-[0.97]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                  )}
                >
                  Ver trabajos reales
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {['Boceto gratis en 24-48 h', 'Precio cerrado por escrito', 'Entrega en 15 días'].map(
                  (claim) => (
                    <li
                      key={claim}
                      className="flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
                    >
                      <CheckIcon className="size-3.5 shrink-0 text-[var(--color-primary)]" />
                      {claim}
                    </li>
                  ),
                )}
              </ul>
            </div>

            {/* Ficha de precio — contrapeso asimétrico y respuesta directa a
                "cuánto sale", que es la primera pregunta de esta intención. */}
            <aside className="bento-surface p-6 md:mt-16">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                El número
              </span>
              <p className="mt-4 font-heading text-4xl font-extrabold tabular-nums text-[var(--color-on-surface)]">
                {arsInline(data.price)}
              </p>
              <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                ARS · precio cerrado · 3 cuotas sin interés
              </p>
              <ul className="mt-5 space-y-2.5">
                {['Diseño 100% a medida', 'Dominio y hosting configurados', '3 meses de soporte incluidos'].map(
                  (f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]"
                    >
                      <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-[var(--color-primary)]" />
                      {f}
                    </li>
                  ),
                )}
              </ul>
              <Link
                href={ROUTES.opiniones}
                className="group mt-6 flex items-center gap-2 rounded-lg border border-[rgba(var(--color-primary-rgb),0.2)] px-3 py-2.5 text-xs font-semibold text-[var(--color-on-surface)] transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.45)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              >
                <StarIcon className="size-3.5 shrink-0 text-[var(--color-primary)]" />
                <span className="tabular-nums">{AVG_RATING}</span>
                <span className="opacity-70">con {REVIEW_COUNT} opiniones</span>
                <ArrowRightIcon className="ml-auto size-3 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </Link>
            </aside>
          </div>

          {/* Respuesta directa en prosa: es el bloque que citan las AI
              Overviews y el que responde la query sin hacer scroll. */}
          <p className="mt-12 max-w-3xl border-l-2 pl-5 text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:text-base"
             style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.45)' }}>
            {data.answer}
          </p>
        </div>
      </section>

      {/* ── 01 · El problema ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              01 · Por qué estás acá
            </span>
            <h2 className="mb-10 max-w-2xl font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Lo que probablemente te está pasando hoy
            </h2>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-3">
            {data.pains.map((p, i) => (
              <SectionReveal key={p.title} delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                <div
                  className="flex h-full flex-col rounded-2xl border p-6"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <span
                    aria-hidden
                    className="mb-4 font-mono text-xs font-bold tabular-nums opacity-40"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mb-2.5 font-heading text-lg font-extrabold leading-snug text-[var(--color-on-surface)]">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {p.body}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 · Trabajo real ─────────────────────────────────────────────── */}
      <section
        id="trabajos"
        className="relative scroll-mt-24 py-16 sm:py-24"
        style={{ backgroundColor: 'var(--color-surface-base)' }}
      >
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <div className="mb-10 md:flex md:items-end md:justify-between md:gap-10">
              <div>
                <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
                  02 · Trabajo real
                </span>
                <h2 className="font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
                  Está online, abrilo
                </h2>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)] md:mt-0">
                No son maquetas. Entrá, tocá los botones y fijate cuánto tardan en cargar en tu
                celular.
              </p>
            </div>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-6">
            {data.work.map((w, i) => {
              const featured = i === 0
              return (
                <SectionReveal
                  key={w.site.slug}
                  delay={i * STAGGER_BASE}
                  className={cn('h-full [&>div]:h-full', featured ? 'md:col-span-4' : 'md:col-span-2')}
                >
                  <a
                    href={w.site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'group/card flex h-full flex-col overflow-hidden rounded-2xl',
                      CARD_HOVER_CLASS,
                    )}
                    style={{
                      backgroundColor: 'var(--color-surface-base)',
                      borderColor: 'var(--glass-border)',
                    }}
                  >
                    <BrowserChrome domain={w.site.domain} />
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-surface-low)]">
                      <Image
                        src={`/projects/showcase/${w.site.slug}.webp`}
                        alt={`Diseño del sitio web ${w.site.name} (${w.site.domain})`}
                        fill
                        sizes={
                          featured
                            ? '(max-width: 768px) 100vw, 620px'
                            : '(max-width: 768px) 100vw, 320px'
                        }
                        className="object-cover object-top transition-transform duration-[1.1s] ease-out will-change-transform group-hover/card:scale-[1.05] motion-reduce:transform-none motion-reduce:transition-none"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-3 left-3 inline-flex translate-y-2 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold text-white opacity-0 transition-[transform,opacity] duration-300 ease-out group-hover/card:translate-y-0 group-hover/card:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none"
                        style={{ background: 'rgba(var(--color-primary-rgb),0.92)' }}
                      >
                        Ver en vivo
                        <ExternalLinkIcon className="size-3" />
                      </span>
                    </div>

                    <div className={cn('flex flex-1 flex-col p-5', featured && 'sm:p-6')}>
                      <div className="mb-2 flex items-center gap-2">
                        <h3
                          className={cn(
                            'font-heading font-extrabold text-[var(--color-on-surface)] transition-colors duration-200 group-hover/card:text-[var(--color-primary)]',
                            featured ? 'text-xl' : 'text-base',
                          )}
                        >
                          {w.site.name}
                        </h3>
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] opacity-70 ring-1 ring-[var(--glass-border)]">
                          {w.site.kind === 'product' ? 'Producto propio' : 'Cliente'}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'leading-relaxed text-[var(--color-on-surface-variant)]',
                          featured ? 'text-base' : 'text-sm',
                        )}
                      >
                        {w.proof}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                        {w.site.domain}
                        <ExternalLinkIcon className="size-3" />
                      </span>
                    </div>
                  </a>
                </SectionReveal>
              )
            })}

            <SectionReveal delay={data.work.length * STAGGER_BASE} className="md:col-span-2">
              <Link
                href={ROUTES.muestrario}
                className={cn('flex h-full flex-col justify-center rounded-2xl p-6', CARD_HOVER_CLASS)}
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <h3 className="font-heading text-base font-extrabold leading-tight text-[var(--color-on-surface)] transition-colors group-hover:text-[var(--color-primary)]">
                  Ver el muestrario completo
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  Todos los sitios, con su captura y el link para abrirlos.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                  Entrar
                  <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── 03 · Qué incluye ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              03 · Qué incluye
            </span>
            <h2 className="mb-10 max-w-2xl font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Todo esto entra en el precio
            </h2>
          </SectionReveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.includes.map((item, i) => (
              <SectionReveal key={item.title} delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                <div
                  className="flex h-full flex-col rounded-2xl border p-6"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <CheckIcon className="mb-4 size-5 shrink-0 text-[var(--color-primary)]" />
                  <h3 className="mb-2 font-heading text-base font-extrabold leading-snug text-[var(--color-on-surface)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {item.body}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · Comparativa ──────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              04 · La comparación
            </span>
            <h2 className="mb-3 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              {data.comparison.heading}
            </h2>
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              {data.comparison.intro}
            </p>
          </SectionReveal>

          <SectionReveal>
            <div
              className="overflow-x-auto rounded-2xl border"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-low)' }}>
                    {data.comparison.headers.map((h, i) => (
                      <th
                        key={h || `col-${i}`}
                        scope="col"
                        className={cn(
                          'px-4 py-3.5 font-heading text-xs font-extrabold uppercase tracking-wide',
                          i === data.comparison.headers.length - 1
                            ? 'text-[var(--color-primary)]'
                            : 'text-[var(--color-on-surface-variant)]',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.comparison.rows.map((row) => (
                    <tr
                      key={row[0]}
                      className="border-t"
                      style={{ borderColor: 'var(--glass-border)' }}
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={`${row[0]}-${ci}`}
                          className={cn(
                            'px-4 py-3.5 align-top',
                            ci === 0 && 'font-semibold text-[var(--color-on-surface)]',
                            ci > 0 && 'text-[var(--color-on-surface-variant)]',
                            ci === row.length - 1 && 'font-semibold text-[var(--color-on-surface)]',
                          )}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionReveal>

          {/* La comparación solo es creíble si dice cuándo pierde. */}
          <SectionReveal>
            <div
              className="mt-6 rounded-2xl border-l-2 p-5"
              style={{
                backgroundColor: 'var(--color-surface-low)',
                borderLeftColor: 'rgba(var(--color-primary-rgb), 0.55)',
              }}
            >
              <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                <strong className="font-heading font-extrabold text-[var(--color-on-surface)]">
                  Cuándo NO te conviene lo mío:{' '}
                </strong>
                {data.comparison.honesty}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 05 · Proceso ──────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              05 · Cómo trabajamos
            </span>
            <h2 className="mb-10 max-w-2xl font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              De la primera charla al día que sale al aire
            </h2>
          </SectionReveal>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.process.map((s, i) => (
              <SectionReveal key={s.step} delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                <li
                  className="flex h-full list-none flex-col rounded-2xl border p-6"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className="font-mono text-xs font-bold tabular-nums"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {s.step}
                    </span>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-on-surface-variant)] ring-1 ring-[var(--glass-border)]">
                      {s.meta}
                    </span>
                  </div>
                  <h3 className="mb-2 font-heading text-base font-extrabold leading-snug text-[var(--color-on-surface)]">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {s.body}
                  </p>
                </li>
              </SectionReveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 06 · Para quién no es ─────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-4xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              06 · Franqueza
            </span>
            <h2 className="mb-8 max-w-2xl font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Para quién no es
            </h2>
          </SectionReveal>

          <ul className="grid gap-3">
            {data.fitNo.map((f, i) => (
              <SectionReveal key={f} delay={i * STAGGER_BASE}>
                <li
                  className="flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed text-[var(--color-on-surface-variant)]"
                  style={{
                    backgroundColor: 'var(--color-surface-low)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <XIcon className="mt-0.5 size-4 shrink-0 opacity-50" />
                  {f}
                </li>
              </SectionReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 07 · FAQ ──────────────────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              07 · Preguntas
            </span>
            <h2 className="mb-8 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
              Lo que siempre me preguntan
            </h2>
          </SectionReveal>

          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <SectionReveal key={item.q} delay={i * STAGGER_BASE}>
                {/* <details> nativo: la respuesta está en el HTML servido —
                    un acordeón que monta el contenido al abrir no lo indexa
                    ni Google ni un LLM. */}
                <details
                  className="group rounded-2xl border transition-colors duration-200 hover:border-[rgba(var(--color-primary-rgb),0.35)]"
                  style={{
                    backgroundColor: 'var(--color-surface-base)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-heading text-base font-bold text-[var(--color-on-surface)] transition-colors duration-200 marker:hidden hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-low)]">
                    <h3 className="text-base font-bold">{item.q}</h3>
                    <span
                      aria-hidden
                      className="grid size-6 shrink-0 place-items-center rounded-full text-lg leading-none transition-transform duration-300 ease-out group-open:rotate-45 motion-reduce:transition-none"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {item.a}
                  </p>
                </details>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 · Seguir leyendo ───────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <SectionReveal>
            <span className={EYEBROW_CLASS} style={{ color: 'var(--color-primary)' }}>
              08 · Seguir leyendo
            </span>
            <h2 className="mb-8 font-heading text-2xl font-extrabold text-[var(--color-on-surface)] sm:text-3xl">
              Si querés profundizar
            </h2>
          </SectionReveal>

          <div className="grid gap-4 md:grid-cols-3">
            {data.related.map((r, i) => (
              <SectionReveal key={r.href} delay={i * STAGGER_BASE} className="h-full [&>div]:h-full">
                <Link
                  href={r.href}
                  className={cn('flex h-full flex-col rounded-2xl p-6', CARD_HOVER_CLASS)}
                  style={{
                    backgroundColor: 'var(--color-surface-low)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <h3 className="mb-2 font-heading text-base font-extrabold leading-snug text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)]">
                    {r.label}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {r.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                    Leer
                    <ArrowRightIcon className="size-3 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                  </span>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 sm:py-28"
        style={{ backgroundColor: 'var(--color-surface-low)' }}
      >
        <GridBackground />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <SectionReveal>
            <h2 className="heading-display mb-5 text-3xl text-[var(--color-on-surface)] sm:text-4xl md:text-5xl">
              El boceto es <strong>gratis</strong>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-pretty text-base leading-relaxed text-[var(--color-on-surface-variant)]">
              Contame en dos líneas qué necesitás. En 24 a 48 horas ves el diseño con tu contenido
              adentro y recién ahí decidís si seguimos.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <WhatsAppOutboundLink
                waHref={waUrl}
                className={cn(WA_CTA_CLASS, WA_SHADOW_CLASS, 'w-full sm:w-auto')}
                style={{ background: WA_GRADIENT }}
              >
                <WhatsAppIcon className="size-4 shrink-0" aria-hidden />
                Pedir mi boceto gratis
                <ArrowRightIcon className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </WhatsAppOutboundLink>
              <Link
                href={ROUTES.contact}
                className={cn(
                  'btn-tech btn-outline-tech inline-flex h-12 min-h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto',
                  'text-[var(--color-primary)] transition-transform duration-300 ease-out active:scale-[0.97]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-low)]',
                )}
              >
                Agendar una reunión
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  )
}
