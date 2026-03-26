import { HeroSection } from '@/components/sections/hero'
import { TechStackSection } from '@/components/sections/tech-stack'
import { ProjectsSection } from '@/components/sections/projects'

function SocialProofStrip() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-6">
      <div
        className="rounded-xl px-6 py-4 text-center"
        style={{
          background: 'linear-gradient(to right, rgba(var(--color-primary-rgb), 0.06), rgba(6,182,212,0.05), rgba(var(--color-primary-rgb), 0.06))',
          border: '1px solid rgba(var(--color-primary-rgb), 0.18)',
        }}
      >
        <p className="text-sm md:text-base font-medium text-[var(--color-on-surface-variant)]">
          <span style={{ color: 'rgba(var(--color-primary-rgb), 0.9)' }}>✓</span>{' '}
          +15 proyectos entregados{' '}
          <span className="opacity-40 mx-2">·</span>
          4.9 ⭐ promedio{' '}
          <span className="opacity-40 mx-2">·</span>
          Desde <span className="font-semibold text-[var(--color-on-surface)]">ARS 300k</span>{' '}
          <span className="opacity-40 mx-2">·</span>
          <span className="font-semibold text-[var(--color-on-surface)]">15 días</span> garantizado
        </p>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SocialProofStrip />
      <TechStackSection />
      <ProjectsSection />
    </>
  )
}
