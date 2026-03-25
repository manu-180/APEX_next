'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 })
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 })

  useEffect(() => {
    // Only show custom cursor on desktop with fine pointer
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return

    setVisible(true)

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovering(
        t.closest('a, button, [role="button"], [data-hover]') !== null
      )
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cursorX, cursorY])

  if (!visible) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          width: hovering ? 48 : 12,
          height: hovering ? 48 : 12,
          backgroundColor: 'white',
          translateX: '-50%',
          translateY: '-50%',
        }}
        transition={{ type: 'spring', damping: 20 }}
      />
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  )
}
