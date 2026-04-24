# APEX Portfolio — Next.js

Always work directly on main branch. Never create worktrees or feature branches.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS 3
- Framer Motion 11
- next-themes (light/dark)
- Supabase (auth, DB, realtime)

## Project Structure

```
app/              # Next.js App Router pages
  layout.tsx      # Root layout: ThemeProvider, fonts, metadata
  globals.css     # CSS variables for all 7 themes + base styles
  page.tsx        # Home / Landing
  sobre-mi/       # About page
  servicios/      # Services + estimator
  contacto/       # Contact + booking + reviews
  api/            # Route handlers (chat, contact, bookings)

components/
  ui/             # Primitive UI components (button, card, badge, etc.)
  layout/         # Navbar, Footer, MainLayout
  sections/       # Full page sections (Hero, Projects, Pricing, etc.)
  theme/          # ThemeCard, ThemeToast, ThemeSwitcher
  floating/       # WhatsAppButton, APEXbot, PresenceBadge
  inspector/      # InspectorGadget wrapper

hooks/
  useTheme.ts           # 7-theme dynamic system (data-theme on <html>)
  useInspector.ts       # X-Ray inspector mode
  useKeyboardShortcuts.ts # Ctrl+H/A/C/S/M/T/R/W/I/K

lib/
  types/theme.ts        # ThemeId, ThemeConfig, THEMES array
  constants/index.ts    # Routes, WhatsApp, shortcuts, admin UUID
  utils/cn.ts           # cn() = clsx + tailwind-merge
  supabase/             # Supabase client (browser + server)
```

## Theme System

7 dynamic themes, applied via `data-theme="<id>"` on `<html>`.
CSS variables `--color-primary` and `--color-primary-rgb` change per theme.
Light/dark handled separately by next-themes (`class="dark"` on `<html>`).

Theme IDs: `neutral` | `flutter` | `supabase` | `riverpod` | `botlode` | `assistify` | `contact-engine`

## Key Functionality (all must be preserved from original APEX Flutter project)

- Dynamic themes: hover preview + click to apply (persisted localStorage)
- Light/dark toggle: Ctrl+T
- Inspector mode (X-Ray): Ctrl+I
- Keyboard shortcuts: Ctrl+H/A/C/S/M/T/R/W/I/K
- Real-time presence badge (Supabase Realtime)
- Google login (Supabase OAuth)
- APEXbot floating chatbot
- WhatsApp floating button
- Booking/calendar system (no Sundays, anti-double-booking)
- Reviews with star rating + nested replies

## Prices (ARS) — do not modify without checking with Manuel

Web: Landing $300K | Interactiva $600K | E-commerce $900K
Mobile: Profesional $1.2M | Empresarial $2.7M | Plataforma: consultar

## Admin

ADMIN_UUID = `37dad3e9-531c-4657-8db6-ddebbdcfa878`
WhatsApp: `5491125303794`

## Diseño Visual — Reglas de Estética (NO IGNORAR)

### Tipografía
- NUNCA usar: Inter, Roboto, Arial, System-ui como fuente principal
- SIEMPRE elegir fuentes con personalidad: Clash Display, Cabinet Grotesk, Syne, Satoshi, General Sans
- Usar contraste extremo de peso: mezclar 200 (thin) con 800 (extrabold) en el mismo texto

### Paleta de colores
- NUNCA gradientes morados/azules genéricos sobre fondo blanco
- NUNCA más de 3 colores principales
- SIEMPRE definir colores como CSS variables antes de codear
- Paleta: 1 color dominante + 1 acento agudo + neutros

### Layouts
- NUNCA centrar todo simétricamente — usar asimetría intencional
- SIEMPRE romper el grid en al menos 1 sección por página
- Usar espaciado generoso (padding mínimo 120px en secciones hero)
- Preferir composiciones de 2 columnas asimétricas sobre layouts centrados

### Animaciones
- SIEMPRE agregar animaciones scroll-triggered en secciones principales
- NUNCA animaciones genéricas fade-in sin propósito
- Usar GSAP ScrollTrigger para efectos de scroll complejos
- Respetar prefers-reduced-motion en TODAS las animaciones

### Componentes
- SIEMPRE buscar primero en Aceternity UI y Magic UI antes de crear desde cero
- Usar shadcn/ui como base, nunca como diseño final
- NUNCA dejar un componente con el estilo default de shadcn sin personalizar

### Anti-patterns prohibidos
- ❌ Hero con texto centrado + botón + imagen flotante genérica
- ❌ Cards con sombra box-shadow sutil y bordes redondeados uniformes
- ❌ Sección "features" con 3 columnas de íconos + título + descripción
- ❌ Footer con 4 columnas de links en gris sobre blanco
- ❌ Navbar transparente que se vuelve blanca al hacer scroll

## Skills activas para este proyecto
Usar SOLO estas skills, ignorar el resto:

### Diseño Visual (core)
- ui-ux-pro-max              ← 50+ estilos, 161 paletas, 57 font pairings
- frontend-design            ← producción sin "generic AI aesthetics"
- baseline-ui                ← guardrails anti-mediocridad
- web-design-guidelines      ← review de UI contra guidelines

### Componentes y Animaciones
- animated-component-libraries  ← Magic UI (150+) + React Bits (90+) + Aceternity UI
- gsap-scrolltrigger            ← GSAP + ScrollTrigger (ya citado en reglas de diseño)
- motion-framer                 ← Framer Motion moderno (ya en stack)
- modern-web-design             ← tendencias 2024-2025

### Figma (ahora conectado vía MCP)
- figma-use                  ← PREREQUISITO para todo lo de Figma
- figma-implement-design     ← Figma → React/Next.js

### Performance y Calidad
- fixing-accessibility
- fixing-motion-performance
- vercel-react-best-practices
- vercel-composition-patterns