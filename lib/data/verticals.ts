/**
 * Landings verticales para nichos profesionales argentinos.
 *
 * Why: programmatic SEO para captar búsquedas específicas tipo "web para médicos
 * argentina", "página web para abogados", "sitio para contadores". Cada vertical
 * tiene su propio dolor, palabras y prueba social — landing dedicada convierte
 * mucho mejor que landing genérica.
 *
 * Pattern: data en este archivo, una sola page dinámica /[vertical]/page.tsx
 * que genera todas las landings desde aquí.
 */

export interface Vertical {
  slug: string
  /** Profesión en singular ("médico", "abogado", "contador"). */
  noun: string
  /** Profesión en plural. */
  nounPlural: string
  /** Tu profesión como header: "Médicos · Profesionales de la salud" */
  category: string
  /** Headline H1 — pregunta o statement potente. */
  headline: { soft: string; strong: string }
  /** Subheadline — 1-2 frases con beneficios clave. */
  subheadline: string
  /** Bullets con los dolores específicos del vertical. */
  pains: string[]
  /** Features específicas con título + descripción. */
  features: { title: string; body: string }[]
  /** FAQ específica del vertical — crítico para AEO. */
  faq: { q: string; a: string }[]
  /** Rango de precio para esta vertical. */
  priceFrom: number
  priceTo: number
  /** Plazo de entrega típico. */
  timeline: string
  /** Keywords para SEO + metadata. */
  keywords: string[]
  /** Integraciones que destacar específicamente. */
  integrations: string[]
}

