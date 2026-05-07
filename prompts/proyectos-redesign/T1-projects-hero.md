---
permissionMode: bypassPermissions
wave: 1
---

# T1 — Sección Hero específica para `/proyectos`

## Objetivo
Crear una sección hero dedicada para la nueva ruta `/proyectos`. Diseño asimétrico, copy más enganchador que el actual "Productos reales", consistente con el estilo del resto del sitio. **Solo crear la sección — el page la usa T2.**

## Archivo único a crear
- `components/sections/projects-hero.tsx`

## API

```tsx
export function ProjectsHero(): JSX.Element
```

Sin props — sección autocontenida.

## Copy (importante: usar exactamente este)

### Eyebrow (badges, fila superior)
- Badge primary: `Portfolio`
- Badge outline: `En producción`

### Título (2 líneas, contraste extremo de pesos)
Línea 1: `Cosas que construí.`
- "Cosas que" → `font-light` o `font-thin`, color `var(--color-on-surface-variant)`
- "construí." → `font-extrabold`, color `var(--color-on-surface)`

Línea 2: `Funcionan. Dan plata.`
- "Funcionan." → `font-extrabold`, color `var(--color-on-surface)`
- "Dan plata." → `font-light` o `font-thin`, color `var(--color-primary)` con `glow-text` si la clase existe

### Subtítulo
> 4 productos en producción usados todos los días. Cada uno tiene su propio tema visual — hacé clic en una card para aplicarlo y ver cómo cambia el sitio entero en tiempo real.

### Stats inline (debajo del subtítulo, opcional pero deseado)
Fila con tres ítems separados por dot `·`:
- `4 productos`
- `3 SaaS · 1 plataforma`
- `Argentina · 2024-2026`

Tipografía: `text-xs font-medium text-[var(--color-on-surface-variant)] tabular-nums`

## Layout

### Estructura
```tsx
<section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
  <GridBackground showRadialLight />
  <div className="absolute top-0 left-0 right-0 h-px" style={{...gradient...}} />
  <div className="relative z-10 mx-auto max-w-6xl px-6">
    <motion.div className="max-w-3xl"> {/* asimétrico — left-aligned */}
      ...badges, título, subtítulo, stats
    </motion.div>
  </div>
</section>
```

### Asimetría
- Contenedor `max-w-3xl` left-aligned (NO `mx-auto text-center`)
- Padding-top generoso: `pt-32 md:pt-40` para respiro vs navbar fija (h-14/h-16)
- Padding-bottom corto: `pb-12 md:pb-16` para que conecte visualmente con el grid de proyectos abajo

### Tipografía
- Título: `font-heading text-balance text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-6`
- Subtítulo: `text-pretty text-base md:text-lg text-[var(--color-on-surface-variant)] max-w-xl leading-relaxed`
- Stats: separados con `<span aria-hidden>·</span>` y gap visual

### Animaciones
Reutilizar el patrón `fadeUp` que ya usa `components/sections/projects.tsx`:

```ts
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
}
```

Stagger order:
1. Badges (custom={0})
2. Título línea 1 (custom={1})
3. Título línea 2 (custom={2})
4. Subtítulo (custom={3})
5. Stats (custom={4})

Wrapper con `initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}` y atributo `data-motion`.

### Background
- Reutilizar `<GridBackground showRadialLight />` de `@/components/ui/grid-background`
- Línea horizontal de glow en top: 1px con gradient `linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent)`

## Inspector mode
En el wrapper del título agregar:
- `data-hover`
- `data-inspector-title="Hero asimétrico con contraste de pesos"`
- `data-inspector-desc="Tipografía Syne mezclando 200/300 (thin) con 800 (extrabold) en la misma frase. Layout left-aligned, no centrado."`
- `data-inspector-cat="Tipografía · Layout"`

## Accesibilidad
- `<h1>` para el título completo (envolver las dos líneas en un solo h1, usar `<span>` para los pesos distintos)
- `<p>` para el subtítulo
- Stats como `<ul role="list">` con `<li>` por ítem (más semántico que spans sueltos)

## Imports permitidos
- `'use client'` en primera línea
- `framer-motion` — `motion`
- `@/components/ui/badge`
- `@/components/ui/grid-background`
- `@/lib/utils/cn` (si hace falta)

## NO hacer
- NO importar `<ProjectsSection>` ni la card existente
- NO incluir el grid de proyectos (eso va en `app/proyectos/page.tsx`, T2)
- NO usar este componente desde ningún archivo (T2 lo importa)
- NO copiar/modificar `components/sections/projects.tsx`

## Verificación
- `npx tsc --noEmit` debe pasar
- Renderizar en aislamiento debe verse correctamente sin errores
