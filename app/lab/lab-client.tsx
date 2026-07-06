'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ROUTES } from '@/lib/constants'
import { useApexTheme } from '@/hooks/useTheme'
import { THEMES } from '@/lib/types/theme'
import { ARTIFACTS } from '@/lib/three/artifacts'
import { MUSEUM_CASES, type MuseumCase } from '@/lib/three/museum'
import { ArrowRightIcon, ExternalLinkIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { whatsappUrl, WA_MSG_LAB } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'

/**
 * APEX Lab — campo de demostración 3D.
 * Sección 1: APEX Core (theme engine hecho materia, procedural, theme-reactive).
 * Sección 2: Showroom de artefactos generados con Meshy AI (texto → 3D).
 * Sección 3: Museo de casos — los sitios reales de /servicios como slabs 3D.
 * Los Canvas se montan client-only (three.js no SSR); showroom y museo esperan
 * a entrar en viewport (IO) para no bajar su bundle+modelos hasta que hace falta.
 */

function StagePoster({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className="h-14 w-14 rounded-full border border-white/10"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(var(--color-primary-rgb), 0.26), transparent 70%)',
          boxShadow: '0 0 55px 6px rgba(var(--color-primary-rgb), 0.3)',
        }}
      />
      <span className="absolute mt-24 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">{label}</span>
    </div>
  )
}

const ApexCore = dynamic(() => import('@/components/three/apex-core/ApexCore'), {
  ssr: false,
  loading: () => <StagePoster label="inicializando core" />,
})

const MeshyShowroom = dynamic(() => import('@/components/three/meshy-showroom/MeshyShowroom'), {
  ssr: false,
  loading: () => <StagePoster label="cargando artefacto" />,
})

const CaseMuseum = dynamic(() => import('@/components/three/case-museum/CaseMuseum'), {
  ssr: false,
  loading: () => <StagePoster label="montando museo" />,
})

/** Hook local: montar un stage 3D recién cuando entra al viewport. */
function useInViewOnce(rootMargin = '250px') {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
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
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return { ref, inView }
}

/**
 * Stage del museo con su caption de hover. Vive como componente propio para
 * que el hover (que cambia por frame de mouse) no re-renderice toda la página.
 */
function MuseumStage({ themeHex }: { themeHex: string }) {
  const { ref, inView } = useInViewOnce()
  const [focus, setFocus] = useState<MuseumCase | null>(null)

  return (
    <>
      <div ref={ref} className="relative mx-auto mt-8 h-[62vh] max-h-[560px] min-h-[420px] w-full">
        {inView ? <CaseMuseum themeHex={themeHex} onHoverChange={setFocus} /> : <StagePoster label="montando museo" />}
      </div>

      {/* Caption fija (sin layout shift): qué pieza estás mirando */}
      <div className="mx-auto mt-4 flex min-h-[64px] max-w-2xl flex-col items-center justify-center text-center">
        {focus ? (
          <>
            <p className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--color-primary)' }}>
                {focus.tierNumeral} · {focus.tierLabel}
              </span>
              {focus.name}
              <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                {focus.domain}
                <ExternalLinkIcon className="size-3" aria-hidden />
              </span>
            </p>
            <p className="mt-1 text-[13px] font-light leading-relaxed text-white/55">{focus.blurb}</p>
          </>
        ) : (
          <p className="text-[13px] font-light text-white/45">
            Pasá el mouse por una pieza para inspeccionarla · clic para abrir el sitio real en producción
          </p>
        )}
      </div>
    </>
  )
}

