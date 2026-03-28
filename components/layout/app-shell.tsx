'use client'

import { useState, useCallback, type ReactNode, type MouseEvent } from 'react'
import { useTheme } from 'next-themes'
import { useApexTheme } from '@/hooks/useTheme'
import { useInspector } from '@/hooks/useInspector'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { ShortcutsModal } from './shortcuts-modal'
import { InspectorOverlay } from '@/components/ui/inspector-overlay'
import { ThemeWaveOverlay } from '@/components/ui/theme-wave-overlay'
import { BotlodeGraciasBridge } from '@/components/whatsapp/botlode-gracias-bridge'

// Context exports for child components
export { useApexTheme } from '@/hooks/useTheme'
export { useInspector } from '@/hooks/useInspector'

export function AppShell({ children }: { children: ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { resetTheme, activeConfig } = useApexTheme()
  const inspector = useInspector()
  const [showShortcuts, setShowShortcuts] = useState(false)

  const toggleDarkMode = useCallback((e?: MouseEvent) => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    if (e) {
      window.dispatchEvent(
        new CustomEvent('apex:wave', {
          detail: { x: e.clientX, y: e.clientY, colorRgb: activeConfig.primaryRgb },
        })
      )
    }
  }, [setTheme, resolvedTheme, activeConfig])

  const toggleShortcutsDialog = useCallback(() => {
    setShowShortcuts((open) => !open)
  }, [])

  const openShortcutsDialog = useCallback(() => {
    setShowShortcuts(true)
  }, [])

  useKeyboardShortcuts({
    toggleDarkMode,
    resetTheme,
    toggleInspector: inspector.toggle,
    toggleShortcutsDialog,
  })

  return (
    <div className={inspector.isActive ? 'inspector-mode' : ''}>
      <Navbar
        onToggleDarkMode={toggleDarkMode}
        onShowShortcuts={openShortcutsDialog}
        inspectorActive={inspector.isActive}
        onToggleInspector={inspector.toggle}
      />
      <main
        className={
          inspector.isActive
            ? 'min-h-dvh pt-[calc(4rem+2.25rem)]'
            : 'min-h-dvh pt-16'
        }
      >
        {children}
      </main>
      <Footer />
      {inspector.isActive && <InspectorOverlay onDisable={inspector.disable} />}
      <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ThemeWaveOverlay />
      <BotlodeGraciasBridge />
    </div>
  )
}
