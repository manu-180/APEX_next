/**
 * FAQ — orden de objeciones del DESIGN_BRIEF §1.6:
 * precio → tiempo → confianza → proceso → ROI → garantía → resto (logística).
 * Alimenta el accordion (static-sections.tsx) y el JSON-LD FAQPage en page.tsx.
 *
 * Vive en un módulo sin 'use client' porque page.tsx (Server Component) lo
 * consume para el schema; static-sections.tsx es client (usa framer-motion).
 */
import { arsTexto, MAINTENANCE_PLANS } from '@/lib/types/services'
import { PLAZO_MAX_DIAS, PLAZO_MIN_DIAS, plazoPlan } from '@/lib/data/plazos'

export const SERVICIOS_FAQ_ITEMS = [
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: 'Acá no hay "a cotizar": los precios están publicados. Landing $300.000, Web Interactiva $600.000 y Tienda Online $900.000 (ARS, precio fijo pactado por escrito antes de arrancar). Todos se pagan en 3 cuotas sin interés, y antes de la primera cuota ya viste un boceto gratis de tu proyecto. Las apps móviles funcionan distinto: con un fee mensual que incluye desarrollo activo, soporte y publicación en las tiendas — los valores están en la pestaña «Aplicación Móvil» de esta misma página.',
  },
  {
    q: '¿Cuánto tarda en estar lista mi página?',
    a: `Depende del plan: ${plazoPlan('web_basic')} días hábiles una Landing Page, ${plazoPlan('web_interactive')} una Web Interactiva y ${plazoPlan('web_premium')} una Tienda Online, contados desde que tengo lo que te toca a vos (tu contenido y, si hace falta, tu dominio). El plazo queda por escrito en tu resumen antes de pagar, y si no lo cumplo, podés cancelar y te devuelvo lo que pagaste. El boceto lo ves antes, gratis, en 24-48 h.`,
  },
  {
    q: '¿Cómo sé que no me vas a dejar a mitad del proyecto?',
    a: 'Tres cosas concretas: ves un boceto gratis antes de pagar un peso, podés pagar en 3 cuotas sin interés (al contratar, a los 30 y a los 60 días) en vez de todo por adelantado, y el plazo queda por escrito: si no lo cumplo, podés cancelar y te devuelvo lo que pagaste. Además podés ver mis productos funcionando en producción (BotLode, Botrive, Assistify) y sitios de clientes reales antes de decidir. Hablás conmigo, no con un vendedor.',
  },
  {
    q: '¿Cómo es el proceso de trabajo?',
    a: `Cuatro pasos: (1) me escribís por WhatsApp y charlamos 15 minutos sobre tu negocio; (2) en 24-48 h te mando un boceto gratis de tu página; (3) si te gusta, contratás —de una vez o en 3 cuotas sin interés— y, desde que tengo tu contenido, tu web sale en ${PLAZO_MIN_DIAS} a ${PLAZO_MAX_DIAS} días hábiles según el plan, con avances a la vista; (4) lanzamos y tenés 60 días de cambios sin límite. Todo por WhatsApp o Zoom, desde cualquier punto del país.`,
  },
  {
    q: '¿Qué gano con una web a medida en vez de Wix o una plantilla?',
    a: 'Números concretos: una web a medida carga en menos de 2 segundos (Google posiciona mejor los sitios rápidos), no pagás mensualidades obligatorias (Wix y Tiendanube cobran entre USD 16 y 250 por mes, para siempre), no pagás comisiones por venta y, cuando terminás de pagar, el código es tuyo: si te vas, te lo llevás sin costo. Y está diseñada para convertir: botón de WhatsApp, SEO y velocidad al servicio de generar consultas. Si tu caso es muy simple, te lo digo honestamente: a veces Wix alcanza (mirá la tabla comparativa de esta página).',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'El boceto es gratis y sin compromiso: si no te convence, no pagás nada y quedamos como amigos. Una vez que contratás, ves los avances y pedís cambios sin límite hasta 60 días después de publicar. Si no cumplo lo que acordamos por escrito, podés cancelar y te devuelvo lo que pagaste. Y además tenés 10 días corridos para arrepentirte, sin dar motivos.',
  },
  {
    q: '¿Cuáles son las formas de pago?',
    a: 'De una vez o en 3 cuotas sin interés: la primera al contratar, la segunda a los 30 días y la tercera a los 60. En cuotas pagás lo mismo que de contado. Acepto MercadoPago y transferencia bancaria.',
  },
  {
    q: '¿La página se va a ver bien en el celular?',
    a: 'Sí. Cada página se desarrolla con diseño responsivo a medida: se adapta automáticamente a cualquier tamaño de pantalla, desde el celular hasta la computadora, sin perder proporciones ni legibilidad. Antes de entregar, la reviso en distintos dispositivos para asegurarnos de que se vea impecable en todos.',
  },
  {
    q: '¿El hosting y el dominio están incluidos?',
    a: 'El hosting está incluido desde el día uno. El dominio va por tu cuenta — se registra a tu nombre y suele costar alrededor de USD 10 por año. Si nunca lo hiciste, no te preocupés: te guío en el proceso o lo resolvemos juntos en menos de 10 minutos.',
  },
  {
    q: '¿De quién es el código cuando terminamos?',
    a: 'Tuyo, cuando terminás de pagar: el diseño, los textos y el código de tu página. Mientras te la alojo, vive en la infraestructura de APEX, así no tenés que crear ni pagar cuentas técnicas. Si te vas, te lo llevás sin costo: el repositorio transferido a tu GitHub o en un .zip, con tus datos en CSV o JSON. Lo único que no se muda son las funciones del sistema central (tienda, reservas, cursos y panel), porque las comparten todos los clientes, pero tus datos te los llevás siempre.',
  },
  {
    q: '¿Pueden integrar MercadoPago, facturación o WhatsApp Business?',
    a: 'Sí. MercadoPago para cobrar online (incluido en los planes que lo necesitan) y WhatsApp para que cada consulta te llegue directo al teléfono. Si tu negocio necesita facturación electrónica u otra integración puntual, lo evaluamos en el boceto: te digo si aplica y cuánto suma antes de que arranquemos.',
  },
  {
    q: '¿Qué pasa después de la entrega?',
    a: `Durante 60 días desde que tu página sale online, pedís cambios sin límite. Después sigue online igual, con el hosting incluido y sin abono obligatorio. Si querés seguir pidiendo cambios, hay mantenimiento opcional desde ${arsTexto(MAINTENANCE_PLANS[0].price)} por mes (actualizaciones de seguridad, monitoreo y rondas de cambios), con débito automático y baja cuando quieras. Y si algo que hicimos no funciona como acordamos, lo arreglamos sin costo, tengas plan o no.`,
  },
  {
    q: '¿Trabajás solo en Buenos Aires?',
    a: 'No — trabajo con clientes de toda Argentina y del exterior, 100% remoto. Reuniones por Zoom o directamente por WhatsApp. La distancia no cambia ni el precio ni el plazo.',
  },
  {
    q: '¿Hacés apps móviles o solo webs?',
    a: 'Las dos cosas: webs con Next.js y apps iOS + Android con Flutter (una sola base de código para las dos tiendas). Las apps funcionan con fee mensual porque son un producto vivo: incluye mejoras continuas, soporte y publicación en App Store y Google Play.',
  },
] as const
