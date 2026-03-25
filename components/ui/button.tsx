import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const isTech = variant === 'primary' || variant === 'outline'

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold select-none',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
          'disabled:pointer-events-none disabled:opacity-50',
          isTech ? 'btn-tech' : 'rounded-xl',
          variant === 'primary' && [
            'btn-primary-tech',
            'active:scale-[0.97]',
          ],
          variant === 'secondary' && [
            'bg-[var(--color-surface-high)] text-[var(--color-on-surface)]',
            'hover:bg-[var(--color-surface-highest)]',
            'hover:shadow-[0_0_15px_-3px_rgba(var(--color-primary-rgb),0.15)]',
            'active:scale-[0.98]',
          ],
          variant === 'ghost' && [
            'text-[var(--color-on-surface-variant)]',
            'hover:bg-[var(--color-surface-high)] hover:text-[var(--color-on-surface)]',
          ],
          variant === 'outline' && [
            'btn-outline-tech',
            'text-[var(--color-primary)]',
            'active:scale-[0.97]',
          ],
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
