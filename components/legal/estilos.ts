import { cn } from '@/lib/utils/cn'

export const BOTON_TINTA = cn(
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold sm:w-auto',
  'bg-[var(--color-on-surface)] text-[var(--color-surface-base)]',
  'shadow-[0_10px_24px_-14px_rgba(0,0,0,0.16)] transition-[transform,box-shadow,opacity] duration-200 ease-out',
  'hover:-translate-y-px hover:shadow-[0_14px_28px_-14px_rgba(0,0,0,0.22)] active:translate-y-0 active:scale-[0.98]',
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--color-primary-rgb),0.7)]',
)

export const FOCO = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--color-primary-rgb),0.6)]'

export const SUPERFICIE = cn(
  'rounded-2xl border border-[var(--glass-border)] bg-[var(--color-surface-low)]',
  'shadow-[0_18px_40px_-28px_rgba(0,0,0,0.16)]',
)
