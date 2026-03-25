'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'apex-inspector'

// ─── useInspector ─────────────────────────────────────────────────────────────
// Manages the X-Ray inspector mode toggle.
// Persisted to sessionStorage (resets on new tab).

export function useInspector() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved === 'true') setIsActive(true)
  }, [])

  const toggle = useCallback(() => {
    setIsActive(prev => {
      const next = !prev
      sessionStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }, [])

  const disable = useCallback(() => {
    setIsActive(false)
    sessionStorage.removeItem(STORAGE_KEY)
  }, [])

  return { isActive, toggle, disable }
}
