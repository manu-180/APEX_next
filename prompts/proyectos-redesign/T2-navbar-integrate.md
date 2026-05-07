---
permissionMode: bypassPermissions
wave: 2
---

# T2 — Integrar `Proyectos` y `MobileDrawer` en navbar

## Prerrequisitos (deben existir antes)
- T1-routes-add-proyectos (`ROUTES.proyectos` registrada)
- T1-mobile-drawer (`<MobileDrawer />` exportado desde `components/layout/mobile-drawer.tsx`)

## Objetivo
1. Agregar el link `Proyectos` a la navbar (desktop + mobile) entre `Servicios` y `Tecnologías`.
2. Reemplazar el menú mobile actual (slide top→down con `<motion.div>` inline en navbar) por el nuevo `<MobileDrawer />` (slide derecha→izquierda).

## Archivo único a editar
- `components/layout/navbar.tsx`

## Cambios concretos

### 1) Agregar `Proyectos` a `NAV_LINKS`

Ubicación: array `NAV_LINKS` declarado al inicio del archivo.

```ts
const NAV_LINKS = [
  { href: ROUTES.home, label: 'Inicio', external: false },
  { href: ROUTES.servicios, label: 'Servicios', external: false },
  { href: ROUTES.proyectos, label: 'Proyectos', external: false },   // ← NUEVO
  { href: ROUTES.tecnologias, label: 'Tecnologías', external: false },
  { href: ROUTES.about, label: 'Sobre Mí', external: false },
  { href: ROUTES.contact, label: 'Contacto', external: false },
] as const
```

Esto automáticamente lo agrega al underline animado de desktop y al menú mobile (que vamos a reemplazar abajo).

### 2) Importar `MobileDrawer`

Agregar al bloque de imports:

```ts
import { MobileDrawer } from '@/components/layout/mobile-drawer'
```

### 3) Reemplazar el bloque mobile menu

**Quitar todo el bloque `<AnimatePresence>` que renderiza el menú mobile actual** — desde:

```tsx
{/* Mobile menu */}
<AnimatePresence>
  {mobileOpen && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      ...
```

hasta su `</AnimatePresence>` de cierre (incluyendo todo el contenido: el map de NAV_LINKS, el divider y el `WhatsAppOutboundLink`).

**En su lugar**, después del cierre del `<nav>` exterior (o justo antes, depende del z-index), agregar:

```tsx
<MobileDrawer
  open={mobileOpen}
  onClose={() => setMobileOpen(false)}
  links={NAV_LINKS}
  currentPath={pathname}
  whatsappHref={WHATSAPP_NAV_HREF}
  onToggleTheme={onToggleDarkMode}
  onShowShortcuts={onShowShortcuts}
  resolvedTheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
  onlineCount={onlineCount}
/>
```

**Decisión de ubicación**: dentro del `<nav>` pero fuera del bloque del header (el div con `mx-auto flex h-14 ...`), hermano del bloque del header bar. Así el portal-like rendering queda dentro del mismo nav y los z-index de la prop `--z-sticky` se mantienen consistentes.

Ejemplo de estructura final del nav:

```tsx
<nav className="fixed top-0 left-0 right-0" style={{ zIndex: 'var(--z-sticky)' }}>
  <div className="w-full pt-[env(safe-area-inset-top,0px)]" style={{...}}>
    <div className="mx-auto flex h-14 ...">
      {/* logo, desktop links, action cluster con botón hamburguesa */}
    </div>
  </div>

  <MobileDrawer
    open={mobileOpen}
    onClose={() => setMobileOpen(false)}
    links={NAV_LINKS}
    currentPath={pathname}
    whatsappHref={WHATSAPP_NAV_HREF}
    onToggleTheme={onToggleDarkMode}
    onShowShortcuts={onShowShortcuts}
    resolvedTheme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    onlineCount={onlineCount}
  />
</nav>
```

### 4) Mantener intacto

- El botón hamburguesa (`<button>` con `onClick={() => setMobileOpen(!mobileOpen)}`) sigue como trigger — NO modificar.
- Toda la lógica del underline desktop, del logo, de los botones del action cluster (theme toggle, inspector, shortcuts, WhatsApp, online count) → no tocar.
- `useState`, `useEffect`, `useLayoutEffect`, `useRef` existentes → no tocar.
- El estado `mobileOpen` ya existe → reutilizar sin renombrar.

### 5) Imports a remover (si quedaron sin uso después de reemplazar el bloque)

Si tras quitar el `<AnimatePresence>` mobile algún import dejó de usarse:
- `AnimatePresence` de `framer-motion` — verificar si todavía se usa en otra parte del navbar (sí: en el underline NO se usa AnimatePresence, pero `motion` sí). Probable que `AnimatePresence` quede sin uso → eliminarlo del import. Conservar `motion` que sí se usa.
- `XIcon` y `MenuIcon` de `@/components/ui/icons` — el botón hamburguesa los sigue usando → conservar ambos.

Hacer un escaneo del archivo después del cambio para asegurar que no quedan imports muertos. TypeScript/lint los va a flagear.

## Verificación
- `npx tsc --noEmit` pasa
- `npm run lint` sin nuevos errores ni warnings de imports muertos
- Desktop: el link "Proyectos" aparece entre Servicios y Tecnologías, el underline animado funciona y subraya la ruta activa
- Mobile (375px): tap al hamburguesa abre el drawer lateral derecha→izquierda; tap fuera, ESC, swipe-right o tap en close → cierra
- Tap en un link interno del drawer → navega y cierra el drawer

## NO hacer
- NO crear el `<MobileDrawer />` acá (ya existe — T1)
- NO modificar `lib/constants/index.ts` (T1 ya agregó la ruta)
- NO modificar `components/sections/projects.tsx` (huérfano post-T2)
- NO eliminar el botón hamburguesa
- NO renombrar `mobileOpen`