export function LabClient() {
  const { activeConfig, applyTheme } = useApexTheme()
  const [artifactIdx, setArtifactIdx] = useState(0)
  const artifactRef = useRef<HTMLDivElement>(null)
  const [artifactInView, setArtifactInView] = useState(false)

  useEffect(() => {
    const el = artifactRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArtifactInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const activeArtifact = ARTIFACTS[artifactIdx]

  return (
    <>
      {/* ═══════════ Sección 1 — APEX Core (theme engine) ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface-base)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(1100px 640px at 50% 20%, rgba(var(--color-primary-rgb), 0.16), transparent 60%), radial-gradient(820px 520px at 82% 92%, rgba(var(--color-primary-rgb), 0.09), transparent 55%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.4px)',
            backgroundSize: '34px 34px',
            maskImage: 'radial-gradient(120% 90% at 50% 38%, #000 42%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 50% 38%, #000 42%, transparent 78%)',
          }}
        />

        <div className="relative z-[2] mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-6 pb-10 pt-8 md:px-10">
          <header className="max-w-2xl">
            <div className="flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.34em] text-white/45">
              <span
                className="h-[7px] w-[7px] rounded-full"
                style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 12px 2px rgba(var(--color-primary-rgb), 0.9)' }}
              />
              APEX // LAB
            </div>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.02] tracking-tight text-white">
              <span className="font-thin text-white/45">un objeto.</span> diez{' '}
              <span
                style={{
                  background: 'linear-gradient(96deg,#EAF0FA,var(--color-primary))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                identidades.
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] font-light leading-relaxed text-white/55">
              El mismo artefacto que respira el color del tema activo. Tu sistema de themes,
              hecho materia — WebGL real, en tiempo real. Tocá un color y mirá cómo cambia todo el sitio con él.
            </p>
          </header>

          <div className="relative my-1 flex-1" style={{ minHeight: 'min(54vh, 480px)' }}>
            <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 font-mono text-[11px] uppercase leading-[2.1] tracking-[0.18em] text-white/40 lg:block">
              modo <b className="font-normal text-white">{activeConfig.name}</b>
              <br />
              webgl · three.js · r3f
              <br />
              <span style={{ color: 'var(--color-primary)' }}>◇</span> arrastrá para rotar
            </div>
            <ApexCore />
          </div>

          <div className="relative z-[3] mt-2 flex flex-wrap justify-center gap-2.5">
            {THEMES.map((t) => {
              const active = activeConfig.id === t.id
              return (
                <button
                  key={t.id}
                  onClick={(e) => applyTheme(t.id, e)}
                  className="group flex items-center gap-2 rounded-[10px] border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-300"
                  style={{
                    borderColor: active ? 'rgba(var(--color-primary-rgb),0.6)' : 'rgba(255,255,255,0.08)',
                    background: active ? 'rgba(var(--color-primary-rgb),0.08)' : 'rgba(255,255,255,0.02)',
                    color: active ? '#EAF0FA' : 'rgba(255,255,255,0.5)',
                    boxShadow: active ? '0 8px 26px -16px rgba(var(--color-primary-rgb),0.9)' : 'none',
                  }}
                >
                  <span
                    className="h-[11px] w-[11px] rounded-[3px]"
                    style={{ background: t.primary, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
                  />
                  {t.name}
                </button>
              )
            })}
          </div>

          <p className="mt-5 text-center text-[13px] font-light text-white/45">
            Clic en un color para aplicar el tema a todo el sitio · agarrá el objeto y arrastralo para verlo desde cualquier ángulo
          </p>
        </div>
      </section>

      {/* ═══════════ Sección 2 — Artefactos Meshy AI ═══════════ */}
      <section
        ref={artifactRef}
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: 'var(--color-surface-lowest)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 560px at 50% 42%, rgba(var(--color-primary-rgb), 0.10), transparent 62%)',
          }}
        />

        <div className="relative z-[2] mx-auto max-w-6xl px-6 md:px-10">
          <header className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 font-mono text-[12px] uppercase tracking-[0.34em] text-white/45">
              <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
              APEX // ARTEFACTOS
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              De la idea{' '}
              <span
                style={{
                  background: 'linear-gradient(96deg,#EAF0FA,var(--color-primary))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                a un objeto real.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] font-light leading-relaxed text-white/55">
              Los modelé con IA, los optimicé a mano y los traje a WebGL en tiempo real.
              Objetos que girás y mirás desde cualquier ángulo — no son imágenes. Agarrá uno y movelo.
            </p>
          </header>

          {/* Stage del artefacto */}
          <div className="relative mx-auto mt-8 h-[52vh] max-h-[520px] min-h-[380px] w-full">
            {artifactInView ? <MeshyShowroom index={artifactIdx} /> : <StagePoster label="cargando artefacto" />}
          </div>

          {/* Selector */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            {ARTIFACTS.map((a, i) => {
              const active = i === artifactIdx
              return (
                <button
                  key={a.id}
                  onClick={() => setArtifactIdx(i)}
                  className="flex flex-col rounded-xl border px-4 py-2.5 text-left transition-all duration-300"
                  style={{
                    borderColor: active ? 'rgba(var(--color-primary-rgb),0.6)' : 'rgba(255,255,255,0.08)',
                    background: active ? 'rgba(var(--color-primary-rgb),0.08)' : 'rgba(255,255,255,0.02)',
                    boxShadow: active ? '0 8px 26px -16px rgba(var(--color-primary-rgb),0.9)' : 'none',
                  }}
                >
                  <span className="text-sm font-semibold" style={{ color: active ? '#EAF0FA' : 'rgba(255,255,255,0.6)' }}>
                    {a.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">{a.tag}</span>
                </button>
              )
            })}
          </div>

          <p className="mt-5 text-center text-[13px] font-light text-white/45">
            {activeArtifact.blurb} · arrastrá para rotar · generado con Meshy AI
          </p>

          <div className="mt-10 flex justify-center">
            <WhatsAppOutboundLink
              waHref={whatsappUrl(WA_MSG_LAB)}
              data-inspector-title="CTA WhatsApp del lab (artefactos)"
              data-inspector-desc="Pide el boceto 3D gratis por WhatsApp. Tracking en openWhatsAppWithThankYouPage."
              data-inspector-cat="Conversión"
              className={cn(
                'group inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-outline-tech text-[var(--color-primary)]',
                'min-h-12 px-7 py-3 text-sm rounded-xl',
              )}
            >
              Quiero algo así para mi marca
              <ArrowRightIcon
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </WhatsAppOutboundLink>
          </div>
        </div>
      </section>

      {/* ═══════════ Sección 3 — Museo de casos reales ═══════════ */}
      <section
        id="museo"
        className="relative overflow-hidden py-20 md:py-28"
        style={{ backgroundColor: 'var(--color-surface-base)' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(1000px 600px at 50% 38%, rgba(var(--color-primary-rgb), 0.11), transparent 62%)',
          }}
        />

        <div className="relative z-[2] mx-auto max-w-6xl px-6 md:px-10">
          <header className="mx-auto max-w-2xl text-center">
            <div className="flex items-center justify-center gap-3 font-mono text-[12px] uppercase tracking-[0.34em] text-white/45">
              <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
              APEX // MUSEO
            </div>
            <h2 className="mt-4 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-[1.05] tracking-tight text-white">
              {MUSEUM_CASES.length} proyectos reales,{' '}
              <span
                style={{
                  background: 'linear-gradient(96deg,#EAF0FA,var(--color-primary))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                en el espacio.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] font-light leading-relaxed text-white/55">
              No son mockups: cada pieza es un sitio funcionando hoy en producción.
              Inspeccionala en 3D y abrila con un clic.
            </p>
          </header>

          <MuseumStage themeHex={activeConfig.primary} />

          <div className="mt-8 flex justify-center">
            <Link
              href={`${ROUTES.servicios}#casos-reales`}
              prefetch={false}
              className={cn(
                'group inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.01] active:scale-[0.97]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-outline-tech text-[var(--color-primary)]',
                'min-h-12 px-7 py-3 text-sm rounded-xl',
              )}
            >
              Ver qué cuesta cada nivel
              <ArrowRightIcon
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
