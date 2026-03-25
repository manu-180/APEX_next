'use client'

import { useState, useEffect, useCallback } from 'react'
import { type ThemeId, THEMES, DEFAULT_THEME } from '@/lib/types/theme'

const STORAGE_KEY = 'apex-theme'

// ─── useApexTheme ─────────────────────────────────────────────────────────────
// Manages the dynamic 7-theme system independently of light/dark mode.
// Persists to localStorage. Applies data-theme attribute to <html>.

export function useApexTheme() {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME)
  const [previewTheme, setPreviewTheme] = useState<ThemeId | null>(null)

  // Load persisted theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && THEMES.find(t => t.id === saved)) {
      setThemeState(saved)
      applyThemeToDOM(saved)
    } else {
      applyThemeToDOM(DEFAULT_THEME)
    }
  }, [])

  // Apply theme preview on hover (not persisted)
  const previewThemeFn = useCallback((id: ThemeId | null) => {
    setPreviewTheme(id)
    applyThemeToDOM(id ?? theme)
  }, [theme])

  // Apply theme permanently
  const applyTheme = useCallback((id: ThemeId) => {
    setThemeState(id)
    setPreviewTheme(null)
    localStorage.setItem(STORAGE_KEY, id)
    applyThemeToDOM(id)
  }, [])

  // Reset to neutral
  const resetTheme = useCallback(() => {
    applyTheme(DEFAULT_THEME)
  }, [applyTheme])

  const activeTheme = previewTheme ?? theme
  const activeConfig = THEMES.find(t => t.id === activeTheme)!

  return {
    theme,
    activeTheme,
    activeConfig,
    previewTheme,
    applyTheme,
    previewThemeFn,
    resetTheme,
  }
}

// ─── DOM helper ──────────────────────────────────────────────────────────────
function applyThemeToDOM(id: ThemeId) {
  document.documentElement.setAttribute('data-theme', id)
}
