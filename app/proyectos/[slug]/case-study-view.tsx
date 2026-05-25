'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { useApexThemeActions } from '@/hooks/useTheme'
import { GridBackground } from '@/components/ui/grid-background'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon, ExternalLinkIcon, CheckIcon } from '@/components/ui/icons'
import { REVIEWS } from '@/lib/data/reviews'
import type { CaseStudy } from '@/lib/data/case-studies'
import type { ThemeId } from '@/lib/types/theme'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'
import { useRouter } from 'next/navigation'
import { trackGoogleAdsHeroCtaClick } from '@/lib/analytics/google-ads'
import { trackMetaLead } from '@/components/analytics/meta-pixel'
import { cn } from '@/lib/utils/cn'

interface CaseStudyViewProps {
  caseStudy: CaseStudy
  others: CaseStudy[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

const STACK_LABEL: Record<CaseStudy['stack'][number]['category'], string> = {
  mobile: 'Mobile',
  web: 'Web',
  backend: 'Backend',
  devops: 'DevOps',
  design: 'Diseño',
}

export function CaseStudyView({ caseStudy, others }: CaseStudyViewProps) {
  const { applyTheme } = useApexThemeActions()
  const prefersReducedMotion = useReducedMotion()
  const router = useRouter()

  // Aplica el tema del proyecto al entrar — sigue manteniendo el sistema dinámico
  useEffect(() => {
    applyTheme(caseStudy.themeId as ThemeId)
  }, [applyTheme, caseStudy.themeId])

  const review = caseStudy.reviewId
    ? REVIEWS.find((r) => r.id === caseStudy.reviewId)
    : undefined

  const handleCtaClick = () => {
    trackGoogleAdsHeroCtaClick()
    trackMetaLead()
    openWhatsAppWithThankYouPage(
      whatsappUrl(`Hola Manuel, vi el caso de ${caseStudy.title} y quiero algo similar.`),
      router,
    )
  }

  return (
    <>
      {/* ── HERO editorial: asimétrico, dramático, info densa ────────── */}
      <section
        className="relative isolate pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-base)' }}
      >
        <GridBackground showRadialLight showScanline />

        {/* Glow primary del tema dinámico */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 20% 0%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          {/* Breadcrumb */}
          <motion.nav
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="mb-8 flex items-center gap-2 text-xs text-[var(--color-on-surface-variant)]"
            aria-label="Breadcrumb"
          >
            <Link href={ROUTES.home} className="hover:text-[var(--color-primary)] transition-colors">
              Inicio
            </Link>
            <span className="opacity-40">/</span>
            <Link
              href={ROUTES.proyectos}
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Proyectos
            </Link>
            <span className="opacity-40">/</span>
            <span className="font-semibold text-[var(--color-on-surface)]">{caseStudy.title}</span>
          </motion.nav>

          {/* Tags arriba */}
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            className="mb-6 flex flex-wrap items-center gap-2"
          >
            <Badge variant="primary" className="rounded-full px-3 py-1 text-[11px] font-semibold">
              {caseStudy.type}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
              {caseStudy.client.industry}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
              {caseStudy.duration}
            </Badge>
          </motion.div>

          {/* Headline asimétrico — peso 200 + 800 mezclados */}
          <motion.h1
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-heading text-balance leading-[0.95] mb-6 max-w-4xl"
          >
            <span className="block text-4xl sm:text-5xl md:text-6xl font-extralight text-[var(--color-on-surface-variant)]">
              {caseStudy.title}
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)] mt-1">
              {caseStudy.tagline}
            </span>
          </motion.h1>

          {/* Summary — el "TL;DR" del case study para AI Overviews */}
          <motion.p
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.1 }}
            className="text-pretty max-w-2xl text-lg leading-relaxed text-[var(--color-on-surface-variant)]"
          >
            {caseStudy.summary}
          </motion.p>

          {/* CTA + link externo */}
          <motion.div
            initial={prefersReducedMotion ? false : 'hidden'}
            animate="visible"
            variants={fadeUp}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-tech btn-primary-tech min-h-12 px-7 py-3 text-sm rounded-xl inline-flex items-center gap-2 font-semibold"
            >
              Quiero algo similar
              <ArrowRightIcon className="size-4" />
            </button>