export const VERTICALS: Vertical[] = [
  {
    slug: 'web-para-medicos',
    noun: 'médico',
    nounPlural: 'médicos',
    category: 'Profesionales de la salud',
    headline: {
      soft: 'Una web que tus pacientes',
      strong: 'no tienen que llamarte.',
    },
    subheadline:
      'Sitio web premium para médicos en Argentina con turnos online, historia clínica integrada, recordatorios por WhatsApp y facturación AFIP automática.',
    pains: [
      'Tu secretaria pierde 3 horas/día tomando turnos por teléfono',
      'Los pacientes faltan al turno porque no recordaste avisarles',
      'No tenés forma de mostrar tu especialidad y trayectoria online',
      'Cobrás efectivo o transferencia porque no sabés cómo aceptar tarjeta',
      'Tu Instagram no se traduce en pacientes nuevos',
    ],
    features: [
      {
        title: 'Turnos online 24/7',
        body: 'Tu paciente reserva desde el celular, ve tu agenda real, recibe confirmación automática y un recordatorio 24hs antes por WhatsApp. Vos sólo aprobás los turnos que quieras revisar.',
      },
      {
        title: 'Pagos integrados',
        body: 'Aceptás MercadoPago, tarjeta o efectivo. Si cobrás seña, el sistema la retiene y la libera cuando confirmás el turno. Factura electrónica AFIP automática al cliente.',
      },
      {
        title: 'Diseño profesional',
        body: 'No es una plantilla genérica de doctor. Diseño a medida que comunica tu seriedad y especialización, con foto profesional, biografía y consultorio.',
      },
      {
        title: 'Cumple normativa argentina',
        body: 'Política de privacidad acorde a Ley 25.326 (datos personales), términos de servicio para profesionales de la salud, y nota legal sobre que no reemplaza consulta médica.',
      },
      {
        title: 'SEO local',
        body: 'Optimizado para que aparezcas cuando alguien busca "cardiólogo Palermo" o "obstetra zona norte". Google Business Profile configurado y posicionado.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta hacer una página web para médicos en Argentina?',
        a: 'Un sitio web profesional para médicos con turnos online integrados cuesta entre ARS 600.000 y 1.200.000, con entrega en 15-25 días. Incluye diseño a medida, sistema de reservas, pagos online y configuración SEO local.',
      },
      {
        q: '¿El sistema de turnos puede integrarse con mi historia clínica?',
        a: 'Sí, podemos integrar con sistemas de HCE existentes vía API (Klinic, Doctoralia API, soluciones custom). También podemos crear un panel propio con campos clínicos específicos para tu especialidad.',
      },
      {
        q: '¿Cumple con la ley de datos personales?',
        a: 'Sí. Incluimos políticas de privacidad acordes a la Ley 25.326, formularios de consentimiento, y almacenamiento seguro de datos sensibles. El hosting se elige en infraestructura compatible.',
      },
      {
        q: '¿Mis pacientes pueden pagar por tarjeta?',
        a: 'Sí. Integramos MercadoPago para tarjeta de crédito/débito, transferencia, y pago en efectivo en consultorio. La factura electrónica se emite automáticamente.',
      },
      {
        q: '¿Puedo manejar varios profesionales o consultorios desde el mismo sitio?',
        a: 'Sí. Si trabajás en grupo o tenés un equipo, el sistema soporta múltiples agendas, especialidades y ubicaciones desde el mismo panel.',
      },
    ],
    priceFrom: 600_000,
    priceTo: 1_200_000,
    timeline: '15-25 días',
    keywords: [
      'web para médicos argentina',
      'página web médico',
      'turnos online médicos',
      'sistema de turnos para consultorio',
      'web para clínicas',
    ],
    integrations: ['MercadoPago', 'AFIP', 'WhatsApp Business', 'Google Calendar'],
  },

  {
    slug: 'web-para-abogados',
    noun: 'abogado',
    nounPlural: 'abogados',
    category: 'Profesionales del derecho',
    headline: {
      soft: 'Tu estudio jurídico',
      strong: 'merece más que un Wix.',
    },
    subheadline:
      'Sitio web premium para abogados y estudios jurídicos en Argentina. Captación de consultas online, agenda de reuniones, y blog para posicionamiento legal.',
    pains: [
      'Tu sitio actual hace décadas que parece de los 2000',
      'No diferenciás tu estudio de los otros 200 abogados de la zona',
      'Los referidos están bajando y no sabés cómo crecer en digital',
      'Cada consulta inicial requiere 30 mensajes por WhatsApp',
      'No tenés tiempo para mantener un blog que te posicione como experto',
    ],
    features: [
      {
        title: 'Captación de consultas calificadas',
        body: 'Formulario de consulta con tipologías legales (laboral, civil, comercial, familia) que califica el caso antes de que vos invertís tiempo. Solo recibís consultas que encajan con lo que hacés.',
      },
      {
        title: 'Agenda de reuniones online',
        body: 'El cliente reserva su consulta online, tu sistema le manda confirmación, recordatorio, y el link de Zoom o Meet. Vos llegás a la reunión con los datos del caso ya pre-armados.',
      },
      {
        title: 'Blog optimizado SEO',
        body: 'Estructura de blog para que escribas (o te ayudemos a escribir) artículos sobre tu especialidad. Cada artículo bien escrito posiciona en Google para keywords legales específicas.',
      },
      {
        title: 'Política de confidencialidad robusta',
        body: 'Términos de servicio adaptados al ejercicio profesional argentino, secreto profesional protegido, y formularios con criptografía adecuada para datos sensibles.',
      },
      {
        title: 'Diferenciación visual',
        body: 'Diseño que comunica tu especialización (corporate vs trial vs familia) sin caer en estética genérica de abogado. Tipografía elegante, paleta sobria, motion sutil.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta una página web para un estudio jurídico?',
        a: 'Una web profesional para abogados con captación de consultas y agenda integrada cuesta entre ARS 600.000 y 1.500.000, según cantidad de socios, áreas de práctica y complejidad. Plazo: 15-30 días.',
      },
      {
        q: '¿Mi estudio puede tener múltiples áreas de práctica diferenciadas?',
        a: 'Sí. Diseñamos secciones separadas para cada área (laboral, civil, penal, etc.) con su propio contenido, casos y formulario de contacto, optimizado para que el cliente encuentre fácil lo que necesita.',
      },
      {
        q: '¿Pueden ayudarme con el contenido del sitio y el blog?',
        a: 'Tenemos partners de redacción legal que pueden colaborar con vos. Vos das los conceptos técnicos, ellos los hacen accesibles para el cliente final. Costo adicional según volumen.',
      },
      {
        q: '¿El sitio cumple con normativas profesionales argentinas?',
        a: 'Sí. Cumplimos con regulaciones de Colegio Público de Abogados (CPACF, CPAU según jurisdicción) en términos de comunicación profesional, advertising y captación.',
      },
      {
        q: '¿Puedo recibir consultas internacionales?',
        a: 'Sí. El sitio puede tener versión en inglés para captar consultas de empresas o expatriados, con campos legales adaptados (corporate, international, real estate).',
      },
    ],
    priceFrom: 600_000,
    priceTo: 1_500_000,
    timeline: '15-30 días',
    keywords: [
      'web para abogados argentina',
      'página web estudio jurídico',
      'sitio para abogados',
      'web abogado laboral',
      'marketing digital abogados',
    ],
    integrations: ['MercadoPago', 'Zoom', 'Calendly', 'WhatsApp Business'],
  },

  {
    slug: 'web-para-contadores',
    noun: 'contador',
    nounPlural: 'contadores',
    category: 'Profesionales contables',
    headline: {
      soft: 'Que tu cliente te encuentre',
      strong: 'antes de tener un problema.',
    },
    subheadline:
      'Sitio web premium para contadores en Argentina con AFIP integrado, calendario fiscal automático, portal de clientes y captación de monotributistas, empresas y autónomos.',
    pains: [
      'El 80% de tus clientes nuevos llega por referencia, no por web',
      'No tenés cómo segmentar entre monotributistas, empresas y autónomos',
      'Los clientes te llaman cada 2 horas para preguntar fechas de vencimiento',
      'Tu Excel personal es el sistema "oficial" del estudio',
      'No tenés tiempo de hacer marketing pero perdés clientes a estudios con mejor presencia online',
    ],
    features: [
      {
        title: 'Captación segmentada',
        body: 'Formularios separados para monotributo, responsable inscripto, sociedades y autónomos. Cada uno con los campos relevantes y precios estimados, así el cliente llega calificado.',
      },
      {
        title: 'Calendario fiscal automatizado',
        body: 'Tus clientes ven próximos vencimientos en su panel personal: IIBB, IVA, ganancias, monotributo, aportes. Avisos automáticos por WhatsApp 7 y 2 días antes.',
      },
      {
        title: 'Portal del cliente',
        body: 'Cada cliente accede a su panel con: documentos compartidos, comprobantes emitidos, balance, estado de cuenta corriente, y mensajes directos con vos. Reduce 70% las consultas por WhatsApp.',
      },
      {
        title: 'Integración AFIP completa',
        body: 'Consulta de constancia de inscripción, padrón ARCA, emisión y validación de comprobantes, descarga de mis comprobantes recibidos — todo desde el panel del cliente, sin que vos tengas que entrar a AFIP.',
      },
      {
        title: 'Diferenciación profesional',
        body: 'Diseño que comunica modernidad sin perder seriedad contable. No es plantilla "contador con gráfico de torta" — es un sitio que te posiciona como contador con tecnología, no como dueño de un Excel.',
      },
    ],
    faq: [
      {
        q: '¿Cuánto cuesta una web con AFIP integrado para un contador?',
        a: 'Un sitio profesional para contador con portal de clientes y AFIP integrado cuesta entre ARS 900.000 y 2.000.000, según número de clientes y servicios. Plazo: 20-35 días.',
      },
      {
        q: '¿Realmente puede integrarse con AFIP / ARCA?',
        a: 'Sí. Conectamos con webservices oficiales de AFIP (WSAA, WSFE, padrón, constancia) y con servicios como TusFacturasAPP o AFIP SDK. El cliente ve sus comprobantes en tiempo real desde el portal.',
      },
      {
        q: '¿Puedo segmentar precios diferentes para monotributistas y empresas?',
        a: 'Sí. El sitio puede tener tarifarios diferenciados visibles (o no, según preferencia) y formularios distintos por categoría. Esto pre-califica al cliente antes de la primera consulta.',
      },
      {
        q: '¿Mis clientes actuales pueden migrar al portal sin perder históricos?',
        a: 'Sí. Si tenés históricos en Excel, papel o sistema actual, los importamos al panel del cliente. La migración inicial es parte del proyecto.',
      },
      {
        q: '¿Cumple con normas de secreto profesional contable?',
        a: 'Sí. El portal está protegido con autenticación robusta, los datos sensibles van encriptados, y los accesos quedan auditados. Cumplimos con Ley 25.326 y normativas FACPCE.',
      },
    ],
    priceFrom: 900_000,
    priceTo: 2_000_000,
    timeline: '20-35 días',
    keywords: [
      'web para contadores argentina',
      'página web contador público',
      'portal de clientes contable',
      'web con AFIP integrado',
      'sistema contable online',
    ],
    integrations: ['AFIP', 'MercadoPago', 'WhatsApp Business', 'Google Drive'],
  },
]

export function getVertical(slug: string): Vertical | undefined {
  return VERTICALS.find((v) => v.slug === slug)
}

export function getVerticalSlugs(): string[] {
  return VERTICALS.map((v) => v.slug)
}
