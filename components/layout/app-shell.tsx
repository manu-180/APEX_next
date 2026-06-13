'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback, useEffect, type ReactNode, type MouseEvent } from 'react'
import { useTheme } from '@/components/providers/theme-mode-provider'
import { useApexThemeActions } from '@/hooks/useTheme'
import { useInspector } from '@/hooks/useInspector'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { ToastProvider } from '@/components/ui/toast'

const ShortcutsModal = dynamic(
  () => import('./shortcuts-modal').then((m) => m.ShortcutsModal),
  { ssr: false },
)

const InspectorOverlay = dynamic(
  () => import('@/components/ui/inspector-overlay').then((m) => m.InspectorOverlay),
  { ssr: false },
)

const ThemeWaveOverlay = dynamic(
  () => import('@/components/ui/theme-wave-overlay').then((m) => m.ThemeWaveOverlay),
  { ssr: false },
)

const BotlodeGraciasBridge = dynamic(
  () => import('@/components/whatsapp/botlode-gracias-bridge').then((m) => m.BotlodeGraciasBridge),
  { ssr: false },
)

const WhatsAppFloatingButton = dynamic(
  () =>
    import('@/components/floating/whatsapp-floating-button').then(
      (m) => m.WhatsAppFloatingButton,
    ),
  { ssr: false },
)

// Context exports for child components
export { useApexTheme } from '@/hooks/useTheme'
export { useInspector } from '@/hooks/useInspector'

export function AppShell({ children }: { children: ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme()
  const { resetTheme } = useApexThemeActions()
  const inspector = useInspector()
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [enhancementsReady, setEnhancementsReady] = useState(false)

  const getPrimaryRgb = useCallback(() => {
    if (typeof window === 'undefined') return '100, 116, 139'
    const value = getComputedStyle(document.documentElement).getPropertyValue('--color-primary-rgb').trim()
    return value || '100, 116, 139'
  }, [])

  const toggleDarkMode = useCallback((e?: MouseEvent) => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    if (e) {
      window.dispatchEvent(
        new CustomEvent('apex:wave', {
          detail: { x: e.clientX, y: e.clientY, colorRgb: getPrimaryRgb() },
        })
      )
    }
  }, [setTheme, resolvedTheme, getPrimaryRgb])

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

  useEffect(() => {
    // Diferimos enhancements no críticos (overlays, bridge) hasta que el browser quede idle.
    if (typeof window === 'undefined') return
    const ric = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number
    }).requestIdleCallback
    const trigger = () => setEnhancementsReady(true)
    if (typeof ric === 'function') {
      ric(trigger, { timeout: 2500 })
    } else {
      const t = window.setTimeout(trigger, 1500)
      return () => window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const blockNativeDrag = (e: DragEvent) => {
      e.preventDefault()
    }
    document.addEventListener('dragstart', blockNativeDrag, true)
    return () => document.removeEventListener('dragstart', blockNativeDrag, true)
  }, [])

  return (
    <ToastProvider>
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
            ? 'min-h-dvh pt-[calc(4rem+2.25rem+env(safe-area-inset-top,0px))]'
            : 'min-h-dvh pt-[calc(4rem+env(safe-area-inset-top,0px))]'
        }
      >
        {children}
      </main>
      <Footer />
      {inspector.isActive && <InspectorOverlay onDisable={inspector.disable} />}
      {showShortcuts && <ShortcutsModal open={showShortcuts} onClose={() => setShowShortcuts(false)} />}
      {enhancementsReady && (
        <>
          <ThemeWaveOverlay />
          <BotlodeGraciasBridge />
          <WhatsAppFloatingButton />
        </>
      )}
    </div>
    </ToastProvider>
  )
}
