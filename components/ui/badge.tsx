import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold tracking-wide',
        'transition-all duration-300',
        variant === 'default' && 'bg-[var(--color-surface-high)] text-[var(--color-on-surface-variant)]',
        variant === 'primary' && [
          'bg-[rgba(var(--color-primary-rgb),0.12)] text-[var(--color-primary)]',
          'border border-[rgba(var(--color-primary-rgb),0.25)]',
          'hover:shadow-[0_0_12px_-3px_rgba(var(--color-primary-rgb),0.25)]',
        ],
        variant === 'outline' && [
          'border border-[rgba(var(--color-primary-rgb),0.3)] text-[var(--color-primary)]',
          'hover:bg-[rgba(var(--color-primary-rgb),0.06)]',
        ],
        className
      )}
    >
      {children}
    </span>
  )
}
