import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_FOOTER_LINK } from '@/lib/whatsapp'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

const SERVICIOS_LINKS = [
  { label: 'Landing Page',     href: `${ROUTES.servicios}?tab=web` },
  { label: 'Web Interactiva',  href: `${ROUTES.servicios}?tab=web` },
  { label: 'E-commerce',       href: `${ROUTES.servicios}?tab=web` },
  { label: 'App Mobile',       href: `${ROUTES.servicios}?tab=mobile` },
  { label: 'Automatizaciones', href: `${ROUTES.servicios}?tab=mobile` },
]

const CONTACTO_LINKS = [
  {
    label: 'Agendar reunión',
    href: ROUTES.contact,
    type: 'internal' as const,
  },
  {
    label: 'WhatsApp',
    href: whatsappUrl(WA_MSG_FOOTER_LINK),
    type: 'whatsapp' as const,
  },
  {
    label: 'Tecnologías',
    href: ROUTES.tecnologias,
    type: 'internal' as const,
  },
  {
    label: 'Sobre mí',
    href: ROUTES.about,
    type: 'internal' as const,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/apex.stack/',
    type: 'external' as const,
  },
]

export function Footer() {
  return (
    <footer id="site-footer" style={{ backgroundColor: 'var(--footer-bg)' }}>
      {/* Top gradient separator — theme-aware */}
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.25), transparent)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        {/* Main — 3-column: editorial CTA (wide) + Servicios + Contacto */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-12 lg:gap-8">

          {/* ── Left: statement + CTA ─────────────────────────────── */}
          <div>
            <div
              className="w-10 h-0.5 mb-6 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <h2 className="font-heading leading-tight mb-5">
              <span className="block text-4xl sm:text-5xl font-light text-[var(--color-on-surface-variant)]">
                ¿Listo para construir
              </span>
              <span className="block text-4xl sm:text-5xl font-extrabold text-[var(--color-on-surface)]">
                algo increíble?
              </span>
            </h2>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-sm mb-8">
              Full-Stack & Mobile. Apps con diseño premium que resuelven problemas reales — entregadas a tiempo.
            </p>
            <WhatsAppOutboundLink
              waHref={whatsappUrl(WA_MSG_FOOTER_LINK)}
              className={cn(
                'inline-flex items-center justify-center gap-2 font-semibold select-none',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface-base)]',
                'btn-tech btn-primary-tech active:scale-[0.97]',
                'h-12 px-7 text-sm rounded-xl',
              )}
              data-hover
              data-inspector-title="WhatsApp + Thank-you page"
              data-inspector-desc="Abre WhatsApp con mensaje pre-armado y muestra la página de confirmación en esta ventana — mismo patrón que el CTA del Hero."
              data-inspector-cat="Conversión"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.118 1.529 5.845L.057 23.57a.5.5 0 0 0 .614.614l5.718-1.472A11.953 11.953 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.523-5.22-1.435l-.374-.22-3.876.997.997-3.876-.22-.374A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Escribime por WhatsApp
            </WhatsAppOutboundLink>
          </div>

          {/* ── Servicios column ──────────────────────────────────── */}
          <nav aria-label="Servicios">
            <h4 className="footer-heading mb-5">Servicios</h4>
            <ul className="space-y-1.5">
              {SERVICIOS_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm"
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

          {/* ── Contacto column ───────────────────────────────────── */}
          <nav aria-label="Contacto">
            <h4 className="footer-heading mb-5">Contacto</h4>
            <ul className="space-y-1.5">
              {CONTACTO_LINKS.map((l) => {
                if (l.type === 'whatsapp') {
                  return (
                    <li key={l.label}>
                      <WhatsAppOutboundLink
                        waHref={l.href}
                        className="footer-link text-sm"
                        data-hover
                        data-inspector-title="WhatsApp + página de gracias"
                        data-inspector-desc="Abre WhatsApp en nueva pestaña y muestra la confirmación en esta misma ventana."
                        data-inspector-cat="Conversión"
                      >
                        {l.label}
                      </WhatsAppOutboundLink>
                    </li>
                  )
                }
                if (l.type === 'external') {
                  return (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link text-sm"
                        data-hover
                        data-inspector-title="Link Externo — Anti-Tabnabbing"
                        data-inspector-desc="rel=noopener noreferrer evita que la pestaña externa redirija la actual — protección estándar contra tabnabbing."
                        data-inspector-cat="Seguridad"
                      >
                        {l.label}
                      </a>
                    </li>
                  )
                }
                return (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="footer-link text-sm"
                      data-hover
                      data-inspector-title="Navegación Interna"
                      data-inspector-desc="Client-side navigation — sin recarga, estado del tema preservado."
                      data-inspector-cat="Performance"
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{
            borderTop: '1px solid',
            borderImage:
              'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.12), transparent) 1',
          }}
        >
          <div className="flex items-center gap-2">
            <ApexLogoMark />
            <span className="font-bold text-[var(--color-on-surface)] glow-text">APEX</span>
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
