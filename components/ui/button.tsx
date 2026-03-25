import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
          'disabled:pointer-events-none disabled:opacity-50',
          // Variants
          variant === 'primary' && 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98]',
          variant === 'secondary' && 'bg-surface-high text-on-surface hover:bg-surface-highest active:scale-[0.98]',
          variant === 'ghost' && 'text-on-surface-variant hover:bg-surface-high hover:text-on-surface',
          variant === 'outline' && 'border border-primary-40 text-primary hover:bg-primary-8 active:scale-[0.98]',
          // Sizes
          size === 'sm' && 'h-9 px-4 text-sm',
          size === 'md' && 'h-11 px-6 text-sm',
          size === 'lg' && 'h-13 px-8 text-base',
          className
        )}
        data-hover
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
