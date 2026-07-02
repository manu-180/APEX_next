'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { GridBackground } from '@/components/ui/grid-background'
import { CodeRainBg } from '@/components/ui/code-rain-bg'
import { TiltCard } from '@/components/ui/tilt-card'
import { REVEAL_ITEM_VARIANTS } from '@/components/ui/section-reveal'
import { ArrowRightIcon, ExternalLinkIcon, WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { PROJECTS, ROUTES } from '@/lib/constants'
import { DUR_REVEAL, EASE_OUT, STAGGER_BASE } from '@/lib/motion'
import { WA_GRADIENT, WA_SHADOW_CLASS } from '@/lib/constants/whatsapp-ui'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'

/* ────────────────────────────────────────────────────────────────────────────
   Datos reales — nada inventado. Fuentes: lib/constants, lib/types/theme.ts,
   llms.txt y claims ya publicados en el sitio (footer: respuesta <1 h).
   ──────────────────────────────────────────────────────────────────────────── */

/** Mensaje prellenado propio de esta página (el tracking vive en WhatsAppOutboundLink). */
const WA_MSG_SOBRE_MI =
  'Hola Manuel, leí tu página y me interesa trabajar con vos. Tengo un proyecto para contarte. ¿Lo charlamos?'

const FICHA_ROWS = [
  { label: 'Disponibilidad', value: '1-2 proyectos por vez' },
  { label: 'Base', value: 'Buenos Aires · 100% remoto' },
  { label: 'Entrega', value: 'Fecha pactada = fecha entregada' },
  { label: 'Código', value: 'Tuyo desde el día uno' },
] as const

/** Principios no negociables — copy validado por auditoría, no suavizar. */
const PRINCIPIOS = [
  'Tu código. Tuyo. Para siempre.',
  'Fecha pactada = fecha entregada',
  'WhatsApp directo, sin filtros',
  'Primero el problema. Luego el código.',
] as const

/* Botón de dinero: SIEMPRE sólido verde WhatsApp (jerarquía del addendum).
   Gradiente y sombra desde la fuente única lib/constants/whatsapp-ui (spec §12).
   Hover: overlay white/10 por opacity (nada de brightness) + iconos cinéticos. */
const WA_BTN_CLASS =
  'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl font-bold text-white select-none ' +
  'transition-[transform,box-shadow] duration-300 hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] ' +
  WA_SHADOW_CLASS

const WA_BTN_STYLE: CSSProperties = {
  background: WA_GRADIENT,
}

/** Overlay de hover del CTA WhatsApp: solo opacity (compositado). */
function WaHoverOverlay() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  )
}

const DIRECT_BENEFITS = [
  {
    n: '01',
    title: 'Mejor precio',
    body: 'Sin project managers, comerciales ni oficinas que pagar: el presupuesto se va en diseño y código. Precio fijo, acordado antes de empezar.',
  },
  {
    n: '02',
    title: 'Más velocidad',
    body: 'Las decisiones se toman en una charla de WhatsApp, no en una semana de reuniones. Por eso una web sale en 15 días.',
  },
  {
    n: '03',
    title: 'Hablás con quien construye',
    body: 'Lo que me contás no pasa por tres personas antes de llegar al código. El que te lee es el que lo programa — sin teléfono descompuesto. Si hay un bug a las 11 de la noche, lo arreglo yo.',
  },
] as const

const NO_HAGO = [
  'Prometer plazos imposibles para cerrar el trato.',
  'Cobrarte mantenimiento mensual por un sitio que no cambia.',
  'Subcontratar tu proyecto a un equipo que no conocés.',
  'Tomar más proyectos de los que puedo hacer bien.',
] as const

