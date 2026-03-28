import { HeroSection } from '@/components/sections/hero'
import { TechStackSection } from '@/components/sections/tech-stack'
import { ProjectsSection } from '@/components/sections/projects'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TechStackSection />
      <ProjectsSection />
    </>
  )
}
