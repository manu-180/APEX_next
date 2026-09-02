'use client'

import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'
import { StarIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { useGsapReveal } from '@/hooks/useGsapReveal'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { REVIEWS, AVG_RATING, type Review } from '@/lib/data/reviews'
import { WA_MSG_CONTACT_NOW, focusRing } from './shared'

/* ────────────────────────────────────────────────────────────────────────
   Opiniones (social proof) — chunk dinámico de /contacto.
   Se descarga aparte del hero/CTA: trae GSAP (vía useGsapReveal, ya
   dynamic-import()eado dentro del hook) fuera del chunk inicial también.
   ──────────────────────────────────────────────────────────────────────── */

/** Las replies viven en la DB (tabla reviews); el dataset estático aún no las
 *  trae. El render ya las soporta: si el día de mañana llegan, se anidan. */
type ReviewReply = { name: string; text: string; date?: string; isAdmin?: boolean }
type ReviewWithReplies = Review & { replies?: ReviewReply[] }
const REVIEW_ITEMS: ReviewWithReplies[] = REVIEWS

/* ────────────────────────────────────────────────────────────────────────
   Opiniones — social proof con jerarquía de estrellas en Amber
   ──────────────────────────────────────────────────────────────────────── */
export function ReviewsSection() {
  const listRef = useRef<HTMLDivElement>(null)
  const hasReviews = REVIEW_ITEMS.length > 0
  const filledStars = Math.round(Number(AVG_RATING))

  // Stagger GSAP sobre cada reseña (el hook respeta prefers-reduced-motion)
  useGsapReveal(listRef, {
    selector: '[data-review-item]',
    y: 32,
    stagger: 0.12,
    start: 'top 80%',
  })

  return (
    <section className="py-20 md:py-28" style={{ backgroundColor: 'var(--color-surface-base)' }}>
      <div className="mx-auto max-w-5xl px-6">
        {/* Header asimétrico: título a la izquierda, rating gigante a la derecha */}
        <SectionReveal>
          <div className="mb-14 grid grid-cols-1 items-end gap-8 md:grid-cols-[1.2fr_auto]">
            <div className="max-w-xl">
              <p className="editorial-label mb-5">Opiniones</p>
              <h2 className="heading-display text-balance text-3xl sm:text-4xl">
                <span className="text-[var(--color-on-surface-variant)]">No lo digo yo. </span>
                <strong className="text-[var(--color-on-surface)]">Lo dicen ellos.</strong>
              </h2>
            </div>

            {hasReviews && (
              <div className="flex items-end gap-4 md:justify-end">
                <span
                  aria-hidden="true"
                  className="section-number leading-none"
                  style={{ '--sn-stroke-alpha': '0.5', fontSize: 'clamp(3.5rem, 7vw, 5.5rem)' } as CSSProperties}
                >
                  {AVG_RATING}
                </span>
                <div className="pb-1.5">
                  <div
                    className="flex"
                    role="img"
                    aria-label={`Promedio ${AVG_RATING} de 5 estrellas, ${REVIEW_ITEMS.length} opiniones`}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon
                        key={s}
                        className="size-5 text-amber-400 dark:drop-shadow-[0_0_5px_rgba(251,191,36,0.45)]"
                        filled={s <= filledStars}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-on-surface-variant)]">
                    {REVIEW_ITEMS.length} opiniones reales
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionReveal>

        {!hasReviews ? (
          /* Estado vacío honesto */
          <SectionReveal>
            <div className="bento-surface p-10 text-center sm:p-14">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[rgba(251,191,36,0.12)]">
                <StarIcon className="size-6 text-amber-400" filled={false} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-[var(--color-on-surface)]">
                Todavía no hay opiniones publicadas.
              </h3>
              <p className="mx-auto mb-6 max-w-md text-sm text-[var(--color-on-surface-variant)]">
                Las primeras reseñas están en camino. Mientras tanto, contame tu
                proyecto y comprobalo de primera mano.
              </p>
              <WhatsAppOutboundLink
                waHref={whatsappUrl(WA_MSG_CONTACT_NOW)}
                className={cn(
                  'inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline',
                  focusRing,
                )}
              >
                <WhatsAppIcon className="size-4" />
                Escribime y sé el primero
              </WhatsAppOutboundLink>
            </div>
          </SectionReveal>
        ) : (
          /* Lista editorial con stagger GSAP */
          // divide-[color:…] tiñe los bordes de los HIJOS; el borderColor inline
          // en el contenedor no llegaba a las hairlines (gris default de preflight)
          <div
            ref={listRef}
            className="space-y-0 divide-y divide-[color:var(--glass-border)]"
            data-hover
            data-inspector-title="Reviews editoriales con GSAP"
            data-inspector-desc="Cada reseña entra escalonada (stagger 120ms) con ScrollTrigger de GSAP. La animación respeta prefers-reduced-motion."
            data-inspector-cat="Animación · GSAP"
          >
            {REVIEW_ITEMS.map((r) => (
              <article
                key={r.id}
                data-review-item
                className="group grid grid-cols-[3px_1fr] gap-5 py-8 first:pt-0 last:pb-0"
              >
                {/* Barra de acento del tema — late con el hover de la reseña */}
                <div
                  className="origin-center self-stretch rounded-full opacity-60 transition-[opacity,transform] duration-300 ease-out group-hover:scale-x-150 group-hover:opacity-100 motion-reduce:transition-none"
                  style={{ background: 'var(--color-primary)' }}
                  aria-hidden
                />

                <div className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none">
                  {/* Texto de la reseña */}
                  <p className="mb-4 text-pretty text-base leading-relaxed text-[var(--color-on-surface)]">
                    <span
                      className="mr-1 align-text-bottom font-heading text-3xl font-extrabold leading-none"
                      style={{ color: 'var(--color-primary)' }}
                      aria-hidden
                    >
                      &ldquo;
                    </span>
                    {r.text}
                  </p>

                  {/* Autor */}
                  <div className="flex items-start gap-3">
                    <div
                      className="flex size-11 flex-shrink-0 items-center justify-center rounded-full text-base font-extrabold ring-2 ring-offset-2 ring-offset-[var(--color-surface-base)]"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.18), rgba(var(--color-primary-rgb), 0.06))',
                        color: 'var(--color-primary)',
                        // @ts-expect-error CSS var en propiedad nativa
                        '--tw-ring-color': 'rgba(var(--color-primary-rgb), 0.35)',
                      }}
                      aria-hidden
                    >
                      {r.name[0]}
                    </div>

                    <div className="flex min-w-0 flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-on-surface)]">{r.name}</span>
                        <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>

                        <div
                          className="flex"
                          role="img"
                          aria-label={`${r.rating} de 5 estrellas`}
                        >
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarIcon key={s} className="size-3 text-amber-400" filled={s <= r.rating} />
                          ))}
                        </div>

                        <span className="text-[var(--color-on-surface-variant)] opacity-40" aria-hidden>·</span>
                        <time
                          dateTime={r.date}
                          className="text-xs tabular-nums text-[var(--color-on-surface-variant)] opacity-60"
                        >
                          {new Date(r.date).toLocaleDateString('es-AR', { timeZone: 'UTC', year: 'numeric', month: 'short' })}
                        </time>
                      </div>

                      {r.role && (
                        <span className="text-xs text-[var(--color-on-surface-variant)] opacity-75">
                          {r.role}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Replies anidadas (cuando el dataset las traiga) */}
                  {r.replies && r.replies.length > 0 && (
                    <div
                      className="mt-5 space-y-4 border-l-2 pl-5"
                      style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.25)' }}
                    >
                      {r.replies.map((reply, i) => (
                        <div key={i} className="text-sm">
                          <p className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[var(--color-on-surface)]">{reply.name}</span>
                            {reply.isAdmin && (
                              <span className="rounded-md bg-[rgba(var(--color-primary-rgb),0.12)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                                Respuesta
                              </span>
                            )}
                            {reply.date && (
                              <time
                                dateTime={reply.date}
                                className="text-xs tabular-nums text-[var(--color-on-surface-variant)] opacity-60"
                              >
                                {new Date(reply.date).toLocaleDateString('es-AR', { timeZone: 'UTC', year: 'numeric', month: 'short' })}
                              </time>
                            )}
                          </p>
                          <p className="text-pretty leading-relaxed text-[var(--color-on-surface-variant)]">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
