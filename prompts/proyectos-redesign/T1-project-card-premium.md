---
permissionMode: bypassPermissions
wave: 1
---

# T1 — `ProjectCardPremium` con tilt 3D + spotlight + shimmer border

## Objetivo
Crear una **versión premium** de la card de proyecto, más visual y con menos densidad de texto que la actual. Va a usarse en la nueva ruta `/proyectos`. **Solo crear el componente — la página la arma T2.**

## Archivo único a crear
- `components/ui/project-card-premium.tsx`

## Diferencias clave vs la card actual (`components/sections/projects.tsx > ProjectCard`)
1. **Visual hero más grande** — el thumbnail/icono ocupa más espacio, no es solo un avatar 48px
2. **Spotlight radial** que sigue al cursor (no solo el tilt + glow estático del GlowCard actual)
3. **Borde shimmer** con conic-gradient animado (intensifica en hover)
4. **Menos features**: máximo 2 destacadas (no 4), formato más visual
5. **CTA "Explorar →" con flecha que se desplaza en hover**
6. **Estado `isActive`** (cuando el tema del proyecto está aplicado): borde glow más intenso + check icon discreto

## API

```tsx
import type { ProjectItem, ThemeId } from '@/lib/types/theme'

interface ProjectCardPremiumProps {
  project: ProjectItem
  isActive: boolean
  onApplyTheme: (themeId: ThemeId, e?: React.MouseEvent) => void
  onOpenDrawer: (project: ProjectItem) => void
  className?: string
}

export function ProjectCardPremium(props: ProjectCardPremiumProps): JSX.Element
```

## Specs

### Estructura del DOM
```
<article> (la card, role="button" + tabIndex=0)
  <div class="card-spotlight" />        ← pseudo-elemento o div con radial-gradient siguiendo cursor
  <div class="card-shimmer-border" />   ← conic-gradient rotativo
  <div class="card-content">
    <div class="card-visual">           ← thumbnail/icono grande
      <Image | Icon />
      <div class="card-visual-overlay" /> ← gradiente para legibilidad
      {isActive && <CheckBadge />}
    </div>
    <div class="card-body">
      <Header>
        <h3>title</h3>
        <p>subtitle (con glow-text)</p>
      </Header>
      <p class="tagline">tagline (max 2 líneas, line-clamp-2)</p>
      <ul class="features">
        {project.features.slice(0, 2).map(f => <FeatureRow />)}
      </ul>
    </div>
    <Footer>
      <Badge>tier</Badge>
      <span>Explorar <ArrowRight /></span>
    </Footer>
  </div>
</article>
```

### 3D Tilt
- Usar `useMotionValue` + `useSpring` de Framer Motion
- En `onMouseMove`: calcular `rotateX` y `rotateY` basados en posición relativa del cursor (rango: -8° a +8°)
- En `onMouseLeave`: volver a 0,0 con spring (`stiffness: 200, damping: 20`)
- Aplicar `style={{ transform: 'perspective(1200px) rotateX(...) rotateY(...)' }}`
- Hijos con `transform-style: preserve-3d` y un `translateZ` sutil para depth (ej: footer y CTA con translateZ(20px))

### Spotlight radial (sigue al cursor)
- Trackear `--mx` y `--my` como CSS custom properties en el elemento card
- En `onMouseMove`, hacer `el.style.setProperty('--mx', `${x}px`)` y lo mismo con `--my`
- Pseudo-elemento o div absoluto con:
  ```css
  background: radial-gradient(
    400px circle at var(--mx) var(--my),
    rgba(var(--color-primary-rgb), 0.18),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  ```
- Hover → opacity 1

### Shimmer border
- Pseudo-elemento absoluto, inset 0, padding 1px, mask-composite para mostrar solo el borde
- Background: `conic-gradient(from var(--shimmer-angle, 0deg), transparent, rgba(var(--color-primary-rgb), 0.4), transparent 30%)`
- Animación: `--shimmer-angle` rotando 0deg → 360deg en 6s linear infinite (usar `@property --shimmer-angle: ...` en globals.css? NO — definir keyframes con variable de framer-motion en su lugar para evitar tocar globals)
- **Alternativa simple**: si el conic-gradient animado se complica, usar un border estático `1px solid rgba(var(--color-primary-rgb), 0.2)` que pasa a `0.6` en hover con transition. Lo más importante es el spotlight; el shimmer es accent.
- En `isActive`: opacity del shimmer al 100%, en estado normal al 50%

