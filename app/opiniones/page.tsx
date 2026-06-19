import type { Metadata } from 'next'
import { GridBackground } from '@/components/ui/grid-background'
import { StarIcon, ArrowRightIcon } from '@/components/ui/icons'
import { BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { REVIEWS, AVG_RATING, REVIEW_COUNT } from '@/lib/data/reviews'
import { APP_URL, GOOGLE_REVIEW_URL } from '@/lib/constants'
import { ShareActions } from './share-actions'

export const dynamic = 'force-static'
export const revalidate = 86400

const PAGE_URL = `${APP_URL.replace(/\/$/, '')}/opiniones`

export const metadata: Metadata = {
  title: 'Dejá tu opinión sobre APEX',
  description:
    'Si trabajamos juntos en tu web o app, tu reseña en Google ayuda al próximo emprendedor a confiar. Dejá tu opinión en 30 segundos, sin registrarte en nada.',
  alternates: { canonical: '/opiniones' },
  openGraph: {
    title: 'Dejá tu opinión sobre APEX',
    description: 'Tu reseña en Google es la mejor publicidad. Gracias por el minuto.',
    url: '/opiniones',
  },
}

const STEPS = [
  { n: '01', title: 'Tocá el botón', body: 'Se abre Google con tu cuenta. No te registrás en nada nuevo.' },
  { n: '02', title: 'Elegí las estrellas', body: 'De una a cinco. Lo que de verdad pensás — sin vueltas.' },
  { n: '03', title: 'Dos líneas y listo', body: 'Qué te resolví y cómo fue trabajar juntos. Publicás y ya está.' },
]

export default function OpinionesPage() {
  const filledStars = Math.round(Number(AVG_RATING))
  const waShareMessage = `Hola, te dejo el link para dejar tu opinión sobre APEX en Google (30 segundos): ${PAGE_URL}`

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Inicio', url: APP_URL },
          { name: 'Opiniones', url: PAGE_URL },
        ]}
      />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 md:pt-40">
        <GridBackground showRadialLight />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 18% -5%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="editorial-label mb-5">Opiniones</p>

          <h1 className="font-heading text-balance leading-[0.95] mb-6 max-w-3xl">
            <span className="block text-4xl font-extralight text-[var(--color-on-surface-variant)] sm:text-5xl md:text-6xl">
              Treinta segundos tuyos
            </span>
            <span className="mt-1 block text-4xl font-extrabold text-[var(--color-on-surface)] sm:text-5xl md:text-6xl">
              valen más que mil anuncios.
            </span>
          </h1>

          <p className="text-pretty mb-8 max-w-2xl text-base leading-relaxed text-[var(--color-on-surface-variant)] md:text-lg">
            Si te ayudé con tu web o tu app, tu reseña en Google es lo que hace que el próximo
            emprendedor confíe en trabajar conmigo. Gracias por el minuto. 🙏
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech btn-primary-tech inline-flex min-h-12 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold"
            >
              <StarIcon className="size-4" />
              Dejar mi reseña en Google
              <ArrowRightIcon className="size-4" />
            </a>

            <div className="flex items-center gap-3">
              <span className="font-heading text-3xl font-extrabold tabular-nums text-[var(--color-on-surface)]">
                {AVG_RATING}
              </span>
              <div>
                <div
                  className="flex"
                  role="img"
                  aria-label={`Promedio ${AVG_RATING} de 5 estrellas, ${REVIEW_COUNT} opiniones`}
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className="size-4 text-amber-400 dark:drop-shadow-[0_0_5px_rgba(251,191,36,0.45)]"
                      filled={s <= filledStars}
                    />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-on-surface-variant)]">
                  {REVIEW_COUNT} opiniones reales
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo dejarla (3 pasos) ──────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="editorial-label mb-4">Así de fácil</p>
          <h2 className="mb-10 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
            En 30 segundos, sin registrarte en nada.
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border p-6"
                style={{ backgroundColor: 'var(--color-surface-base)', borderColor: 'var(--glass-border)' }}
              >
                <span
                  className="section-number mb-3 block leading-none"
                  style={{ fontSize: '2.75rem' }}
                >
                  {s.n}
                </span>
                <h3 className="mb-2 text-base font-bold text-[var(--color-on-surface)]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech btn-primary-tech inline-flex min-h-12 items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold"
            >
              <StarIcon className="size-4" />
              Escribir mi reseña ahora
              <ArrowRightIcon className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Prueba social ───────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="editorial-label mb-4">Ya confiaron</p>
          <h2 className="mb-10 font-heading text-3xl font-extrabold text-[var(--color-on-surface)] sm:text-4xl">
            <span className="font-extralight text-[var(--color-on-surface-variant)]">No lo digo yo. </span>
            Lo dicen ellos.
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.id}
                className="flex flex-col rounded-xl border p-6"
                style={{ backgroundColor: 'var(--color-surface-low)', borderColor: 'var(--glass-border)' }}
              >
                <div className="mb-3 flex" role="img" aria-label={`${r.rating} de 5 estrellas`}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon key={s} className="size-4 text-amber-400" filled={s <= r.rating} />
                  ))}
                </div>
                <blockquote className="flex-1 text-sm leading-relaxed text-[var(--color-on-surface)]">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4">
                  <p className="text-sm font-bold text-[var(--color-on-surface)]">{r.name}</p>
                  {r.role && (
                    <p className="text-xs text-[var(--color-on-surface-variant)]">{r.role}</p>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compartir (uso interno de Manuel) ───────────────────────── */}
      <section className="relative py-14" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <div className="bento-surface p-8 sm:p-10">
            <h2 className="mb-2 font-heading text-xl font-extrabold text-[var(--color-on-surface)] sm:text-2xl">
              Compartí este link con tus clientes
            </h2>
            <p className="mb-6 text-sm text-[var(--color-on-surface-variant)]">
              Mandáselo por WhatsApp apenas termines un proyecto — es el mejor momento para pedir
              la reseña, cuando la satisfacción está fresca.
            </p>
            <ShareActions url={PAGE_URL} waMessage={waShareMessage} />
          </div>
        </div>
      </section>
    </>
  )
}
