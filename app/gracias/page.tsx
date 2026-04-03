import { Suspense } from 'react'
import type { Metadata } from 'next'
import { GraciasContent } from './content'

export const metadata: Metadata = {
  title: 'Gracias | APEX',
  robots: { index: false, follow: false },
}

export default function GraciasPage() {
  return (
    <Suspense fallback={null}>
      <GraciasContent />
    </Suspense>
  )
}
