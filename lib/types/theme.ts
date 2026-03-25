export type ThemeId =
  | 'neutral'
  | 'flutter'
  | 'nextjs'
  | 'supabase'
  | 'riverpod'
  | 'typescript'
  | 'botlode'
  | 'assistify'
  | 'contact-engine'

export interface ThemeConfig {
  id: ThemeId
  name: string
  primary: string
  primaryRgb: string
  surfaceBase: { dark: string; light: string }
  logo?: string
  icon?: string
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    primary: '#64748B',
    primaryRgb: '100, 116, 139',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
  },
  {
    id: 'flutter',
    name: 'Flutter',
    primary: '#0175C2',
    primaryRgb: '1, 117, 194',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'flutter',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    primary: '#A1A1AA',
    primaryRgb: '161, 161, 170',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'nextjs',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    primary: '#3ECF8E',
    primaryRgb: '62, 207, 142',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'bolt',
  },
  {
    id: 'riverpod',
    name: 'Riverpod',
    primary: '#6E56F8',
    primaryRgb: '110, 86, 248',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'water-drop',
  },
  {
    id: 'typescript',
    name: 'TypeScript + Tailwind',
    primary: '#3178C6',
    primaryRgb: '49, 120, 198',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'typescript',
  },
  {
    id: 'botlode',
    name: 'BotLode',
    primary: '#FFC000',
    primaryRgb: '255, 192, 0',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    logo: '/projects/botlode.png',
  },
  {
    id: 'assistify',
    name: 'Assistify',
    primary: '#00A8E8',
    primaryRgb: '0, 168, 232',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    logo: '/projects/assistify.png',
  },
  {
    id: 'contact-engine',
    name: 'Contact Engine',
    primary: '#15803D',
    primaryRgb: '21, 128, 61',
    surfaceBase: { dark: '#121212', light: '#F5F5F5' },
    icon: 'crosshairs',
  },
]

export const DEFAULT_THEME: ThemeId = 'neutral'

// Tech stack cards shown on home page (5 cards)
export interface TechStackItem {
  themeId: ThemeId
  title: string
  subtitle: string
  description: string
  features: string[]
  category: 'mobile' | 'web' | 'backend' | 'architecture' | 'tooling'
}

export const TECH_STACK: TechStackItem[] = [
  {
    themeId: 'flutter',
    title: 'Flutter',
    subtitle: 'Apps Nativas',
    description: 'Apps móviles nativas ultrarrápidas para iOS y Android desde un solo código.',
    features: [
      'Un código, dos plataformas',
      'Rendimiento nativo real',
      'Hot reload instantáneo',
      'UI pixel-perfect en cualquier dispositivo',
      'Diseño premium',
    ],
    category: 'mobile',
  },
  {
    themeId: 'nextjs',
    title: 'Next.js',
    subtitle: 'Webs de Alto Rendimiento',
    description: 'Webs de alto rendimiento, SEO real y carga instantánea.',
    features: [
      'Server-side rendering para SEO',
      'Carga instantánea optimizada',
      'App Router + Server Components',
      'Deploy en Vercel con un click',
      'Diseño premium',
    ],
    category: 'web',
  },
  {
    themeId: 'supabase',
    title: 'Supabase',
    subtitle: 'Backend en Tiempo Real',
    description: 'Base de datos, autenticación y storage en tiempo real. Todo conectado.',
    features: [
      'PostgreSQL serverless',
      'Auth con Google, Apple, email',
      'Realtime subscriptions',
      'Storage para archivos y media',
      'Diseño premium',
    ],
    category: 'backend',
  },
  {
    themeId: 'riverpod',
    title: 'Riverpod',
    subtitle: 'Estado Sólido',
    description: 'Arquitectura de estado sólida: tu app escala sin volverse un caos.',
    features: [
      'Estado reactivo y predecible',
      'Testing simplificado',
      'Code generation integrado',
      'Escala sin perder el control',
      'Diseño premium',
    ],
    category: 'architecture',
  },
  {
    themeId: 'typescript',
    title: 'TypeScript + Tailwind',
    subtitle: 'Código Limpio',
    description: 'Código limpio, tipado y estilos precisos sin plantillas genéricas.',
    features: [
      'Tipado estricto = menos bugs',
      'Utility-first CSS preciso',
      'Refactoring sin miedo',
      'Componentes reutilizables',
      'Diseño premium',
    ],
    category: 'tooling',
  },
]

// Projects shown on home page
export interface ProjectItem {
  themeId: ThemeId
  title: string
  tagline: string
  subtitle: string
  url?: string
  features: { title: string; description: string }[]
}

export const PROJECTS: ProjectItem[] = [
  {
    themeId: 'contact-engine',
    title: 'Contact Engine',
    tagline: 'Encuentra clientes y convierte conversaciones en ventas, de forma automática',
    subtitle: 'Prospección Inteligente',
    features: [
      { title: 'Prospección 24/7', description: 'Detecta negocios y prepara contacto incluso fuera de horario' },
      { title: 'Canal Correcto', description: 'Combinación Email + WhatsApp optimizada para respuesta máxima' },
      { title: 'Operación Bajo Control', description: 'Dashboard con estados, volumen de envíos, conversaciones centralizadas' },
      { title: 'Modelo Escalable', description: 'Multi-tenant: usá en tu marca o revendé como servicio' },
    ],
  },
  {
    themeId: 'botlode',
    title: 'BotLode',
    tagline: 'Ecosistema de Bots IA',
    subtitle: 'Fábrica \u2022 Player \u2022 History \u2022 24/7',
    url: 'https://botlode.com',
    features: [
      { title: 'BotLode Factory', description: 'Creá bots sin código con personalización completa' },
      { title: 'Cat Bot IA', description: '6 personalidades: vendedor, técnico, neutral y más' },
      { title: 'Command Center', description: 'Tracking de leads, alertas por email, calendario integrado' },
      { title: 'Inversión Cero', description: 'Producto listo para vender desde el día uno' },
    ],
  },
  {
    themeId: 'assistify',
    title: 'Assistify',
    tagline: 'Gestión para Profesores',
    subtitle: 'App en Producción \u2022 iOS & Android',
    url: 'https://assistify.lat',
    features: [
      { title: 'Autogestión Total', description: 'Alumnos autogestionan cancelaciones y reprogramaciones' },
      { title: 'Ingresos Blindados', description: 'Sistema de créditos + lista de espera auto-llena huecos' },
      { title: 'Cero Fricción', description: 'Notificaciones WhatsApp sin abrir la app' },
      { title: 'Control Operativo', description: 'Crear clases, ajustar cupos, gestionar alumnos en tiempo real' },
    ],
  },
]
