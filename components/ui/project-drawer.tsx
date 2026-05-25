'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { type ProjectItem, type ThemeId } from '@/lib/types/theme'
import { PROJECT_THUMB_SRC } from '@/lib/constants/project-thumbs'
import { cn } from '@/lib/utils/cn'
import {
  XIcon,
  ExternalLinkIcon,
  BotLodeIcon,
  AssistifyIcon,
  ContactEngineIcon,
  LumaInvitaIcon,
} from '@/components/ui/icons'

// ─── Project-specific icons ─────────────────────────────────────────────────
const PROJECT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  botlode: BotLodeIcon,
  assistify: AssistifyIcon,
  'contact-engine': ContactEngineIcon,
  'luma-invita': LumaInvitaIcon,
}

// ─── Tech stacks ─────────────────────────────────────────────────────────────
const PROJECT_TECH: Record<string, string[]> = {
  botlode: ['Flutter', 'Supabase', 'Riverpod', 'OpenAI', 'Next.js'],
  assistify: ['Flutter', 'Supabase', 'Riverpod', 'WhatsApp API'],
  'contact-engine': ['Next.js', 'Supabase', 'TypeScript', 'Tailwind', 'WhatsApp API'],
  'luma-invita': ['Next.js', 'Supabase', 'Framer Motion', 'Mapbox', 'Zod', 'Tailwind'],
}

// ─── Rich content types ───────────────────────────────────────────────────────
interface BotlodeData {
  kind: 'botlode'
  description: string
  pillars: { icon: React.ReactNode; title: string; desc: string }[]
  catBotFeatures: { title: string; desc: string }[]
  historyFeatures: { title: string; desc: string }[]
  commerceText: string
  commerceFeature: { title: string; desc: string }
  urls: { label: string; href: string }[]
}
interface AssistifyData {
  kind: 'assistify'
  problem: string
  solutionFeatures: { title: string; desc: string }[]
  impact: string
  storeLinks: { label: string; href: string; platform: 'android' | 'ios' }[]
}
interface ContactEngineData {
  kind: 'contact-engine'
  tagline: string
  objectives: string[]
  impactFeatures: { title: string; desc: string }[]
  modules: { step: number; title: string; desc: string }[]
  quote: string
}
interface LumaInvitaData {
  kind: 'luma-invita'
  pitch: string
  personas: { title: string; desc: string }[]
  experiencePillars: { title: string; desc: string }[]
  flow: { step: number; title: string; desc: string }[]
  quote: string
}
type ProjectRichData = BotlodeData | AssistifyData | ContactEngineData | LumaInvitaData

