import Link from 'next/link'
import { ROUTES, WHATSAPP_DEFAULT } from '@/lib/constants'

const FOOTER_LINKS = {
  servicios: [
    { label: 'Landing Page', href: ROUTES.servicios },
    { label: 'Web Interactiva', href: ROUTES.servicios },
    { label: 'App Móvil', href: `${ROUTES.servicios}?tab=mobile` },
    { label: 'Estimador', href: `${ROUTES.servicios}#estimador` },
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
    { label: 'WhatsApp', href: WHATSAPP_DEFAULT, external: true },
    { label: 'Sobre mí', href: ROUTES.about },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-surface-high/50 bg-surface-lowest">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-extrabold">
                A
              </span>
              <span className="font-bold text-on-surface">APEX</span>
            </div>
            <p className="text-sm text-on-surface-variant leading-relaxed max-w-[240px]">
              Desarrollo Full-Stack & Mobile. Apps que resuelven problemas reales.
            </p>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-4">Servicios</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.servicios.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors" data-hover>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-4">Tech Stack</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.stack.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors" data-hover>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-sm font-semibold text-on-surface mb-4">Contacto</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.contacto.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-on-surface-variant hover:text-primary transition-colors" data-hover>
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-on-surface-variant hover:text-primary transition-colors" data-hover>
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-surface-high/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-surface-variant">
            &copy; {new Date().getFullYear()} Manuel Navarro. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1 text-xs text-on-surface-variant">
            <span>Hecho con</span>
            <span className="text-primary font-semibold">Next.js</span>
            <span>+</span>
            <span className="text-primary font-semibold">Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
