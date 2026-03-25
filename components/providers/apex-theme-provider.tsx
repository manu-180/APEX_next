'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { type ThemeId, THEMES, DEFAULT_THEME } from '@/lib/types/theme'

const STORAGE_KEY = 'apex-theme'

type ApexThemeContextValue = {
  theme: ThemeId
  activeTheme: ThemeId
  activeConfig: (typeof THEMES)[number]
  previewTheme: ThemeId | null
  applyTheme: (id: ThemeId, event?: React.MouseEvent | null) => void
  previewThemeFn: (id: ThemeId | null) => void
  resetTheme: () => void
}

const ApexThemeContext = createContext<ApexThemeContextValue | null>(null)

function applyThemeToDOM(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id)
}

export function ApexThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && THEMES.find(t => t.id === saved)) {
      setThemeState(saved)
      applyThemeToDOM(saved)
    } else {
      applyThemeToDOM(DEFAULT_THEME)
    }
  }, [])

  const previewThemeFn = useCallback((id: ThemeId | null) => {
    setPreviewTheme(id)
    applyThemeToDOM(id ?? theme)
  }, [theme])

  const applyTheme = useCallback((id: ThemeId, event?: React.MouseEvent | null) => {
    setThemeState(id)
    setPreviewTheme(null)
    localStorage.setItem(STORAGE_KEY, id)
    applyThemeToDOM(id)

    if (event) {
      const config = THEMES.find(t => t.id === id)
      if (config) {
        window.dispatchEvent(
          new CustomEvent('apex:wave', {
            detail: {
              x: event.clientX,
              y: event.clientY,
              colorRgb: config.primaryRgb,
            },
          })
        )
      }
    }
  }, [])

  const resetTheme = useCallback(() => {
    applyTheme(DEFAULT_THEME)
  }, [applyTheme])

  const activeTheme = previewTheme ?? theme
  const activeConfig = THEMES.find(t => t.id === activeTheme)!

  const value = useMemo(
    () => ({
      theme,
      activeTheme,
      activeConfig,
      previewTheme,
      applyTheme,
      previewThemeFn,
      resetTheme,
    }),
    [theme, activeTheme, activeConfig, previewTheme, applyTheme, previewThemeFn, resetTheme]
  )

  return <ApexThemeContext.Provider value={value}>{children}</ApexThemeContext.Provider>
}

export function useApexTheme() {
  const ctx = useContext(ApexThemeContext)
  if (!ctx) {
    throw new Error('useApexTheme debe usarse dentro de ApexThemeProvider')
  }
  return ctx
}
