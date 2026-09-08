/**
 * Server component a proposito. El footer es markup estatico salvo el
 * watermark con parallax (extraido a `FooterWatermark`) y los CTAs de
 * WhatsApp (`WhatsAppOutboundLink`, cliente). Como el shell lo recibe como
 * slot desde `app/layout.tsx`, su arbol no viaja en el bundle de cliente ni
 * se hidrata: es costo que se pagaba en TODAS las rutas.
 */
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { ROUTES, WHATSAPP_PHONE_DISPLAY } from '@/lib/constants'
import { VERTICALS } from '@/lib/data/verticals'
import { whatsappUrl, WA_MSG_FOOTER_LINK } from '@/lib/whatsapp'
import { ApexLogoMark } from '@/components/ui/apex-logo-mark'
import { WhatsAppIcon } from '@/components/ui/icons'
import { WhatsAppOutboundLink } from '@/components/whatsapp/whatsapp-outbound-link'
import { FooterWatermark } from '@/components/layout/footer-watermark'

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

/**
 * El footer es el único bloque que aparece en TODAS las páginas: es la palanca
 * de enlazado interno más fuerte del sitio, y hasta 2026-09-07 la estaba
 * desperdiciando. Tres de sus cinco links de "Servicios" apuntaban a la MISMA
 * URL (`/servicios?tab=web`, que es `/servicios` para un crawler), mientras las
 * dos landings de intención comercial más largas del sitio quedaban casi
 * huérfanas: `/cuanto-cuesta-una-pagina-web` con 2 enlaces entrantes en todo el
 * sitio y `/diseno-de-paginas-web` con 1 — contra 45 de `/sobre-mi`, que no
 * tiene ninguna keyword comercial detrás.
 *
 * Regla al editar: cada entrada apunta a una URL DISTINTA y real. Un `?tab=`
 * no crea una URL nueva a ojos de Google — si un servicio merece su propio
 * link acá, merece su propia página.
 */
const SERVICIOS_LINKS = [
  { label: 'Páginas web a medida', href: ROUTES.disenoWeb },
  { label: 'Tienda online',        href: ROUTES.tiendaOnline },
  { label: 'Landing page',         href: ROUTES.landingPage },
  { label: 'Apps móviles',         href: `${ROUTES.servicios}?tab=mobile` },
  { label: 'Precios y planes',     href: ROUTES.cuantoCuesta },
]

const EXPLORAR_LINKS = [
  { label: 'Blog y guías',    href: ROUTES.blog,         external: false },
  { label: 'Muestrario',      href: ROUTES.muestrario,   external: false },
  { label: 'Agendar reunión', href: ROUTES.contact,      external: false },
  { label: 'Tecnologías',     href: ROUTES.tecnologias,  external: false },
  { label: 'Sobre mí',        href: ROUTES.about,        external: false },
  { label: 'Instagram',       href: 'https://www.instagram.com/apex.stack/', external: true },
]

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="cv-auto relative overflow-hidden"
      style={{ backgroundColor: 'var(--footer-bg)' }}
    >
      {/* Separador superior con gradiente del tema */}
      <div className="divider-theme" aria-hidden="true" />

      {/* Grain de superficie (spec §6) — bajo el contenido z-10 */}
      <span aria-hidden className="noise-overlay pointer-events-none absolute inset-0 z-0" />

      {/* Watermark de marca: outline gigante del tema, puramente decorativo */}
      <FooterWatermark />

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
                'transition-[transform,box-shadow,background-color] duration-200 ease-out',
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

            {/* Contacto visible: número real, clic abre WhatsApp.
                mt-2 + py-3 deja la misma separación visual que el mt-5 previo,
                pero la caja pasa de 20px a 44px de alto tocable: era el peor
                target del sitio y está en el camino de conversión. */}
            <WhatsAppOutboundLink
              waHref={WHATSAPP_FOOTER_HREF}
              className="group mt-2 flex w-fit items-center gap-2.5 py-3 text-sm text-[var(--color-on-surface-variant)] transition-colors duration-200 hover:text-[var(--color-on-surface)]"
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
              <h3 className="footer-heading mb-5">Servicios</h3>
              <ul className="space-y-0.5">
                {SERVICIOS_LINKS.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className={FOOTER_LINK}
                      data-hover
                      data-inspector-title="Una página por intención"
                      data-inspector-desc="Cada servicio tiene su propia URL con su propio contenido, no un tab de la misma página: es lo que le permite a Google rankearlas por separado."
                      data-inspector-cat="SEO"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ── Explorar ──────────────────────────────────────────── */}
            <nav aria-label="Explorar" className="min-w-0">
              <h3 className="footer-heading mb-5">Explorar</h3>
              <ul className="space-y-0.5">
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

        {/* ── Webs por profesión ────────────────────────────────────────
            Fila editorial en línea, no una cuarta columna de links (el brief
            veta el footer de 4 columnas). Es lo que le da a las landings por
            vertical un enlace entrante desde TODAS las páginas: antes solo las
            linkeaban los posts del blog. */}
        <div className="divider-theme mt-14" aria-hidden="true" />
        <nav aria-label="Webs por profesión" className="pt-6">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-2 text-sm">
            <span className="editorial-label editorial-label--primary">
              Webs por profesión
            </span>
            {VERTICALS.map((v, i) => (
              <span key={v.slug} className="flex items-baseline gap-3">
                {i > 0 && (
                  <span aria-hidden className="text-[var(--color-on-surface-variant)] opacity-30">
                    /
                  </span>
                )}
                <Link href={`/${v.slug}`} className={FOOTER_LINK} data-hover>
                  {v.nounPlural.charAt(0).toUpperCase() + v.nounPlural.slice(1)}
                </Link>
              </span>
            ))}
          </p>
        </nav>

        {/* Bottom bar: marca + año + stack */}
        <div className="divider-theme mt-10" aria-hidden="true" />
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
          {/* Sin opacity en el contenedor: la opacidad compuesta apagaba también
              los nombres del stack (el opacity:1 inline no la revertía). Se
              atenúa solo el texto plano; Next.js/Tailwind quedan a pleno color. */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[var(--color-on-surface-variant)] opacity-60">Hecho con</span>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Next.js
            </span>
            <span className="text-[var(--color-on-surface-variant)] opacity-60">+</span>
            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
              Tailwind
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
