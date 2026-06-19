/**
 * Blog posts pillar — SEO + AEO (AI Overviews / LLM citations).
 *
 * Estructura optimizada para 2026:
 * - Cada post tiene FAQ schema (LLMs citan FAQs 3x más que prosa)
 * - Tablas y listas comparativas (citables 2.5x más)
 * - H2 como preguntas (Google Featured Snippets)
 * - Data propia con benchmarks reales del mercado AR
 *
 * Posts son objetos en TS (no MDX/Markdown) para evitar dependencias extra
 * y mantener el bundle ligero. Renderizados con un switch básico.
 */

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip'; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'cta'; text: string }

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  readingMinutes: number
  category: 'pricing' | 'tecnologia' | 'cro' | 'estrategia'
  tags: string[]
  /** TL;DR para AI Overviews — 2-3 frases con respuesta directa. */
  tldr: string
  blocks: BlogBlock[]
  /** FAQs al final del post — críticas para AEO. */
  faq: { q: string; a: string }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'cuanto-cuesta-pagina-web-argentina-2026',
    title: 'Cuánto cuesta una página web en Argentina en 2026 (precios reales por tipo)',
    description:
      'Tabla actualizada con los precios reales del mercado argentino 2026 para landing, sitio corporativo, e-commerce y apps móviles. Sin "depende".',
    publishedAt: '2026-05-15',
    updatedAt: '2026-06-19',
    readingMinutes: 11,
    category: 'pricing',
    tags: ['precios', 'argentina', 'desarrollo web', 'presupuesto'],
    tldr: 'En Argentina mayo 2026, una landing cuesta entre ARS 180k-500k, un sitio interactivo entre 500k-1.2M, e-commerce custom entre 900k-3M, y una app móvil entre 580k-6M. El rango depende de complejidad, plazo, contenido propio e integraciones.',
    blocks: [
      {
        type: 'paragraph',
        text: 'La pregunta "cuánto cuesta una página web" tiene una respuesta más clara de lo que te dicen. En Argentina, mayo 2026, los rangos están bastante definidos por tipo de proyecto. Acá va la tabla — y debajo, qué incluye cada rango y cómo evitar pagar de más.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuáles son los precios reales por tipo de proyecto?',
      },
      {
        type: 'table',
        headers: ['Tipo', 'Rango ARS', 'Plazo típico', 'Costo recurrente'],
        rows: [
          ['Landing page (1-5 secciones)', '180k - 500k', '7-15 días', '$0-20 USD/mes (hosting)'],
          ['Sitio corporativo (5-10 páginas)', '500k - 1.2M', '15-25 días', '$0-30 USD/mes'],
          ['E-commerce Tiendanube/Shopify', '350k - 600k', 'Inmediato', '$35-65 USD/mes'],
          ['E-commerce custom', '900k - 3M+', '15-45 días', '$0-50 USD/mes'],
          ['App móvil MVP', '580k - 1.15M', '4-6 semanas', '$0-30 USD/mes'],
          ['App móvil profesional', '1.15M - 2.7M', '8-12 semanas', '$30-100 USD/mes'],
          ['App enterprise multi-tenant', '2.7M - 6M+', '12-20 semanas', '$100+ USD/mes'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Por qué tanta diferencia dentro de cada rango?',
      },
      {
        type: 'paragraph',
        text: 'Tres variables mueven el precio dentro de cada categoría: diseño (plantilla vs custom), funcionalidad (estática vs con CMS/admin) y contenido (lo tenés vs hay que crearlo).',
      },
      {
        type: 'list',
        items: [
          'Plantilla customizada vs diseño propio: diferencia del 40-60%.',
          'Sitio estático vs con panel admin: +30-50%.',
          'Vos tenés copy/fotos vs hay que generarlas: +$100-250k.',
          'Multi-idioma: +$120-280k según cantidad de páginas.',
          'Integración pagos online (MercadoPago + AFIP): +$200-400k.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Conviene Tiendanube/Shopify o custom?',
      },
      {
        type: 'paragraph',
        text: 'Heurística sencilla por volumen de ventas mensuales: hasta $500k facturás cada mes, Tiendanube te alcanza ($35/mes). Entre $500k y $3M, conviene Tiendanube + custom skin. Arriba de $3M/mes, el e-commerce custom paga su diferencia en 6-12 meses por: velocidad real, sin comisión por venta, propiedad del código. Lo comparo a fondo en [Tiendanube vs Shopify vs e-commerce custom](/blog/tiendanube-vs-shopify-vs-ecommerce-custom-argentina).',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'La trampa: pagar Tiendanube Premium ($45 USD/mes) durante 3 años es ARS 1.6M acumulados, sin tener nada como activo propio. A partir del año 2 ya conviene custom si tu volumen lo justifica.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué incluye un proyecto de ARS 300k vs uno de 600k?',
      },
      {
        type: 'paragraph',
        text: 'Un proyecto base de $300k típicamente incluye: diseño responsive a medida, hosting profesional el primer año, integración formulario de contacto con email, SEO on-page básico, optimización mobile (Lighthouse 90+), y el código sube a un repo a tu nombre. Plazo: 15 días. Es lo que ofrezco como [plan Landing](/servicios).',
      },
      {
        type: 'paragraph',
        text: 'Un proyecto de $600k agrega: hasta 5-7 páginas adicionales, panel admin para que cambies textos/imágenes vos, integración WhatsApp + email automático, booking/calendario online, analytics avanzado, y soporte 3 meses post-entrega. Es el [plan Web Interactiva](/servicios).',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto cuesta el mantenimiento mensual de una página web?',
      },
      {
        type: 'paragraph',
        text: 'Acá hay mucha confusión —a veces a propósito—. Una landing o un sitio que no cambia casi no tiene costo mensual: pagás el dominio (USD 10-15 al año) y el hosting, que en infraestructura moderna (Vercel, Netlify) puede ser USD 0 para el tráfico normal de una PyME. El "mantenimiento" caro que venden muchas agencias, muchas veces, es una cuota por nada.',
      },
      {
        type: 'table',
        headers: ['Concepto', 'Costo real', '¿Lo necesitás?'],
        rows: [
          ['Dominio .com / .com.ar', 'USD 10-15 / año', 'Sí, siempre'],
          ['Hosting landing / sitio estático', 'USD 0-20 / mes', 'Sí (suele ir gratis el 1er año)'],
          ['Hosting con base de datos / panel', 'USD 0-30 / mes', 'Solo si tenés admin o login'],
          ['Mantenimiento "por las dudas"', 'ARS 45k-80k / mes', 'Casi nunca — pagá por cambio'],
          ['Cambio puntual (texto, sección)', 'ARS 50k-80k por vez', 'Solo cuando lo pedís'],
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Si tu sitio no cambia mes a mes, un mantenimiento mensual fijo es plata tirada. Un fijo de ARS 60k/mes son 720k al año por, muchas veces, no hacer nada. Pagá por bloque cuando realmente necesitás un cambio.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Por qué unos cobran en dólares y otros en pesos?',
      },
      {
        type: 'paragraph',
        text: 'Cobrar en USD protege al desarrollador de la inflación, pero te traslada a vos el riesgo cambiario: un proyecto de 3 meses puede terminar costándote 20-30% más en pesos del que arrancó. Cobrar en pesos con precio fijo pactado por escrito te da certeza: sabés exactamente cuánto vas a pagar de principio a fin. Por eso publico los precios en ARS y los fijo antes de empezar, sin "ajuste por inflación" sorpresa a mitad de camino.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Conviene un freelance, una agencia o una plataforma como Wix?',
      },
      {
        type: 'paragraph',
        text: 'Para la mayoría de las PyMEs argentinas, un freelance full-stack es el punto óptimo: pagás por el trabajo, no por la estructura de una agencia (oficinas, vendedores, project managers que encarecen 2-3x lo mismo). Una plataforma tipo Wix o Tiendanube es barata de entrada, pero alquilás para siempre y el código nunca es tuyo. El resumen:',
      },
      {
        type: 'table',
        headers: ['Opción', 'Costo típico', 'Dueño del código', 'Ideal para'],
        rows: [
          ['Plataforma (Wix/Tiendanube)', '$35-65 USD/mes para siempre', 'No (alquilás)', 'Arrancar rápido y validar'],
          ['Freelance full-stack', 'ARS 300k-1.2M una sola vez', 'Sí, tuyo', 'PyME que quiere un activo propio'],
          ['Agencia', 'ARS 1.5M-5M+ una sola vez', 'Depende del contrato', 'Empresa con equipo y presupuesto'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Tenés la comparación completa, fila por fila —APEX vs WordPress vs Wix vs Tiendanube vs agencia—, en la página de [servicios y precios](/servicios), con qué recibís exactamente a cada precio.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Se puede pagar una página web en cuotas?',
      },
      {
        type: 'paragraph',
        text: 'Sí, y debería ser lo normal. Trabajo con 3 cuotas sin interés y, antes de que pagues nada, te hago un boceto gratis en 24-48 h: ves cómo va a quedar tu proyecto y recién ahí decidís. Si no te convence, no pagás. Eso te saca el riesgo de encima — no estás pagando una promesa, estás pagando algo que ya viste.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cómo evitar pagar de más?',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Pedí precio fijo o cap. Nunca "por hora sin scope".',
          'Verificá que el código quede en tu cuenta de GitHub.',
          'Confirmá que el dominio y hosting estén a tu nombre.',
          'Preguntá qué pasa si querés cambiar de proveedor.',
          'No pagues mantenimiento mensual si tu sitio no cambia.',
        ],
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta una página web simple en Argentina en 2026?',
        a: 'Entre ARS 180.000 y ARS 500.000 según si es plantilla customizada o diseño propio. Plazo típico de 7 a 15 días, con hosting incluido el primer año.',
      },
      {
        q: '¿Cuál es la diferencia entre Tiendanube y un e-commerce custom?',
        a: 'Tiendanube cuesta $35-65 USD/mes pero el código no es tuyo. Custom cuesta ARS 900k-3M de una sola vez y el código queda a tu nombre, sin costo recurrente significativo. Conviene custom cuando facturás más de $3M/mes.',
      },
      {
        q: '¿El hosting y el dominio están incluidos en el precio?',
        a: 'El primer año de hosting suele venir incluido en el precio. El dominio (USD 10-15/año) lo registrás a tu nombre. Después del primer año, el hosting profesional cuesta entre USD 0 y 30 por mes según el tráfico.',
      },
      {
        q: '¿Cuánto cuesta hacer una app móvil en Argentina?',
        a: 'Un MVP simple (3-5 pantallas) cuesta entre ARS 580.000 y 1.150.000. Una app profesional con backend y panel admin va de 1.150.000 a 2.700.000. Apps enterprise con multi-tenant superan los 2.700.000.',
      },
      {
        q: '¿Vale la pena pagar mantenimiento mensual?',
        a: 'Sólo si el sitio o app es crítico para tu negocio y se actualiza con frecuencia. Para landings estáticas, conviene pagar por bloques cuando hay cambios ($50-80k cada vez) en vez de un fijo mensual.',
      },
      {
        q: '¿Cuánto tarda en estar lista una página web?',
        a: 'Una landing está lista en 7-15 días y un sitio interactivo en 15-25 días. En APEX el plazo se pacta por escrito antes de empezar, con un boceto gratis en 24-48 h para que veas el diseño antes de pagar.',
      },
      {
        q: '¿Qué pasa si no me gusta el diseño?',
        a: 'Por eso primero ves un boceto gratis en 24-48 h, sin pagar nada. Si no te convence, no avanzás y no pagás. Recién cuando aprobás el diseño se arranca el desarrollo: no comprás una promesa, comprás algo que ya viste.',
      },
      {
        q: '¿Puedo pagar mi página web en cuotas?',
        a: 'Sí. Trabajo con 3 cuotas sin interés, y el primer boceto es gratis: recién pagás cuando aprobás cómo va a quedar tu proyecto.',
      },
    ],
  },

  {
    slug: 'nextjs-vs-wordpress-pyme-argentina',
    title: 'Next.js vs WordPress vs Wix para PyMEs argentinas: comparativa real 2026',
    description:
      'Comparativa honesta entre Next.js, WordPress y Wix para sitios de PyMEs en Argentina. Velocidad real, costos, lock-in, SEO y cuándo conviene cada uno.',
    publishedAt: '2026-05-12',
    readingMinutes: 6,
    category: 'tecnologia',
    tags: ['nextjs', 'wordpress', 'wix', 'comparativa', 'pymes'],
    tldr: 'Para PyMEs argentinas en 2026: Next.js es la opción premium para sitios que necesitan velocidad, SEO y propiedad del código (rango $300k-$1.2M ARS). WordPress conviene para blogs largos con muchos plugins. Wix sólo para casos muy chicos (<$300k facturación/mes).',
    blocks: [
      {
        type: 'paragraph',
        text: 'Si tu PyME está por arrancar su presencia web o quiere migrar de una solución actual, esta comparativa te ahorra leer 20 artículos contradictorios. Datos reales del mercado argentino 2026.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tabla comparativa: lo importante para una PyME',
      },
      {
        type: 'table',
        headers: ['Criterio', 'Next.js', 'WordPress', 'Wix'],
        rows: [
          ['Velocidad (Lighthouse mobile)', '90-98', '40-70', '30-60'],
          ['SEO técnico out-of-the-box', 'Excelente', 'Bueno con plugins', 'Limitado'],
          ['Costo inicial', '$300k-$1.2M', '$80k-$600k', '$0-200k'],
          ['Costo recurrente', '$0-30/mes USD', '$5-25/mes USD', '$16-45/mes USD'],
          ['Propiedad del código', '100%', '100%', '0%'],
          ['Editar sin programar', 'Con CMS extra', 'Sí (admin nativo)', 'Sí (drag-drop)'],
          ['Lock-in (dificultad para migrar)', 'Nulo', 'Bajo', 'Alto'],
          ['Apps móviles desde mismo stack', 'Sí (React Native)', 'No', 'No'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo conviene Next.js?',
      },
      {
        type: 'list',
        items: [
          'Tu negocio depende del SEO (querés rankear en Google y traer tráfico orgánico).',
          'Tu sitio recibe más de 500 visitas/mes y la velocidad importa para conversión.',
          'Vas a sumar funciones a futuro: booking, e-commerce, dashboard, app móvil.',
          'No querés pagar suscripción mensual ni quedar atado a una plataforma.',
          'Tu cliente compra tickets medianos-altos ($500+ por transacción).',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo conviene WordPress?',
      },
      {
        type: 'list',
        items: [
          'Tu negocio es contenido (blog, magazine, portal de noticias).',
          'Necesitás integrar muchos plugins específicos del nicho (membership, LMS, foros).',
          'Tu equipo va a actualizar el sitio múltiples veces por semana sin tocar código.',
          'Tu presupuesto inicial es chico (<$200k) y la velocidad no es crítica.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo conviene Wix?',
      },
      {
        type: 'paragraph',
        text: 'Sólo si tu negocio factura menos de $300k/mes y necesitás un sitio "que esté" antes que "que venda". En cuanto tu volumen crece, Wix se vuelve caro (suscripción acumulada) y limitado (velocidad, SEO, integraciones).',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'La trampa más cara de Wix: después de 2-3 años pagando $30-45 USD/mes, querés migrar y descubrís que no podés llevarte los datos, ni el diseño, ni el SEO acumulado. Plata tirada acumulada: ARS 1.5M+.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cómo migrar de Wix/WordPress a Next.js sin perder SEO?',
      },
      {
        type: 'paragraph',
        text: 'Tres pasos esenciales: 1) Hacer auditoría de URLs y keywords activas en Search Console antes de migrar. 2) Diseñar el sitio nuevo con la misma estructura de URLs (mismas slugs). 3) Configurar redirects 301 para cualquier URL que cambie. Esto preserva el ranking acumulado y no perdés tráfico orgánico.',
      },
    ],
    faq: [
      {
        q: '¿Next.js es más caro que WordPress?',
        a: 'Inicialmente sí (300-700% más caro de entrada), pero después de 2 años el costo total acumulado se equipara porque WordPress requiere mantenimiento mensual y hosting. Next.js no tiene esos costos recurrentes obligatorios.',
      },
      {
        q: '¿Puedo cambiar yo mismo los textos en Next.js?',
        a: 'Sí, si pedís que se incluya un CMS (Sanity, Strapi o el panel admin custom). Sin CMS, los cambios requieren código. Es una decisión a definir al inicio del proyecto.',
      },
      {
        q: '¿Wix es realmente tan malo?',
        a: 'No es malo, es limitado. Funciona perfecto para portfolios personales, sitios de eventos puntuales o tiendas que recién arrancan. Se vuelve un problema cuando el negocio crece y necesita velocidad, SEO real o salir de la plataforma.',
      },
      {
        q: '¿Conviene Next.js para un blog?',
        a: 'Sólo si el blog es parte de un sitio más grande (marketing, portfolio, e-commerce). Para un blog puro, WordPress sigue siendo más rápido de operar — el admin nativo y los plugins de blogging son insuperables.',
      },
    ],
  },

  {
    slug: 'cuanto-cuesta-app-movil-argentina-flutter-react-native',
    title: 'Cuánto cuesta hacer una app móvil en Argentina (Flutter vs React Native vs nativo)',
    description:
      'Precios reales y comparativa técnica para apps iOS + Android en Argentina 2026. Cuándo conviene Flutter, React Native o nativo según tu caso.',
    publishedAt: '2026-05-10',
    readingMinutes: 6,
    category: 'pricing',
    tags: ['apps', 'flutter', 'react native', 'ios', 'android', 'precios'],
    tldr: 'Una app móvil simple en Argentina cuesta entre ARS 580k-1.15M (Flutter o React Native), una profesional con backend 1.15M-2.7M, y enterprise 2.7M+. Flutter conviene para diseño consistente cross-platform, React Native si ya tenés team React, nativo sólo para apps con hardware crítico.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Las apps móviles son el componente más caro y más confuso de la oferta de desarrollo en Argentina. Esta guía te da los rangos reales y la decisión técnica que MÁS impacta el precio: qué stack usar.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto cuesta una app móvil según tipo y stack?',
      },
      {
        type: 'table',
        headers: ['Complejidad', 'Flutter / React Native', 'iOS + Android nativo', 'Plazo'],
        rows: [
          ['MVP (3-5 pantallas)', '$580k - $1.15M', '$1.5M - $2.5M', '4-6 sem'],
          ['App profesional + backend', '$1.15M - $2.7M', '$2.7M - $5M', '8-12 sem'],
          ['Enterprise multi-tenant', '$2.7M - $6M', '$5M - $12M+', '12-20 sem'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Por qué Flutter cuesta la mitad que iOS + Android nativo?',
      },
      {
        type: 'paragraph',
        text: 'Con Flutter escribís una sola base de código en Dart y obtenés dos apps (iOS y Android) compiladas a código nativo. Con desarrollo nativo, tenés que escribir dos veces: Swift para iOS y Kotlin para Android. A igualdad de funcionalidad, son básicamente dos proyectos en paralelo.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo NO conviene Flutter?',
      },
      {
        type: 'list',
        items: [
          'La app necesita integraciones muy profundas con hardware específico (ARKit, lectores NFC industriales).',
          'Hay un equipo iOS y Android ya formado que va a mantener la app a largo plazo.',
          'La app va a ser un juego AAA con física compleja (mejor Unity/Unreal).',
          'Necesitás features de release el mismo día que iOS/Android los lanzan (a veces Flutter tarda 2-3 meses en adoptar nuevas APIs).',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿React Native o Flutter?',
      },
      {
        type: 'paragraph',
        text: 'Decisión técnica con tradeoffs reales. React Native conviene si tu equipo ya domina React/JavaScript (curva de aprendizaje cero). Flutter conviene si el diseño visual es crítico (controla cada pixel) y si querés performance más cercano a nativo. Para PyMEs argentinas sin equipo dev interno, Flutter suele ser la elección porque entrega un resultado más pulido con menos correcciones.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué pasa con los costos recurrentes de una app?',
      },
      {
        type: 'list',
        items: [
          'Apple Developer Program: USD 99/año (obligatorio para publicar en App Store).',
          'Google Play Console: USD 25 pago único.',
          'Backend (Supabase, Firebase o custom): USD 0-100/mes según uso.',
          'Push notifications: USD 0-30/mes según volumen.',
          'Analytics + crash reporting: USD 0 con planes free de Sentry + PostHog.',
        ],
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Total realista para mantener una app en producción: USD 130-250/mes ($130k-250k ARS/mes). Esto es además de lo que pagues por mantenimiento técnico al dev.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto tiempo lleva tener la app en stores?',
      },
      {
        type: 'paragraph',
        text: 'Desde "arrancamos" hasta "instalable en stores": 4-6 semanas para un MVP, 8-12 semanas para una app profesional. El bottleneck no suele ser el desarrollo sino la review de Apple (3-7 días) y el setup inicial de cuentas (otra semana).',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta una app sencilla en Argentina?',
        a: 'Un MVP con 3-5 pantallas hecho con Flutter o React Native cuesta entre ARS 580.000 y 1.150.000, con plazo de 4 a 6 semanas. Incluye iOS y Android desde una sola base de código.',
      },
      {
        q: '¿Flutter es realmente más barato que nativo?',
        a: 'A igualdad de complejidad, Flutter sale aproximadamente la mitad porque escribís una sola base de código para ambas plataformas. La diferencia se mantiene también en mantenimiento posterior.',
      },
      {
        q: '¿Mi app puede tener iOS y Android desde el primer día?',
        a: 'Sí, con Flutter o React Native publicás ambas el mismo día. Con desarrollo nativo, generalmente se lanza una primero (la más relevante para tu mercado) y la segunda viene 4-8 semanas después.',
      },
      {
        q: '¿Cuánto sale mantener una app después de lanzarla?',
        a: 'Los costos fijos de plataforma rondan USD 130-250/mes (Apple Developer, Google Play, backend, monitoring). Aparte, mantenimiento técnico con el dev cuesta entre ARS 50.000 y 250.000/mes según frecuencia de updates.',
      },
    ],
  },

  {
    slug: 'de-quien-es-codigo-contratar-desarrollador',
    title: '¿De quién es el código cuando contratás un desarrollador?',
    description:
      'Las 3 preguntas que tu dev tiene que poder responder antes de firmar. Casos reales de PyMEs que perdieron $1M+ por no preguntar esto.',
    publishedAt: '2026-05-08',
    readingMinutes: 5,
    category: 'estrategia',
    tags: ['contratación', 'propiedad código', 'lock-in', 'riesgos'],
    tldr: 'El código de tu sitio o app debe quedar 100% a tu nombre desde el día 1 (repositorio en tu cuenta, dominio a tu nombre, datos exportables). Si tu dev no te puede confirmar esto por escrito, no firmes.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Esta es la pregunta más cara que las PyMEs argentinas no hacen antes de contratar dev. Tres escenarios reales (sin nombres porque son clientes que vinieron a rescate), y las 3 preguntas que evitan la trampa.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tres escenarios reales (con números)',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Caso 1: el cliente fantasma',
      },
      {
        type: 'paragraph',
        text: 'PyME contrata freelance por ARS 200k. Sitio "listo". A los 6 meses quieren agregar una sección. El freelance no responde. Resultado: pagan ARS 400k a otro dev para tomar control, porque el código original estaba en una cuenta personal del freelance. No podían ni mover el sitio de servidor.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Caso 2: la agencia "incluida"',
      },
      {
        type: 'paragraph',
        text: 'Otra PyME contrata agencia por ARS 1.5M. "Incluye mantenimiento mensual de $80k". Después de 18 meses, $1.4M extras en mantenimiento. Quisieron salir, pero el código tenía dependencias del "framework propietario" de la agencia. No era portable.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Caso 3: Wix premium para siempre',
      },
      {
        type: 'paragraph',
        text: 'PyME arma su tienda en Wix. 3 años pagando USD 45/mes. Cuando quisieron migrar, descubrieron que no se podían llevar los datos de los clientes ni el diseño. Empezaron de cero. Plata tirada acumulada: ARS 1.6M.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Las 3 preguntas que evitan la trampa',
      },
      {
        type: 'heading',
        level: 3,
        text: '1. ¿En qué cuenta queda el repositorio?',
      },
      {
        type: 'paragraph',
        text: 'Respuesta correcta: "GitHub a tu nombre, vos sos owner, yo soy collaborator hasta entregar y después salgo." Respuesta peligrosa: "En mi cuenta, te doy acceso" — eso es lock-in puro.',
      },
      {
        type: 'heading',
        level: 3,
        text: '2. ¿En qué cuenta queda el dominio y el hosting?',
      },
      {
        type: 'paragraph',
        text: 'Respuesta correcta: "Vos comprás el dominio a tu nombre. Hosting en tu cuenta de Vercel/AWS/etc." Respuesta peligrosa: "Te lo manejo todo yo" — si el dev desaparece, perdés acceso al sitio.',
      },
      {
        type: 'heading',
        level: 3,
        text: '3. ¿Qué pasa si en 1 año quiero moverme a otro proveedor?',
      },
      {
        type: 'paragraph',
        text: 'Respuesta correcta: "Te llevás el repo entero, las bases de datos exportadas, y la documentación. Lo podés correr en otro lado mañana mismo." Respuesta peligrosa: "Lo armé con mi framework propio, sería difícil migrarlo." Si te dicen esto, correlo.',
      },
      {
        type: 'callout',
        variant: 'warning',
        text: 'Antes de firmar, pedí por escrito (email es válido) que el código quedará en tu cuenta y que podés migrarte en cualquier momento. Si el dev no acepta poner esto por escrito, es un red flag enorme.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué hacer si ya firmaste sin preguntar?',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Pedí formalmente acceso owner al repositorio (email + por WhatsApp).',
          'Si el dev no responde en 7 días, escalá legalmente — el código del sitio puede ser tuyo por ley si lo pagaste.',
          'En paralelo, hacé backup de todo lo público (el frontend) y exportá toda la data que tengas acceso.',
          'Considerá contratar a otro dev para una "auditoría de propiedad" — chequea qué tan portable es tu setup actual.',
        ],
      },
    ],
    faq: [
      {
        q: '¿El código de mi sitio es legalmente mío si lo pagué?',
        a: 'En Argentina, la titularidad del código depende del contrato. Sin contrato escrito, la propiedad puede quedar ambigua. Por eso es crítico pactar por escrito desde el inicio que el código queda a nombre del cliente.',
      },
      {
        q: '¿Qué es el lock-in de un proveedor?',
        a: 'Es cuando técnicamente es muy difícil o imposible migrar tu sitio o app a otro proveedor. Ocurre cuando el código vive en cuentas del dev, usa frameworks propietarios, o los datos no se pueden exportar.',
      },
      {
        q: '¿Wix y Shopify tienen lock-in?',
        a: 'Sí, alto. Wix no te deja exportar el diseño ni los datos de los clientes. Shopify es un poco mejor (exportás productos y clientes) pero el theme y las customizaciones no son portables. Tiendanube está en el medio.',
      },
      {
        q: '¿Cómo me aseguro que el código quede a mi nombre?',
        a: 'Pedí que el repositorio se cree directamente en tu cuenta de GitHub (no transferido después). Pedí ser el "owner" desde el día 1. Si te dicen que "es más fácil" empezar en la cuenta del dev y "después transferir", desconfiá.',
      },
    ],
  },

  {
    slug: 'tiendanube-vs-shopify-vs-ecommerce-custom-argentina',
    title: 'Tiendanube vs Shopify vs e-commerce custom: cuál te conviene según tu facturación',
    description:
      'Comparativa honesta de e-commerce en Argentina 2026. Desde Tiendanube básico hasta custom con Next.js. Tabla con cuándo conviene cada uno según tu volumen mensual.',
    publishedAt: '2026-05-05',
    readingMinutes: 6,
    category: 'tecnologia',
    tags: ['ecommerce', 'tiendanube', 'shopify', 'argentina'],
    tldr: 'Hasta $500k facturación/mes: Tiendanube ($35-65 USD/mes). Entre $500k-$3M/mes: Tiendanube + custom skin. Arriba de $3M/mes: e-commerce custom con Next.js + Supabase paga su diferencia en 6-12 meses por velocidad real, propiedad del código y sin comisión por venta.',
    blocks: [
      {
        type: 'paragraph',
        text: 'La elección de plataforma e-commerce define el techo de tu negocio online. Esta guía te da la heurística clara: cuándo conviene cada opción según tu volumen mensual real.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Tabla resumen por volumen',
      },
      {
        type: 'table',
        headers: ['Tu facturación mensual', 'Opción recomendada', 'Costo aprox/año', 'Por qué'],
        rows: [
          ['< $200k ARS', 'MercadoLibre + Instagram', '0', 'No justifica sitio propio todavía'],
          ['$200k - $500k', 'Tiendanube básico', '$420 USD ($420k)', 'Setup rápido, bajo riesgo'],
          ['$500k - $1.5M', 'Tiendanube + custom skin', '$780 USD ($780k)', 'Diferenciación visual'],
          ['$1.5M - $3M', 'Tiendanube Premium o custom', '$1.5K USD ($1.5M)', 'Empieza a justificar custom'],
          ['$3M - $10M', 'E-commerce custom', '$900k-$2M one-time', 'Velocidad + propiedad pagan'],
          ['$10M+', 'Custom multi-tenant', '$2M-$5M one-time', 'Necesitás control total'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué cobra cada plataforma realmente?',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Tiendanube',
      },
      {
        type: 'paragraph',
        text: 'Planes desde USD 17-65/mes. Comisión por venta: 0% en plan paid (pago de la mensualidad), 0.5%-2% en plan free. Integración nativa con MercadoPago y Mercado Envíos. Sincronización con MercadoLibre.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'Shopify',
      },
      {
        type: 'paragraph',
        text: 'Planes desde USD 32-399/mes. Comisión por venta: 1.5%-2% si NO usás Shopify Payments (que no está en Argentina). Esto suma rápido: si vendés $3M/mes, perdés $45-60k/mes sólo en comisiones. Recomendable sólo si necesitás features muy específicas del ecosistema.',
      },
      {
        type: 'heading',
        level: 3,
        text: 'E-commerce custom (Next.js + Supabase)',
      },
      {
        type: 'paragraph',
        text: 'Inversión inicial: ARS 900k-3M one-time. Costo recurrente: USD 0-50/mes (hosting + base de datos). Sin comisión por venta. El código es tuyo y podés agregarle lo que quieras sin pagar más.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo realmente conviene migrar a custom?',
      },
      {
        type: 'paragraph',
        text: 'Tres señales claras: 1) Tu velocidad de carga mobile baja del 60 (Tiendanube/Shopify cap arriba en 70). 2) Estás pagando $200+ USD/mes acumulados entre suscripciones + apps + comisiones. 3) Tu equipo perdió 2+ ventas por mes por bugs o limitaciones de la plataforma.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Cálculo simple: si gastás USD 200/mes en Tiendanube + apps + comisiones, en 5 años gastaste USD 12.000 (~ARS 12M). Un custom de calidad media cuesta ARS 1.5M-2.5M. Break-even: 1-2 años.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Se puede migrar de Tiendanube a custom sin perder SEO?',
      },
      {
        type: 'paragraph',
        text: 'Sí. La migración bien hecha incluye: exportar el catálogo completo, mapear las URLs antiguas a las nuevas, configurar redirects 301 para cualquier cambio, y mantener la estructura de categorías. Hecho así, no perdés tráfico orgánico ni ranking acumulado.',
      },
    ],
    faq: [
      {
        q: '¿Tiendanube tiene comisión por venta?',
        a: 'Sí, en planes pagos suele ser 0% pero pueden cobrar comisiones específicas en transacciones con MercadoPago. En planes free, la comisión por venta es entre 0.5% y 2%. Siempre confirmá en tu plan actual.',
      },
      {
        q: '¿Cuánto tarda armar un e-commerce custom?',
        a: 'Un e-commerce custom simple lleva entre 15 y 45 días según complejidad. Multi-vendor o con integraciones avanzadas (AFIP automático, ERP) puede llegar a 60-90 días.',
      },
      {
        q: '¿Puedo combinar Tiendanube con un sitio Next.js?',
        a: 'Sí, es un patrón común: el sitio principal en Next.js (landing, contenido, SEO) y el checkout/carrito en Tiendanube. Te llevás la velocidad del custom + la operación simple de Tiendanube.',
      },
      {
        q: '¿Conviene Shopify en Argentina?',
        a: 'Sólo si vendés mayormente al exterior en USD, o si necesitás features específicas del ecosistema Shopify (apps de dropshipping internacionales, integraciones con TikTok Shop). Para mercado argentino puro, Tiendanube suele ser más práctico.',
      },
    ],
  },

  {
    slug: 'elegir-freelance-web-argentina-checklist',
    title: 'Cómo elegir un freelance web en Argentina sin perder plata: checklist de 12 puntos',
    description:
      'Checklist verificable de 12 puntos para evaluar a un freelance o agencia antes de firmar. Si cumple 9+, vas bien.',
    publishedAt: '2026-05-02',
    readingMinutes: 5,
    category: 'estrategia',
    tags: ['contratación', 'freelance', 'checklist', 'argentina'],
    tldr: 'Para evitar perder plata contratando dev en Argentina, evaluá al candidato con 12 criterios: trabajos en producción, casos con métricas, plazo escrito, propiedad del código, precio fijo, factura A/B, canal directo, qué NO hace, stack en castellano, referencias, NDA opcional, garantía explícita. Si cumple 9+, vas bien.',
    blocks: [
      {
        type: 'paragraph',
        text: 'No hay forma de eliminar todo el riesgo de contratar dev a ciegas, pero sí podés bajarlo del 50% al 5% con una evaluación honesta de 12 puntos. Acá va el checklist.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'El checklist de 12 puntos',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**Te muestra trabajos en producción** (no mockups en Behance). Tiene que poder enseñarte sitios reales funcionando, ideal con clientes reconocibles.',
          '**Tiene casos con métricas reales** (no "aumentamos las ventas"). Si te dice "+47% conversión", debería poder mostrar el dato.',
          '**Te explica el plazo y los hitos por escrito**. WhatsApp o email vale como documentación.',
          '**El código queda en tu cuenta** desde el día 1. Preguntá literalmente: "¿En qué cuenta de GitHub queda?"',
          '**El precio es fijo o tiene un cap explícito**. Sin cap, el proyecto se va al doble.',
          '**Acepta factura A o B** si te corresponde. Es señal de que está inscripto en AFIP en serio.',
          '**Tiene un canal directo** (WhatsApp/email del dev). Si solo hablás con account managers, perdés tiempo.',
          '**Te dice qué NO hace**. Cualquier "hago de todo" es señal de alerta — nadie es bueno en todo.',
          '**Te explica el stack en castellano**. Si no lo entendés, es opaco a propósito.',
          '**Te ofrece referencias verificables**. Clientes reales que podés llamar o WhatsAppear.',
          '**Está disponible para NDA** si tu proyecto es confidencial. Sin drama.',
          '**Tiene garantía explícita** (devolución, deadline, soporte post-entrega). Por escrito.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: 'Cómo usar este checklist',
      },
      {
        type: 'paragraph',
        text: 'Hacé esta evaluación ANTES de firmar. Mandale el checklist al candidato directamente o usalo como guía en la primera llamada. Si responde abiertamente y cumple 9 o más, tu riesgo es bajo. Si cumple menos de 7, considerá otra opción.',
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'Bonus: si tu candidato te muestra ESTA misma página como referencia o algo similar, ya sabés que su mentalidad es la correcta — entiende que el trabajo del dev no es opacar al cliente, es darle claridad.',
      },
      {
        type: 'heading',
        level: 2,
        text: 'Las 3 señales de alerta más comunes',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          '**"Es difícil dar un presupuesto sin ver todo".** A veces es legítimo, pero si pasan 2 conversaciones y todavía no te dan ni un rango, run.',
          '**"Mi framework es propietario, optimizado para X".** Esto casi siempre significa lock-in. Pedí explícitamente que el stack sea open source y conocido.',
          '**"El mantenimiento es de $X/mes desde el día 1, obligatorio".** A veces es necesario (apps complejas), pero para sitios estáticos es un upsell injusto. Negociá pago por bloques.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo es razonable pagar más que el promedio?',
      },
      {
        type: 'paragraph',
        text: 'Si el candidato cumple 12/12 del checklist, tiene casos verificables impresionantes, y te puede dar referencias de clientes con tu volumen exacto — puede pedir 20-40% más que el promedio del mercado. Vale la pena porque el riesgo bajó al mínimo.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto debería pagarle a un freelance argentino senior?',
        a: 'Entre USD 35 y 65 por hora según experiencia. Para proyectos, evitá pagar por hora sin scope cerrado — pedí siempre precio fijo o cap explícito.',
      },
      {
        q: '¿Es seguro contratar a alguien que recién arranca?',
        a: 'Sí, si te ofrece un descuento real por el riesgo (típicamente 30-40% menos que un senior) y si su trabajo previo, aunque sea personal, es sólido. Nunca contrates "porque era barato" si no podés ver al menos 3 proyectos terminados.',
      },
      {
        q: '¿Conviene un freelance individual o una agencia chica?',
        a: 'Individual conviene cuando la persona es full-stack y tu proyecto es chico-mediano. Agencia chica (2-5 personas) conviene si necesitás diseñador + dev + alguien que coordine. Agencia grande (10+ personas) sólo para proyectos enterprise.',
      },
      {
        q: '¿Qué hago si el dev desaparece a la mitad del proyecto?',
        a: 'Primero, intentá contacto por todos los canales durante 7 días. Si no responde, contratá otro dev para auditar lo que hay y completar. Conservá toda la comunicación previa — si pagaste y no hay entrega, podés reclamar legalmente o por medios de pago (chargeback en MercadoPago si fue por ahí).',
      },
    ],
  },

  {
    slug: 'integrar-mercadopago-afip-web-argentina',
    title: 'Integrar MercadoPago + AFIP en tu web: guía técnica + costos 2026',
    description:
      'Cómo integrar pasarela de pagos MercadoPago + facturación electrónica AFIP en un sitio web argentino. Costos reales, plazos y aspectos técnicos para 2026.',
    publishedAt: '2026-04-28',
    readingMinutes: 7,
    category: 'tecnologia',
    tags: ['mercadopago', 'afip', 'pagos', 'integración', 'argentina'],
    tldr: 'Integrar MercadoPago en una web custom cuesta ARS 80k-200k y lleva 3-5 días. Agregar facturación electrónica AFIP automática suma ARS 200k-400k y otros 5-10 días. El stack más simple en 2026: MercadoPago Checkout Pro + AFIP SDK + webhook handlers.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Esta es la integración más pedida en e-commerce argentino. Vamos al grano: qué stack usar, qué cuesta, cuánto tarda, qué cosas se pueden y no se pueden automatizar.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué incluye una integración MercadoPago completa?',
      },
      {
        type: 'list',
        items: [
          'Checkout Pro embebido (el más simple) o Checkout API (más control).',
          'Webhooks para confirmar pagos en tiempo real.',
          'Manejo de estados (pendiente, aprobado, rechazado, en disputa).',
          'Refunds parciales y totales.',
          'Integración con Mercado Envíos si aplica.',
          'Sandbox para testing antes de prod.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto cobra MercadoPago por transacción?',
      },
      {
        type: 'table',
        headers: ['Forma de pago', 'Comisión', 'Plazo de acreditación'],
        rows: [
          ['Dinero en cuenta MP', '4.99%', 'Inmediato'],
          ['Tarjeta débito', '4.59%', '6 días hábiles'],
          ['Tarjeta crédito 1 cuota', '6.29%', '6 días hábiles'],
          ['Tarjeta crédito 3 cuotas s/interés', '11.99%', '6 días hábiles'],
          ['Tarjeta crédito 6 cuotas s/interés', '15.99%', '6 días hábiles'],
        ],
      },
      {
        type: 'paragraph',
        text: 'Las comisiones cambian según el rubro y volumen. Para volúmenes altos podés negociar comisiones menores con tu account manager de MercadoPago.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto cuesta integrar MercadoPago en un sitio existente?',
      },
      {
        type: 'list',
        items: [
          'Setup básico Checkout Pro: ARS 80k-150k (3-5 días).',
          'Setup avanzado Checkout API + webhook manager: ARS 150k-250k (5-8 días).',
          'Multi-vendor (varios sellers cobran en la misma plataforma): ARS 300k-500k (10-15 días).',
          'Integración con Mercado Envíos: +ARS 80k-150k.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué incluye una integración AFIP automática?',
      },
      {
        type: 'paragraph',
        text: 'Después de confirmar el pago, el sistema emite automáticamente factura A, B o C según el tipo de cliente, genera el CAE (Código de Autorización Electrónico), guarda el comprobante en PDF con tu marca, lo envía por email al cliente, y guarda el registro en tu sistema para que tu contador lo descargue cuando quiera.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuánto cuesta agregar facturación AFIP automática?',
      },
      {
        type: 'list',
        items: [
          'Setup básico (sólo factura B/C, monotributista): ARS 200k-280k (5-8 días).',
          'Setup completo (A/B/C con discriminación IVA, Responsable Inscripto): ARS 280k-400k (8-12 días).',
          'Setup con notas de crédito/débito automáticas: +ARS 100k.',
          'Costo recurrente: prácticamente $0 si usás el SDK oficial. AFIP SDK como servicio paga ronda los USD 10-30/mes según volumen.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué stack técnico usar en 2026?',
      },
      {
        type: 'paragraph',
        text: 'Recomendado: MercadoPago Checkout Pro + AFIP SDK (oficial o TusFacturasAPP) + webhooks manejados en Next.js API routes o Supabase Edge Functions. La base de datos guarda los pagos y comprobantes con la firma digital correspondiente.',
      },
      {
        type: 'callout',
        variant: 'info',
        text: 'Importante: la firma digital AFIP requiere que el certificado esté activo y renovado anualmente. Tu dev debe automatizar la renovación o documentar el proceso claramente.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Se puede integrar AFIP sin un dev técnico?',
      },
      {
        type: 'paragraph',
        text: 'Sólo si usás una plataforma que ya lo trae integrado (Tiendanube tiene parcial, Tienda Online de MP integrada). Para sitios custom o e-commerce hechos a medida, necesitás un dev — la integración AFIP requiere SOAP, certificados X.509 y manejo de errores específicos.',
      },
    ],
    faq: [
      {
        q: '¿Necesito ser responsable inscripto para usar MercadoPago Checkout?',
        a: 'No, podés usar MercadoPago siendo monotributista. La diferencia está en el tipo de factura que emitís (C para monotributo, A/B para responsable inscripto), no en la pasarela de pago.',
      },
      {
        q: '¿La integración AFIP funciona con MercadoPago directamente?',
        a: 'No automáticamente. MercadoPago confirma el pago, pero la factura electrónica la emitís vos. Tenés que conectar tu sistema con AFIP usando WSAA + WSFE/WSMTXCA, o usar un middleware como AFIP SDK o TusFacturasAPP.',
      },
      {
        q: '¿Cuánto cuesta TusFacturasAPP o AFIP SDK?',
        a: 'TusFacturasAPP tiene planes desde USD 10/mes hasta USD 50/mes según volumen de comprobantes. AFIP SDK es open source si lo manejás vos mismo (gratis), o tiene servicio cloud desde USD 20-40/mes.',
      },
      {
        q: '¿Puedo integrar MercadoPago en Wix o Shopify?',
        a: 'En Wix sí, vía app de MercadoPago para Wix. En Shopify no es tan simple porque Shopify Payments no opera en Argentina — tenés que usar gateway de terceros con comisión adicional.',
      },
    ],
  },

  {
    slug: 'por-que-pyme-pwa-2026',
    title: 'Por qué tu PyME necesita una PWA (y no una app nativa) en 2026',
    description:
      'PWA vs app nativa para PyMEs argentinas en 2026. Cuándo conviene cada una, costos comparados, y los 3 escenarios donde la PWA gana 9 de 10 veces.',
    publishedAt: '2026-04-25',
    readingMinutes: 5,
    category: 'tecnologia',
    tags: ['pwa', 'app móvil', 'pyme', 'argentina'],
    tldr: 'Una Progressive Web App (PWA) cuesta 40-60% menos que una app nativa, no requiere descarga de stores, y cubre el 80% de las necesidades para la mayoría de PyMEs argentinas. Conviene PWA en lugar de app nativa cuando el uso es ocasional, el discovery viene por web, o no necesitás hardware nativo profundo.',
    blocks: [
      {
        type: 'paragraph',
        text: 'Hay PyMEs argentinas pagando ARS 1.5M+ por apps nativas que la mayoría de sus clientes no instalan nunca. La PWA es la respuesta moderna a este problema — y en 2026 está más madura que nunca.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué es una PWA exactamente?',
      },
      {
        type: 'paragraph',
        text: 'Una Progressive Web App es un sitio web optimizado que se comporta como app: se instala desde el navegador (sin pasar por stores), funciona offline, manda push notifications, abre en pantalla completa, accede a cámara/GPS si lo permitís. Para el usuario final, se siente igual que una app nativa. Para tu negocio, es un solo proyecto en lugar de tres (web + iOS + Android).',
      },
      {
        type: 'heading',
        level: 2,
        text: 'PWA vs App nativa: tabla comparativa',
      },
      {
        type: 'table',
        headers: ['Criterio', 'PWA', 'App nativa (Flutter)'],
        rows: [
          ['Costo inicial', '$600k - $1.5M', '$580k - $2.7M'],
          ['Plazo', '15-25 días', '4-12 semanas'],
          ['Instalación', 'Desde navegador (2 clicks)', 'App Store / Play Store'],
          ['Funcionamiento offline', 'Sí', 'Sí'],
          ['Push notifications', 'Sí (Web Push)', 'Sí'],
          ['Acceso a cámara/GPS', 'Sí', 'Sí'],
          ['Acceso a sensores avanzados', 'Limitado', 'Completo'],
          ['Visibilidad en stores', 'No', 'Sí'],
          ['SEO (Google indexable)', 'Sí', 'No'],
          ['Updates automáticos', 'Inmediato', 'Vía store, 1-7 días review'],
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo conviene PWA sobre app nativa?',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'El uso es ocasional (1 vez por semana o menos): catálogos, formularios, dashboards de gestión, reservas, agendas.',
          'El discovery viene mayormente por web (Google, ads, redes): tu app es retention, no acquisition.',
          'No necesitás hardware nativo profundo (Bluetooth complejo, ARKit, lectores NFC industriales).',
          'Tu cliente target tiene celulares variados (muchos modelos Android viejos): PWA funciona mejor en hardware bajo recurso.',
        ],
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Cuándo conviene app nativa sobre PWA?',
      },
      {
        type: 'list',
        ordered: true,
        items: [
          'Uso diario o multidiario: gimnasio que registra clases, app de turnos médicos para pacientes crónicos, app de pedidos para clientes habituales.',
          'Necesitás push notifications agresivas (iOS limita las de PWA).',
          'Hardware específico: lectores QR industriales, cámaras especiales, conexión Bluetooth con dispositivos médicos.',
          'Tu marketing depende de estar en App Store / Play Store como signal de seriedad.',
        ],
      },
      {
        type: 'callout',
        variant: 'tip',
        text: 'En PyMEs argentinas, 70-80% de los casos encajan en PWA. App nativa es la opción correcta cuando el caso de uso lo justifica claramente — no por defecto.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Una PWA puede reemplazar mi sitio web también?',
      },
      {
        type: 'paragraph',
        text: 'Sí. Una PWA es un sitio web con superpoderes. La misma URL funciona desde un browser de escritorio como sitio normal, y desde el celular se puede instalar como app. Ahorrás mantener dos productos separados.',
      },
      {
        type: 'heading',
        level: 2,
        text: '¿Qué stack técnico se usa para una PWA en 2026?',
      },
      {
        type: 'paragraph',
        text: 'Next.js 15 + Tailwind CSS + Supabase es el stack más eficiente para PWAs en 2026. Permite render server-side (bueno para SEO), Service Workers para offline, Web Push API nativa, y deploy en Vercel sin configuración adicional.',
      },
    ],
    faq: [
      {
        q: '¿Las PWAs funcionan en iPhone?',
        a: 'Sí, desde iOS 11.3 (2018) y completamente desde iOS 16. Push notifications llegaron a iOS PWAs recién en 2023, así que cuidado si tu app depende mucho de notificaciones agresivas.',
      },
      {
        q: '¿Una PWA aparece en App Store o Play Store?',
        a: 'Por defecto no, pero podés "envolverla" con tecnologías como Capacitor o PWABuilder para subirla a las stores. Para Play Store es fácil, para App Store es más complicado por las políticas de Apple.',
      },
      {
        q: '¿Una PWA es más lenta que una app nativa?',
        a: 'Para casos comunes (catálogos, dashboards, e-commerce, formularios), no hay diferencia perceptible. Para casos extremos (3D, juegos complejos, edición de video), las apps nativas todavía son más rápidas.',
      },
      {
        q: '¿Cuánto cuesta convertir mi web actual en PWA?',
        a: 'Si tu sitio está bien construido (Next.js, React), agregar capacidades PWA cuesta entre ARS 80k y 250k (2-5 días). Si tu sitio está en Wix o WordPress, suele requerir reconstruirlo de cero.',
      },
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug)
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getBlogPost(slug)
  if (!current) return BLOG_POSTS.slice(0, limit)
  return BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  ).slice(0, limit)
}

/**
 * Posts más relevantes para un conjunto de keywords. Usado para internal
 * linking desde las landings verticales (/[vertical]) hacia el blog.
 * Puntúa por overlap de tokens (>3 chars) en tags + título; ordena desc.
 * Fallback estable: primeros `limit` posts si no hay match.
 */
export function getPostsByKeywords(keywords: string[], limit = 3): BlogPost[] {
  const tokens = new Set(
    keywords
      .flatMap((k) => k.toLowerCase().split(/\s+/))
      .filter((t) => t.length > 3),
  )
  return BLOG_POSTS.map((p) => {
    const haystack = `${p.tags.join(' ')} ${p.title}`.toLowerCase()
    let score = 0
    tokens.forEach((t) => {
      if (haystack.includes(t)) score += 1
    })
    return { post: p, score }
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post)
}
