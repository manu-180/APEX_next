'use client'

import { useEffect, useRef, useInsertionEffect } from 'react'
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

  /**
   * `handlers` llega como objeto literal nuevo en cada render de AppShell, asi
   * que tenerlo en las deps del efecto desmontaba y volvia a montar el listener
   * global de keydown en CADA render. Con la ref, el listener se registra una
   * sola vez y siempre lee los handlers frescos.
   */
  const handlersRef = useRef(handlers)
  // En insertion effect y no en render: con render concurrente un árbol
  // descartado podría dejar la ref apuntando a handlers de un render abandonado.
  useInsertionEffect(() => {
    handlersRef.current = handlers
  })

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
          handlersRef.current.toggleDarkMode()
          break
        case 'R':
          e.preventDefault()
          handlersRef.current.resetTheme()
          break
        case 'I':
          e.preventDefault()
          handlersRef.current.toggleInspector()
          break
        case 'K':
        case '?':
          e.preventDefault()
          handlersRef.current.toggleShortcutsDialog()
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router])
}
