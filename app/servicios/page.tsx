import type { Metadata } from 'next'
import { ServiciosContent } from './content'

export const metadata: Metadata = {
  title: 'Desarrollo de software Argentina | Precios | Manuel Navarro',
  description:
    'Desarrollo de software a medida para empresas y emprendedores. Precio fijo, entrega garantizada. Presupuestos desde ARS 300k.',
  keywords: [
    'desarrollo de software argentina',
    'software a medida',
    'desarrollador de software',
    'desarrollador full stack',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto tarda hacer una página web?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Entre 2 y 4 semanas para una landing page, 15 días para una web completa. Fecha de entrega garantizada desde el día 1.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta una página web en Argentina?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nuestros proyectos arrancan desde ARS 300.000 con precio fijo. Sin sorpresas al final.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si no me gusta el resultado?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Trabajamos con revisiones incluidas. Si al finalizar no estás conforme, devolvemos el depósito sin discusiones.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo hablar con alguien antes de contratar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Tenemos una consulta inicial gratuita de 15 minutos, sin compromiso, por WhatsApp.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Trabajan solo en Buenos Aires?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, trabajamos con clientes de toda Argentina de forma 100% remota.',
      },
    },
  ],
}

export default function ServiciosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServiciosContent />
    </>
  )
}
