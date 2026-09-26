import { ROUTES } from '@/lib/constants'
import { SHOWCASE_TIERS, type ShowcaseSite } from '@/lib/data/showcase'
import { arsInline, MAINTENANCE_PLANS, WEB_PLANS } from '@/lib/types/services'
import { plazoPlan } from '@/lib/data/plazos'

/**
 * Landings por PRODUCTO — una URL por cosa que se vende.
 *
 * Por qué existen: hasta 2026-09-07 las búsquedas de "tienda online",
 * "ecommerce" y "landing page" caían todas en `/servicios`, que las responde a
 * las tres con la misma página. En los términos de búsqueda de la campaña
 * (junio-septiembre 2026) ese cluster sumaba ~430 impresiones para e-commerce y
 * ~295 para landing page: demanda medida, sin página propia que la reciba.
 *
 * Regla al agregar un producto: si no tenés 1.000 palabras de contenido que NO
 * aparecen en otra página del sitio, no es una landing nueva — es una sección.
 * Dos páginas que dicen lo mismo compiten entre ellas y pierden las dos.
 */

const ALL_SITES = SHOWCASE_TIERS.flatMap((t) => t.sites)

function site(slug: string): ShowcaseSite {
  const found = ALL_SITES.find((s) => s.slug === slug)
  if (!found) throw new Error(`showcase site inexistente: ${slug}`)
  return found
}

function planPrice(id: string): number {
  const p = WEB_PLANS.find((x) => x.id === id)
  if (!p || p.price == null) throw new Error(`Plan web sin precio: ${id}`)
  return p.price
}

export interface ProductLanding {
  slug: string
  path: string
  /** Plan de WEB_PLANS del que sale el precio. Nunca se hardcodea un número. */
  planId: string
  price: number
  /**
   * Nombre corto de la página: la miga de pan y el BreadcrumbList.
   * No se deriva del H1 — `h1Bold` es la mitad de una frase partida
   * ("que trae clientes.") y como último escalón de un breadcrumb no
   * dice nada.
   */
  shortName: string
  seoTitle: string
  metaDescription: string
  keywords: string[]
  eyebrow: string
  /** H1 partido en dos: la primera mitad va liviana, la segunda en extrabold. */
  h1Light: string
  h1Bold: string
  subhead: string
  /** Respuesta directa a la query, en un párrafo. Lo que cita una AI Overview. */
  answer: string
  waMessage: string
  /** Lo que hoy le duele a quien busca esto. Tres, concretos. */
  pains: { title: string; body: string }[]
  includes: { title: string; body: string }[]
  /** Comparación honesta contra la alternativa obvia. */
  comparison: {
    heading: string
    intro: string
    headers: string[]
    rows: string[][]
    /** Cuándo la alternativa gana. Sin esto la comparación no es creíble. */
    honesty: string
  }
  work: { site: ShowcaseSite; proof: string }[]
  process: { step: string; title: string; body: string; meta: string }[]
  fitNo: string[]
  faq: { q: string; a: string }[]
  /** Enlaces salientes a las páginas hermanas — enlazado interno con contexto. */
  related: { href: string; label: string; blurb: string }[]
}

const TIENDA_PRICE = planPrice('web_premium')
const LANDING_PRICE = planPrice('web_basic')
const INTERACTIVA_PRICE = planPrice('web_interactive')
const TIENDA_DIAS = plazoPlan('web_premium')
const LANDING_DIAS = plazoPlan('web_basic')

