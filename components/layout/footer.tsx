import type { CSSProperties } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { ROUTES, WHATSAPP_PHONE_DISPLAY } from '@/lib/constants'
import { whatsappUrl, WA_MSG_FOOTER_LINK } from '@/lib/whatsapp'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

const WHATSAPP_FOOTER_HREF = whatsappUrl(WA_MSG_FOOTER_LINK)

/** Verde oficial WhatsApp — única excepción de hex permitida (DESIGN_BRIEF §2). */
const WHATSAPP_GREEN = '#25D366'

/** `.footer-link` (globals.css) ya da hover + underline-reveal, pero no tiene
 *  estado de teclado. Componemos focus-visible + press feedback con Tailwind
 *  sin tocar el CSS global. */
const FOOTER_LINK = cn(
  'footer-link text-sm rounded outline-none',
  'transition-transform duration-150 ease-out active:scale-[0.97]',
  'focus-visible:ring-2 focus-visible:ring-[rgba(var(--color-primary-rgb),0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)] focus-visible:text-[var(--color-primary)]',
)

const SERVICIOS_LINKS = [
  { label: 'Landing Page',     href: `${ROUTES.servicios}?tab=web` },
  { label: 'Web Interactiva',  href: `${ROUTES.servicios}?tab=web` },
  { label: 'E-commerce',       href: `${ROUTES.servicios}?tab=web` },
  { label: 'App Mobile',       href: `${ROUTES.servicios}?tab=mobile` },
  { label: 'Automatizaciones', href: `${ROUTES.servicios}?tab=mobile` },
]

const EXPLORAR_LINKS = [
  { label: 'Agendar reunión', href: ROUTES.contact,      external: false },
  { label: 'Tecnologías',     href: ROUTES.tecnologias,  external: false },
  { label: 'Sobre mí',        href: ROUTES.about,        external: false },
  { label: 'Instagram',       href: 'https://www.instagram.com/apex.stack/', external: true },
]

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden"
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      {/* Separador superior con gradiente del tema */}
      <div className="divider-theme" aria-hidden="true" />

      {/* Watermark de marca: outline gigante del tema, puramente decorativo */}
      <div
        aria-hidden="true"
        className="section-number absolute -bottom-8 right-0 z-0 hidden select-none lg:block"
        style={
          {
            '--sn-stroke-alpha': '0.07',
            fontSize: 'clamp(9rem, 16vw, 14rem)',
          } as CSSProperties
        }
      >
        APEX
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 pb-10">
        {/* Main — asimétrico: bloque editorial ancho + 2 columnas discretas */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr] lg:gap-8">

          {/* ── Bloque editorial: CTA WhatsApp prominente ─────────── */}
          <div>
            <p className="editorial-label editorial-label--primary mb-6">
              Contacto directo
            </p>

            <h2 className="heading-display mb-5 text-4xl sm:text-5xl">
              <span className="block text-[var(--color-on-surface-variant)]">
                ¿Arrancamos con
              </span>
              <strong className="block text-[var(--color-on-surface)]">
                tu proyecto?
              </strong>
            </h2>

            <p className="mb-8 max-w-sm text-sm leading-relaxed text-[var(--color-on-surface-variant)]">
              Contame tu idea por WhatsApp. Te respondo en menos de 1 hora con
              los próximos pasos, sin compromiso.
            </p>

            <WhatsAppOutboundLink
              waHref={WHATSAPP_FOOTER_HREF}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-wa active:scale-[0.97]',
                'h-12 px-7 text-sm rounded-xl',
              )}
              data-hover
              data-inspector-title="WhatsApp + Thank-you page"
              data-inspector-desc="Abre WhatsApp con mensaje pre-armado y muestra la página de confirmación en esta ventana — mismo patrón que el CTA del Hero."
              data-inspector-cat="Conversión"
            >
              <WhatsAppIcon className="size-4" />
              Escribime por WhatsApp
            </WhatsAppOutboundLink>

            {/* Contacto visible: número real, clic abre WhatsApp */}
            <WhatsAppOutboundLink
              waHref={WHATSAPP_FOOTER_HREF}
              className="group mt-5 flex w-fit items-center gap-2.5 text-sm text-[var(--color-on-surface-variant)] transition-colors duration-200 hover:text-[var(--color-on-surface)]"
              data-hover
              data-inspector-title="Número visible"
              data-inspector-desc="Contacto a la vista, sin formularios de por medio — el clic abre la misma conversación de WhatsApp."
              data-inspector-cat="Conversión"
            >
              {/* Verde WhatsApp: excepción única de hex permitida por el brief */}
              <span aria-hidden="true" className="flex-none" style={{ color: WHATSAPP_GREEN }}>
                <WhatsAppIcon className="size-4" />
              </span>
              <span className="font-heading font-semibold tracking-wide tabular-nums">
                {WHATSAPP_PHONE_DISPLAY}
              </span>
            </WhatsAppOutboundLink>
          </div>

          {/* Móvil: 2 columnas lado a lado; lg: integran el grid de 3 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-0 lg:contents">
            {/* ── Servicios ─────────────────────────────────────────── */}
            <nav aria-label="Servicios" className="min-w-0">
              <h4 className="footer-heading mb-5">Servicios</h4>
              <ul className="space-y-1.5">
                {SERVICIOS_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={FOOTER_LINK}
                      data-hover
                      data-inspector-title="Navegación a Servicios"
                      data-inspector-desc="Client-side navigation con Next.js — activa el tab correcto vía query param ?tab=web o ?tab=mobile."
                      data-inspector-cat="Performance"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Explorar ──────────────────────────────────────────── */}
            <nav aria-label="Explorar" className="min-w-0">
              <h4 className="footer-heading mb-5">Explorar</h4>
              <ul className="space-y-1.5">
                {EXPLORAR_LINKS.map((l) =>
                  l.external ? (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={FOOTER_LINK}
                        data-hover
                        data-inspector-title="Link Externo — Anti-Tabnabbing"
                        data-inspector-desc="rel=noopener noreferrer evita que la pestaña externa redirija la actual — protección estándar contra tabnabbing."
                        data-inspector-cat="Seguridad"
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className={FOOTER_LINK}
                        data-hover
                        data-inspector-title="Navegación Interna"
                        data-inspector-desc="Client-side navigation — sin recarga, estado del tema preservado."
                        data-inspector-cat="Performance"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar: marca + año + stack */}
        <div className="divider-theme mt-14" aria-hidden="true" />
        <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <ApexLogoMark />
            <div className="flex flex-col">
              <span className="font-heading font-extrabold leading-tight text-[var(--color-on-surface)] glow-text">
                APEX
              </span>
              <span className="text-[11px] leading-tight text-[var(--color-on-surface-variant)]">
                Web y apps a medida — Buenos Aires
              </span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-on-surface-variant)] opacity-60">
            &copy; {new Date().getFullYear()} Manuel Navarro. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] opacity-60">
            Hecho con{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary)', opacity: 1 }}>
              Next.js
            </span>{' '}
            +{' '}
            <span className="font-semibold" style={{ color: 'var(--color-primary)', opacity: 1 }}>
              Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
