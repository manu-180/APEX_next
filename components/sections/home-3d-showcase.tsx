'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { useApexTheme } from '@/hooks/useTheme'
import { THEMES } from '@/lib/types/theme'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

/**
 * Interludio 3D de la home — "la web no tiene por qué ser plana".
 * Muestra el APEX Core (WebGL real) como demostración de capacidad y empuja al /lab.
 *
 * Perf: el bundle de three.js se monta SOLO cuando la sección entra en viewport
 * (IntersectionObserver), así no toca el LCP/TBT del critical path del home.
 * El texto es SSR (SEO) — solo el Canvas es client-only.
 */

function CorePoster() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className="h-14 w-14 rounded-full border border-white/10"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(var(--color-primary-rgb), 0.28), transparent 70%)',
          boxShadow: '0 0 55px 6px rgba(var(--color-primary-rgb), 0.32)',
        }}
      />
    </div>
  )
}

const ApexCore = dynamic(() => import('@/components/three/apex-core/ApexCore'), {
  ssr: false,
  loading: () => <CorePoster />,
})

export function Home3DShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { activeConfig, applyTheme } = useApexTheme()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32"
      style={{ backgroundColor: 'var(--color-surface-base)' }}
    >
      {/* Glow radial del theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 520px at 72% 45%, rgba(var(--color-primary-rgb), 0.13), transparent 62%)',
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-4">
        {/* ── Texto (columna angosta) ── */}
        <div className="order-2 lg:order-1">
          <p className="editorial-label editorial-label--primary mb-6">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 8px var(--color-primary)' }}
              aria-hidden="true"
            />
            Experiencia 3D · en vivo
          </p>

          <h2 className="mb-5 text-3xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-on-surface)] sm:text-4xl md:text-[2.8rem]">
            <span className="font-thin text-[var(--color-on-surface-variant)]">La web no tiene</span>
            <br />
            por qué ser{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(96deg, var(--color-on-surface), var(--color-primary))' }}
            >
              plana.
            </span>
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            Esto es 3D real corriendo en tu navegador, ahora mismo. Tocá un color y mirá al objeto
            cambiar de forma junto con todo el sitio. Es la misma clase de experiencia premium que
            puedo construir para tu marca.
          </p>

          {/* Swatches de theme — el gancho interactivo */}
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {THEMES.map((t) => {
              const active = activeConfig.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={(e) => applyTheme(t.id, e)}
                  aria-label={`Aplicar tema ${t.name}`}
                  className="h-6 w-6 rounded-md transition-transform duration-200 hover:scale-110"
                  style={{
                    background: t.primary,
                    boxShadow: active
                      ? '0 0 0 2px var(--color-surface-base), 0 0 0 3.5px var(--color-primary)'
                      : 'inset 0 0 0 1px rgba(255,255,255,0.14)',
                  }}
                />
              )
            })}
          </div>

          <Link href={ROUTES.lab} prefetch={false}>
            <button
              type="button"
              className={cn(
                'group inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-outline-tech text-[var(--color-primary)]',
                'min-h-12 px-7 py-3 text-sm rounded-xl',
              )}
            >
              Entrar al laboratorio
              <ArrowRightIcon
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </button>
          </Link>
        </div>

        {/* ── Stage 3D (columna ancha) ──
            El máscara radial funde los bordes del canvas en el negro de la sección:
            sin él, el bloom del objeto llega hasta el borde del <canvas> y dibuja un
            rectángulo duro (se nota en themes saturados). Así el objeto "flota" en el
            espacio como en /lab, en vez de quedar encerrado en una caja. */}
        <div
          className="relative order-1 h-[360px] w-full md:h-[460px] lg:order-2 lg:h-[520px]"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 76% 80% at 50% 50%, #000 56%, rgba(0,0,0,0) 90%)',
            maskImage:
              'radial-gradient(ellipse 76% 80% at 50% 50%, #000 56%, rgba(0,0,0,0) 90%)',
          }}
        >
          {inView ? <ApexCore /> : <CorePoster />}
        </div>
      </div>
    </section>
  )
}
