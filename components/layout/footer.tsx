import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { whatsappUrl, WA_MSG_FOOTER_LINK } from '@/lib/whatsapp'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'

const FOOTER_LINKS = {
  servicios: [
    { label: 'Landing Page', href: ROUTES.servicios },
    { label: 'Web Interactiva', href: ROUTES.servicios },
    { label: 'App móvil', href: `${ROUTES.servicios}?tab=mobile` },
  ],
  stack: [
    { label: 'Flutter', href: '/#stack' },
    { label: 'Next.js', href: '/#stack' },
    { label: 'Supabase', href: '/#stack' },
    { label: 'Riverpod', href: '/#stack' },
    { label: 'TypeScript', href: '/#stack' },
  ],
  contacto: [
    { label: 'Agendar reunión', href: ROUTES.contact },
    { label: 'WhatsApp', href: whatsappUrl(WA_MSG_FOOTER_LINK), external: true },
    { label: 'Sobre mí', href: ROUTES.about },
  ],
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--footer-bg)' }}>
      {/* Top gradient separator */}
      <div
        className="h-px"
        style={{
          background: 'linear-gradient(to right, transparent 5%, rgba(var(--color-primary-rgb), 0.25) 30%, rgba(6, 182, 212, 0.2) 50%, rgba(var(--color-primary-rgb), 0.25) 70%, transparent 95%)',
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <ApexLogoMark />
              <span className="font-bold text-[var(--color-on-surface)] glow-text">APEX</span>
            </div>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-[240px]">
              Desarrollo Full-Stack & Mobile. Apps que resuelven problemas reales.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="footer-heading text-sm font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.servicios.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm"
                    data-hover
                    data-inspector-title="Link de Navegación Interna"
                    data-inspector-desc="Este link usa el router de Next.js para navegar entre páginas sin recargar el navegador (client-side navigation). La transición es instantánea porque Next.js pre-carga las páginas en segundo plano cuando el link entra en el viewport."
                    data-inspector-cat="Performance"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h4 className="footer-heading text-sm font-semibold mb-4">Tech Stack</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.stack.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="footer-link text-sm"
                    data-hover
                    data-inspector-title="Anchor Link con Scroll Suave"
                    data-inspector-desc="Este link navega directamente a la sección de tecnologías usando un anchor (#stack). El navegador hace scroll suave al elemento con ese ID — cero JavaScript necesario. Es navegación accesible: funciona sin CSS y sin JS, como debe ser."
                    data-inspector-cat="UX · Accesibilidad"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="footer-heading text-sm font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.contacto.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    l.label === 'WhatsApp' ? (
                      <WhatsAppOutboundLink
                        waHref={l.href}
                        className="footer-link text-sm"
                        data-hover
                        data-inspector-title="WhatsApp + página de gracias"
                        data-inspector-desc="Abre WhatsApp en nueva pestaña y muestra la confirmación en esta misma ventana, igual que el resto de los CTAs del sitio."
                        data-inspector-cat="Seguridad"
                      >
                        {l.label}
                      </WhatsAppOutboundLink>
                    ) : (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link text-sm"
                        data-hover
                        data-inspector-title="Link Externo con Protección Anti-Tabnabbing"
                        data-inspector-desc="Cada link externo tiene rel=noopener noreferrer. Esto evita el ataque 'tabnabbing': sin esta protección, la página externa podría redirigir tu pestaña original a otra URL maliciosa. Es un detalle de seguridad invisible que protege al visitante sin que lo note."
                        data-inspector-cat="Seguridad"
                      >
                        {l.label}
                      </a>
                    )
                  ) : (
                    <Link
                      href={l.href}
                      className="footer-link text-sm"
                      data-hover
                      data-inspector-title="Navegación interna"
                      data-inspector-desc="Link interno con el router de Next.js: sin recarga completa y el estado del tema se mantiene."
                      data-inspector-cat="Performance"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-6 flex flex-col gap-5"
          style={{
            borderTop: '1px solid',
            borderImage: 'linear-gradient(to right, transparent, rgba(var(--color-primary-rgb), 0.15), transparent) 1',
          }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              &copy; {new Date().getFullYear()} Manuel Navarro. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-2 gap-y-1 text-[11px] sm:text-xs tracking-[0.02em] text-[var(--color-on-surface-variant)]">
              <span>
                Desarrollado <span className="tabular-nums">100%</span> por{' '}
                <span className="font-medium text-[var(--color-on-surface)]">
                  Manuel Navarro
                </span>
              </span>
              <span className="text-[var(--color-on-surface-variant)]/40" aria-hidden>
                ·
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <span>Hecho con</span>
                <span className="text-[var(--color-primary)] font-semibold">Next.js</span>
                <span>+</span>
                <span className="text-[var(--color-primary)] font-semibold">Tailwind</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
