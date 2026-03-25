export interface PricingPlan {
  id: string
  badge: string
  name: string
  price: number | null  // null = custom
  originalPrice?: number
  /** Web: pago por proyecto. Apps: retainer mensual (desarrollador de producto). */
  billing?: 'once' | 'month'
  /** Texto bajo “A consultar” (ej. plan plataforma sin cifra pública). */
  consultSubtext?: string
  /** Titular de la cara frontal (debajo del precio). */
  frontHeadline: string
  description: string
  targetAudience: string
  features: string[]
  isFeatured?: boolean
  caseStudies?: string[]
  // Back face — flip card content
  backHook: string
  idealFor: string[]
  gains: { num: string; title: string; desc: string }[]
  powerStatement: string
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
    frontHeadline: 'Tu vendedor online, disponible las 24 horas',
    description:
      'Mientras vos dormís, tu página trabaja. Diseñada para que quien te busca en Google te encuentre, te conozca y te contacte solo.',
    targetAudience: 'Profesionales independientes: coaches, abogados, contadores y consultores',
    features: [
      'Diseño 100% a medida (sin plantillas genéricas)',
      'Secciones de servicios, bio, testimonios y contacto',
      'Botón WhatsApp + formulario con auto-respuesta por email',
      'Carga ultrarrápida optimizada',
      'SEO técnico para aparecer en Google',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Simon Mindset', 'Pérez Yeregui', 'Metal Wailers', 'Poncho Spanish'],
    // Back face
    backHook: 'Tu vendedor online, disponible las 24 horas',
    idealFor: [
      'Profesionales independientes: coaches, abogados, contadores y consultores',
    ],
    gains: [
      { num: '01', title: 'Más clientes sin esfuerzo', desc: 'Tu web convierte visitas en consultas mientras vos dormís' },
      { num: '02', title: 'Primera impresión premium', desc: 'Diseño que transmite profesionalismo desde el primer segundo' },
      { num: '03', title: 'Aparecer en Google', desc: 'SEO técnico para que te encuentren antes que a la competencia' },
      { num: '04', title: 'Contacto directo', desc: 'WhatsApp + formulario con respuesta automática inmediata' },
    ],
    powerStatement: 'Cada día sin presencia online es un cliente que va con tu competencia.',
  },
  {
    id: 'web_interactive',
    badge: 'Más elegido',
    name: 'Web Interactiva',
    price: 600000,
    originalPrice: 880000,
    frontHeadline: 'Tu negocio automatizado, sin esfuerzo extra',
    description:
      'Tus clientes reservan, cotizan y te pagan solos. Vos te enfocás en trabajar, el sistema hace el resto.',
    targetAudience: 'Pequeñas empresas y startups que quieren crecer sin contratar más gente',
    features: [
      'Todo lo del plan Landing Page',
      'Base de datos conectada (Supabase)',
      'Funcionalidades complejas: stock, cotizadores, reservas, dashboards',
      'Panel de administración sin tocar código',
      'Integraciones: WhatsApp, MercadoPago, Google Calendar',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Assistify', 'Botrive', 'BotLode'],
    // Back face
    backHook: 'Tu negocio automatizado, sin esfuerzo extra',
    idealFor: [
      'Pequeñas empresas y startups que quieren crecer sin contratar más gente',
    ],
    gains: [
      { num: '01', title: 'Automatización total', desc: 'Reservas, cotizaciones y contactos sin intervención manual' },
      { num: '02', title: 'Cobrá online desde el día 1', desc: 'MercadoPago y más, integrados y listos para facturar' },
      { num: '03', title: 'Tu panel de control', desc: 'Gestioná todo desde un dashboard sin necesitar un técnico' },
      { num: '04', title: 'Todo conectado', desc: 'WhatsApp, Google Calendar y tus herramientas sincronizadas' },
    ],
    powerStatement: 'La automatización no es tecnología, es recuperar tu tiempo para lo que importa.',
  },
  {
    id: 'web_premium',
    badge: 'E-commerce',
    name: 'Tienda Online',
    price: 900000,
    originalPrice: 1400000,
    isFeatured: true,
    frontHeadline: 'Vendé todos los días, sin depender de Instagram ni comisiones',
    description:
      'Tu propio canal de ventas con catálogo, carrito y pagos. Sin que MercadoLibre o ninguna otra plataforma se quede con tu ganancia.',
    targetAudience: 'Comercios y emprendimientos con productos propios',
    features: [
      'Catálogo de productos con filtros y búsqueda',
      'Carrito + checkout con MercadoPago / Stripe',
      'Panel admin para gestionar pedidos, stock y clientes',
      'Sistema de cuentas con historial de compras',
      'SEO técnico avanzado para tráfico orgánico',
      'Hosting + 3 meses de mantenimiento incluidos',
    ],
    caseStudies: ['Pulpiprint', 'MNL Tecno'],
    // Back face
    backHook: 'Vendé todos los días, sin depender de Instagram ni comisiones',
    idealFor: [
      'Comercios y emprendimientos con productos propios',
    ],
    gains: [
      { num: '01', title: '0% de comisión', desc: 'Cada venta es 100% tuya. Sin Mercado Libre, sin intermediarios' },
      { num: '02', title: 'Experiencia de compra premium', desc: 'Catálogo, carrito y checkout optimizado para convertir' },
      { num: '03', title: 'Stock en tiempo real', desc: 'Nunca más vendas algo que no tenés en tu depósito' },
      { num: '04', title: 'Clientes orgánicos gratis', desc: 'SEO avanzado para que Google te traiga compradores sin pagar ads' },
    ],
    powerStatement: 'Tu tienda. Tus reglas. Tu dinero. Sin intermediarios que se queden con tu margen.',
  },
]

/**
 * Apps = retainer mensual: me contratás como desarrollador del producto (evolución, soporte, nuevas features).
 * Paralelo a webs: (1) experiencia de usuario, (2) + operación/admin fuerte, (3) plataforma multi-actor tipo marketplace.
 * Ajustá montos en ARS cuando quieras; son referencia pública, el contrato cierra por alcance.
 */
export const APP_PLANS: PricingPlan[] = [
  {
    id: 'app_mvp',
    badge: 'Producto',
    name: 'App Producto',
    price: 580000,
    billing: 'month',
    frontHeadline: 'Tu app en manos de tus clientes',
    description:
      'Tu negocio en el celular de cada cliente. Con tu imagen, tus datos y todo lo que necesitás para fidelizarlos — sin preocuparte por la tecnología.',
    targetAudience: 'Marcas y negocios que quieren su propia app en App Store y Google Play',
    features: [
      'Incluye el plan web Landing Page (mismo alcance que el plan Esencial de sitios web)',
      'Android + iOS con Flutter (un solo código base)',
      'Backend y datos a medida para tu caso (cuentas, reservas, catálogo, etc.)',
      'Autenticación segura (email, Google, Apple)',
      'Push notifications',
      'Publicación y actualizaciones en App Store y Play Store',
      'Fee mensual: desarrollo activo, mejoras y soporte (retainer)',
    ],
    // Back face
    backHook: 'Tu app en manos de tus clientes',
    idealFor: [
      'Marcas y negocios que quieren su propia app en App Store y Google Play',
    ],
    gains: [
      { num: '01', title: 'Un fee, continuidad', desc: 'No es solo entregar y listo: evolucionamos el producto cada mes' },
      { num: '02', title: 'iOS + Android real', desc: 'Una base de código, dos tiendas, menos sorpresas' },
      { num: '03', title: 'Backend incluido', desc: 'Datos y lógica detrás de la app, acorde a tu escala' },
      { num: '04', title: 'Publicación cubierta', desc: 'Subidas, rechazos de tienda y ajustes forma parte del trabajo' },
    ],
    powerStatement: 'La app es el canal más íntimo con tu cliente; el retainer es que no quede abandonada.',
  },
  {
    id: 'app_pro',
    badge: 'Operación',
    name: 'App + Operaciones',
    price: 1150000,
    billing: 'month',
    frontHeadline: 'Tu negocio funciona solo, aunque vos no estés mirando',
    description:
      'App para clientes más un panel donde tu equipo gestiona todo: pedidos, roles, pagos y reportes. Nada queda librado al azar.',
    targetAudience: 'Franquicias, servicios con muchos pedidos o equipos que necesitan coordinarse',
    features: [
      'Incluye el plan web Web Interactiva (mismo alcance que el plan “Más elegido” de sitios web)',
      'Todo el alcance del plan App Producto',
      'Panel web de administración (gestión sin depender del desarrollador para el día a día)',
      'Roles y permisos: qué ve y qué hace cada tipo de usuario',
      'Pagos / cobros integrados cuando el flujo lo requiere (MercadoPago, Stripe, etc.)',
      'Reportes y métricas para decisiones operativas',
      'Fee mensual ampliado según complejidad y horas acordadas',
    ],
    // Back face
    backHook: 'Tu negocio funciona solo, aunque vos no estés mirando',
    idealFor: [
      'Franquicias, servicios con muchos pedidos o equipos que necesitan coordinarse',
    ],
    gains: [
      { num: '01', title: 'Dos caras, un sistema', desc: 'Experiencia pública + herramientas internas alineadas' },
      { num: '02', title: 'Gobernanza', desc: 'Roles y permisos para que nadie toque lo que no debe' },
      { num: '03', title: 'Dinero dentro del flujo', desc: 'Cobros integrados donde el recorrido del usuario lo pide' },
      { num: '04', title: 'Números accionables', desc: 'Reportes pensados para operar, no solo para mirar' },
    ],
    powerStatement: 'Cuando crece el volumen, el panel admin es lo que te salva de caos operativo.',
  },
  {
    id: 'app_platform',
    badge: 'Plataforma',
    isFeatured: true,
    name: 'Plataforma multi-app',
    price: null,
    billing: 'month',
    frontHeadline: 'Cuando tu negocio ya es demasiado grande para una sola app',
    description:
      'Múltiples apps que se hablan entre sí: clientes, operadores y administración, todo conectado en tiempo real. Para quienes piensan en escala.',
    targetAudience: 'Startups con inversión, marketplaces y operadores con flota o red de prestadores',
    features: [
      'Incluye el plan web Tienda Online (mismo alcance que el plan E-commerce de sitios web)',
      'Múltiples frentes: app cliente, app operador / proveedor y administración central',
      'Mapas, geolocalización y seguimiento en tiempo real cuando aplica',
      'Lógica de asignación de pedidos (dispatch) y estados en vivo',
      'Arquitectura e infraestructura pensadas para crecer (nube, servicios, monitoreo)',
      'Prioridad y roadmap compartido: modelo partner técnico, no ticket suelto',
      'Fee mensual + eventual hito de implementación según propuesta',
    ],
    // Back face
    backHook: 'Cuando tu negocio ya es demasiado grande para una sola app',
    idealFor: [
      'Startups con inversión, marketplaces y operadores con flota o red de prestadores',
    ],
    gains: [
      { num: '01', title: 'Varias apps, una visión', desc: 'Cliente, operador y comando central coordinados' },
      { num: '02', title: 'Tiempo real de verdad', desc: 'Ubicación, estados y asignaciones que no mienten' },
      { num: '03', title: 'Sin techo artificial', desc: 'Arquitectura para crecer sin reescribir todo a los seis meses' },
      { num: '04', title: 'Partner, no proveedor', desc: 'Roadmap y decisiones técnicas alineadas al negocio' },
    ],
    powerStatement:
      'En productos de alta complejidad, la arquitectura tiene que estar pensada para escalar: que el sistema acompañe el crecimiento sin convertirse en un freno operativo.',
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

/** Texto del CTA principal de la card según modalidad de cobro. */
export function getPlanCtaLabel(plan: PricingPlan): string {
  if (plan.price === null) return 'Solicitar presupuesto'
  if (plan.billing === 'month') return 'Consultar retainer mensual'
  return 'Empezar proyecto'
}