### Visual hero (top de la card)
- Aspect ratio 16:9 o `h-44 md:h-48`
- Si `PROJECT_THUMB_SRC[themeId]` existe: usar `<Image>` con `fill` y `object-cover`
- Si no, mostrar el icono `PROJECT_ICONS[themeId]` centrado en un fondo `rgba(var(--color-primary-rgb), 0.08)` con grid pattern sutil
- Overlay degradado bottom-up para legibilidad: `linear-gradient(to top, var(--color-surface-low) 0%, transparent 50%)`
- En `isActive`: ring superior con check icon en esquina superior derecha (badge circular 28px con CheckIcon, `bg: var(--color-primary)`, `color: var(--color-on-primary)`)

### Body
- `padding: 1.5rem`
- Header:
  - Title: `font-heading font-extrabold text-2xl text-[var(--color-on-surface)]`
  - Subtitle: `text-sm font-medium text-[var(--color-primary)]` (usar la clase `glow-text` existente si está)
- Tagline: `text-sm text-[var(--color-on-surface-variant)] leading-relaxed line-clamp-2 mt-3`
- Features (solo 2):
  - Lista vertical, gap-2, mt-4
  - Cada item: `<ArrowRightIcon class="size-3.5 text-primary" />` + título bold + descripción muted en una línea
  - Si la card tiene 4+ features, slice(0, 2) y mostrar texto "+N más" como link al drawer

### Footer
- Border-top con gradient: `borderImage: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.2), transparent) 1'`
- Padding-top 1rem
- Badge a la izquierda con tier (misma lógica del componente actual: `App Store + Play Store` para assistify, `Invitaciones · Web` para luma-invita, sino `SaaS`)
- A la derecha: `<span>Explorar <ArrowRightIcon /></span>` con la flecha que se desplaza 4px a la derecha en hover (transition transform 200ms)

### Click handling
- Click en cualquier parte de la card que no sea el link externo:
  ```ts
  onApplyTheme(project.themeId as ThemeId, e)
  onOpenDrawer(project)
  ```
- Si `project.url` existe y es externa, mostrar un icono `<ExternalLinkIcon />` pequeño en esquina top-right del visual que abre en nueva pestaña con `e.stopPropagation()` (igual que la card actual)

### Accesibilidad
- `role="button"` en el `<article>`, `tabIndex={0}`
- `onKeyDown`: Enter o Space → mismo comportamiento que click
- `aria-label="Abrir caso ${project.title}"`
- `prefers-reduced-motion`: desactivar tilt y spotlight (solo dejar hover de borde y CTA)
- Focus visible: ring-2 ring-primary ring-offset-2 ring-offset-surface

### Inspector mode (mantener feature del sitio)
- En el div principal de la card, agregar:
  - `data-hover`
  - `data-inspector-title="Tarjeta Premium 3D"`
  - `data-inspector-desc="Tilt 3D con spotlight radial siguiendo el cursor y borde shimmer animado. Click aplica el tema del proyecto y abre el drawer."`
  - `data-inspector-cat="3D · Spotlight"`

## Imports permitidos
- `next/image`, `next/link`
- `framer-motion` — `motion`, `useMotionValue`, `useSpring`, `useTransform`
- React hooks
- `@/lib/types/theme` — `PROJECTS as PROJECT_DATA`, `ProjectItem`, `ThemeId`
- `@/lib/constants/project-thumbs` — `PROJECT_THUMB_SRC`
- `@/lib/utils/cn`
- `@/components/ui/icons` — `ExternalLinkIcon`, `ArrowRightIcon`, `BotLodeIcon`, `AssistifyIcon`, `ContactEngineIcon`, `LumaInvitaIcon`, `CheckIcon` (si no existe, usar un SVG inline mínimo)
- `@/components/ui/badge`

## NO hacer
- NO importar `GlowCard` (esta card es independiente, hace su propio tilt + spotlight)
- NO usar este componente desde ningún archivo (T2 lo integra en `app/proyectos/page.tsx`)
- NO modificar `components/sections/projects.tsx` (queda intacto)
- NO agregar estilos globales nuevos — todo localmente con Tailwind/inline styles

## Verificación
- `npx tsc --noEmit` debe pasar
- Probar visualmente con datos mock (no requerido escribir test)
