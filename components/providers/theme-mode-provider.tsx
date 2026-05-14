'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

type Mode = 'light' | 'dark'

interface ThemeModeContextValue {
  resolvedTheme: Mode
  setTheme: (mode: Mode | ((prev: Mode) => Mode)) => void
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null)

const STORAGE_KEY = 'apex-theme-mode'
const DEFAULT_MODE: Mode = 'dark'

/**
 * Provider ligero de modo light/dark. Reemplaza `next-themes` que inyectaba
 * un script bloqueante en el <head>. Acá el modo inicial viene preseteado por
 * el `<html className="dark">` del server (default dark) y se sincroniza
 * con localStorage en el primer effect del cliente.
 */
export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<Mode>(DEFAULT_MODE)

  useEffect(() => {
    // Lee localStorage en client. Si difiere del default, aplica la clase.
    if (typeof window === 'undefined') return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null
      const next = stored === 'light' || stored === 'dark' ? stored : DEFAULT_MODE
      if (next !== DEFAULT_MODE) {
        applyThemeClass(next)
      }
      setResolvedTheme(next)
    } catch {
      // localStorage puede fallar en algunos contextos. Caemos al default.
    }
  }, [])

  const setTheme = useCallback((next: Mode | ((prev: Mode) => Mode)) => {
    setResolvedTheme((prev) => {
      const value = typeof next === 'function' ? next(prev) : next
      applyThemeClass(value)
      try {
        window.localStorage.setItem(STORAGE_KEY, value)
      } catch {}
      return value
    })
  }, [])

  return (
    <ThemeModeContext.Provider value={{ resolvedTheme, setTheme }}>
      {children}
    </ThemeModeContext.Provider>
  )
}

function applyThemeClass(mode: Mode) {
  const root = document.documentElement
  if (mode === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}

/** Misma firma que `useTheme` de next-themes para minimizar refactor. */
export function useTheme(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext)
  if (!ctx) {
    // Fallback defensivo: sin provider, asumimos dark (el default del HTML).
    return {
      resolvedTheme: DEFAULT_MODE,
      setTheme: () => {},
    }
  }
  return ctx
}
