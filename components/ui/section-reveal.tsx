'use client'

import { type ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SectionRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right'
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: SectionRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const offset = { up: [0, 40], left: [-40, 0], right: [40, 0] }[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset[0], y: offset[1] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