            {caseStudy.url && (
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
              >
                Ver en vivo
                <ExternalLinkIcon className="size-3.5" />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── MÉTRICAS — bento grid asimétrico ─────────────────────────── */}
      <section className="relative py-16 sm:py-20" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <Badge variant="primary" className="mb-3">
              Lo que entregamos
            </Badge>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-on-surface)]">
              Hechos, no promesas
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {caseStudy.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={cn(
                  'relative rounded-xl p-5 border overflow-hidden',
                  'bg-[var(--color-surface-base)]',
                )}
                style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.2)' }}
              >
                {/* Acento diagonal del color del tema */}
                <span
                  aria-hidden
                  className="absolute -right-6 -top-6 size-16 rounded-full blur-2xl"
                  style={{ background: 'rgba(var(--color-primary-rgb), 0.18)' }}
                />

                <div
                  className="relative font-heading text-2xl md:text-3xl font-extrabold tabular-nums leading-tight"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {m.value}
                </div>
                <div className="relative mt-1.5 text-xs text-[var(--color-on-surface-variant)] leading-snug">
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEMA ────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              01 · Problema
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)] mb-6">
              ¿Qué dolor resolvimos?
            </h2>
            <p className="text-pretty text-lg leading-relaxed text-[var(--color-on-surface-variant)] whitespace-pre-line">
              {caseStudy.problem}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── ENFOQUE ─────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span
              className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              02 · Enfoque
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
              Cómo lo abordamos
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {caseStudy.approach.map((step, i) => (
              <motion.article
                key={step.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl p-6 border"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <span
                  className="absolute right-5 top-5 font-mono text-xs font-bold opacity-30"
                  style={{ color: 'var(--color-primary)' }}
                >
                  0{i + 1}
                </span>
                <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)] mb-3 pr-8">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  {step.body}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STACK ───────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
        <div className="mx-auto max-w-4xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span
              className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              03 · Stack
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
              Con qué lo construimos
            </h2>
          </motion.div>

          <div className="space-y-6">
            {caseStudy.stack.map((s) => (
              <motion.div
                key={s.category}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-[100px_1fr] gap-4 sm:grid-cols-[160px_1fr] sm:gap-8 items-baseline"
              >
                <div
                  className="font-mono text-xs font-bold tracking-widest uppercase opacity-60"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {STACK_LABEL[s.category]}
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full px-3 py-1 text-xs font-medium border"
                      style={{
                        backgroundColor: 'var(--color-surface-low)',
                        borderColor: 'var(--glass-border)',
                        color: 'var(--color-on-surface)',
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ENTREGADAS ─────────────────────────────────────── */}
      <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <span
              className="inline-block font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: 'var(--color-primary)' }}
            >
              04 · Resultado
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)]">
              Lo que el cliente se llevó
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {caseStudy.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-xl p-5 border flex gap-4 items-start"
                style={{
                  backgroundColor: 'var(--color-surface-base)',
                  borderColor: 'var(--glass-border)',
                }}
              >
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.14)',
                    color: 'var(--color-primary)',
                  }}
                  aria-hidden
                >
                  <CheckIcon className="size-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[var(--color-on-surface)] mb-1">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                    {f.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL DEL CLIENTE (si aplica) ─────────────────────── */}
      {review && (
        <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
          <div className="mx-auto max-w-3xl px-6">
            <motion.figure
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55 }}
              className="relative"
            >
              <span
                className="absolute -left-2 -top-8 font-heading text-7xl font-extrabold leading-none opacity-25"
                style={{ color: 'var(--color-primary)' }}
                aria-hidden
              >
                &ldquo;
              </span>
              <blockquote className="text-pretty text-xl sm:text-2xl leading-relaxed font-light text-[var(--color-on-surface)] mb-6">
                {review.text}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div
                  className="size-11 rounded-full flex items-center justify-center text-base font-extrabold"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(var(--color-primary-rgb), 0.2), rgba(var(--color-primary-rgb), 0.05))',
                    color: 'var(--color-primary)',
                  }}
                  aria-hidden
                >
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--color-on-surface)]">
                    {review.name}
                  </div>
                  {review.role && (
                    <div className="text-xs text-[var(--color-on-surface-variant)] opacity-75">
                      {review.role}
                    </div>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          </div>
        </section>
      )}

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: 'var(--color-surface-low)' }}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(var(--color-primary-rgb), 0.16), transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-heading text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-on-surface)] mb-4">
            <span className="font-extralight text-[var(--color-on-surface-variant)]">¿Tenés algo</span>{' '}
            similar en mente?
          </h2>
          <p className="text-pretty text-[var(--color-on-surface-variant)] mb-8 max-w-xl mx-auto">
            Cada caso arranca con una charla de 15 minutos. Sin compromiso, sin formulario kilométrico.
            Te respondo en menos de 2 horas por WhatsApp.
          </p>
          <button
            type="button"
            onClick={handleCtaClick}
            className="btn-tech btn-primary-tech min-h-12 px-8 py-3 text-sm rounded-xl inline-flex items-center gap-2 font-semibold"
          >
            Hablemos de tu proyecto
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </section>

      {/* ── OTROS CASOS ─────────────────────────────────────────────── */}
      {others.length > 0 && (
        <section className="relative py-20 sm:py-24" style={{ backgroundColor: 'var(--color-surface-base)' }}>
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[var(--color-on-surface)] mb-10">
              <span className="font-extralight text-[var(--color-on-surface-variant)]">Otros</span> casos
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/proyectos/${other.slug}`}
                  className="group block rounded-xl p-5 border transition-all duration-200 hover:border-[rgba(var(--color-primary-rgb),0.4)]"
                  style={{
                    backgroundColor: 'var(--color-surface-low)',
                    borderColor: 'var(--glass-border)',
                  }}
                >
                  <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)] mb-1.5">
                    {other.title}
                  </h3>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 line-clamp-2">
                    {other.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]">
                    Leer caso
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                      <ArrowRightIcon className="size-3" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
