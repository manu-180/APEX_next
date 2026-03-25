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
WhatsApp: `5491134272488`