export const TIENDA_ONLINE: ProductLanding = {
  slug: 'tienda-online',
  path: ROUTES.tiendaOnline,
  planId: 'web_premium',
  price: TIENDA_PRICE,
  shortName: 'Tienda online',
  seoTitle: `Tienda online a medida en Argentina desde ${arsInline(TIENDA_PRICE)}`,
  metaDescription: `Tienda online a medida desde ${arsInline(TIENDA_PRICE)}: catálogo, checkout con MercadoPago y panel propio. Sin abono mensual ni comisión por venta. Online en ${TIENDA_DIAS} días hábiles.`,
  keywords: [
    'tienda online argentina',
    'crear tienda online',
    'desarrollo ecommerce argentina',
    'tienda online a medida',
    'ecommerce argentina',
    'comercio electronico argentina',
    'precio tienda online argentina',
    'tienda virtual argentina',
    'checkout mercadopago',
    'alternativa a tiendanube',
  ],
  eyebrow: '/ E-commerce a medida',
  h1Light: 'Tu tienda online,',
  h1Bold: 'sin comisión por venta.',
  subhead:
    'Catálogo, carrito, checkout con MercadoPago y un panel para manejar todo desde el celular. Tuya, con tu marca, sin abono mensual ni un porcentaje de cada venta yéndose a una plataforma.',
  answer: `Una tienda online a medida en Argentina arranca en ${arsInline(TIENDA_PRICE)} ARS, con precio cerrado por escrito y online en ${TIENDA_DIAS} días hábiles desde que tengo tu catálogo. Incluye catálogo con filtros y búsqueda, carrito, checkout con MercadoPago, cálculo de envíos, «Mis pedidos» para que tus clientes vean sus compras con un código, sin crear cuenta, y un panel propio para cargar productos, controlar stock y ver pedidos. Se paga una vez: no hay abono mensual ni comisión por venta, así que el margen de cada venta queda entero en tu cuenta.`,
  waMessage: 'Hola Manuel, quiero una tienda online. ¿Cómo arrancamos?',
  pains: [
    {
      title: 'Vendés por Instagram y se te va el día en el DM',
      body: 'Cada venta son quince mensajes: si hay talle, cuánto sale el envío, pasame el alias, ya te transferí, ¿te llegó? Eso no escala. Una tienda contesta esas quince preguntas sola, a las tres de la mañana y a cinco personas a la vez.',
    },
    {
      title: 'La plataforma se queda con tu margen',
      body: 'Un marketplace te cobra un porcentaje de cada venta. Una plataforma con abono te cobra todos los meses aunque el mes venga flojo, y sube el plan cuando crecés. Con una tienda propia pagás una vez el desarrollo, y el hosting va incluido.',
    },
    {
      title: 'Tu tienda se parece a las otras mil',
      body: 'Las plantillas son las mismas para todos: mismo layout, mismo checkout, mismo aire. Cuando tu producto es el diferencial, que la tienda se vea igual que la del competidor de al lado te está costando plata.',
    },
  ],
  includes: [
    {
      title: 'Catálogo que se puede recorrer',
      body: 'Categorías, filtros, buscador y fichas de producto con varias fotos, variantes de talle o color y stock por variante. Cargás todo desde el panel, sin tocar una línea de código.',
    },
    {
      title: 'Checkout con MercadoPago',
      body: 'Carrito, checkout y cobro con MercadoPago (tarjeta, débito, transferencia y cuotas). La plata entra directo a tu cuenta de MercadoPago, no a la mía.',
    },
    {
      title: 'Envíos calculados en el carrito',
      body: 'El cliente ve el costo de envío antes de pagar, no después por WhatsApp. Retiro en local, envío por zona o integración con el correo que uses.',
    },
    {
      title: 'Panel de gestión propio',
      body: 'Pedidos, stock, productos y clientes en un solo lugar, pensado para usarlo desde el celular. Cuando entra una venta te llega la notificación y el pedido ya está cargado.',
    },
    {
      title: 'Mis pedidos, sin crear cuenta',
      body: 'Tus compradores ven sus compras entrando con un código que les llega por mail o WhatsApp. Sin contraseñas que olvidar ni formularios de registro en el medio de la compra.',
    },
    {
      title: 'SEO técnico de e-commerce',
      body: 'Datos estructurados de producto (precio y disponibilidad en el resultado de Google), sitemap que se actualiza solo con cada producto nuevo y velocidad medida en Core Web Vitals.',
    },
  ],
  comparison: {
    heading: '¿Tienda a medida o plataforma con abono?',
    intro:
      'La respuesta honesta depende de cuánto factures. No de cuál me conviene venderte.',
    headers: ['', 'Plataforma con abono', 'Tienda a medida'],
    rows: [
      ['Costo inicial', 'Casi cero', `${arsInline(TIENDA_PRICE)}, una vez`],
      ['Costo mensual', 'Abono fijo, sube con el plan', 'Ninguno: hosting incluido'],
      ['Comisión por venta', 'Según plan y medio de pago', 'Ninguna de mi lado'],
      ['Diseño', 'Plantilla, compartida con miles', 'A medida, solo tuyo'],
      ['Funciones raras del rubro', 'Lo que tenga el plugin', 'Se programa'],
      ['Si dejás de pagar', 'La tienda se cae', 'Sigue online'],
      ['Dueño del código', 'La plataforma', 'Vos, al terminar de pagar'],
    ],
    honesty:
      'Si recién arrancás y todavía no sabés si el producto vende, una plataforma con abono es la decisión correcta: validás rápido y barato. La tienda a medida empieza a convenir cuando la comisión y el abono anual ya se acercan al costo del desarrollo, o cuando necesitás algo que la plataforma no hace. Si no estás seguro de en qué punto estás, decímelo y te lo digo derecho. Y si algún día te vas, te llevás el diseño y todos tus datos, pero no las funciones de tienda (carrito, cobros y panel), que corren en el sistema central de APEX.',
  },
  work: [
    {
      site: site('moda'),
      proof: 'Tienda completa: catálogo con variantes, carrito, checkout y cálculo de envíos, abierta para que la recorras.',
    },
    {
      site: site('poncho-spanish'),
      proof: 'Venta de cursos con pago por PayPal y área privada de alumno — mismo motor, producto digital.',
    },
    {
      site: site('taller-marcelo'),
      proof: 'Panel interno a medida: la prueba de que el back-office no es una plantilla.',
    },
  ],
  process: [
    {
      step: '01',
      title: 'Charlamos 15 minutos',
      body: 'Qué vendés, cuántos productos, si hay variantes, cómo cobrás y cómo despachás hoy. De ahí sale el alcance real.',
      meta: 'Hoy mismo',
    },
    {
      step: '02',
      title: 'Boceto gratis de la tienda',
      body: 'Ves tu home y una ficha de producto con tus fotos adentro, antes de pagar nada. Si no te gusta, ahí termina.',
      meta: '24 a 48 h',
    },
    {
      step: '03',
      title: 'Desarrollo y carga',
      body: 'Armo la tienda, conecto MercadoPago y cargamos el catálogo. Vas viendo el avance en un link real, no en capturas.',
      meta: `${TIENDA_DIAS} días hábiles`,
    },
    {
      step: '04',
      title: 'Primera venta y soporte',
      body: 'Salimos al aire con los pagos probados de punta a punta. Durante 60 días, los cambios que pidas no tienen límite.',
      meta: '+60 días',
    },
  ],
  fitNo: [
    'Si todavía no vendiste una unidad. Validá primero por Instagram o con una plataforma barata; la tienda a medida es para cuando ya sabés que el producto se mueve.',
    `Si necesitás publicar mañana. El boceto tarda 48 h y la tienda, ${TIENDA_DIAS} días hábiles desde que tengo tu catálogo.`,
    'Si necesitás que te produzcan las fotos y las descripciones de cada producto. La tienda la diseño y la programo; el contenido lo aportás vos.',
  ],
  faq: [
    {
      q: '¿Cuánto cuesta una tienda online en Argentina?',
      a: `Una tienda online a medida arranca en ${arsInline(TIENDA_PRICE)} ARS, con el precio cerrado por escrito antes de empezar y en 3 cuotas sin interés. Ese número incluye el diseño, el desarrollo, el checkout con MercadoPago, el panel de gestión, el hosting incluido y 60 días de cambios sin límite. No hay costos ocultos ni "extras" que aparecen a mitad del proyecto.`,
    },
    {
      q: '¿Me cobrás comisión por cada venta?',
      a: 'No. Vos pagás el desarrollo una vez y la tienda es tuya. Las únicas comisiones que vas a ver son las de la pasarela de pago que elijas (MercadoPago cobra su porcentaje, como se lo cobra a cualquiera), y esas van directo entre vos y ellos.',
    },
    {
      q: '¿Puedo cargar y editar los productos yo?',
      a: 'Sí, es el punto del panel. Cargás productos, fotos, precios, variantes y stock desde el celular o la computadora, sin pedirme nada. Yo entro solo si querés una función nueva.',
    },
    {
      q: '¿Conviene más que Tiendanube o Shopify?',
      a: 'Depende de tu facturación. Si estás arrancando, una plataforma con abono te sale más barata y te deja validar rápido. La tienda a medida conviene cuando el abono más la comisión anual ya se parecen al costo del desarrollo, cuando el diseño de plantilla te está frenando, o cuando necesitás algo que la plataforma directamente no hace. Lo desarrollé en detalle en la comparativa del blog.',
    },
    {
      q: '¿Qué medios de pago acepta?',
      a: 'MercadoPago cubre tarjeta de crédito y débito, transferencia, dinero en cuenta y cuotas — es lo estándar para vender en Argentina, y la plata entra directo a tu cuenta. Y si querés dejar transferencia directa o efectivo contra entrega, también.',
    },
    {
      q: '¿Cuánto tarda en estar online?',
      a: `${TIENDA_DIAS} días hábiles desde que me pasás el catálogo y conectás tu MercadoPago. El plazo queda por escrito en tu resumen antes de pagar: si no lo cumplo, podés cancelar y te devuelvo lo que pagaste.`,
    },
    {
      q: '¿Y el stock? ¿Se actualiza solo?',
      a: 'Sí. El stock baja con cada venta y el producto se marca como agotado cuando llega a cero, con variantes independientes: podés quedarte sin talle M y seguir vendiendo el L. Si ya usás un sistema de gestión, se puede conectar.',
    },
  ],
  related: [
    {
      href: ROUTES.cuantoCuesta,
      label: 'Cuánto cuesta una página web',
      blurb: 'Los tres niveles de sitio, qué incluye cada uno y qué hace subir el número.',
    },
    {
      href: '/blog/tiendanube-vs-shopify-vs-ecommerce-custom-argentina',
      label: 'Tiendanube vs Shopify vs a medida',
      blurb: 'La comparativa completa, con el punto de facturación en el que se da vuelta la cuenta.',
    },
    {
      href: '/blog/integrar-mercadopago-afip-web-argentina',
      label: 'Integrar MercadoPago y AFIP',
      blurb: 'Cómo cobrar y facturar dentro del sitio, con los costos reales de cada parte.',
    },
  ],
}

