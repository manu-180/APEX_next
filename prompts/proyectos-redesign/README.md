# Prompts — Rediseño `/proyectos` + Mobile Drawer Lateral

Carpeta plana con todos los prompts del rediseño. Identificados por nombre: `T{N}-{slug}.md`.

## Tandas (ejecutar en orden, dentro de cada tanda en paralelo)

### T1 — Foundations (paralelo, 4 archivos independientes)
- `T1-routes-add-proyectos.md` → `lib/constants/index.ts`
- `T1-mobile-drawer.md` → `components/layout/mobile-drawer.tsx` (NEW)
- `T1-project-card-premium.md` → `components/ui/project-card-premium.tsx` (NEW)
- `T1-projects-hero.md` → `components/sections/projects-hero.tsx` (NEW)

### T2 — Integration (paralelo, 3 archivos independientes)
- `T2-page-proyectos.md` → `app/proyectos/page.tsx` + `app/proyectos/layout.tsx` (NEW)
- `T2-home-remove-section.md` → `app/page.tsx`
- `T2-navbar-integrate.md` → `components/layout/navbar.tsx`

### T3 — Verification (secuencial, después de T2)
- `T3-verify.md` → solo lectura + dev server

## Garantía de paralelismo

| Tanda | Archivos modificados/creados | Solapamiento |
|---|---|---|
| T1 | 4 archivos completamente distintos | ❌ No hay |
| T2 | 3 archivos distintos (uno crea carpeta nueva) | ❌ No hay |
| T3 | Sin escritura de código | N/A |

Cada prompt dentro de una misma tanda toca un archivo único — pueden ejecutarse en paralelo sin race conditions ni merge conflicts.

## Dependencias entre tandas

- T2 depende de T1: page-proyectos importa componentes de T1, navbar importa MobileDrawer y usa ROUTES.proyectos.
- T3 depende de T2: verifica el resultado completo.

Las dependencias **solo cruzan tandas**, nunca dentro de la misma tanda.
