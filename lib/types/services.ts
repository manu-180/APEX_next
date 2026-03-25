export interface PricingPlan {
  id: string
  badge: string
  name: string
  price: number | null  // null = custom
  originalPrice?: number
  description: string
  targetAudience: string
  features: string[]
  isFeatured?: boolean
  caseStudies?: string[]
}

export interface EstimatorModule {
  id: string
  label: string
  description: string
  price: number
  originalPrice: number
  type: 'web' | 'app'
  isCore?: boolean
}

export const WEB_PLANS: PricingPlan[] = [
  {
    id: 'web_basic',
    badge: 'Esencial',
    name: 'Landing Page',
    price: 300000,
    originalPrice: 420000,
    description: 'Tu mejor vendedor, disponible las 24 h. Diseñada para convertir visitas en clientes reales.',
    targetAudience: 'Coaches, abogados, psicólogos, contadores, profesionales independientes',
    features: [
      'Diseño 100% a medida (sin plantillas genéricas)',
      'Secciones de servicios, bio, testimonios y contacto',
      'Botón WhatsApp + formulario con auto-respuesta por email',
      'Carga ultrarrápida optimizada',
      'SEO técnico para aparecer en Google',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Simon Mindset', 'Pérez Yeregui', 'Metal Wailers', 'Poncho Spanish'],
  },
  {
    id: 'web_interactive',
    badge: 'Más elegido',
    name: 'Web Interactiva',
    price: 600000,
    originalPrice: 880000,
    description: 'Automatizá el contacto con tus clientes y agregá cualquier funcionalidad a medida.',
    targetAudience: 'Pequeñas empresas y startups',
    isFeatured: true,
    features: [
      'Todo lo del plan Landing Page',
      'Base de datos conectada (Supabase)',
      'Funcionalidades complejas: stock, cotizadores, reservas, dashboards',
      'Panel de administración sin tocar código',
      'Integraciones: WhatsApp, MercadoPago, Google Calendar',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Assistify', 'Botrive', 'BotLode'],
  },
  {
    id: 'web_premium',
    badge: 'E-commerce',
    name: 'Tienda Online',
    price: 900000,
    originalPrice: 1400000,
    description: 'Vendé productos o servicios con tu propio canal de ventas. Sin comisiones de terceros.',
    targetAudience: 'Comercios y emprendimientos',
    features: [
      'Catálogo de productos con filtros y búsqueda',
      'Carrito + checkout con MercadoPago / Stripe',
      'Panel admin para gestionar pedidos, stock y clientes',
      'Sistema de cuentas con historial de compras',
      'SEO técnico avanzado para tráfico orgánico',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Pulpiprint', 'MNL Tecno'],
  },
]

export const APP_PLANS: PricingPlan[] = [
  {
    id: 'app_mvp',
    badge: 'Starter',
    name: 'App Profesional',
    price: 1200000,
    originalPrice: 1700000,
    description: 'Tu idea, convertida en app lista para las tiendas. Funcional, rápida y con buena UX.',
    targetAudience: 'Emprendedores con apps de gestión, reservas, clientes o contenido',
    features: [
      'Android + iOS desde un único proyecto (Flutter)',
      'Funcionalidades core de tu negocio',
      'Autenticación segura (email, Google o Apple)',
      'Notificaciones push básicas',
      'Publicación en App Store y Play Store',
      '3 meses de mantenimiento incluidos',
    ],
  },
  {
    id: 'app_pro',
    badge: 'Empresas',
    name: 'App Empresarial',
    price: 2700000,
    originalPrice: 3800000,
    isFeatured: true,
    description: 'Automatizá procesos, reducí la carga laboral y escalá tu negocio con tecnología real.',
    targetAudience: 'Empresas digitalizando operaciones',
    features: [
      'Todo lo del plan Starter',
      'Panel de administración web o de escritorio',
      'Roles y permisos para múltiples usuarios',
      'Pagos integrados (MercadoPago / Stripe)',
      'Reportes y métricas en tiempo real',
      '3 meses de mantenimiento incluidos',
    ],
  },
  {
    id: 'app_platform',
    badge: 'Premium',
    name: 'Plataforma Avanzada',
    price: null,
    description: 'Arquitectura de nivel Uber o Rappi. Tecnología sin límites para startups con visión.',
    targetAudience: 'Startups con financiamiento',
    features: [
      'Múltiples apps (cliente, operador y administrador)',
      'Geolocalización y tracking en tiempo real',
      'Arquitectura de microservicios escalable',
      'Infraestructura en la nube (AWS / GCP)',
      'Equipo técnico dedicado (modelo de partner)',
      'Mantenimiento continuo + SLA garantizado',
    ],
  },
]

export const WEB_MODULES: EstimatorModule[] = [
  { id: 'w1', label: 'Identidad Digital (Landing)', description: 'Tu presencia online base', price: 300000, originalPrice: 400000, type: 'web', isCore: true },
  { id: 'w2', label: 'Cuentas de Usuario', description: 'Login, registro, perfiles', price: 200000, originalPrice: 300000, type: 'web' },
  { id: 'w3', label: 'Base de Datos Dinámica', description: 'CRUD + relaciones + filtros', price: 250000, originalPrice: 350000, type: 'web' },
  { id: 'w4', label: 'Gestión de Contenidos (CMS)', description: 'Panel admin para editar contenido', price: 200000, originalPrice: 300000, type: 'web' },
  { id: 'w5', label: 'Pasarela de Pagos', description: 'MercadoPago / Stripe integrado', price: 300000, originalPrice: 450000, type: 'web' },
  { id: 'w6', label: 'Chat o Soporte en Vivo', description: 'Atención al cliente en tiempo real', price: 100000, originalPrice: 150000, type: 'web' },
  { id: 'w7', label: 'Panel de Administración Full', description: 'Dashboard completo para tu equipo', price: 400000, originalPrice: 600000, type: 'web' },
]

export const APP_MODULES: EstimatorModule[] = [
  { id: 'a1', label: 'App Híbrida (iOS + Android)', description: 'Flutter multiplataforma', price: 1200000, originalPrice: 1600000, type: 'app', isCore: true },
  { id: 'a2', label: 'Autenticación Biométrica', description: 'Face ID, huella digital', price: 350000, originalPrice: 500000, type: 'app' },
  { id: 'a3', label: 'Sistema de Notificaciones', description: 'Push notifications personalizadas', price: 300000, originalPrice: 450000, type: 'app' },
  { id: 'a4', label: 'Geolocalización Avanzada', description: 'Mapas, tracking, geofencing', price: 600000, originalPrice: 900000, type: 'app' },
  { id: 'a5', label: 'Panel Admin Web', description: 'Dashboard web para gestión', price: 700000, originalPrice: 1000000, type: 'app' },
  { id: 'a6', label: 'Cobros In-App & Wallet', description: 'Pagos dentro de la app', price: 500000, originalPrice: 750000, type: 'app' },
  { id: 'a7', label: 'Modo Offline (Sync)', description: 'Funciona sin conexión', price: 450000, originalPrice: 650000, type: 'app' },
]

export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
}