// ─── SVG icons for pillars ────────────────────────────────────────────────────
const FactoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M5 21V11l4-4 4 4V21" />
    <path d="M13 11V7l4 4v10" />
    <rect x="7" y="15" width="4" height="6" />
  </svg>
)
const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M9 12h.01M15 12h.01M9 16h6" />
    <path d="M12 8V5M9 5h6" />
  </svg>
)
const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10M12 20V4M6 20v-6" />
  </svg>
)
const TrendUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <circle cx="12" cy="15" r="1" fill="currentColor" />
    <circle cx="8" cy="15" r="1" fill="currentColor" />
    <circle cx="16" cy="15" r="1" fill="currentColor" />
  </svg>
)
const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ─── Rich content data ────────────────────────────────────────────────────────
const RICH_DATA: Record<string, ProjectRichData> = {
  botlode: {
    kind: 'botlode',
    description:
      'Plataforma para que cualquiera pueda crear y comercializar sus propios bots con IA. Cada bot es un empleado virtual listo para trabajar 24/7 en cualquier sitio web. Creación instantánea, personalización total y cero código.',
    pillars: [
      {
        icon: <FactoryIcon />,
        title: 'La Fábrica',
        desc: 'Creá bots ilimitados con un clic. Sin código. Sin inversión inicial.',
      },
      {
        icon: <BotIcon />,
        title: 'Cat Bot IA',
        desc: '6 modos, IA conversacional inmersiva, modo vendedor activo.',
      },
      {
        icon: <AnalyticsIcon />,
        title: 'Command Center',
        desc: 'Leads, alertas por email, calendario de reuniones integrado.',
      },
    ],
    catBotFeatures: [
      {
        title: '6 modos de personalidad',
        desc: 'Feliz, Enojado, Técnico, Confundido, Neutro y Vendedor. El bot adapta su tono y respuestas según el contexto.',
      },
      {
        title: 'Modo vendedor',
        desc: 'Recopila emails, teléfonos y necesidades del visitante. Todos los datos en el historial para seguimiento comercial.',
      },
      {
        title: 'Experiencia inmersiva',
        desc: 'Seguimiento de mouse, detección de WiFi e IA conversacional. Un bot que parece vivo y conecta con tus clientes.',
      },
    ],
    historyFeatures: [
      {
        title: 'Dashboard en tiempo real',
        desc: 'Cada conversación, cada lead. Lead scoring neuronal de 0 a 100 por cada interacción.',
      },
      {
        title: 'Alertas por email',
        desc: 'Recibís un email profesional con datos y preview de conversación cuando un lead es caliente.',
      },
      {
        title: 'Calendario integrado',
        desc: 'Reuniones agendadas directamente desde el historial, configuradas por bot.',
      },
    ],
    commerceText:
      'Empleados virtuales que venden, atienden y generan leads 24/7. Producto listo para comercializar: sin inversión en desarrollo, escalable con IA.',
    commerceFeature: {
      title: 'Listo para vender',
      desc: 'El cliente obtiene su fábrica de bots y empieza a monetizar desde el día uno. Sin escribir una línea de código.',
    },
    urls: [
      { label: 'botlode.com', href: 'https://botlode.com' },
      { label: 'botrive.com', href: 'https://botrive.com' },
    ],
  },

  assistify: {
    kind: 'assistify',
    problem:
      'Coordinar cambios de horario por WhatsApp consume horas no remuneradas. Cuando un alumno cancela sobre la hora, ese hueco queda vacío — dinero perdido para siempre.',
    solutionFeatures: [
      {
        title: 'Autogestión Total',
        desc: 'El alumno cancela y busca su propio horario de recuperación desde la App. Elimina el 100% de la carga operativa manual.',
      },
      {
        title: 'Ingresos Blindados',
        desc: 'Sistema de Créditos + Lista de Espera rellena huecos automáticamente. Tu agenda y tu bolsillo siempre llenos.',
      },
      {
        title: 'Cero Fricción',
        desc: 'Si hay un cambio, Assistify te avisa por WhatsApp automáticamente. No necesitás abrir la App para estar informado.',
      },
      {
        title: 'Control Operativo',
        desc: 'Creá clases, ajustá cupos en tiempo real y administrá el padrón de alumnos con total libertad.',
      },
    ],
    impact:
      'Elimina el 90% de la carga administrativa y mejora la relación con los alumnos al ofrecerles flexibilidad inmediata. Disponible hoy mismo.',
    storeLinks: [
      {
        label: 'Google Play',
        href: 'https://play.google.com/store/apps/details?id=com.manuelnavarro.tallerdeceramica',
        platform: 'android',
      },
      {
        label: 'App Store',
        href: 'https://apps.apple.com/app/assistify/id6745438721',
        platform: 'ios',
      },
    ],
  },

  'contact-engine': {
    kind: 'contact-engine',
    tagline: 'Encuentra clientes y convierte conversaciones en ventas, de forma automática.',
    objectives: [
      'Encontrar clientes todos los días',
      'Ahorrar tiempo operativo',
      'Aumentar respuesta comercial',
      'Escalar sin contratar más equipo',
    ],
    impactFeatures: [
      {
        title: 'Prospección 24/7',
        desc: 'Detecta negocios y prepara el contacto incluso mientras tu equipo está fuera de horario.',
      },
      {
        title: 'Canal Correcto',
        desc: 'Email + WhatsApp combinados para que cada oportunidad reciba seguimiento por el canal con mayor respuesta.',
      },
      {
        title: 'Operación Bajo Control',
        desc: 'Dashboard con estados, volumen de envíos y conversaciones en un solo lugar para tomar decisiones rápidas.',
      },
      {
        title: 'Modelo Escalable',
        desc: 'Arquitectura multi-tenant lista para usarlo en tu marca o comercializarlo como servicio para terceros.',
      },
    ],
    modules: [
      { step: 1, title: 'Finder', desc: 'Descubrí contactos y oportunidades por nicho y ciudad.' },
      { step: 2, title: 'Hunter', desc: 'Preparó datos y ejecutá outreach por email con seguimiento automático.' },
      { step: 3, title: 'Sender', desc: 'Gestioná la cola de WhatsApp para sostener conversaciones activas.' },
      { step: 4, title: 'Panel', desc: 'Visualizá, ajustá y optimizá todo el embudo comercial.' },
    ],
    quote:
      'Contact Engine transforma el alcance comercial en una máquina de oportunidades: más conversaciones, más reuniones y más cierres.',
  },

  'luma-invita': {
    kind: 'luma-invita',
    pitch:
      'Luma Invita es la capa premium entre tu evento y cada invitado: una URL única, diseño que enamora en el primer scroll y RSVP sin fricción. El foco es la estética — animaciones senior y plantillas que se sienten como productos distintos, no variantes de la misma plantilla.',
    personas: [
      {
        title: 'Administrador',
        desc: 'Creás y editás invitaciones, subís galería, elegís plantilla, publicás y copiás links (invitación pública + dashboard del cliente).',
      },
      {
        title: 'Dueño del evento',
        desc: 'Accede con token único: ve la invitación, confirmaciones y estadísticas sin cuenta ni contraseña.',
      },
      {
        title: 'Invitado',
        desc: 'Abre el link, vive la experiencia y confirma asistencia con botones claros y formulario validado.',
      },
    ],
    experiencePillars: [
      {
        title: 'Hero cinematográfico',
        desc: 'Imagen principal, tipografía a escala fluida y motion que respeta prefers-reduced-motion.',
      },
      {
        title: 'Countdown + info + mapa',
        desc: 'Fecha en español, lugar, Mapbox con estilo acorde a la plantilla y atajos a Google Maps / Waze.',
      },
      {
        title: 'RSVP que convierte',
        desc: 'Confirmación con “Con todo” / “No puedo”, personas, menú especial y rate limiting por IP.',
      },
      {
        title: 'Compartir en WhatsApp',
        desc: 'Meta tags y OG por invitación para que la preview brille cuando la mandan al grupo.',
      },
    ],
    flow: [
      { step: 1, title: 'Crear invitación', desc: 'Tipo de evento, protagonistas, slug y estado (borrador / publicada).' },
      { step: 2, title: 'Contenido y media', desc: 'Textos, Spotify, galería en Supabase Storage con imagen principal.' },
      { step: 3, title: 'Plantilla', desc: 'Una de seis identidades: Elegante, Botánico, Moderno, Rústico, Lujo oscuro o Fiesta.' },
      { step: 4, title: 'Distribuir', desc: 'Link público para invitados y link con token para el dueño del evento.' },
    ],
    quote:
      'Si la invitación no emociona en 3 segundos, perdés RSVP. Luma Invita está pensada para que cada evento se sienta irrepetible.',
  },
}

