// ─── Theme Types ────────────────────────────────────────────────────────────

export type ThemeId =
  | 'neutral'
  | 'flutter'
  | 'supabase'
  | 'riverpod'
  | 'botlode'
  | 'assistify'
  | 'contact-engine'

export interface ThemeConfig {
  id: ThemeId
  name: string
  primary: string       // hex color
  primaryRgb: string    // "r, g, b"
  surfaceBase: {
    dark: string
    light: string
  }
  logo?: string         // asset path (for BotLode, Assistify)
  icon?: string         // icon name (for others)
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'neutral',
    name: 'Neutral',
    primary: '#64748B',
    primaryRgb: '100, 116, 139',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
  },
  {
    id: 'flutter',
    name: 'Flutter',
    primary: '#0175C2',
    primaryRgb: '1, 117, 194',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'flutter',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    primary: '#3ECF8E',
    primaryRgb: '62, 207, 142',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'bolt',
  },
  {
    id: 'riverpod',
    name: 'Riverpod',
    primary: '#6E56F8',
    primaryRgb: '110, 86, 248',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    icon: 'water-drop',
  },
  {
    id: 'botlode',
    name: 'BotLode',
    primary: '#FFC000',
    primaryRgb: '255, 192, 0',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    logo: '/icons/logo_botlode.png',
  },
  {
    id: 'assistify',
    name: 'Assistify',
    primary: '#00A8E8',
    primaryRgb: '0, 168, 232',
    surfaceBase: { dark: '#111318', light: '#F4F6F8' },
    logo: '/icons/logo_assistify.png',
  },
  {
    id: 'contact-engine',
    name: 'Contact Engine',
    primary: '#15803D',
    primaryRgb: '21, 128, 61',
    surfaceBase: { dark: '#121212', light: '#F5F5F5' },
    icon: 'crosshairs',
  },
]

export const DEFAULT_THEME: ThemeId = 'neutral'
