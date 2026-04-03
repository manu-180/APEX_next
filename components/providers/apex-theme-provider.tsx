'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { type ThemeId, THEMES, DEFAULT_THEME } from '@/lib/types/theme'

const STORAGE_KEY = 'apex-theme'

type ApexThemeStateValue = {
  theme: ThemeId
  activeTheme: ThemeId
  activeConfig: (typeof THEMES)[number]
  previewTheme: ThemeId | null
}

type ApexThemeActionsValue = {
  applyTheme: (id: ThemeId, event?: React.MouseEvent | null) => void
  previewThemeFn: (id: ThemeId | null) => void
  resetTheme: () => void
}

type ApexThemeContextValue = ApexThemeStateValue & ApexThemeActionsValue

const ApexThemeStateContext = createContext<ApexThemeStateValue | null>(null)
const ApexThemeActionsContext = createContext<ApexThemeActionsValue | null>(null)

function applyThemeToDOM(id: ThemeId) {
  if (document.documentElement.getAttribute('data-theme') === id) return
  document.documentElement.setAttribute('data-theme', id)
}

export function ApexThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null)
  const themeRef = useRef<ThemeId>(DEFAULT_THEME)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && THEMES.find(t => t.id === saved)) {
      themeRef.current = saved
      setThemeState(saved)
      applyThemeToDOM(saved)
    } else {
      themeRef.current = DEFAULT_THEME
      applyThemeToDOM(DEFAULT_THEME)
    }
  }, [])

  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  const previewThemeFn = useCallback((id: ThemeId | null) => {
    setPreviewTheme(id)
    applyThemeToDOM(id ?? themeRef.current)
  }, [])

  const applyTheme = useCallback((id: ThemeId, event?: React.MouseEvent | null) => {
    setPreviewTheme(null)
    if (themeRef.current !== id) {
      themeRef.current = id
      setThemeState(id)
      localStorage.setItem(STORAGE_KEY, id)
      applyThemeToDOM(id)
    } else {
      applyThemeToDOM(id)
    }

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

  const stateValue = useMemo(
    () => ({
      theme,
      activeTheme,
      activeConfig,
      previewTheme,
    }),
    [theme, activeTheme, activeConfig, previewTheme]
  )

  const actionsValue = useMemo(
    () => ({
      applyTheme,
      previewThemeFn,
      resetTheme,
    }),
    [applyTheme, previewThemeFn, resetTheme]
  )

  return (
    <ApexThemeActionsContext.Provider value={actionsValue}>
      <ApexThemeStateContext.Provider value={stateValue}>
        {children}
      </ApexThemeStateContext.Provider>
    </ApexThemeActionsContext.Provider>
  )
}

export function useApexTheme() {
  const state = useContext(ApexThemeStateContext)
  const actions = useContext(ApexThemeActionsContext)
  if (!state || !actions) {
    throw new Error('useApexTheme debe usarse dentro de ApexThemeProvider')
  }
  return { ...state, ...actions }
}

export function useApexThemeActions() {
  const ctx = useContext(ApexThemeActionsContext)
  if (!ctx) {
    throw new Error('useApexThemeActions debe usarse dentro de ApexThemeProvider')
  }
  return ctx
}
