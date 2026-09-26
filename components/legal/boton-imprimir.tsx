'use client'

import { cn } from '@/lib/utils/cn'
import { PrinterIcon } from '@/components/legal/iconos'
import { FOCO } from '@/components/legal/estilos'

export function BotonImprimir() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        'inline-flex h-10 items-center gap-2 rounded-xl border border-[rgba(11,15,26,0.16)] px-3.5 text-sm font-medium text-[var(--color-on-surface-variant)] print:hidden',
        'transition-[color,border-color,transform] duration-150 ease-out hover:text-[var(--color-on-surface)] active:scale-[0.98] motion-reduce:transition-none',
        'dark:border-[var(--color-surface-high)] dark:hover:border-[var(--color-surface-highest)]',
        FOCO,
      )}
    >
      <PrinterIcon className="size-4" />
      Guardar o imprimir
    </button>
  )
}
