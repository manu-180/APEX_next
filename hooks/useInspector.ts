'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'apex-inspector'

/**
 * sessionStorage tira SecurityError cuando el navegador bloquea el almacenamiento
 * del sitio (Safari en modo privado, Chrome con cookies de terceros bloqueadas,
 * webviews embebidas). Sin guarda, el throw sube por el render de AppShell y
 * tumba TODA la pagina por un toggle cosmetico. El inspector degrada a
 * "no persiste" y listo.
 */
function readFlag(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function writeFlag(value: boolean | null): void {
  try {
    if (value === null) sessionStorage.removeItem(STORAGE_KEY)
    else sessionStorage.setItem(STORAGE_KEY, String(value))
  } catch {
    /* almacenamiento bloqueado: el modo funciona igual, solo no sobrevive al reload */
  }
}

// ─── useInspector ─────────────────────────────────────────────────────────────
// Manages the X-Ray inspector mode toggle.
// Persisted to sessionStorage (resets on new tab).

export function useInspector() {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (readFlag()) setIsActive(true)
  }, [])

  const toggle = useCallback(() => {
    setIsActive(prev => {
      const next = !prev
      writeFlag(next)
      return next
    })
  }, [])

  const disable = useCallback(() => {
    setIsActive(false)
    writeFlag(null)
  }, [])

  return { isActive, toggle, disable }
}
