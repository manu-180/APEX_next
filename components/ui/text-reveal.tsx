'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function TextReveal({ text, className, delay = 0, as: Tag = 'span' }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={isInView ? { y: 0 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

export function TypeWriter({ text, className, delay = 0 }: Omit<TextRevealProps, 'as'>) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const chars = text.split('')

  return (
    <span ref={ref} className={cn('inline-block font-mono', className)}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.03, delay: delay + i * 0.035 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  )
}
