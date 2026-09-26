import Link from 'next/link'
import { HORARIO_ATENCION, ROUTES } from '@/lib/constants'
import { SOLICITUD_EN_LINEA, type TipoSolicitud } from '@/lib/legal/config'
import { mensajeWhatsApp } from '@/lib/legal/whatsapp'
import { mailDeContacto } from '@/lib/legal/vendedor'
import { whatsappUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils/cn'
import { ArrowRightIcon, WhatsAppIcon } from '@/components/ui/icons'
import { ClockIcon, MailIcon } from '@/components/legal/iconos'
import { BOTON_TINTA, FOCO, SUPERFICIE } from '@/components/legal/estilos'
import { GridBackground } from '@/components/ui/grid-background'
import { ConsumerRequestForm } from '@/components/legal/consumer-request-form'

interface Contenido {
  etiqueta: string
  tituloSuave: string
  tituloFuerte: string
  bajada: string
  bajadaSinFormulario: string
  pasos: { titulo: string; texto: string }[]
  nota?: string
  asuntoMail: string
  baseLegal: string
}

const CONTENIDO: Record<TipoSolicitud, Contenido> = {
  arrepentimiento: {
    etiqueta: 'Botón de arrepentimiento',
    tituloSuave: '¿Cambiaste de idea?',
    tituloFuerte: 'Te devolvemos lo que pagaste.',
    bajada:
      'Tenés 10 días corridos desde que contratás para arrepentirte, sin dar motivos y sin ningún costo. Completá tus datos y te damos el código de tu pedido en el momento.',
    bajadaSinFormulario:
      'Tenés 10 días corridos desde que contratás para arrepentirte, sin dar motivos y sin ningún costo. Escribinos y te respondemos con el código de tu pedido.',
    pasos: [
      {
        titulo: 'Te confirmamos en 24 horas',
        texto: 'Te escribimos por el medio que elegiste, con el código de tu pedido.',
      },
      {
        titulo: 'Frenamos todo',
        texto: 'Paramos lo que esté en curso. Si tu página ya estaba online, la damos de baja.',
      },
      {
        titulo: 'Te devolvemos todo lo que pagaste',
        texto:
          'Por el mismo medio de pago. Iniciamos la devolución dentro de los 5 días hábiles; cuándo la ves acreditada depende de tu banco, tu tarjeta o Mercado Pago.',
      },
    ],
    nota:
      'El mantenimiento y el marketing también tienen 10 días desde que los contratás. En el marketing pausamos las campañas en el momento; lo que ya se invirtió en anuncios lo cobró Google, no APEX.',
    asuntoMail: 'Me arrepiento de mi contratación',
    baseLegal:
      'Derecho de arrepentimiento: artículo 34 de la Ley 24.240, artículos 1110 y siguientes del Código Civil y Comercial y Disposición 954/2025.',
  },
  baja: {
    etiqueta: 'Botón de baja de servicio',
    tituloSuave: 'Dar de baja un servicio,',
    tituloFuerte: 'sin vueltas.',
    bajada:
      'El mantenimiento y el marketing en Google se dan de baja cuando quieras y sin costo. Completá tus datos y te damos el código de tu pedido en el momento.',
    bajadaSinFormulario:
      'El mantenimiento y el marketing en Google se dan de baja cuando quieras y sin costo. Escribinos y te respondemos con el código de tu pedido.',
    pasos: [
      {
        titulo: 'Te confirmamos en 24 horas',
        texto: 'Te escribimos por el medio que elegiste, con el código de tu pedido.',
      },
      {
        titulo: 'Mantenimiento',
        texto: 'El plan sigue hasta el final del mes que ya pagaste y no se te cobra más.',
      },
      {
        titulo: 'Marketing en Google',
        texto: 'Pausamos las campañas y sacamos nuestro acceso. La cuenta de Google Ads sigue siendo tuya.',
      },
    ],
    nota:
      'Tu página sigue online: el hosting va incluido y no depende de ningún plan. El débito del mantenimiento también lo podés cancelar desde tu cuenta de Mercado Pago.',
    asuntoMail: 'Quiero dar de baja un servicio',
    baseLegal:
      'Baja de servicios: artículo 10 ter de la Ley 24.240 y Disposición 954/2025.',
  },
}

const LINK_CANAL = cn(
  'group inline-flex min-h-11 items-center gap-2.5 rounded-xl px-1 text-sm font-semibold text-[var(--color-on-surface)]',
  'transition-colors duration-150 hover:text-[var(--color-primary)]',
  FOCO,
)

export function ConsumerRequestPage({ tipo }: { tipo: TipoSolicitud }) {
  const c = CONTENIDO[tipo]
  const mail = mailDeContacto()
  const whatsapp = whatsappUrl(mensajeWhatsApp(tipo))

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] print:hidden"
      >
        <GridBackground showRadialLight />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 md:pt-28">
        <header className="max-w-2xl">
          <p className="editorial-label editorial-label--primary mb-6">{c.etiqueta}</p>
          <h1 className="heading-display text-balance text-4xl sm:text-5xl">
            <span className="block text-[var(--color-ink-strong)]">{c.tituloSuave}</span>
            <strong className="block text-[var(--color-on-surface)]">{c.tituloFuerte}</strong>
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[var(--color-on-surface-reading)]">
            {SOLICITUD_EN_LINEA ? c.bajada : c.bajadaSinFormulario}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
          <section aria-label="Tu pedido" className={cn(SUPERFICIE, 'p-6 sm:p-8 lg:self-start')}>
            {SOLICITUD_EN_LINEA ? (
              <ConsumerRequestForm tipo={tipo} />
            ) : (
              <div>
                <h2 className="font-heading text-xl font-extrabold tracking-tight text-[var(--color-on-surface)]">
                  Pedilo por WhatsApp
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                  El mensaje ya va escrito: solo sumá tu nombre y qué contrataste. No tenés que registrarte ni
                  crear una cuenta.
                </p>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cn(BOTON_TINTA, 'mt-6')}>
                  <WhatsAppIcon className="size-4 text-[#25D366]" />
                  Escribir por WhatsApp
                </a>
                {mail && (
                  <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
                    O por mail a{' '}
                    <a
                      href={`mailto:${mail}?subject=${encodeURIComponent(c.asuntoMail)}`}
                      className={cn(
                        'rounded font-semibold text-[var(--color-on-surface)] underline decoration-[rgba(var(--color-primary-rgb),0.5)] underline-offset-4 hover:decoration-[var(--color-primary)]',
                        FOCO,
                      )}
                    >
                      {mail}
                    </a>
                    .
                  </p>
                )}
              </div>
            )}
          </section>

          <aside className="flex flex-col gap-6">
            <section aria-labelledby={`${tipo}-pasos`} className={cn(SUPERFICIE, 'p-6 sm:p-7')}>
              <h2
                id={`${tipo}-pasos`}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]"
              >
                Qué pasa después
              </h2>
              <ol className="mt-5 space-y-5">
                {c.pasos.map((paso, i) => (
                  <li key={paso.titulo} className="grid grid-cols-[auto_1fr] gap-x-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex size-6 items-center justify-center rounded-full border border-[rgba(var(--color-primary-rgb),0.35)] font-mono text-[11px] font-bold text-[var(--color-primary)]"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">{paso.titulo}</p>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                        {paso.texto}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              {c.nota && (
                <p className="mt-6 border-t border-[var(--glass-border)] pt-5 text-xs leading-relaxed text-[var(--color-on-surface-variant)]">
                  {c.nota}
                </p>
              )}
            </section>

            <section aria-labelledby={`${tipo}-canales`} className="px-1">
              <h2 id={`${tipo}-canales`} className="text-sm font-semibold text-[var(--color-on-surface)]">
                {SOLICITUD_EN_LINEA ? '¿Preferís escribirnos?' : 'Horario de atención'}
              </h2>
              <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
                <ClockIcon className="mt-0.5 size-4 shrink-0" />
                <span>
                  Te atendemos de {HORARIO_ATENCION}. El pedido lo podés hacer a cualquier hora.
                </span>
              </p>
              {SOLICITUD_EN_LINEA && (
                <div className="mt-3 flex flex-col items-start gap-1">
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={LINK_CANAL}>
                    <WhatsAppIcon className="size-4 text-[#25D366]" />
                    Escribir por WhatsApp
                  </a>
                  {mail && (
                    <a href={`mailto:${mail}?subject=${encodeURIComponent(c.asuntoMail)}`} className={LINK_CANAL}>
                      <MailIcon className="size-4" />
                      {mail}
                    </a>
                  )}
                </div>
              )}
              <Link
                href={ROUTES.terminos}
                prefetch={false}
                className={cn(LINK_CANAL, 'mt-2 font-medium text-[var(--color-on-surface-variant)]')}
              >
                Leer los términos y condiciones
                <ArrowRightIcon className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </Link>
            </section>
          </aside>
        </div>

        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-[var(--color-on-surface-variant)] opacity-80">
          {c.baseLegal}
        </p>
      </div>
    </div>
  )
}
