'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES, WHATSAPP_NUMBER, WHATSAPP_KEYBOARD_MSG } from '@/lib/constants'

interface ShortcutHandlers {
  toggleDarkMode: () => void
  resetTheme: () => void
  toggleInspector: () => void
  showShortcutsDialog: () => void
}

// ─── useKeyboardShortcuts ─────────────────────────────────────────────────────
// Global Ctrl/Cmd keyboard shortcut system.
// Disabled when focus is inside an editable element.

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!e.ctrlKey && !e.metaKey) return

      // Skip if user is typing in an input/textarea/contenteditable
      const target = e.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) return

      const key = e.key.toUpperCase()

      switch (key) {
        case 'H':
          e.preventDefault()
          router.push(ROUTES.home)
          break
        case 'A':
          e.preventDefault()
          router.push(ROUTES.about)
          break
        case 'C':
          e.preventDefault()
          router.push(ROUTES.contact)
          break
        case 'S':
          e.preventDefault()
          router.push(ROUTES.servicios)
          break
        case 'M':
          e.preventDefault()
          router.push(`${ROUTES.servicios}?tab=mobile`)
          break
        case 'T':
          e.preventDefault()
          handlers.toggleDarkMode()
          break
        case 'R':
          e.preventDefault()
          handlers.resetTheme()
          break
        case 'W':
          e.preventDefault()
          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_KEYBOARD_MSG}`,
            '_blank'
          )
          break
        case 'I':
          e.preventDefault()
          handlers.toggleInspector()
          break
        case 'K':
        case '?':
          e.preventDefault()
          handlers.showShortcutsDialog()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, handlers])
}