export const LANDING_PAGE: ProductLanding = {
  slug: 'landing-page',
  path: ROUTES.landingPage,
  planId: 'web_basic',
  price: LANDING_PRICE,
  shortName: 'Landing page',
  seoTitle: `Landing page profesional en Argentina desde ${arsInline(LANDING_PRICE)}`,
  metaDescription: `Landing page a medida desde ${arsInline(LANDING_PRICE)}: diseño propio, textos incluidos y carga en menos de 2 segundos. Boceto gratis antes de pagar y online en ${LANDING_DIAS} días hábiles.`,
  keywords: [
    'landing page argentina',
    'cuanto sale una landing page',
    'diseño de landing page',
    'landing page profesional',
    'crear landing page',
    'landing page que convierte',
    'pagina de aterrizaje',
    'landing page para campañas',
    'precio landing page argentina',
  ],
  eyebrow: '/ Página que convierte',
  h1Light: 'Una landing page',
  h1Bold: 'que trae clientes.',
  subhead:
    `Una sola página, diseñada a medida y escrita para que el visitante haga una cosa: escribirte. Carga en menos de dos segundos, se ve impecable en el celular y sale en ${LANDING_DIAS} días hábiles.`,
  answer: `Una landing page profesional en Argentina cuesta ${arsInline(LANDING_PRICE)} ARS, con precio cerrado y online en ${LANDING_DIAS} días hábiles desde que tengo tus fotos y los datos del negocio. Incluye diseño 100% a medida (sin plantillas), redacción orientada a conversión, botón de WhatsApp y formulario que abre el chat con la consulta ya escrita, SEO técnico, medición con Google Analytics, dominio configurado, hosting incluido y 60 días de cambios sin límite. Antes de pagar nada se ve un boceto gratis del diseño, en 24 a 48 horas.`,
  waMessage: 'Hola Manuel, quiero una landing page. ¿Cómo arrancamos?',
  pains: [
    {
      title: 'Mandás gente a tu Instagram y se pierde',
      body: 'El perfil no explica qué hacés, no muestra precios y el link de la bio lleva a un feed. El que llegó con ganas de comprarte se va sin escribirte, y vos nunca te enteraste de que estuvo.',
    },
    {
      title: 'Pagás publicidad para que el clic caiga en cualquier lado',
      body: 'Si el anuncio promete una cosa y la página habla de otra, Google te cobra más caro cada clic y la gente rebota. Una landing hecha para ese anuncio baja el costo por consulta antes de tocar la campaña.',
    },
    {
      title: 'Tenés una web, pero nadie llega al botón',
      body: 'Menú con ocho secciones, tres carruseles y el contacto al final del todo. Cuando el visitante tiene que decidir dónde hacer clic, la respuesta más común es cerrar la pestaña.',
    },
  ],
  includes: [
    {
      title: 'Diseño a medida, no una plantilla',
      body: 'Arranca en una hoja en blanco: tu tipografía, tu paleta, tus secciones. Nada de comprar un tema y cambiarle los colores.',
    },
    {
      title: 'Los textos los escribo yo',
      body: 'No te mando un documento para que "completes el contenido". Charlamos, escribo la página y vos corregís lo que no suene a vos.',
    },
    {
      title: 'WhatsApp y formulario de consulta',
      body: 'Botón de WhatsApp con el mensaje ya escrito y un formulario que abre la charla con la consulta completa. Te llega a tu WhatsApp, no a una bandeja que nadie mira.',
    },
    {
      title: 'Menos de 2 segundos en el celular',
      body: 'Optimizada para Core Web Vitals, que es la métrica que Google usa para rankear y la que decide si el visitante espera o se va.',
    },
    {
      title: 'Medición desde el primer día',
      body: 'Google Analytics y el evento de conversión configurados. Vas a saber cuánta gente entró y cuántos escribieron, no adivinarlo.',
    },
    {
      title: 'Hosting incluido y 60 días de cambios',
      body: 'Dominio y hosting configurados, sin abono mensual. Durante 60 días desde que la página sale online, pedís cambios sin límite.',
    },
  ],
  comparison: {
    heading: '¿Landing a medida, plantilla o "un conocido"?',
    intro: 'Las tres opciones existen y las tres sirven para algo distinto.',
    headers: ['', 'Plantilla (Wix, etc.)', 'Landing a medida'],
    rows: [
      ['Costo inicial', 'Bajo', `${arsInline(LANDING_PRICE)}, una vez`],
      ['Costo mensual', 'Suscripción, para siempre', 'Ninguno: hosting incluido'],
      ['Diseño', 'El mismo de otros miles', 'Solo tuyo'],
      ['Velocidad', 'Pesada por lo que no usás', 'Menos de 2 s en móvil'],
      ['Textos', 'Los escribís vos', 'Los escribo yo'],
      ['Quién la hace', 'Vos, en tus ratos libres', `Yo, en ${LANDING_DIAS} días hábiles`],
      ['Si dejás de pagar', 'Se cae', 'Sigue online'],
    ],
    honesty:
      'Si necesitás algo online esta semana y el presupuesto es cero, una plantilla es la decisión correcta y te la recomiendo sin problema. La landing a medida conviene cuando ya estás invirtiendo en publicidad —ahí cada punto de conversión se paga solo— o cuando el diseño es parte de lo que vendés.',
  },
  work: [
    {
      site: site('handy'),
      proof: 'Servicios explicados en una sola pantalla, con cada sección empujando a la consulta.',
    },
    {
      site: site('luma-invita'),
      proof: 'Seis estilos distintos con motion propio: cuando el diseño ES el producto.',
    },
    {
      site: site('assistify'),
      proof: 'Planes a la vista y el contacto cerrando por WhatsApp, sin formularios de por medio.',
    },
  ],
  process: [
    {
      step: '01',
      title: 'Charlamos 15 minutos',
      body: 'A quién le vendés, qué te piden siempre y qué querés que haga el que entra. De ahí sale la estructura de la página.',
      meta: 'Hoy mismo',
    },
    {
      step: '02',
      title: 'Boceto gratis',
      body: 'Ves el diseño de tu página con tus textos adentro antes de pagar un peso. Si no te convence, no seguimos.',
      meta: '24 a 48 h',
    },
    {
      step: '03',
      title: 'Desarrollo y ajustes',
      body: 'La armo entera y la ajustamos sobre la pantalla real, no sobre una descripción en un documento.',
      meta: `${LANDING_DIAS} días hábiles`,
    },
    {
      step: '04',
      title: 'Online y midiendo',
      body: 'Dominio, hosting y medición configurados. Durante 60 días, los cambios no tienen límite.',
      meta: '+60 días',
    },
  ],
  fitNo: [
    'Si necesitás un catálogo con carrito y pagos. Eso es una tienda online, no una landing.',
    'Si buscás lo más barato del mercado. Hay quien te arma una página por monedas; no compito ahí.',
    'Si querés veinte secciones. Una landing gana justamente por tener una sola cosa para hacer.',
  ],
  faq: [
    {
      q: '¿Cuánto sale una landing page en Argentina?',
      a: `${arsInline(LANDING_PRICE)} ARS, precio cerrado por escrito y en 3 cuotas sin interés. Incluye diseño a medida, redacción, desarrollo, SEO técnico, medición, dominio configurado, hosting incluido y 60 días de cambios sin límite. No hay extras que aparecen después.`,
    },
    {
      q: '¿Qué diferencia hay entre una landing page y una página web?',
      a: `Una landing page es una sola página con un objetivo único: que el visitante haga una acción concreta, casi siempre escribirte. Una web tiene varias secciones y sirve para que te conozcan de a poco. Si vas a mandar tráfico de publicidad o de redes, la landing convierte más porque no ofrece a dónde distraerse. Si tu negocio necesita reservas, cotizador o panel, ahí ya estamos hablando de una Web Interactiva (${arsInline(INTERACTIVA_PRICE)}).`,
    },
    {
      q: '¿En cuánto tiempo la tenés lista?',
      a: `El boceto lo ves en 24 a 48 horas. La página completa, en ${LANDING_DIAS} días hábiles desde que tengo tus fotos y los datos del negocio. El plazo queda por escrito en tu resumen, y si no lo cumplo, podés cancelar y te devuelvo lo que pagaste.`,
    },
    {
      q: '¿Los textos los tengo que escribir yo?',
      a: 'No. Charlamos media hora sobre tu negocio y los escribo yo. Vos los leés y corregís lo que no suene a vos, que es mucho más fácil que arrancar de una hoja en blanco.',
    },
    {
      q: '¿Sirve para campañas de Google Ads o Meta?',
      a: 'Sí, es su mejor uso. Una landing específica para el anuncio mejora el Quality Score en Google Ads —o sea, pagás menos por clic— y sube la tasa de conversión porque lo que promete el anuncio es exactamente lo que aparece en pantalla. Si vas a invertir en publicidad, esto se paga solo.',
    },
    {
      q: '¿Puedo cambiarle cosas después?',
      a: `Sí. Durante 60 días desde que sale online, pedís cambios sin límite: textos, precios, fotos. Después, si es algo puntual, se cotiza aparte; si querés cambiarla seguido, hay mantenimiento opcional desde ${arsInline(MAINTENANCE_PLANS[0].price)} por mes, con baja cuando quieras.`,
    },
    {
      q: '¿Y si más adelante necesito más páginas?',
      a: 'Se suman. La landing se escribe con la misma base que un sitio completo, así que crecer es agregar secciones, no rehacer todo de cero.',
    },
  ],
  related: [
    {
      href: ROUTES.cuantoCuesta,
      label: 'Cuánto cuesta una página web',
      blurb: 'Los tres niveles, qué incluye cada uno y qué hace subir el precio.',
    },
    {
      href: ROUTES.disenoWeb,
      label: 'Diseño y desarrollo web',
      blurb: 'Cómo trabajo, quién hace el trabajo y para quién no es.',
    },
    {
      href: '/blog/nextjs-vs-wordpress-pyme-argentina',
      label: 'Next.js vs WordPress vs Wix',
      blurb: 'Qué gana y qué pierde tu PyME con cada opción, sin marketing.',
    },
  ],
}

export const PRODUCT_LANDINGS = [TIENDA_ONLINE, LANDING_PAGE] as const
