'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BotIcon, XIcon, SendIcon } from '@/components/ui/icons'

export function ApexBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: '¡Hola! Soy APEXbot. ¿En qué puedo ayudarte hoy?' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: input },
      { role: 'bot', text: 'Gracias por tu mensaje. Manuel te responderá a la brevedad.' },
    ])
    setInput('')
  }

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform theme-transition"
        aria-label="Abrir APEXbot"
        data-hover
      >
        {open ? <XIcon className="h-5 w-5" /> : <BotIcon className="h-5 w-5" />}
        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-online border-2 border-surface-base" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-40 right-6 z-50 w-[340px] max-h-[440px] flex flex-col rounded-2xl border border-surface-high bg-surface-low shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-high bg-surface-lowest">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <BotIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-on-surface">APEXbot</p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-online" />
                  <span className="text-xs text-on-surface-variant">Online</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-surface-high text-on-surface rounded-bl-md'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-surface-high">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribí tu mensaje..."
                className="flex-1 bg-surface-high rounded-xl px-3.5 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 hover:brightness-110 transition"
                data-hover
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
