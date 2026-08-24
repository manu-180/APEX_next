'use client'

import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { useApexTheme } from '@/hooks/useTheme'
import { THEMES } from '@/lib/types/theme'
import { ArrowRightIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils/cn'

/**
 * Showcase interactivo de themes — reemplaza al interludio WebGL de la home.
 *
 * El gancho de conversión (tocar un swatch y ver TODO el sitio cambiar de
 * identidad) se conserva intacto; lo que se fue es three.js: el core ahora es
 * un artefacto 100% CSS (gradientes + transform compositado) que reacciona a
 * las CSS vars del theme. Costo de runtime ≈ 0: nada de WebGL, bloom ni rAF.
 * El 3D real vive en /lab, detrás de un click explícito.
 */

/** Núcleo CSS theme-reactive: anillos orbitando + gema facetada por gradientes. */
function CssCore({ primaryHex }: { primaryHex: string }) {
  return (
    <div className="relative grid size-full place-items-center" aria-hidden="true">
      {/* Halo ambiente */}
      <div
        className="absolute size-[340px] rounded-full md:size-[420px]"
        style={{
          background:
            'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.16) 0%, rgba(var(--color-primary-rgb), 0.05) 42%, transparent 68%)',
        }}
      />

      {/* Anillo orbital A (plano inclinado, giro lento) */}
      <div className="absolute" style={{ transform: 'rotateX(72deg)', transformStyle: 'preserve-3d', perspective: '800px' }}>
        <div
          className="apex-orbit size-[300px] rounded-full md:size-[380px]"
          style={{
            border: '1px solid rgba(var(--color-primary-rgb), 0.35)',
            boxShadow: '0 0 24px -6px rgba(var(--color-primary-rgb), 0.35)',
          }}
        />
      </div>

      {/* Anillo orbital B (contra-giro, punteado) */}
      <div className="absolute" style={{ transform: 'rotateX(72deg) rotateZ(35deg)' }}>
        <div
          className="apex-orbit-reverse size-[220px] rounded-full md:size-[280px]"
          style={{ border: '1px dashed rgba(var(--color-accent-rgb), 0.4)' }}
        />
      </div>

      {/* Gema central — dos capas contra-rotando, solo transform (GPU) */}
      <div className="apex-gem-spin relative size-[150px] md:size-[190px]" style={{ willChange: 'transform' }}>
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '30%',
            transform: 'rotate(45deg)',
            background:
              'linear-gradient(160deg, rgba(var(--color-primary-rgb), 0.38), rgba(var(--color-primary-rgb), 0.06) 55%, transparent), conic-gradient(from 210deg, transparent 0deg, rgba(var(--color-primary-rgb), 0.25) 90deg, transparent 200deg)',
            border: '1px solid rgba(var(--color-primary-rgb), 0.55)',
            boxShadow:
              '0 0 46px -6px rgba(var(--color-primary-rgb), 0.55), inset 0 0 28px rgba(var(--color-primary-rgb), 0.18)',
          }}
        />
        <div
          className="absolute inset-[18%]"
          style={{
            borderRadius: '34%',
            transform: 'rotate(12deg)',
            background:
              'linear-gradient(320deg, rgba(var(--color-accent-rgb), 0.30), transparent 60%)',
            border: '1px solid rgba(var(--color-accent-rgb), 0.45)',
          }}
        />
        <div
          className="absolute inset-[38%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at 42% 38%, #ffffff 0%, var(--color-primary) 34%, rgba(var(--color-primary-rgb), 0.25) 100%)',
            boxShadow: '0 0 30px 2px rgba(var(--color-primary-rgb), 0.75)',
          }}
        />
      </div>

      {/* Chips de telemetría — el hex vivo del theme activo */}
      <div
        className="absolute left-[8%] top-[12%] rounded-md px-2.5 py-1.5 font-mono text-[10px] font-bold tracking-[0.14em]"
        style={{
          color: 'var(--color-on-surface-variant)',
          border: '1px solid var(--glass-border)',
          backgroundColor: 'var(--glass-bg)',
        }}
      >
        THEME ENGINE · LIVE
      </div>
      <div
        className="absolute bottom-[14%] right-[10%] rounded-md px-2.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em]"
        style={{
          color: 'var(--color-primary)',
          border: '1px solid rgba(var(--color-primary-rgb), 0.4)',
          backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
        }}
      >
        {primaryHex}
      </div>
    </div>
  )
}

export function Home3DShowcase() {
  const { activeConfig, applyTheme } = useApexTheme()

  return (
    <section
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
            Identidad viva · en tiempo real
          </p>

          <h2 className="mb-5 text-3xl font-extrabold leading-[1.05] tracking-tight text-[var(--color-on-surface)] sm:text-4xl md:text-[2.8rem]">
            <span className="font-thin text-[var(--color-on-surface-variant)]">Siete identidades.</span>
            <br />
            Un solo{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(96deg, var(--color-on-surface), var(--color-primary))' }}
            >
              sitio.
            </span>
          </h2>

          <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--color-on-surface-variant)]">
            Tocá un color y mirá cómo todo el sitio —botones, luces, acentos— cambia de identidad
            al instante. Es la misma clase de experiencia premium que puedo construir para tu marca.
          </p>

          {/* Swatches de theme — el gancho interactivo */}
          {/* gap-3 + swatch de 32px = 44px de paso entre centros, que es lo que
              necesitan las áreas de `tap-44` para no pisarse entre sí. A 375px
              esto reparte los 10 swatches en dos filas: diez targets de 44px no
              entran en una sola línea, y un target de 24px no es tocable. */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {THEMES.map((t) => {
              const active = activeConfig.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={(e) => applyTheme(t.id, e)}
                  aria-label={`Aplicar tema ${t.name}`}
                  className="relative tap-44 h-8 w-8 rounded-md transition-transform duration-200 hover:scale-110"
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

          <Link
            href={ROUTES.lab}
            prefetch={false}
            className={cn(
              'group inline-flex items-center justify-center gap-2 font-semibold select-none',
              'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
              'btn-tech btn-outline-tech text-[var(--color-primary)]',
              'min-h-12 px-7 py-3 text-sm rounded-xl',
            )}
          >
            Ver el laboratorio 3D
            <ArrowRightIcon
              className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden
            />
          </Link>
        </div>

        {/* ── Stage (columna ancha) — artefacto CSS, cero WebGL ── */}
        <div className="relative order-1 h-[360px] w-full md:h-[460px] lg:order-2 lg:h-[520px]">
          <CssCore primaryHex={activeConfig.primary} />
        </div>
      </div>
    </section>
  )
}
