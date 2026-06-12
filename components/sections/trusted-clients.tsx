'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Lock, LockOpen } from 'lucide-react'
import { GridBackground } from '@/components/ui/grid-background'
import { ExternalLinkIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl } from '@/lib/whatsapp'
import { PROJECTS } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'

/**
 * Prueba social temprana (brief §3.2) — honesta:
 * una clienta real entregada (Mi Lugar en el Mundo) + los productos propios
 * que Manuel construyó y opera en producción. Cero testimonios inventados,
 * cero contadores inflados: todo lo que se muestra está online y es clickeable.
 */

const WA_MSG_PROOF =
  'Hola Manuel, vi los proyectos en producción que mostrás en tu web. ¿Podés hacer algo así para mi negocio?'

const FEATURED_CLIENT = {
  name: 'Mi Lugar en el Mundo',
  domain: 'moda.theapexweb.com',
  url: 'https://moda.theapexweb.com',
  label: 'Cliente real · Moda',
  description:
    'Tienda de vestidos de fiesta: diseño, desarrollo y puesta online. Entregada y en uso.',
  screenshot: '/images/clients/mi-lugar.png',
}

interface OwnProduct {
  name: string
  domain: string
  url: string
  tagline: string
}

/** Descripciones verificables, tomadas del propio sitio (theme.ts / llms.txt). */
const OWN_PRODUCTS: OwnProduct[] = [
  {
    name: 'BotLode',
    domain: 'botlode.com',
    url: PROJECTS.botlode,
    tagline: 'Ecosistema de bots con IA: creá y operá bots sin código.',
  },
  {
    name: 'Botrive',
    domain: 'botrive.com',
    url: PROJECTS.botrive,
    tagline: 'Plataforma de automatización con IA.',
  },
  {
    name: 'Assistify',
    domain: 'assistify.lat',
    url: PROJECTS.assistify,
    tagline: 'Gestión de clases para profesores e institutos — iOS y Android.',
  },
]

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/* ────────────────────────────────────────────────────────────────────────
   Browser chrome bar — URL con candado (detalle premium del card real)
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
   Featured client card — screenshot real, sin frost: la prueba se muestra
   ──────────────────────────────────────────────────────────────────────── */

function FeaturedClientCard() {
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
      }
      viewport={{ once: true, amount: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full"
    >
      <a
        href={FEATURED_CLIENT.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar ${FEATURED_CLIENT.name} — ${FEATURED_CLIENT.domain}`}
        data-hover
        data-inspector-title="Cliente real entregado"
        data-inspector-desc="Screenshot del sitio real, clickeable. Prueba social verificable en vez de testimonios inventados."
        data-inspector-cat="Conversión"
        className="group flex h-full flex-col overflow-hidden bento-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
      >
        <BrowserChrome domain={FEATURED_CLIENT.domain} isHovered={isHovered} />

        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[260px] sm:flex-1">
          <Image
            src={FEATURED_CLIENT.screenshot}
            alt={`Sitio web real de ${FEATURED_CLIENT.name}`}
            fill
            className={cn(
              'object-cover object-top transition-transform duration-500 ease-out',
              isHovered && !prefersReducedMotion ? 'scale-[1.03]' : 'scale-100',
            )}
            sizes="(max-width: 1024px) 100vw, 55vw"
          />

          {/* Hover CTA overlay */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-opacity duration-300',
              'bg-gradient-to-t from-black/45 via-transparent to-transparent',
              isHovered ? 'opacity-100' : 'opacity-0',
            )}
          >
            <span className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md">
              Visitar sitio
              <ExternalLinkIcon className="size-3.5" />
            </span>
          </div>
        </div>

        <div className="relative px-5 py-4 sm:px-6 sm:py-5">
          <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
            {FEATURED_CLIENT.label}
          </p>
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-lg font-extrabold text-[var(--color-on-surface)]">
              {FEATURED_CLIENT.name}
            </h3>
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
                isHovered
                  ? 'bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)]',
              )}
              aria-hidden="true"
            >
              <ExternalLinkIcon className="size-4" />
            </span>
          </div>
          <p className="mt-1 max-w-md text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            {FEATURED_CLIENT.description}
          </p>
        </div>
      </a>
    </motion.div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Product card — wordmark editorial, sin logos truchos
   ──────────────────────────────────────────────────────────────────────── */

function ProductCard({ product, order }: { product: OwnProduct; order: number }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visitar ${product.name} — ${product.domain}`}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 + order * 0.08 },
            }
      }
      viewport={{ once: true, amount: 0.3 }}
      whileHover={
        prefersReducedMotion ? undefined : { y: -3, transition: { duration: 0.22, ease: 'easeOut' } }
      }
      data-hover
      data-inspector-title={`Producto propio: ${product.name}`}
      data-inspector-desc="Producto construido y operado por Manuel, online en producción. Link real, verificable."
      data-inspector-cat="Conversión"
      className="group block bento-surface p-5 sm:p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-70">
            Producto propio
          </p>
          <h3 className="font-heading text-xl font-extrabold leading-none text-[var(--color-on-surface)] transition-colors duration-200 group-hover:text-[var(--color-primary)]">
            {product.name}
          </h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
            {product.tagline}
          </p>
        </div>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-on-surface-variant)] transition-colors duration-200 group-hover:bg-[rgba(var(--color-primary-rgb),0.12)] group-hover:text-[var(--color-primary)]"
          aria-hidden="true"
        >
          <ExternalLinkIcon className="size-4" />
        </span>
      </div>
      <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-on-surface-variant)] opacity-60">
        <span
          className="size-1.5 rounded-full"
          style={{ backgroundColor: 'var(--color-online)' }}
          aria-hidden="true"
        />
        {product.domain}
      </p>
    </motion.a>
  )
}

