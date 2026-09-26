import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils/cn'
import { CircleMinusIcon, UndoIcon } from '@/components/legal/iconos'

const BOTON = cn(
  'group relative tap-44 inline-flex h-8 items-center gap-1 whitespace-nowrap rounded-full px-2 sm:gap-1.5 sm:px-3',
  'max-[359px]:px-1.5 max-[359px]:text-[10.5px]',
  'border border-[var(--color-outline)] bg-[var(--nav-bg)]',
  'text-[11px] font-medium leading-none text-[var(--color-on-surface-variant)] sm:text-xs',
  'transition-[color,border-color,transform] duration-200 ease-out active:scale-[0.97] motion-reduce:transition-none',
  'hover:border-[rgba(var(--color-on-surface-variant-rgb),0.32)] hover:text-[var(--color-on-surface)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
)

const ICONO = 'size-3 shrink-0 opacity-70 transition-opacity duration-200 group-hover:opacity-100 max-[369px]:hidden sm:size-3.5'

/**
 * Disposición 954/2025 (arts. 1 y 4): los dos botones van "a simple vista, en
 * lugar destacado y en el primer acceso" de cualquier página.
 *
 * Flotan sobre el aire superior de cada página (contenedor de alto 0 +
 * absolute) en vez de empujar el contenido: ningún hero cambia de lugar y no
 * aparece un corte entre el fondo del hero y el de la página. La contracara:
 * toda página necesita al menos `--legal-bar-h` de aire arriba de su primer
 * contenido. Medido en todas las rutas a 375×667; las que no lo tenían (el
 * hero de la home y /lab) lo suman en su padding.
 */
export function ConsumerRightsBar() {
  return (
    <div className="relative z-[2] h-0 print:hidden">
      <nav aria-label="Derechos del consumidor" className="absolute inset-x-0 top-0">
        <ul className="mx-auto flex max-w-6xl items-center justify-between gap-1.5 px-4 pt-2.5 min-[360px]:gap-2 sm:justify-end sm:gap-3 sm:px-6">
          <li>
            <Link href={ROUTES.arrepentimiento} prefetch={false} className={BOTON}>
              <UndoIcon className={ICONO} />
              Botón de arrepentimiento
            </Link>
          </li>
          <li>
            <Link href={ROUTES.baja} prefetch={false} className={BOTON}>
              <CircleMinusIcon className={ICONO} />
              Botón de baja de servicio
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
