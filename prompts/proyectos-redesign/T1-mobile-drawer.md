---
permissionMode: bypassPermissions
wave: 1
---

# T1 — Componente `MobileDrawer` lateral premium

## Objetivo
Crear un componente reutilizable de drawer lateral (derecha → izquierda) para reemplazar el menú mobile actual de la navbar (que se abre de arriba hacia abajo). Diseño premium, alineado con el resto del sitio. **Solo crear el componente — la integración en navbar la hace T2.**

## Archivo único a crear
- `components/layout/mobile-drawer.tsx`

## API del componente

```tsx
type NavLinkItem = {
  href: string
  label: string
  external?: boolean
}

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  links: ReadonlyArray<NavLinkItem>
  currentPath: string
  whatsappHref: string
  onToggleTheme: (e?: React.MouseEvent) => void
  onShowShortcuts: () => void
  resolvedTheme?: 'light' | 'dark'
  onlineCount?: number
}

export function MobileDrawer(props: MobileDrawerProps): JSX.Element
```

## Specs visuales y de comportamiento

### Estructura
- `'use client'` en la primera línea
- Renderizar dentro de un `<AnimatePresence>` de Framer Motion controlado por `open`
- Portal NO necesario — render normal en árbol del navbar
- Z-index por encima de cualquier sticky: usar `z-[100]` o variable CSS `--z-modal` si existe

### Layout
- **Ancho**: `min(85vw, 360px)`
- **Alto**: `100dvh` (usar `dvh` para soportar barra dinámica de mobile browsers)
- Anclado a `right: 0; top: 0`
- `position: fixed`
- Background: `var(--color-surface-low)` con `backdrop-filter: blur(24px)`
- Border-left: `1px solid var(--glass-border)`
- Box-shadow lateral hacia la izquierda, sutil

### Backdrop
- Overlay full-screen detrás del drawer
- `background: rgba(0, 0, 0, 0.55)` + `backdrop-filter: blur(8px)`
- Click en backdrop → llama `onClose`

### Animaciones (Framer Motion)
- Drawer:
  - `initial={{ x: '100%' }}`
  - `animate={{ x: 0 }}`
  - `exit={{ x: '100%' }}`
  - `transition={{ type: 'spring', stiffness: 320, damping: 36 }}`
- Backdrop: fade `opacity 0 → 1` con `duration 0.25`
- Links internos: stagger con `delay: 0.05 * index` después de que el drawer terminó de entrar; usar `motion.div` con `initial={{ opacity: 0, x: 16 }}` → `animate={{ opacity: 1, x: 0 }}`
- Respetar `prefers-reduced-motion`: si está activo, sustituir spring por fade rápido (`duration: 0.15`) y desactivar slide (X = 0 directo).

### Contenido (top a bottom)

**Header (sticky top)**
- `padding: 1.5rem`
- Logo `<ApexLogoMark />` + label "APEX" en font-heading extrabold
- Botón close (XIcon) a la derecha
- Border-bottom sutil con `var(--glass-border)`

**Lista de links (flex-1, scroll si overflow)**
- `padding: 1rem 1.25rem`
- Cada link:
  - `display: flex`, `align-items: center`, `justify-content: space-between`
  - `padding: 0.875rem 1rem`
  - `border-radius: 0.75rem`
  - Tipografía: `font-heading`, `font-size: 1.125rem`, `font-weight: 600`
  - Estado activo (currentPath === link.href):
    - Color `var(--color-primary)`
    - Background `rgba(var(--color-primary-rgb), 0.08)`
    - Indicador lateral: dot de 6px en el lado izquierdo, glow sutil
    - Usar `layoutId="mobile-drawer-active"` en el dot para animación entre items
  - Estado inactivo: color `var(--color-on-surface-variant)`, hover `bg-[var(--color-surface-high)]`
- Click en link interno: `onClose()` antes de navegar (Next Link)
- Links externos: target="_blank" rel="noopener noreferrer" + ExternalLinkIcon a la derecha

**Action row (utilitarios — opcional, compacto)**
- Theme toggle (Sun/Moon icon) + Shortcuts (Keyboard icon) en una fila pequeña separada por divider
- `padding: 0.75rem 1.25rem`
- Iconos size-9 con hover bg

**Footer (sticky bottom)**
- `padding: 1rem 1.25rem 1.5rem`
- Border-top con `var(--glass-border)`
- WhatsApp CTA full-width usando `<WhatsAppOutboundLink>`:
  - Reutilizar las clases del botón `btn-tech btn-primary-tech` que ya usa la navbar mobile actual
  - Texto: "Hablemos"
  - Click → `onClose()` antes de redirigir
- Si `onlineCount !== undefined`: chip pequeño debajo del CTA con punto verde animado (`bg-[var(--color-online)] animate-pulse`) y texto `{count} online`
- Respetar `safe-area-inset-bottom`

### Comportamiento

**Body scroll lock**
- Al `open=true`: `document.body.style.overflow = 'hidden'`
- Al `open=false`: restaurar al valor previo (guardarlo en useRef)
- Limpiar en cleanup del `useEffect`

**Focus management**
- Al abrir: foco al primer link
- Trap focus dentro del drawer mientras está abierto (Tab/Shift+Tab no escapan). Implementar con un `useEffect` que captura keydown y fuerza el foco al primer/último elemento focusable cuando llega al borde.

**Keyboard**
- ESC → `onClose`

**Swipe to close (opcional pero deseado)**
- Drag horizontal en el drawer: si `info.offset.x > 100` y `velocity > 300` → `onClose`
- Usar `drag="x"`, `dragConstraints={{ left: 0, right: 0 }}`, `dragElastic={0.2}` y `onDragEnd`

### Accesibilidad
- `role="dialog"`, `aria-modal="true"`, `aria-label="Menú de navegación"`
- El backdrop tiene `aria-hidden="true"`
- Botón close tiene `aria-label="Cerrar menú"`

## Imports permitidos
- `framer-motion` — `motion`, `AnimatePresence`
- `next/link` — para links internos
- `next-themes` — solo si necesitás leer el tema, pero preferí recibirlo por prop `resolvedTheme`
- `@/lib/utils/cn`
- `@/components/ui/icons` — `XIcon`, `SunIcon`, `MoonIcon`, `KeyboardIcon`, `ExternalLinkIcon`
- `@/components/ui/apex-logo-mark`
- `@/components/whatsapp/whatsapp-outbound-link`
- React hooks estándar

## NO hacer
- NO importar este componente desde la navbar (eso lo hace T2-navbar-integrate)
- NO modificar `components/layout/navbar.tsx`
- NO crear estilos globales — todo inline o Tailwind con variables CSS del tema
- NO usar librerías nuevas — solo lo que ya está en `package.json`

## Verificación
- `npx tsc --noEmit` debe pasar
- El componente debe ser autocontenido y renderizable de forma aislada con props mock
