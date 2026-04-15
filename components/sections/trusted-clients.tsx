'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Lock, LockOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GridBackground } from '@/components/ui/grid-background'
import { SectionReveal } from '@/components/ui/section-reveal'
import { ExternalLinkIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

interface ClientSite {
  name: string
  domain: string
  url: string
  category: string
  screenshot: string
}

const CLIENTS: ClientSite[] = [
  {
    name: 'MNL Tecno',
    domain: 'mnltecno.com',
    url: 'https://mnltecno.com',
    category: 'E-commerce',
    screenshot: '/images/clients/mnltecno.jpg',
  },
  {
    name: 'Taller Cerámica',
    domain: 'tallerceramica.com',
    url: 'https://tallerceramica.com',
    category: 'Educación',
    screenshot: '/images/clients/tallerceramica.jpg',
  },
  {
    name: 'Taller Marcelo',
    domain: 'tallermarcelo.com',
    url: 'https://tallermarcelo.com',
    category: 'Automotriz',
    screenshot: '/images/clients/tallermarcelo.jpg',
  },
  {
    name: 'Luma Invita',
    domain: 'bylumainvita.com',
    url: 'https://bylumainvita.com',
    category: 'Eventos',
    screenshot: '/images/clients/bylumainvita.png',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 },
  }),
}

/* ────────────────────────────────────────────────────────────────────────
   Browser chrome bar — macOS-style traffic lights + URL bar with lock
   ──────────────────────────────────────────────────────────────────────── */

function BrowserChrome({ domain, isHovered = false }: { domain: string; isHovered?: boolean }) {
  return (
    <div className="flex items-center justify-center border-b border-[var(--color-outline)] px-3 py-2">
      <div
        className={cn(
          'flex max-w-[85%] items-center justify-center gap-1.5 rounded-md',
          'bg-[var(--color-surface-base)]/60 text-[var(--color-on-surface-variant)]',
          'h-5 px-2.5 text-[10px]',
        )}
      >
        <Lock
          className={cn(
            'size-2.5 flex-shrink-0 text-emerald-500/70 transition-all duration-300',
            isHovered ? 'opacity-0 absolute' : 'opacity-100',
          )}
          strokeWidth={2.5}
          aria-hidden
        />
        <LockOpen
          className={cn(
            'size-2.5 flex-shrink-0 text-emerald-500 transition-all duration-300',
            isHovered ? 'opacity-100' : 'opacity-0 absolute',
          )}
          strokeWidth={2.5}
          aria-hidden
        />
        <span className="truncate font-medium tracking-wide">{domain}</span>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Frosted client card — blurred screenshot → reveal on hover
   ──────────────────────────────────────────────────────────────────────── */

function ClientCard({
  client,
  index,
}: {
  client: ClientSite
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={client.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
        aria-label={`Visitar ${client.name} — ${client.domain}`}
      >
        <motion.div
          className={cn(
            'relative overflow-hidden rounded-2xl border',
            'bg-[var(--color-surface-low)]/90 backdrop-blur-md',
            'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]',
            'before:pointer-events-none before:absolute before:inset-x-4 before:top-0 before:z-[2] before:h-px before:rounded-full',
            'before:bg-gradient-to-r before:from-transparent before:via-white/12 before:to-transparent',
            'transition-[border-color,box-shadow] duration-300 ease-out',
            isHovered
              ? 'border-[rgba(var(--color-primary-rgb),0.28)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_16px_48px_-20px_rgba(var(--color-primary-rgb),0.3)]'
              : 'border-[var(--color-outline)] hover:border-[rgba(var(--color-primary-rgb),0.18)]',
          )}
          whileHover={
            prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.22, ease: 'easeOut' } }
          }
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-on-surface)]/[0.03] to-transparent"
          />

          <BrowserChrome domain={client.domain} isHovered={isHovered} />

          {/* Screenshot area with frosted glass overlay */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={client.screenshot}
              alt={`Sitio web de ${client.name}`}
              fill
              className={cn(
                'object-cover object-top transition-all duration-500 ease-out',
                isHovered ? 'scale-[1.02] blur-0' : 'scale-[1.06] blur-[6px]',
              )}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />

            {/* Frost overlay */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-500 ease-out',
                isHovered ? 'opacity-0' : 'opacity-100',
              )}
              style={{
                background:
                  'linear-gradient(135deg, var(--color-surface-low) 0%, rgba(var(--color-primary-rgb), 0.06) 50%, var(--color-surface-low) 100%)',
                backdropFilter: 'saturate(0.3)',
              }}
            />

            {/* Center reveal hint (visible when frosted) */}
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300',
                isHovered ? 'opacity-0' : 'opacity-100',
              )}
            >
              <div
                className="flex size-10 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(var(--color-primary-rgb), 0.1)',
                  border: '1px solid rgba(var(--color-primary-rgb), 0.2)',
                }}
              >
                <svg
                  className="size-4 text-[var(--color-primary)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-on-surface-variant)]/50">
                Preview
              </span>
            </div>

            {/* Hover CTA overlay */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
                'bg-gradient-to-t from-black/40 via-transparent to-transparent',
                isHovered ? 'opacity-100' : 'opacity-0',
              )}
            >
              <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
                Visitar sitio
                <ExternalLinkIcon className="size-3.5" />
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="relative px-5 py-4">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-b-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  'radial-gradient(180px circle at 50% 0%, rgba(var(--color-primary-rgb), 0.08), transparent 70%)',
              }}
            />
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-extrabold text-[var(--color-on-surface)]">
                  {client.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[var(--color-on-surface-variant)]">
                  {client.category}
                </p>
              </div>
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg transition-colors duration-200',
                  isHovered
                    ? 'bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]'
                    : 'text-[var(--color-on-surface-variant)]',
                )}
              >
                <ExternalLinkIcon className="size-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </a>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Section — "Confían en APEX"
   ──────────────────────────────────────────────────────────────────────── */

function CarouselDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 sm:hidden" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === active
              ? 'h-1.5 w-5 bg-[var(--color-primary)]'
              : 'size-1.5 bg-[var(--color-on-surface-variant)]/25',
          )}
        />
      ))}
    </div>
  )
}

export function TrustedClientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.scrollWidth / CLIENTS.length
    const index = Math.round(el.scrollLeft / cardWidth)
    setActiveIndex(Math.min(index, CLIENTS.length - 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section className="relative py-24 md:py-32">
      <GridBackground showRadialLight />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="mb-16 max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="primary">Clientes</Badge>
              <Badge variant="outline">Sitios entregados</Badge>
            </div>
            <h2 className="font-heading text-balance text-3xl leading-tight sm:text-4xl md:text-5xl">
              <span className="font-light text-[var(--color-on-surface-variant)]">Confían en </span>
              <span className="font-extrabold text-[var(--color-on-surface)]">APEX</span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 max-w-lg text-pretty text-[var(--color-on-surface-variant)]"
            >
              Sitios diseñados, desarrollados y entregados. En producción y generando resultados
              para sus negocios.
            </motion.p>
          </div>
        </SectionReveal>

        {/* Desktop: grid 4 cols | Mobile: horizontal snap-scroll carousel */}
        <div className="relative">
          {/* Fade edges on mobile to hint scrollability */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4 bg-gradient-to-r from-[var(--color-surface-base)] to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4 bg-gradient-to-l from-[var(--color-surface-base)] to-transparent sm:hidden" />

          <motion.div
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className={cn(
              'flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none',
              '-mx-6 px-6',
              'sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0',
              'lg:grid-cols-4',
            )}
            data-motion
          >
            {CLIENTS.map((client, i) => (
              <div
                key={client.domain}
                className="w-[75vw] flex-shrink-0 snap-center sm:w-auto sm:flex-shrink"
              >
                <ClientCard client={client} index={i} />
              </div>
            ))}
          </motion.div>
        </div>

        <CarouselDots total={CLIENTS.length} active={activeIndex} />
      </div>
    </section>
  )
}