const PRODUCTOS = [
  {
    name: 'Handy',
    tag: 'Producto propio',
    desc: 'Herramientas web rápidas y prácticas para el día a día.',
    url: PROJECTS.handy,
    domain: 'handy.theapexweb.com',
    span: 'lg:col-span-3',
  },
  {
    name: 'Assistify',
    tag: 'Producto propio',
    desc: 'Gestión de clases para profesores e institutos — app publicada en iOS y Android.',
    url: PROJECTS.assistify,
    domain: 'assistify.lat',
    span: 'lg:col-span-3',
  },
  {
    name: 'Byluma Invita',
    tag: 'Producto propio',
    desc: 'Invitaciones digitales personalizadas para eventos y celebraciones.',
    url: PROJECTS.byluma,
    domain: 'bylumainvita.com',
    span: 'lg:col-span-2',
  },
  {
    name: 'Mi Lugar en el Mundo',
    tag: 'Cliente real',
    desc: 'Tienda online de moda construida para un cliente: diseño, catálogo y puesta en producción.',
    url: 'https://moda.theapexweb.com',
    domain: 'moda.theapexweb.com',
    span: 'lg:col-span-4 sm:col-span-2',
  },
] as const

const STACK_BENEFITS = [
  {
    tech: 'Flutter',
    benefit: 'Una sola app que funciona en iPhone y Android: pagás un desarrollo, no dos.',
  },
  {
    tech: 'Next.js',
    benefit: 'Tu web aparece en Google y carga en menos de 2 segundos. Más visitas que se convierten en consultas.',
  },
  {
    tech: 'Supabase',
    benefit: 'Tus datos guardados, seguros y sincronizados — sin servidores que administrar ni mantener.',
  },
  {
    tech: 'TypeScript + Tailwind',
    benefit: 'Los errores se atrapan antes de llegar a tus usuarios. Cada cambio futuro sale más rápido y más barato.',
  },
] as const

/* ────────────────────────────────────────────────────────────────────────────
   Screenshots reales de la "prueba de capacidad" — mapa estático de rutas.
   Los archivos viven en public/projects/showcase/ (compartidos con el
   muestrario). Si un producto no tiene entrada (o la imagen falla en runtime),
   la celda cae al monograma outline (.section-number).
   ──────────────────────────────────────────────────────────────────────────── */
const PRODUCT_SHOTS: Partial<Record<(typeof PRODUCTOS)[number]['name'], string>> = {
  Handy: '/projects/showcase/handy.webp',
  Assistify: '/projects/showcase/assistify.webp',
  'Byluma Invita': '/projects/showcase/luma-invita.webp',
  'Mi Lugar en el Mundo': '/projects/showcase/moda.webp',
}

/**
 * Preview visual de la celda bento: screenshot real con máscara de gradiente
 * a transparente + borde hairline; hover translate/scale transform-only con
 * la curva firma (`ease-out` ya apunta a var(--ease-out)). Fallback: monograma
 * outline reutilizando .section-number. Sin noise encima (spec §6).
 */