// ─── Animation variants ───────────────────────────────────────────────────────
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

const panelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { type: 'spring' as const, damping: 30, stiffness: 280, mass: 0.8 },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as number[] },
  },
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.12 },
  },
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
  },
}

const slideLeftVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] as number[] },
  },
}

const nestedStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.065, delayChildren: 0.05 },
  },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div variants={fadeUpVariants} className="flex items-center gap-2 mb-4 mt-2">
      <div
        className="h-px flex-1 max-w-[40px]"
        style={{
          background:
            'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.5), transparent)',
        }}
      />
      <span
        className="text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: 'var(--color-primary)' }}
      >
        {children}
      </span>
      <div
        className="h-px flex-1"
        style={{
          background:
            'linear-gradient(to left, transparent, rgba(var(--color-primary-rgb), 0.15))',
        }}
      />
    </motion.div>
  )
}

function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div variants={slideLeftVariants} className="flex gap-3 items-start">
      <div
        className="mt-[2px] flex-shrink-0 w-[18px] h-[18px] rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
          border: '1px solid rgba(var(--color-primary-rgb), 0.28)',
          color: 'var(--color-primary)',
        }}
      >
        <CheckIcon />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-[var(--color-on-surface)] leading-snug">
          {title}
        </p>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed mt-0.5">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}

function PillarCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <motion.div
      variants={fadeUpVariants}
      className="rounded-xl p-4 flex flex-col gap-2.5"
      style={{
        background: 'rgba(var(--color-primary-rgb), 0.04)',
        border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
          color: 'var(--color-primary)',
        }}
      >
        {icon}
      </div>
      <p className="text-xs font-bold text-[var(--color-on-surface)] leading-tight">{title}</p>
      <p className="text-[11px] text-[var(--color-on-surface-variant)] leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function ModuleRow({
  step,
  title,
  desc,
  isLast,
}: {
  step: number
  title: string
  desc: string
  isLast: boolean
}) {
  return (
    <motion.div variants={slideLeftVariants} className="flex gap-3">
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold"
          style={{
            background: 'rgba(var(--color-primary-rgb), 0.12)',
            color: 'var(--color-primary)',
            border: '1px solid rgba(var(--color-primary-rgb), 0.22)',
          }}
        >
          {step}
        </div>
        {!isLast && (
          <div
            className="w-px flex-1 my-1"
            style={{
              backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
              minHeight: '18px',
            }}
          />
        )}
      </div>
      <div className={cn('pb-3', isLast && 'pb-0')}>
        <p className="text-sm font-bold text-[var(--color-on-surface)] leading-snug">{title}</p>
        <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed mt-0.5">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}

function StoreButton({
  label,
  href,
  platform,
}: {
  label: string
  href: string
  platform: 'android' | 'ios'
}) {
  return (
    <motion.a
      variants={fadeUpVariants}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 rounded-xl px-4 py-3 transition-all duration-200 group"
      style={{
        background: 'rgba(var(--color-primary-rgb), 0.05)',
        border: '1px solid rgba(var(--color-primary-rgb), 0.14)',
      }}
      whileHover={{ scale: 1.02, borderColor: 'rgba(var(--color-primary-rgb), 0.3)' }}
      whileTap={{ scale: 0.98 }}
    >
      {platform === 'android' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3.18 23.15c.45.25.99.26 1.45.03l10.42-6.01-2.27-2.27-9.6 8.25zM.45 1.03C.17 1.34 0 1.81 0 2.43v19.14c0 .62.17 1.09.45 1.4l.07.07 10.72-10.72v-.25L.52.96l-.07.07zM23.2 10.42l-2.95-1.7-2.53 2.53 2.53 2.53 2.97-1.72c.85-.49.85-1.28-.02-1.64zM4.63.85L15.05 6.86l-2.27 2.27L3.18.88c.45-.24.99-.22 1.45-.03z"
            fill="#01875f"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.03 3.02 2.65 4.03 2.68 4.04l-.06.27zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
            fill="#0D96F6"
          />
        </svg>
      )}
      <span className="text-sm font-semibold text-[var(--color-on-surface)]">{label}</span>
      <ExternalLinkIcon className="ml-auto h-3 w-3 text-[var(--color-on-surface-variant)] opacity-60 group-hover:opacity-100 transition-opacity" />
    </motion.a>
  )
}

// ─── Main drawer ──────────────────────────────────────────────────────────────
interface ProjectDrawerProps {
  project: ProjectItem | null
  open: boolean
  onClose: () => void
}

export function ProjectDrawer({ project, open, onClose }: ProjectDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const Icon = project ? PROJECT_ICONS[project.themeId] : null
  const thumbSrc = project ? PROJECT_THUMB_SRC[project.themeId as ThemeId] : undefined
  const tech = project ? (PROJECT_TECH[project.themeId] ?? []) : []
  const rich = project ? RICH_DATA[project.themeId] : null

  return (
    <AnimatePresence>
      {open && project && (
        <>
          {/* ── Overlay ──────────────────────────────────────── */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]"
          />

          {/* ── Panel ────────────────────────────────────────── */}
          <motion.aside
            key={project.themeId}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[560px] overflow-y-auto overflow-x-hidden"
            style={{
              backgroundColor: 'var(--color-surface-lowest)',
              borderLeft: '1px solid rgba(var(--color-primary-rgb), 0.1)',
              boxShadow:
                '-24px 0 80px -10px rgba(0,0,0,0.7), -1px 0 0 rgba(var(--color-primary-rgb), 0.08)',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-10"
              style={{
                background:
                  'linear-gradient(to right, transparent 5%, rgba(var(--color-primary-rgb), 0.6) 40%, rgba(var(--color-primary-rgb), 0.6) 60%, transparent 95%)',
              }}
            />

            {/* Subtle grid texture overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.018]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(var(--color-primary-rgb),1) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--color-primary-rgb),1) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />

            {/* Radial glow behind header */}
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-48"
              style={{
                background:
                  'radial-gradient(ellipse 70% 100% at 30% 0%, rgba(var(--color-primary-rgb), 0.07) 0%, transparent 100%)',
              }}
            />

            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-lg"
              style={{
                color: 'var(--color-on-surface-variant)',
                backgroundColor: 'rgba(var(--color-primary-rgb), 0.06)',
                border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
              }}
              whileHover={{
                rotate: 90,
                scale: 1.12,
                backgroundColor: 'rgba(var(--color-primary-rgb), 0.12)',
                transition: { duration: 0.18 },
              }}
              whileTap={{ scale: 0.88 }}
            >
              <XIcon className="h-4 w-4" />
            </motion.button>

            {/* ── Scrollable content ──────────────────────────── */}
            <motion.div
              key={project.themeId}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative p-6 md:p-8"
            >
              {/* ── Header ─────────────────────────────── */}
              <motion.div
                variants={fadeUpVariants}
                className="flex items-start gap-4 mb-7 pr-10"
              >
                {/* Logo / icon */}
                {thumbSrc ? (
                  <div
                    className="relative h-[56px] w-[56px] flex-shrink-0 overflow-hidden rounded-2xl"
                    style={{
                      boxShadow:
                        '0 0 0 1px rgba(var(--color-primary-rgb), 0.18), 0 0 28px -4px rgba(var(--color-primary-rgb), 0.35)',
                    }}
                  >
                    <Image
                      src={thumbSrc}
                      alt={project.title}
                      width={56}
                      height={56}
                      className="h-[56px] w-[56px] object-cover"
                    />
                  </div>
                ) : Icon ? (
                  <div
                    className="flex h-[56px] w-[56px] flex-shrink-0 items-center justify-center rounded-2xl"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                      color: 'var(--color-primary)',
                      boxShadow:
                        '0 0 0 1px rgba(var(--color-primary-rgb), 0.2), 0 0 28px -4px rgba(var(--color-primary-rgb), 0.35)',
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-extrabold tracking-tight text-[var(--color-on-surface)] leading-tight">
                    {project.title}
                  </h2>
                  <p
                    className="mt-0.5 text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    {project.subtitle}
                  </p>
                  <p className="mt-1.5 text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2">
                    {project.tagline}
                  </p>
                </div>
              </motion.div>

              {/* ─────────────── BOTLODE ─────────────────────── */}
              {rich?.kind === 'botlode' && (
                <>
                  <motion.p
                    variants={fadeUpVariants}
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-7"
                  >
                    {rich.description}
                  </motion.p>

                  <SectionLabel>Los 3 Pilares</SectionLabel>
                  <motion.div
                    variants={nestedStagger}
                    className="grid grid-cols-3 gap-2.5 mb-7"
                  >
                    {rich.pillars.map((p) => (
                      <PillarCard key={p.title} {...p} />
                    ))}
                  </motion.div>

                  <SectionLabel>Cat Bot IA</SectionLabel>
                  <motion.div variants={nestedStagger} className="space-y-3 mb-7">
                    {rich.catBotFeatures.map((f) => (
                      <FeatureItem key={f.title} title={f.title} desc={f.desc} />
                    ))}
                  </motion.div>

                  <SectionLabel>BotLode History</SectionLabel>
                  <motion.div variants={nestedStagger} className="space-y-3 mb-7">
                    {rich.historyFeatures.map((f) => (
                      <FeatureItem key={f.title} title={f.title} desc={f.desc} />
                    ))}
                  </motion.div>

                  <SectionLabel>Comercialización</SectionLabel>
                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.04)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                    }}
                  >
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-3">
                      {rich.commerceText}
                    </p>
                    <FeatureItem
                      title={rich.commerceFeature.title}
                      desc={rich.commerceFeature.desc}
                    />
                  </motion.div>
                </>
              )}

              {/* ─────────────── ASSISTIFY ───────────────────── */}
              {rich?.kind === 'assistify' && (
                <>
                  <SectionLabel>El Problema</SectionLabel>
                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.04)',
                      borderLeft: '3px solid var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                      borderLeftColor: 'var(--color-primary)',
                    }}
                  >
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                      {rich.problem}
                    </p>
                  </motion.div>

                  <SectionLabel>La Solución</SectionLabel>
                  <motion.div variants={nestedStagger} className="space-y-3 mb-7">
                    {rich.solutionFeatures.map((f) => (
                      <FeatureItem key={f.title} title={f.title} desc={f.desc} />
                    ))}
                  </motion.div>

                  <SectionLabel>Resultados</SectionLabel>
                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7 flex items-start gap-3"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.05)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.12)',
                    }}
                  >
                    <div style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }}>
                      <TrendUpIcon />
                    </div>
                    <p className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed">
                      {rich.impact}
                    </p>
                  </motion.div>

                  <SectionLabel>Disponible en</SectionLabel>
                  <motion.div variants={nestedStagger} className="grid grid-cols-2 gap-3 mb-7">
                    {rich.storeLinks.map((s) => (
                      <StoreButton key={s.platform} {...s} />
                    ))}
                  </motion.div>
                </>
              )}

              {/* ─────────────── CONTACT ENGINE ──────────────── */}
              {rich?.kind === 'contact-engine' && (
                <>
                  <motion.p
                    variants={fadeUpVariants}
                    className="text-[13px] text-[var(--color-on-surface-variant)] leading-relaxed mb-7"
                  >
                    {rich.tagline}
                  </motion.p>

                  <SectionLabel>Objetivos de Negocio</SectionLabel>
                  <motion.div
                    variants={nestedStagger}
                    className="flex flex-wrap gap-2 mb-7"
                  >
                    {rich.objectives.map((obj) => (
                      <motion.span
                        key={obj}
                        variants={fadeUpVariants}
                        className="inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold"
                        style={{
                          background: 'rgba(var(--color-primary-rgb), 0.07)',
                          color: 'var(--color-on-surface)',
                          border: '1px solid rgba(var(--color-primary-rgb), 0.16)',
                        }}
                      >
                        {obj}
                      </motion.span>
                    ))}
                  </motion.div>

                  <SectionLabel>Cómo impacta en tu negocio</SectionLabel>
                  <motion.div variants={nestedStagger} className="space-y-3 mb-7">
                    {rich.impactFeatures.map((f) => (
                      <FeatureItem key={f.title} title={f.title} desc={f.desc} />
                    ))}
                  </motion.div>

                  <SectionLabel>Motor Modular</SectionLabel>
                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.04)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                    }}
                  >
                    <motion.div variants={nestedStagger}>
                      {rich.modules.map((m, i) => (
                        <ModuleRow
                          key={m.title}
                          {...m}
                          isLast={i === rich.modules.length - 1}
                        />
                      ))}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7 flex items-start gap-3"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.05)',
                      borderLeft: '3px solid var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.12)',
                      borderLeftColor: 'var(--color-primary)',
                    }}
                  >
                    <p className="text-[13px] italic text-[var(--color-on-surface-variant)] leading-relaxed">
                      &ldquo;{rich.quote}&rdquo;
                    </p>
                  </motion.div>
                </>
              )}

              {/* ─────────────── LUMA INVITA ─────────────────── */}
              {rich?.kind === 'luma-invita' && (
                <>
                  <motion.p
                    variants={fadeUpVariants}
                    className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed mb-7"
                  >
                    {rich.pitch}
                  </motion.p>

                  <SectionLabel>Roles</SectionLabel>
                  <motion.div variants={nestedStagger} className="grid grid-cols-1 gap-2.5 mb-7">
                    {rich.personas.map((p, i) => (
                      <PillarCard
                        key={p.title}
                        icon={i === 0 ? <FactoryIcon /> : i === 1 ? <CalendarIcon /> : <AnalyticsIcon />}
                        title={p.title}
                        desc={p.desc}
                      />
                    ))}
                  </motion.div>

                  <SectionLabel>Experiencia del invitado</SectionLabel>
                  <motion.div variants={nestedStagger} className="space-y-3 mb-7">
                    {rich.experiencePillars.map((f) => (
                      <FeatureItem key={f.title} title={f.title} desc={f.desc} />
                    ))}
                  </motion.div>

                  <SectionLabel>Flujo del producto</SectionLabel>
                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.04)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.1)',
                    }}
                  >
                    <motion.div variants={nestedStagger}>
                      {rich.flow.map((m, i) => (
                        <ModuleRow
                          key={m.title}
                          {...m}
                          isLast={i === rich.flow.length - 1}
                        />
                      ))}
                    </motion.div>
                  </motion.div>

                  <motion.div
                    variants={fadeUpVariants}
                    className="rounded-xl p-4 mb-7 flex items-start gap-3"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.05)',
                      borderLeft: '3px solid var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.12)',
                      borderLeftColor: 'var(--color-primary)',
                    }}
                  >
                    <p className="text-[13px] italic text-[var(--color-on-surface-variant)] leading-relaxed">
                      &ldquo;{rich.quote}&rdquo;
                    </p>
                  </motion.div>
                </>
              )}

              {/* ── Tech Stack ───────────────────────────────── */}
              <SectionLabel>Tech Stack</SectionLabel>
              <motion.div variants={nestedStagger} className="flex flex-wrap gap-2 mb-7">
                {tech.map((t) => (
                  <motion.span
                    key={t}
                    variants={fadeUpVariants}
                    className="inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.07)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.14)',
                    }}
                  >
                    {t}
                  </motion.span>
                ))}
              </motion.div>

              {/* ── Divider ──────────────────────────────────── */}
              <motion.div
                variants={fadeUpVariants}
                className="h-px mb-7"
                style={{
                  background:
                    'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.18), transparent)',
                }}
              />

              {/* ── CTA buttons ──────────────────────────────── */}
              <motion.div variants={nestedStagger} className="space-y-3">
                {/* BotLode — dual external links */}
                {rich?.kind === 'botlode' && (
                  <motion.div variants={fadeUpVariants} className="grid grid-cols-2 gap-3">
                    {rich.urls.map((u) => (
                      <motion.a
                        key={u.href}
                        href={u.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                        style={{
                          background: 'rgba(var(--color-primary-rgb), 0.07)',
                          color: 'var(--color-primary)',
                          border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {u.label}
                        <ExternalLinkIcon className="h-3.5 w-3.5 opacity-70" />
                      </motion.a>
                    ))}
                  </motion.div>
                )}

                {/* Assistify — app site link */}
                {project.url && rich?.kind === 'assistify' && (
                  <motion.a
                    variants={fadeUpVariants}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.07)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Visitar assistify.lat
                    <ExternalLinkIcon className="h-3.5 w-3.5 opacity-70" />
                  </motion.a>
                )}

                {project.url && rich?.kind === 'luma-invita' && (
                  <motion.a
                    variants={fadeUpVariants}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'rgba(var(--color-primary-rgb), 0.07)',
                      color: 'var(--color-primary)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
                    }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Visitar bylumainvita.com
                    <ExternalLinkIcon className="h-3.5 w-3.5 opacity-70" />
                  </motion.a>
                )}

                {/* Primary CTA — always visible */}
                <motion.a
                  variants={fadeUpVariants}
                  href="/contacto"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'var(--color-surface-lowest)',
                    boxShadow: '0 4px 24px -4px rgba(var(--color-primary-rgb), 0.45)',
                  }}
                  whileHover={{
                    scale: 1.01,
                    boxShadow: '0 6px 32px -4px rgba(var(--color-primary-rgb), 0.6)',
                    transition: { duration: 0.15 },
                  }}
                  whileTap={{ scale: 0.99 }}
                >
                  <CalendarIcon />
                  Agendar consulta gratis
                </motion.a>
              </motion.div>

              {/* Bottom padding */}
              <div className="h-10" />
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