/* ────────────────────────────────────────────────────────────────────────
   Section 01 — prueba social honesta
   ──────────────────────────────────────────────────────────────────────── */

export function TrustedClientsSection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <GridBackground showRadialLight />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Numeración editorial gigante — rompe el grid por el borde derecho */}
      <span
        aria-hidden="true"
        className="section-number absolute -right-4 top-10 hidden lg:block"
        style={{ fontSize: 'clamp(7rem, 13vw, 11rem)' }}
      >
        01
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } }
          }
          viewport={{ once: true, amount: 0.4 }}
          className="mb-14 max-w-2xl"
        >
          <p className="editorial-label mb-6">En producción ahora</p>
          <h2 className="heading-display text-balance text-3xl sm:text-4xl md:text-5xl">
            <span className="block text-[var(--color-on-surface-variant)]">Sin mockups ni promesas.</span>
            <strong className="block text-[var(--color-on-surface)]">Online y funcionando.</strong>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-[var(--color-on-surface-variant)]">
            Una tienda entregada a una clienta real y tres productos propios que construí y
            opero todos los días. Entrá a cualquiera y comprobalo — están online ahora.
          </p>
        </motion.div>

        {/* Bento asimétrico: cliente real protagonista, productos en columna */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
          <div className="lg:col-span-7">
            <FeaturedClientCard />
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-5">
            {OWN_PRODUCTS.map((product, i) => (
              <ProductCard key={product.domain} product={product} order={i} />
            ))}
          </div>
        </div>

        {/* CTA contextual de la sección */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.15 } }
          }
          viewport={{ once: true, amount: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <WhatsAppOutboundLink
            waHref={whatsappUrl(WA_MSG_PROOF)}
            className={cn(
              'inline-flex items-center justify-center gap-2 font-semibold select-none',
              'transition-all duration-200 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              'btn-tech btn-outline-tech text-[var(--color-primary)] active:scale-[0.97]',
              'h-12 px-7 text-sm rounded-xl',
            )}
          >
            <WhatsAppIcon className="size-4" />
            Quiero algo así para mi negocio
          </WhatsAppOutboundLink>
          <p className="text-xs text-[var(--color-on-surface-variant)] opacity-70">
            Te respondo en menos de 1 hora.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
