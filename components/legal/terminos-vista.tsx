import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { fechaLegible, prepararMarkdown, type VersionTerminos } from '@/lib/legal/terminos'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { WhatsAppIcon } from '@/components/ui/icons'
import { BotonImprimir } from '@/components/legal/boton-imprimir'
import { TerminosMarkdown } from '@/components/legal/terminos-documento'
import { BOTON_TINTA, FOCO, SUPERFICIE } from '@/components/legal/estilos'
import { GridBackground } from '@/components/ui/grid-background'

function Fondo() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[560px] [mask-image:linear-gradient(to_bottom,black_50%,transparent)] print:hidden"
    >
      <GridBackground showRadialLight />
    </div>
  )
}

export function TerminosVista({
  version,
  versiones,
}: {
  version: VersionTerminos
  versiones: VersionTerminos[]
}) {
  const vigente = versiones[0]
  const esVigente = vigente?.etiqueta === version.etiqueta
  const { resumen, cuerpo } = prepararMarkdown(version.markdown)
  const anteriores = versiones.filter((v) => v.etiqueta !== version.etiqueta)

  return (
    <div className="relative overflow-hidden">
      <Fondo />
      <article className="terminos-doc relative mx-auto max-w-3xl px-4 pb-24 pt-20 sm:px-6 md:pt-28">
        <header>
          <p className="editorial-label editorial-label--primary mb-6">Términos y condiciones</p>
          <h1 className="heading-display text-balance text-4xl sm:text-5xl">
            <span className="block text-[var(--color-ink-strong)]">Términos y condiciones</span>
            <strong className="block text-[var(--color-on-surface)]">de contratación.</strong>
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              Versión {version.etiqueta} · Publicada el {fechaLegible(version.publicadaEn)}
            </p>
            <BotonImprimir />
          </div>
          {!esVigente && vigente && (
            <p className="mt-6 rounded-xl border border-[rgba(var(--color-primary-rgb),0.35)] bg-[rgba(var(--color-primary-rgb),0.08)] px-4 py-3 text-sm leading-relaxed text-[var(--color-on-surface)]">
              Esta versión ya no es la vigente. Rige para quien contrató mientras estuvo publicada.{' '}
              <Link
                href={ROUTES.terminos}
                prefetch={false}
                className={cn('rounded font-semibold underline underline-offset-4', FOCO)}
              >
                Ver la versión {vigente.etiqueta}
              </Link>
            </p>
          )}
        </header>

        {resumen && (
          <section aria-label="Resumen" className={cn(SUPERFICIE, 'mt-10 p-6 sm:p-8 print:border-0 print:p-0 print:shadow-none')}>
            <TerminosMarkdown markdown={resumen} />
          </section>
        )}

        <div className={resumen ? 'mt-14' : 'mt-10'}>
          <TerminosMarkdown markdown={cuerpo} />
        </div>

        {anteriores.length > 0 && (
          <nav aria-label="Otras versiones" className="mt-16 border-t border-[var(--glass-border)] pt-8 print:hidden">
            <h2 className="text-sm font-semibold text-[var(--color-on-surface)]">Otras versiones</h2>
            <ul className="mt-3 space-y-1">
              {anteriores.map((v) => (
                <li key={v.etiqueta}>
                  <Link
                    href={v.etiqueta === vigente?.etiqueta ? ROUTES.terminos : `${ROUTES.terminos}/${encodeURIComponent(v.etiqueta)}`}
                    prefetch={false}
                    className={cn(
                      'inline-flex min-h-11 items-center rounded text-sm text-[var(--color-on-surface-variant)] underline-offset-4 hover:text-[var(--color-on-surface)] hover:underline',
                      FOCO,
                    )}
                  >
                    Versión {v.etiqueta}, publicada el {fechaLegible(v.publicadaEn)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </div>
  )
}

export function TerminosPendientes() {
  return (
    <div className="relative overflow-hidden">
      <Fondo />
      <section className="relative mx-auto max-w-3xl px-4 pb-24 pt-20 sm:px-6 md:pt-28">
        <p className="editorial-label editorial-label--primary mb-6">Términos y condiciones</p>
        <h1 className="heading-display text-balance text-4xl sm:text-5xl">
          <span className="block text-[var(--color-ink-strong)]">Los términos</span>
          <strong className="block text-[var(--color-on-surface)]">te llegan antes de pagar.</strong>
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-on-surface-reading)]">
          Antes de que pagues, te mandamos por WhatsApp el resumen de tu contratación: el plan, el precio, cómo
          pagás, qué incluye y los términos que aceptás. Si los querés leer antes, pedínoslos y te los mandamos, sin
          compromiso.
        </p>
        <a
          href={whatsappUrl('Hola, antes de contratar quiero leer los términos y condiciones.')}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(BOTON_TINTA, 'mt-8')}
        >
          <WhatsAppIcon className="size-4 text-[#25D366]" />
          Pedir los términos por WhatsApp
        </a>
      </section>
    </div>
  )
}
