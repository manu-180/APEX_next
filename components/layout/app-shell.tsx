'use client'

import { useState, useCallback, type ReactNode } from 'react'
import { useTheme } from 'next-themes'
import { useApexTheme } from '@/hooks/useTheme'
import { useInspector } from '@/hooks/useInspector'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { ShortcutsModal } from './shortcuts-modal'
import { WhatsAppButton } from '@/components/floating/whatsapp-button'
import { ApexBot } from '@/components/floating/apex-bot'
import { CustomCursor } from '@/components/ui/custom-cursor'

// Context exports for child components
export { useApexTheme } from '@/hooks/useTheme'
export { useInspector } from '@/hooks/useInspector'

export function AppShell({ children }: { children: ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { resetTheme } = useApexTheme()
  const inspector = useInspector()
  const [showShortcuts, setShowShortcuts] = useState(false)

  const toggleDarkMode = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [setTheme, resolvedTheme])

  const showShortcutsDialog = useCallback(() => {
    setShowShortcuts(true)
  }, [])

  useKeyboardShortcuts({
    toggleDarkMode,
    resetTheme,
    toggleInspector: inspector.toggle,
    showShortcutsDialog,
  })

  return (
    <div className={inspector.isActive ? 'inspector-mode' : ''}>
      <CustomCursor />
      <Navbar
        onToggleDarkMode={toggleDarkMode}
        onShowShortcuts={showShortcutsDialog}
      />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
      <WhatsAppButton />
      <ApexBot />
      <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  )
}
