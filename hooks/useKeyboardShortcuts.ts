'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_NAV } from '@/lib/whatsapp'
import { openWhatsAppWithThankYouPage } from '@/lib/whatsapp-navigate'

interface ShortcutHandlers {
  toggleDarkMode: () => void
  resetTheme: () => void
  toggleInspector: () => void
  toggleShortcutsDialog: () => void
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
          if (e.shiftKey) {
            openWhatsAppWithThankYouPage(whatsappUrl(WA_MSG_NAV), router)
          } else {
            router.push(ROUTES.home)
          }
          break
        case 'A':
          e.preventDefault()
          router.push(ROUTES.about)
          break
        case 'S':
          e.preventDefault()
          router.push(ROUTES.servicios)
          break
        case 'M':
          e.preventDefault()
          router.push(`${ROUTES.servicios}?tab=mobile`)
          break
        case 'Y':
          e.preventDefault()
          handlers.toggleDarkMode()
          break
        case 'R':
          e.preventDefault()
          handlers.resetTheme()
          break
        case 'I':
          e.preventDefault()
          handlers.toggleInspector()
          break
        case 'K':
        case '?':
          e.preventDefault()
          handlers.toggleShortcutsDialog()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, handlers])
}