function ProductShot({ name }: { name: (typeof PRODUCTOS)[number]['name'] }) {
  const [failed, setFailed] = useState(false)
  const src = PRODUCT_SHOTS[name]
  const showImage = Boolean(src) && !failed

  return (
    <div
      className="relative mt-auto aspect-[16/9] overflow-hidden rounded-lg border border-[var(--glass-border)]"
      aria-hidden="true"
    >
      {showImage ? (
        <Image
          src={src as string}
          alt=""
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-top transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100"
          style={{
            maskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 100%)',
          }}
          onError={() => setFailed(true)}
        />
      ) : (
        /* Fallback: monograma outline sobre tinte sutil del tema */
        <div
          className="flex h-full items-center justify-center"
          style={{ background: 'rgba(var(--color-primary-rgb), 0.05)' }}
        >
          <span
            className="section-number transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={{ fontSize: '4rem' } as CSSProperties}
          >
            {name[0]}
          </span>
        </div>
      )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Count-up de métricas del hero — useMotionValue + animate (cero re-renders:
   el MotionValue se renderiza directo como hijo de motion.span). Con
   reduced-motion o valores no numéricos ("<1 h") queda estático.
   ──────────────────────────────────────────────────────────────────────────── */
function CountUpValue({ value }: { value: string }) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const match = /^(\d+)([\s\S]*)$/.exec(value)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => String(Math.round(v)))

  const animatable = Boolean(match) && !prefersReducedMotion

  useEffect(() => {
    if (!animatable || !inView) return
    const controls = animate(count, target, { duration: DUR_REVEAL, ease: EASE_OUT })
    return () => controls.stop()
    // `count` es estable (useMotionValue); target/inView son las deps reales.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animatable, inView, target])

  if (!animatable) return <span ref={ref}>{value}</span>

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Reveal — wrapper scroll-reveal propio con `useReducedMotion()` (contrato de
   FOUNDATION_NOTES: los `initial={{opacity:0}}` de Framer necesitan el hook).
   Upgrade v2: reveal firma del spec §2 (y+blur one-shot, curva firma) con
   offset `x` opcional para entradas laterales.
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Slot de foto real del founder con fallback elegante a las iniciales "MN".
 * `hasPhoto` viene del server (chequeo estático de `public/manuel.jpg`); el
 * `onError` cubre cualquier fallo en runtime. Las iniciales viven SIEMPRE
 * debajo de la foto, así nunca hay flash ni broken image.
 * TODO Manuel: subir public/manuel.jpg (foto real, cuadrada, ~640px).
 */
function FounderAvatar({ hasPhoto }: { hasPhoto: boolean }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const showPhoto = hasPhoto && !photoFailed

  return (
    <div className="relative shrink-0">
      <div
        className="relative size-20 overflow-hidden rounded-2xl theme-transition"
        style={{
          background: 'rgba(var(--color-primary-rgb), 0.16)',
          border: '2px solid rgba(var(--color-primary-rgb), 0.38)',
        }}
      >
        {/* Fallback: iniciales, siempre presentes debajo */}
        <span
          aria-hidden={showPhoto}
          className="absolute inset-0 flex items-center justify-center text-xl font-bold select-none theme-transition"
          style={{ color: 'var(--color-primary)' }}
        >
          MN
        </span>
        {showPhoto && (
          <Image
            src="/manuel.jpg"
            alt="Manuel Navarro, desarrollador full-stack y mobile"
            fill
            sizes="80px"
            className="object-cover"
            onError={() => setPhotoFailed(true)}
          />
        )}
      </div>
      {/* Indicador de presencia (mismo verde online del resto del sitio) */}
      <span
        className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 animate-pulse"
        style={{
          backgroundColor: 'var(--color-online)',
          borderColor: 'var(--color-surface-low)',
          boxShadow: '0 0 6px var(--color-online)',
        }}
      />
    </div>
  )
}

function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
  /** Offset horizontal de entrada (px). Si se define, reemplaza al y vertical. */
  x?: number
}) {
  const prefersReducedMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, x, y: x === 0 ? 28 : 0, filter: 'blur(6px)' }
      }
      whileInView={
        prefersReducedMotion
          ? undefined
          : {
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
              // Un filter residual crea un backdrop-root y rompería los
              // backdrop-filter internos: se limpia al terminar (ver SectionReveal).
              transitionEnd: { filter: 'none' },
            }
      }
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: DUR_REVEAL, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

