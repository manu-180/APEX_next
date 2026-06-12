import type { Metadata } from 'next'
import Link from 'next/link'
import { GridBackground } from '@/components/ui/grid-background'
import { ROUTES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Página no encontrada — 404',
  description: 'La ruta solicitada no existe. Navegá al inicio o contactame directamente.',
  robots: { index: false, follow: false },
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 7L8 2l6 5v7h-4V9H6v5H2V7z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8h9M9 4l4 4-4 4" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'Servicios',   href: ROUTES.servicios },
  { label: 'Tecnologías', href: ROUTES.tecnologias },
  { label: 'Sobre Mí',    href: ROUTES.about },
  { label: 'Contacto',    href: ROUTES.contact },
] as const

export default function NotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-20"
      style={{ minHeight: 'calc(100dvh - 4rem)' }}
    >
      <GridBackground showRadialLight />

      {/* Ambient glow behind the numbers */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '700px',
          height: '320px',
          background: 'radial-gradient(ellipse, rgba(var(--color-primary-rgb), 0.09) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      {/* Dot-grid backdrop — fades at edges (más presente sobre porcelana en light) */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] opacity-[0.32] dark:opacity-[0.18]"
        style={{
          width: '520px',
          height: '220px',
          backgroundImage:
            'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.5) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage:
            'radial-gradient(ellipse 55% 55% at 50% 50%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 55% 55% at 50% 50%, black 35%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content card — corner brackets wrap this */}
      <div className="relative mx-auto w-full max-w-[560px] px-8 py-4 text-center">
        {/* Brackets */}
        <span className="nf-corner nf-tl" aria-hidden="true" />
        <span className="nf-corner nf-tr" aria-hidden="true" />
        <span className="nf-corner nf-bl" aria-hidden="true" />
        <span className="nf-corner nf-br" aria-hidden="true" />

        {/* Status badge */}
        <div
          className="nf-badge mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            border: '1px solid rgba(var(--color-accent-rgb), 0.35)',
            background: 'rgba(var(--color-accent-rgb), 0.08)',
            color: 'var(--color-accent)',
          }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{
              background: 'var(--color-accent)',
              boxShadow: '0 0 6px var(--color-accent)',
            }}
          />
          SEÑAL PERDIDA
        </div>

        {/* 404 number — weight contrast + gradient + flicker */}
        <h1
          className="nf-four font-heading select-none text-gradient-primary glow-text"
          style={{
            fontSize: 'clamp(6.5rem, 22vw, 13.5rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
          }}
          aria-label="Error 404 — Página no encontrada"
        >
          <span style={{ fontWeight: 300, opacity: 0.58 }}>4</span>
          <span style={{ fontWeight: 800 }}>0</span>
          <span style={{ fontWeight: 300, opacity: 0.58 }}>4</span>
        </h1>

        {/* Subtitle */}
        <p
          className="nf-sub mt-3 font-heading"
          style={{
            fontSize: '0.75rem',
            fontWeight: 400,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'var(--color-on-surface-variant)',
          }}
        >
          Ruta no encontrada
        </p>

        {/* Divider */}
        <div
          className="nf-desc mx-auto my-7"
          style={{
            height: '1px',
            width: '96px',
            background:
              'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.45), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Description */}
        <p
          className="nf-desc mx-auto max-w-[20rem] text-sm leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          La página que buscás no existe o fue movida. Volvé al inicio o contactame directamente.
        </p>

        {/* CTAs */}
        <div className="nf-ctas mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ROUTES.home}
            className="btn-tech btn-primary-tech inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
            style={{ color: 'var(--color-primary)' }}
          >
            <HomeIcon />
            Volver al inicio
          </Link>
          <Link
            href={ROUTES.contact}
            className="btn-tech btn-outline-tech inline-flex items-center gap-2.5 px-6 py-3 text-sm font-medium transition-all duration-300 active:scale-[0.97]"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Contactar
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Quick nav */}
        <div className="nf-nav mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nf-nav-link text-xs"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Terminal status line */}
      <div
        className="nf-term glass-card mt-10 inline-flex items-center gap-2 rounded-lg px-5 py-3 font-mono text-xs"
        style={{ color: 'var(--color-on-surface-variant)' }}
      >
        <span style={{ color: 'var(--color-accent)' }}>apex@sys</span>
        <span style={{ opacity: 0.4 }}>:~$</span>
        <span>resolve</span>
        {/* red-400 (= rgb(248,113,113)) solo en dark; en light necesita más tinta */}
        <span className="text-red-600 dark:text-red-400">NOT_FOUND</span>
        <span
          className="nf-cur ml-0.5 inline-block h-[13px] w-[7px] align-middle"
          style={{ background: 'var(--color-accent)', opacity: 0.75 }}
        />
      </div>
    </div>
  )
}
