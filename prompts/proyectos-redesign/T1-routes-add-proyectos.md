---
permissionMode: bypassPermissions
wave: 1
---

# T1 — Agregar ruta `/proyectos` a constants

## Objetivo
Registrar la nueva ruta `proyectos` en el objeto `ROUTES` de constantes para que pueda usarse type-safe desde el resto del código (navbar, links, sitemap).

## Archivo único a editar
- `lib/constants/index.ts`

## Cambios concretos

### 1) Agregar entrada en `ROUTES`
Ubicación: dentro del objeto `export const ROUTES = { ... } as const`.

Agregar la línea `proyectos: '/proyectos',` después de `tecnologias` y antes de `about`. El objeto debe quedar así:

```ts
export const ROUTES = {
  home:        '/',
  servicios:   '/servicios',
  tecnologias: '/tecnologias',
  proyectos:   '/proyectos',
  about:       '/sobre-mi',
  contact:     '/contacto',
  gracias:     '/gracias',
} as const
```

Mantener el alineamiento por columnas existente.

### 2) NO tocar
- `SHORTCUTS` — no agregar atajo `Ctrl+P` (chocaría con print del browser)
- `PROJECTS` (objeto de URLs externas) — no se modifica
- Resto del archivo

## Verificación
- `npx tsc --noEmit` debe pasar
- `ROUTES.proyectos` debe ser accesible desde otros archivos como string literal `/proyectos`

## NO hacer
- No crear el page bajo `app/proyectos/` (eso es tarea de T2)
- No modificar la navbar (T2)
- No agregar nada al `SHORTCUTS`
