'use client'

/**
 * Hero del muestrario. Narrativa: esto no es un grid de capturas muertas — son
 * sitios reales en producción + un laboratorio que crece SOLO cada semana
 * (gracias a "Libre Albedrío"). Layout asimétrico, padding generoso, un acento.
 */

import { type CSSProperties } from 'react'
import { SectionReveal } from '@/components/ui/section-reveal'

export function MuestrarioHero({ totalCount, labCount }: { totalCount: number; labCount: number }) {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-32 sm:pb-16 sm:pt-40">
      {/* glow de fondo, un solo acento del tema */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 18% 0%, rgba(var(--color-primary-rgb),0.12) 0%, transparent 70%), radial-gradient(50% 40% at 100% 10%, rgba(var(--color-primary-rgb),0.07) 0%, transparent 70%)',
        }}
      />
      <span
        aria-hidden
        className="section-number pointer-events-none absolute -right-2 top-24 hidden select-none md:block"
        style={{ fontSize: 'clamp(6rem, 16vw, 13rem)' } as CSSProperties}
      >
        00
      </span>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-end gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <SectionReveal>
            <p className="editorial-label editorial-label--primary mb-5">Muestrario · diseño en vivo</p>
          </SectionReveal>

          <SectionReveal delay={0.05}>
            <h1 className="heading-display text-balance text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              <span className="block text-[var(--color-on-surface-variant)]">No es un portfolio de capturas.</span>
              <strong className="block text-[var(--color-on-surface)]">Es la web real, abierta y tocable.</strong>
            </h1>
          </SectionReveal>

          <SectionReveal delay={0.12}>
            <p className="text-pretty mt-6 max-w-xl text-base leading-relaxed text-[var(--color-on-surface-variant)]">
              Cada pieza de abajo está deployada y funcionando hoy. Tocá cualquiera y se abre en
              vivo — código en producción, no maquetas. Abajo, además, un laboratorio de diseño
              que <span className="font-semibold text-[var(--color-on-surface)]">suma un sitio nuevo cada semana</span>, solo.
            </p>
          </SectionReveal>
        </div>

        {/* Tarjeta de stats — "se actualiza solo" */}
        <SectionReveal delay={0.18} direction="left">
          <div className="bento-surface rounded-2xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60" style={{ background: 'var(--color-primary)' }} />
                <span className="relative inline-flex size-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-primary)]">En vivo · se actualiza solo</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-4xl font-extrabold tabular-nums text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {totalCount}
                </div>
                <div className="mt-1 text-xs text-[var(--color-on-surface-variant)]">sitios para abrir</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold tabular-nums text-[var(--color-on-surface)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  +{labCount}
                </div>
                <div className="mt-1 text-xs text-[var(--color-on-surface-variant)]">en el laboratorio</div>
              </div>
            </div>

            <div
              className="mt-5 flex items-start gap-2.5 rounded-xl p-3"
              style={{ background: 'rgba(var(--color-primary-rgb),0.05)', border: '1px solid rgba(var(--color-primary-rgb),0.14)' }}
            >
              <span aria-hidden className="mt-px text-sm">⚡</span>
              <p className="text-[11px] leading-relaxed text-[var(--color-on-surface-variant)]">
                El laboratorio lo alimenta un sistema autónomo: diseña, construye y publica un demo
                premium por semana. Lo que ves abajo se recarga solo.
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
