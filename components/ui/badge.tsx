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
        'inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold tracking-wide transition-colors',
        variant === 'default' && 'bg-surface-high text-on-surface-variant',
        variant === 'primary' && 'bg-primary-12 text-primary',
        variant === 'outline' && 'border border-primary-40 text-primary',
        className
      )}
    >
      {children}
    </span>
  )
}
