/**
 * FAQ — orden de objeciones del DESIGN_BRIEF §1.6:
 * precio → tiempo → confianza → proceso → ROI → garantía → resto (logística).
 * Alimenta el accordion (static-sections.tsx) y el JSON-LD FAQPage en page.tsx.
 *
 * Vive en un módulo sin 'use client' porque page.tsx (Server Component) lo
 * consume para el schema; static-sections.tsx es client (usa framer-motion).
 */
export const SERVICIOS_FAQ_ITEMS = [
  {
    q: '¿Cuánto cuesta una página web en Argentina?',
    a: 'Acá no hay "a cotizar": los precios están publicados. Landing $300.000, Web Interactiva $600.000 y Tienda Online $900.000 (ARS, precio fijo pactado por escrito antes de arrancar). Todos se pagan en 3 cuotas sin interés, y antes de la primera cuota ya viste un boceto gratis de tu proyecto. Las apps móviles funcionan distinto: con un fee mensual que incluye desarrollo activo, soporte y publicación en las tiendas — los valores están en la pestaña «Aplicación Móvil» de esta misma página.',
  },
  {
    q: '¿Cuánto tarda en estar lista mi página?',
    a: '15 días desde que aprobás el boceto, para cualquier plan web. La fecha queda pactada por escrito antes de empezar, y el boceto te lo entrego gratis en 24-48 h. Si no cumplo la fecha acordada, te devuelvo el depósito.',
  },
  {
    q: '¿Cómo sé que no me vas a dejar a mitad del proyecto?',
    a: 'Tres cosas concretas: ves un boceto gratis antes de pagar un peso, pagás en 3 cuotas atadas al avance (nunca todo por adelantado) y el código vive en un repositorio a tu nombre desde el primer día — pase lo que pase, lo hecho es tuyo. Además podés ver mis productos funcionando en producción (BotLode, Botrive, Assistify) y sitios de clientes reales antes de decidir. Hablás conmigo, no con un vendedor.',
  },
  {
    q: '¿Cómo es el proceso de trabajo?',
    a: 'Cuatro pasos: (1) me escribís por WhatsApp y charlamos 15 minutos sobre tu negocio; (2) en 24-48 h te mando un boceto gratis de tu página; (3) si te gusta, pagás la primera de 3 cuotas y en 15 días tenés tu web online, viendo avances en el camino; (4) lanzamos y tenés 3 meses de soporte incluido. Todo por WhatsApp o Zoom, desde cualquier punto del país.',
  },
  {
    q: '¿Qué gano con una web a medida en vez de Wix o una plantilla?',
    a: 'Números concretos: una web a medida carga en menos de 2 segundos (Google posiciona mejor los sitios rápidos), no pagás mensualidades obligatorias (Wix y Tiendanube cobran entre USD 16 y 250 por mes, para siempre), no pagás comisiones por venta y el código es tuyo — sin lock-in. Y está diseñada para convertir: botón de WhatsApp, SEO y velocidad al servicio de generar consultas. Si tu caso es muy simple, te lo digo honestamente: a veces Wix alcanza (mirá la tabla comparativa de esta página).',
  },
  {
    q: '¿Qué pasa si no me gusta el resultado?',
    a: 'El boceto es gratis y sin compromiso: si no te convence, no pagás nada y quedamos como amigos. Una vez en desarrollo, ves avances y los aprobás antes de cada cuota. Y si no llego a la fecha de entrega pactada por escrito, te devuelvo el depósito completo. El riesgo lo tomo yo, no vos.',
  },
  {
    q: '¿Cuáles son las formas de pago?',
    a: '3 cuotas sin interés, cada una un tercio del total: la primera al aprobar el boceto (activa el calendario de entrega), la segunda durante el desarrollo y la última contra entrega. Acepto transferencia bancaria y MercadoPago.',
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
    a: '100% tuyo desde el día uno. Vive en un repositorio (GitHub) con tu cuenta como propietaria. Si mañana querés seguir con otro desarrollador, te llevás todo sin pedir permiso ni perder un archivo. Cero lock-in.',
  },
  {
    q: '¿Pueden integrar MercadoPago, AFIP o WhatsApp Business?',
    a: 'Sí, los tres. MercadoPago para cobrar online (incluido en los planes que lo necesitan), WhatsApp para que cada consulta te llegue directo al teléfono, y facturación electrónica AFIP/ARCA automática como addon: suma entre $200.000 y $400.000 según complejidad, y emite factura A o B con CAE sin que cargues nada a mano.',
  },
  {
    q: '¿Qué pasa después de la entrega?',
    a: 'Tenés 3 meses de soporte incluido: bugs, ajustes menores y dudas de uso, sin costo. Después podés seguir por tu cuenta (la web queda andando sola) o contratar mantenimiento mensual desde $50.000, que cubre actualizaciones de seguridad, monitoreo de errores y cambios menores.',
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
