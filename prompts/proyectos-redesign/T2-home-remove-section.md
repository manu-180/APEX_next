---
permissionMode: bypassPermissions
wave: 2
---

# T2 — Quitar `<ProjectsSection>` del home

## Prerrequisitos
- T1 + T2-page-proyectos NO son obligatorios técnicamente para que esto compile, pero esta tarea **debe ejecutarse en T2 (no en T1)** para que la ruta `/proyectos` exista cuando un usuario hace click en el link de la navbar (y no quede el home con un blank donde estaba la sección sin destino claro).

## Objetivo
Eliminar la sección de proyectos del home. El home queda con:
1. Hero
2. ClientBenefits
3. TrustedClients
4. HomeFinalCta

Los proyectos viven en `/proyectos` (T2-page-proyectos).

## Archivo único a editar
- `app/page.tsx`

## Cambios

### 1) Quitar el import
Eliminar la línea:
```ts
import { ProjectsSection } from '@/components/sections/projects'
```

### 2) Quitar el uso en el JSX
Eliminar:
```tsx
<ProjectsSection />
```

### Estado final esperado
```tsx
import { HeroSection } from '@/components/sections/hero'
import { ClientBenefitsSection } from '@/components/sections/client-benefits'
import { TrustedClientsSection } from '@/components/sections/trusted-clients'
import { HomeFinalCtaSection } from '@/components/sections/home-final-cta'

/** Shell del home sin datos remotos en SSR; ISR 1h para reducir TTFB en CDN. */
export const revalidate = 3600

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientBenefitsSection />
      <TrustedClientsSection />
      <HomeFinalCtaSection />
    </>
  )
}
```

## NO hacer
- NO borrar el archivo `components/sections/projects.tsx` (deja huérfano pero estable; T3 evalúa si conviene eliminarlo)
- NO tocar otras secciones del home
- NO modificar `revalidate`
- NO reordenar las secciones restantes

## Verificación
- `npx tsc --noEmit` pasa
- `npm run dev` y abrir `/` debe mostrar las 4 secciones sin la grilla de proyectos
- No debe haber errores en consola del browser
