'use client'

import { motion } from 'framer-motion'
import { WHATSAPP_DEFAULT } from '@/lib/constants'
import { WhatsAppIcon } from '@/components/ui/icons'

export function WhatsAppButton() {
  return (
    <motion.a
      href={WHATSAPP_DEFAULT}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-transform"
      aria-label="Contactar por WhatsApp"
      data-hover
    >
      <WhatsAppIcon className="h-7 w-7" />
    </motion.a>
  )
}
