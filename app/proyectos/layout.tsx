import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proyectos · APEX',
  description:
    '4 productos en producción: BotLode, Assistify, Contact Engine y Luma Invita. SaaS y apps reales construidas con Next.js, Flutter y Supabase.',
  openGraph: {
    title: 'Proyectos · APEX',
    description:
      'Productos reales en producción. SaaS, apps y plataformas construidas con Next.js, Flutter y Supabase.',
    type: 'website',
  },
}

export default function ProyectosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
