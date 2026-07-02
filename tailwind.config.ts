import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ─── Oxanium Font ───────────────────────────────────────────────
      fontFamily: {
        sans: ['var(--font-oxanium)', 'system-ui', 'sans-serif'],
        oxanium: ['var(--font-oxanium)', 'sans-serif'],
      },

      // ─── Dynamic Theme Colors via CSS Variables ──────────────────────
      colors: {
        // Semantic tokens — mapped to CSS vars that change per theme
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        surface: {
          lowest:  'var(--color-surface-lowest)',
          low:     'var(--color-surface-low)',
          DEFAULT: 'var(--color-surface)',
          high:    'var(--color-surface-high)',
          highest: 'var(--color-surface-highest)',
          base:    'var(--color-surface-base)',
        },
        'on-surface':         'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',

        // Status / accent fixed colors
        inspector:  '#38BDF8',
        'inspector-light': '#0284C7',
        online:     '#34B27B',
        offline:    '#E57373',

        // Raw theme primaries (for reference / JS use) — paridad con los 10 data-themes
        'theme-neutral':        '#64748B',
        'theme-flutter':        '#0175C2',
        'theme-nextjs':         '#A1A1AA',
        'theme-supabase':       '#3ECF8E',
        'theme-riverpod':       '#6E56F8',
        'theme-typescript':     '#3178C6',
        'theme-botlode':        '#FFC000',
        'theme-assistify':      '#00A8E8',
        'theme-contact-engine': '#15803D',
        'theme-luma-invita':    '#D946A6',
      },

      // ─── Border Radius ───────────────────────────────────────────────
      borderRadius: {
        '2xl':  '1rem',    // 16px
        '3xl':  '1.125rem', // 18px
        '4xl':  '1.375rem', // 22px
        '5xl':  '1.5rem',   // 24px — main container radius
      },

      // ─── Letter Spacing ──────────────────────────────────────────────
      letterSpacing: {
        tighter: '-0.05em',
        tight:   '-0.025em',
        header:  '-0.03125em', // -0.5px at 16px — headlines
      },

      // ─── Box Shadows ─────────────────────────────────────────────────
      // Los glows (.shadow-glow-sm/.shadow-glow/.shadow-glow-lg) viven SOLO
      // en globals.css (versión rgba con alpha correcto) — no redefinir acá.
      boxShadow: {
        'card-hover': 'var(--shadow-card-hover)',
        'card-hover-light': '0 10px 30px 0 rgba(0,0,0,0.10)',
        'card-base-light':  '0 7px 22px 0 rgba(0,0,0,0.07)',
      },

      // ─── Transition Timing (spec §1) ─────────────────────────────────
      // `ease-out` de Tailwind y el default de todas las transition-*
      // apuntan a la curva firma del sitio.
      transitionTimingFunction: {
        DEFAULT: 'var(--ease-out)',
        out: 'var(--ease-out)',
      },

      // ─── Backdrop Blur ───────────────────────────────────────────────
      backdropBlur: {
        glass: '10px',
      },

      // ─── Animation / Keyframes ───────────────────────────────────────
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        blink:   'blink 1.4s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