export function SobreMiContent({
  hasFounderPhoto = false,
  yearsExp = 5,
}: {
  hasFounderPhoto?: boolean
  /** Se calcula en el server (page.tsx) para evitar el mismatch de hidratación
   *  que producía `new Date()` en el módulo cliente. */
  yearsExp?: number
}) {
  const headerRef = useRef<HTMLElement>(null)
  const bgCursorRef = useRef({ x: -1, y: -1, active: false })
  const prefersReducedMotion = useReducedMotion()

  const heroMetrics = [
    { value: `${yearsExp}+`, label: 'años construyendo software' },
    { value: '8+', label: 'productos y sitios en producción' },
    { value: '<1 h', label: 'respuesta por WhatsApp' },
  ] as const

  /* ── Narrativa scroll-driven (§02): línea vertical de progreso que conecta
        los beneficios 01→03. GSAP ScrollTrigger con scrub, transform-only,
        gated por gsap.matchMedia — con reduced-motion la línea queda estática
        (estado final por CSS). Patrón de referencia: useGsapReveal. ── */
  const benefitsRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = benefitsRef.current
    const line = progressLineRef.current
    if (!container || !line) return

    let cleanup: (() => void) | undefined

    void (async () => {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: container,
              start: 'top 75%',
              end: 'bottom 55%',
              scrub: 0.6,
            },
          }
        )
      })
      cleanup = () => mm.revert()
    })()

    return () => cleanup?.()
  }, [])

  const { scrollYProgress } = useScroll({ target: headerRef, offset: ['start start', 'end start'] })
  const headerOpacity = useTransform(scrollYProgress, [0.4, 1], [1, 0])
  const headerMask = useTransform(scrollYProgress, [0.2, 0.8],
    ['linear-gradient(to bottom, black 80%, transparent 100%)',
     'linear-gradient(to bottom, black 0%, transparent 60%)']
  )

  return (
    <>
      {/* ══ 01 · HERO — asimétrico: narrativa + ficha técnica ══════════════ */}
      <motion.section
        ref={headerRef}
        className="relative overflow-hidden pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24"
        style={
          prefersReducedMotion
            ? undefined
            : { opacity: headerOpacity, maskImage: headerMask, WebkitMaskImage: headerMask }
        }
        data-hover
        data-inspector-title="Hero que respira con el scroll"
        data-inspector-desc="Al hacer scroll, esta cabecera se desvanece y la máscara suaviza el borde inferior. El fondo de lluvia de código reacciona al movimiento del mouse: las columnas brillan cerca del cursor, como una terminal cinematográfica."
        data-inspector-cat="Performance"
        onMouseMove={(e) => {
          const rect = headerRef.current?.getBoundingClientRect()
          if (rect) bgCursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
        }}
        onMouseLeave={() => { bgCursorRef.current = { x: -1, y: -1, active: false } }}
      >
        <GridBackground />
        <CodeRainBg cursorRef={bgCursorRef} />

        {/* Glow editorial lateral */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 55% 45% at 12% 0%, rgba(var(--color-primary-rgb), 0.14), transparent 65%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* ── Columna narrativa ── */}
            <Reveal>
              <p className="editorial-label editorial-label--primary mb-6">Sobre mí</p>

              <h1 className="heading-display heading-display--tight text-balance text-4xl sm:text-5xl md:text-6xl mb-6">
                <span className="block text-[var(--color-on-surface-variant)]">
                  No contratás una agencia.
                </span>
                <strong className="block text-[var(--color-on-surface)]">
                  Contratás al que programa.
                </strong>
              </h1>

              <p className="text-pretty text-base md:text-lg leading-relaxed text-[var(--color-on-surface-variant)] max-w-xl mb-10">
                Soy Manuel Navarro, desarrollador full-stack y mobile en Buenos Aires. El que
                te responde el WhatsApp, el que diseña tu producto y el que lo sube a
                producción somos la misma persona. Eso tiene consecuencias — todas a tu favor.
              </p>

              {/* CTA de dinero arriba del fold — sólido verde WhatsApp (addendum) */}
              <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <WhatsAppOutboundLink
                  waHref={whatsappUrl(WA_MSG_SOBRE_MI)}
                  data-hover
                  data-inspector-title="WhatsApp directo desde el hero"
                  data-inspector-desc="El CTA de dinero aparece en el primer viewport, en verde WhatsApp sólido — no en gris fantasma a 1900px de scroll. Abre WhatsApp con un mensaje personal de esta página; el tracking vive centralizado en el flujo /gracias."
                  data-inspector-cat="UX · Conversion"
                  className={cn(WA_BTN_CLASS, 'px-7 py-3.5 text-base')}
                  style={WA_BTN_STYLE}
                >
                  <WaHoverOverlay />
                  <WhatsAppIcon className="relative size-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100" />
                  <span className="relative">Escribime por WhatsApp</span>
                </WhatsAppOutboundLink>
                <p className="text-xs leading-snug text-[var(--color-on-surface-variant)] opacity-90">
                  Te respondo en menos de 1 hora.
                  <span className="block">Sin compromiso.</span>
                </p>
              </div>

              {/* Strip de métricas reales — count-up al entrar en viewport */}
              <div className="flex flex-wrap gap-x-10 gap-y-5">
                {heroMetrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 + i * 0.08, ease: EASE_OUT }}
                    className="border-l-2 pl-4"
                    style={{ borderColor: 'rgba(var(--color-primary-rgb), 0.35)' }}
                  >
                    <p
                      className="font-heading text-2xl md:text-3xl font-extrabold tabular-nums theme-transition"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      <CountUpValue value={m.value} />
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-80 mt-0.5">
                      {m.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* ── Columna ficha técnica (rompe el eje con el 01 gigante) ── */}
            <Reveal delay={0.15} className="relative">
              {/* Stroke 0.14 solo en dark; en light hereda el 0.34 global (visible sobre porcelana) */}
              <span
                aria-hidden="true"
                className="section-number absolute -top-16 -right-2 hidden lg:block dark:[--sn-stroke-alpha:0.14]"
                style={{ fontSize: 'clamp(6rem, 9vw, 8.5rem)' } as CSSProperties}
              >
                01
              </span>

              {/* Superficie E3: double-bezel (--framed) + grain. El padding vive
                  en el wrapper interior (el shell reserva el bezel-pad). */}
              <div
                className="bento-surface bento-surface--framed noise-overlay relative"
                data-hover
                data-inspector-title="Ficha técnica del founder"
                data-inspector-desc="Tarjeta tipo expediente: quién atiende tu proyecto, con qué condiciones y con qué stack. El punto verde es el mismo indicador de presencia que usa el resto del sitio."
                data-inspector-cat="Copy · Conversion"
              >
              <div className="relative z-10 p-6 md:p-7">
                {/* Cabecera: foto real (o fallback "MN") + nombre */}
                {/* TODO Manuel: subir public/manuel.jpg */}
                <div className="flex items-center gap-4 mb-5">
                  <FounderAvatar hasPhoto={hasFounderPhoto} />
                  <div>
                    <p className="font-heading text-base font-extrabold text-[var(--color-on-surface)]">
                      Manuel Navarro
                    </p>
                    <p className="text-xs text-[var(--color-on-surface-variant)]">
                      Full-Stack &amp; Mobile
                    </p>
                  </div>
                </div>

                <div className="divider-theme mb-5" aria-hidden="true" />

                {/* Filas estilo expediente */}
                <dl className="space-y-3.5 mb-5">
                  {FICHA_ROWS.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between gap-4">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-on-surface-variant)] opacity-70 shrink-0">
                        {row.label}
                      </dt>
                      <dd className="text-sm font-medium text-right text-[var(--color-on-surface)]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="divider-theme mb-5" aria-hidden="true" />

                {/* Stack chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['Flutter', 'Next.js', 'Supabase', 'TypeScript'].map((t) => (
                    <span
                      key={t}
                      className="rounded px-2 py-1 text-[10px] font-mono font-semibold theme-transition"
                      style={{
                        background: 'rgba(var(--color-primary-rgb), 0.08)',
                        color: 'rgba(var(--color-primary-rgb), 0.85)',
                        border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            </Reveal>
          </div>
        </div>
      </motion.section>

      {/* ══ 02 · TRABAJAR DIRECTO — sin agencia = precio + velocidad ═══════ */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="relative mb-12 md:mb-16">
            <span
              aria-hidden="true"
              className="section-number absolute -top-8 right-0 hidden md:block dark:[--sn-stroke-alpha:0.12]"
            >
              02
            </span>
            <p className="editorial-label mb-6">Trabajar directo</p>
            <h2 className="heading-display heading-display--tight text-balance text-3xl sm:text-4xl md:text-5xl max-w-3xl">
              <span className="block text-[var(--color-on-surface-variant)]">
                Una agencia te cobra sus capas.
              </span>
              <strong className="block text-[var(--color-on-surface)]">
                Conmigo, todo va al producto.
              </strong>
            </h2>

            {/* Manifesto — copy validado por auditoría: NO suavizar */}
            <p className="mt-6 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-[var(--color-on-surface)]">
              ¿Pagaste cientos de dólares por un sitio que no vende? ¿Esperaste meses para
              recibir algo que no era lo que pediste? ¿Tu &ldquo;solución web&rdquo; es en
              realidad una plantilla de Wix con suscripción eterna y tus datos rehenes?{' '}
              <strong className="font-extrabold" style={{ color: 'var(--color-primary)' }}>
                Por eso existe APEX.
              </strong>
            </p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            {/* Beneficios numerados, editorial + línea de progreso scroll-driven */}
            <div ref={benefitsRef} className="relative lg:pl-8">
              {/* Línea que se dibuja con el scroll (scaleY vía GSAP scrub).
                  Estado final visible por defecto: con reduced-motion queda
                  estática, sin animación. */}
              <div
                ref={progressLineRef}
                aria-hidden="true"
                className="absolute bottom-2 left-0 top-2 hidden w-px lg:block"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(var(--color-primary-rgb), 0.5), rgba(var(--color-primary-rgb), 0.08))',
                }}
              />
              {DIRECT_BENEFITS.map((b, i) => (
                <Reveal key={b.n} delay={i * 0.08}>
                  {i > 0 && <div className="divider-theme my-7" aria-hidden="true" />}
                  <div
                    className="grid grid-cols-[auto_1fr] gap-5 items-start"
                    data-hover
                    data-inspector-title={`Beneficio: ${b.title}`}
                    data-inspector-desc="Trabajar directo con el desarrollador elimina intermediarios: eso se traduce en precio, velocidad y fidelidad de lo que pediste."
                    data-inspector-cat="Copy · Conversion"
                  >
                    <span
                      className="font-mono text-xs font-bold tracking-[0.2em] mt-1.5 theme-transition"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {b.n}
                    </span>
                    <div>
                      <h3 className="font-heading text-lg md:text-xl font-extrabold text-[var(--color-on-surface)] mb-2">
                        {b.title}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-[var(--color-on-surface-variant)]">
                        {b.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Honestidad: lo que NO hago — entra desde la derecha (x:+24) */}
            <Reveal delay={0.2} x={24}>
              <div
                className="rounded-2xl p-6 md:p-7 h-full"
                style={{
                  background: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.16)',
                }}
                data-hover
                data-inspector-title="Lo que NO hago"
                data-inspector-desc="Anti-pitch deliberado: decir que no a ciertas prácticas es parte de la propuesta. Genera más confianza que cualquier promesa."
                data-inspector-cat="Copy · Conversion"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-5 text-red-600 dark:text-red-400">
                  Lo que NO hago
                </p>
                <ul className="space-y-3.5">
                  {NO_HAGO.map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--color-on-surface-variant)]"
                    >
                      <span
                        className="inline-flex size-4 shrink-0 items-center justify-center rounded-full mt-0.5 text-[10px] font-bold text-red-600 dark:text-red-400"
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)' }}
                        aria-hidden
                      >
                        ✕
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="divider-theme my-5" aria-hidden="true" />
                <p className="text-sm font-medium text-[var(--color-on-surface)]">
                  Y si tu proyecto no encaja, te lo digo antes de cobrar. No después.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Principios no negociables — pills (copy oro de la auditoría).
              Entrada staggerada por li (STAGGER_BASE) + hover con lift sutil.
              Base bg/border por clases (no inline) para que el hover gane. */}
          <motion.ul
            className="mt-12 flex flex-wrap gap-2.5"
            aria-label="Principios de trabajo"
            initial={prefersReducedMotion ? false : 'hidden'}
            whileInView={prefersReducedMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: STAGGER_BASE, delayChildren: 0.1 } },
            }}
          >
            {PRINCIPIOS.map((p) => (
              <motion.li
                key={p}
                variants={prefersReducedMotion ? undefined : REVEAL_ITEM_VARIANTS}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-semibold text-[var(--color-on-surface)]',
                  'border border-[rgba(var(--color-primary-rgb),0.22)] bg-[rgba(var(--color-primary-rgb),0.08)]',
                  'transition-[transform,background-color,border-color] duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:border-[rgba(var(--color-primary-rgb),0.4)] hover:bg-[rgba(var(--color-primary-rgb),0.14)]',
                  'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
                )}
              >
                {p}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ══ 03 · PRUEBA — productos propios en producción ══════════════════ */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="relative mb-12 md:mb-16">
            <span
              aria-hidden="true"
              className="section-number absolute -top-8 right-0 hidden md:block dark:[--sn-stroke-alpha:0.12]"
            >
              03
            </span>
            <p className="editorial-label editorial-label--primary mb-6">Prueba de capacidad</p>
            <h2 className="heading-display heading-display--tight text-balance text-3xl sm:text-4xl md:text-5xl max-w-3xl mb-5">
              <span className="block text-[var(--color-on-surface-variant)]">
                No te muestro mockups.
              </span>
              <strong className="block text-[var(--color-on-surface)]">
                Te muestro productos en producción.
              </strong>
            </h2>
            <p className="text-pretty text-base text-[var(--color-on-surface-variant)] max-w-2xl">
              Los construí yo y están online ahora mismo. Entrá, usalos, juzgá el nivel —
              esa es la vara con la que hago el tuyo.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
            {PRODUCTOS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.07} className={p.span}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bento-surface hover-lift group flex h-full flex-col p-6 md:p-7
                    transition-[transform,box-shadow,border-color] duration-300 ease-out
                    active:translate-y-0 active:duration-100
                    focus-visible:outline-none focus-visible:-translate-y-0.5
                    focus-visible:border-[rgba(var(--color-primary-rgb),0.45)]
                    focus-visible:shadow-[0_0_30px_-8px_rgba(var(--color-primary-rgb),0.3)]
                    focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]
                    motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  data-hover
                  data-inspector-title={`${p.name} — en producción`}
                  data-inspector-desc="Celda de bento con superficie tintada por el tema activo. El link abre el producto real, funcionando en producción: la prueba de capacidad más honesta que existe."
                  data-inspector-cat="UX · Conversion"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] theme-transition"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {p.tag}
                    </span>
                    <ExternalLinkIcon className="size-4 shrink-0 text-[var(--color-on-surface-variant)] opacity-50 transition-opacity duration-200 group-hover:opacity-100" />
                  </div>
                  <h3 className="font-heading text-xl md:text-2xl font-extrabold text-[var(--color-on-surface)] mb-2">
                    {p.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-on-surface-variant)] mb-5">
                    {p.desc}
                  </p>
                  {/* Preview real del producto (o monograma outline de fallback):
                      "no te muestro mockups" ahora muestra el producto de verdad */}
                  <ProductShot name={p.name} />
                  <p className="mt-4 font-mono text-xs text-[var(--color-on-surface-variant)] opacity-70 transition-colors duration-200 group-hover:text-[var(--color-primary)] group-hover:opacity-100">
                    {p.domain} ↗
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 04 · STACK — tecnología como beneficio de negocio ══════════════ */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="relative mb-10 md:mb-14">
            <span
              aria-hidden="true"
              className="section-number absolute -top-8 right-0 hidden md:block dark:[--sn-stroke-alpha:0.12]"
            >
              04
            </span>
            <p className="editorial-label mb-6">El stack</p>
            <h2 className="heading-display heading-display--tight text-balance text-3xl sm:text-4xl md:text-5xl max-w-3xl">
              <span className="block text-[var(--color-on-surface-variant)]">
                Tecnología elegida
              </span>
              <strong className="block text-[var(--color-on-surface)]">
                por lo que te ahorra.
              </strong>
            </h2>
          </Reveal>

          <div className="max-w-4xl">
            {STACK_BENEFITS.map((s, i) => (
              <Reveal key={s.tech} delay={i * 0.06}>
                {i > 0 && <div className="divider-theme" aria-hidden="true" />}
                <div className="grid gap-2 py-6 md:grid-cols-[220px_1fr] md:items-baseline md:gap-8">
                  <h3
                    className="font-heading text-lg font-extrabold theme-transition"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {s.tech}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-[var(--color-on-surface-variant)]">
                    {s.benefit}
                  </p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <Link
                href={ROUTES.tecnologias}
                className="group mt-4 inline-flex items-center gap-2 rounded text-sm font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
              >
                Ver el stack completo en detalle
                <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 05 · CTA — WhatsApp personal ════════════════════════════════════ */}
      <section className="relative pb-24 md:pb-32 pt-4">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <TiltCard
              tiltMax={3}
              glowColor="rgba(0,0,0,0)"
              className="cta-tech-card rounded-2xl overflow-hidden"
            >
              {/* Floating orb lights */}
              <div className="cta-orb cta-orb-1" aria-hidden="true" />
              <div className="cta-orb cta-orb-2" aria-hidden="true" />
              <div className="cta-orb cta-orb-3" aria-hidden="true" />

              {/* Grid mesh — se intensifica en hover vía CSS */}
              <div className="cta-grid-mesh" aria-hidden="true" />

              {/* Scan line hover effect */}
              <div className="cta-scan-line" aria-hidden="true" />

              {/* Accent beams */}
              <div className="cta-top-beam" aria-hidden="true" />
              <div className="cta-bottom-beam" aria-hidden="true" />

              {/* Corner dots */}
              <div className="cta-corner cta-corner-tl" aria-hidden="true" />
              <div className="cta-corner cta-corner-tr" aria-hidden="true" />
              <div className="cta-corner cta-corner-bl" aria-hidden="true" />
              <div className="cta-corner cta-corner-br" aria-hidden="true" />

              {/* HUD indicator */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2" aria-hidden="true">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-hud-pulse"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                />
                <span
                  className="text-[10px] font-mono tracking-wider animate-hud-pulse"
                  style={{ color: 'rgba(var(--color-primary-rgb), 0.6)', animationDelay: '0.4s' }}
                >
                  PROYECTO_SLOT: DISPONIBLE
                </span>
              </div>

              <div
                className="relative z-20 p-8 md:p-12"
                data-hover
                data-inspector-title="CTA 3D con Tilt Parallax"
                data-inspector-desc="La card inclina muy sutilmente con física de resorte siguiendo al cursor. En hover: scan line que barre la tarjeta de arriba a abajo, grid mesh más intenso, corners que pulsan más rápido y borde que brilla."
                data-inspector-cat="3D · Glow"
              >
                <div className="max-w-2xl">
                  <p className="editorial-label editorial-label--primary mb-6">Contacto directo</p>

                  <h2 className="heading-display heading-display--tight text-balance text-3xl sm:text-4xl md:text-5xl mb-4">
                    <span className="block text-[var(--color-on-surface-variant)]">
                      Trabajo con 1-2 clientes a la vez.
                    </span>
                    <strong className="block text-[var(--color-on-surface)]">
                      ¿El próximo sos vos?
                    </strong>
                  </h2>

                  <p className="text-pretty text-[var(--color-on-surface-variant)] mb-8 max-w-lg">
                    Contame qué querés construir. Te digo si puedo ayudarte, cómo lo haría
                    y cuánto cuesta — sin compromiso y sin rodeos.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <WhatsAppOutboundLink
                      waHref={whatsappUrl(WA_MSG_SOBRE_MI)}
                      data-hover
                      data-inspector-title="WhatsApp desde Sobre mí"
                      data-inspector-desc="Abre WhatsApp con un mensaje prellenado propio de esta página: le cuenta a Manuel que venís de leer su historia. El tracking de conversión vive centralizado en el flujo /gracias."
                      data-inspector-cat="UX"
                      className={cn(WA_BTN_CLASS, 'h-14 px-8 text-base')}
                      style={WA_BTN_STYLE}
                    >
                      <WaHoverOverlay />
                      <WhatsAppIcon className="relative size-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 motion-reduce:group-hover:scale-100" />
                      <span className="relative">Escribime por WhatsApp</span>
                      <ArrowRightIcon className="relative size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </WhatsAppOutboundLink>
                    <Link
                      href={ROUTES.contact}
                      className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:text-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]"
                    >
                      ¿Preferís una llamada? Agendá 15 minutos, gratis
                      <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-[var(--color-on-surface-variant)] opacity-80">
                    Te respondo en menos de 1 hora.
                  </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </>
  )
}
