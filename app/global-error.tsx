'use client'

import { useEffect } from 'react'
import { WHATSAPP_NUMBER } from '@/lib/constants'

/**
 * Error global — reemplaza el <html> entero, así que acá NO existe nada del
 * resto del sitio: ni globals.css, ni los providers de tema, ni el AppShell,
 * ni gtag. Todo lo que se ve tiene que viajar en este archivo.
 *
 * Antes esto renderizaba el `NextError` pelado de Next: pantalla blanca, tipografía
 * del sistema y cero salidas. Un visitante que llega desde un anuncio pago y ve
 * eso no vuelve. Ahora hay marca, una explicación humana y dos salidas reales:
 * recargar y WhatsApp (el canal que igual funciona aunque el sitio no).
 *
 * El link de WhatsApp es un <a> plano a propósito: `WhatsAppOutboundLink` y el
 * tracking de conversión dependen del router y de gtag, y ninguno de los dos
 * está montado en este árbol. Es una salida de rescate, no un CTA medido.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Visible en la consola del navegador y en los logs de Vercel (via report).
    console.error('[apex:global-error]', error)
  }, [error])

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hola Manuel, la web me tiró un error y no pude seguir. ¿Me escribís por acá?',
  )}`

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Algo salió mal — APEX</title>
      </head>
      <body>
        {/* Fondo con profundidad (nada de negro plano): base slate + dos glows
            radiales muy tenues. Todo en CSS inline porque globals.css no cargó. */}
        <style>{`
          *,*::before,*::after{box-sizing:border-box}
          html,body{margin:0;padding:0}
          body{
            min-height:100dvh;
            font-family:ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
            color:#e6e8f0;
            background-color:#080a12;
            background-image:
              radial-gradient(ellipse 70% 45% at 50% -8%, rgba(99,140,255,0.14), transparent 62%),
              radial-gradient(ellipse 45% 35% at 82% 100%, rgba(255,138,76,0.07), transparent 60%);
            background-attachment:fixed;
            caret-color:transparent;
            -webkit-font-smoothing:antialiased;
          }
          .ge-wrap{
            min-height:100dvh;display:flex;align-items:center;justify-content:center;
            padding:clamp(1.5rem,6vw,4rem);
          }
          .ge-card{
            width:100%;max-width:34rem;text-align:center;
            border:1px solid rgba(255,255,255,0.09);
            border-radius:1.5rem;
            padding:clamp(1.75rem,5vw,3rem);
            background:rgba(255,255,255,0.035);
            box-shadow:
              inset 0 1px 0 rgba(255,255,255,0.07),
              0 24px 60px -32px rgba(2,6,23,0.9);
          }
          .ge-tag{
            display:inline-flex;align-items:center;gap:.55rem;
            font-size:.625rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;
            color:#ffa877;border:1px solid rgba(255,138,76,0.3);
            background:rgba(255,138,76,0.08);
            border-radius:999px;padding:.35rem .85rem;margin-bottom:1.75rem;
          }
          .ge-dot{width:.375rem;height:.375rem;border-radius:999px;background:#ffa877}
          .ge-h1{
            margin:0;line-height:1.05;letter-spacing:-0.03em;
            font-size:clamp(1.85rem,7vw,2.75rem);font-weight:300;color:#9aa3bd;
          }
          .ge-h1 strong{display:block;font-weight:800;color:#f2f4fa}
          .ge-p{
            margin:1rem auto 0;max-width:26rem;
            font-size:.9375rem;line-height:1.65;color:#98a1ba;
          }
          .ge-rule{
            width:5rem;height:1px;margin:1.75rem auto;
            background:linear-gradient(to right,transparent,rgba(99,140,255,0.45),transparent);
          }
          .ge-actions{display:flex;flex-direction:column;gap:.75rem;align-items:stretch}
          @media (min-width:480px){.ge-actions{flex-direction:row;justify-content:center}}
          .ge-btn{
            display:inline-flex;align-items:center;justify-content:center;gap:.6rem;
            min-height:3rem;padding:0 1.5rem;border-radius:.85rem;
            font-size:.875rem;font-weight:700;text-decoration:none;cursor:pointer;
            border:1px solid transparent;
            transition:transform .25s cubic-bezier(0.22,1,0.36,1),box-shadow .25s cubic-bezier(0.22,1,0.36,1),background-color .25s;
          }
          .ge-btn:hover{transform:translateY(-1px)}
          .ge-btn:active{transform:scale(.975)}
          .ge-btn:focus-visible{outline:2px solid #7fa2ff;outline-offset:2px}
          .ge-wa{
            color:#fff;
            background:linear-gradient(135deg,#25D366 0%,#128C7E 100%);
            box-shadow:0 12px 30px -12px rgba(37,211,102,0.5);
          }
          .ge-ghost{
            color:#cdd4e6;background:rgba(255,255,255,0.04);
            border-color:rgba(255,255,255,0.14);
          }
          .ge-ghost:hover{background:rgba(255,255,255,0.08)}
          .ge-meta{
            margin:1.75rem 0 0;font-size:.6875rem;letter-spacing:.06em;color:#5f6880;
            font-family:ui-monospace,SFMono-Regular,Menlo,monospace;word-break:break-all;
          }
          @media (prefers-reduced-motion:reduce){
            .ge-btn{transition:none}
            .ge-btn:hover,.ge-btn:active{transform:none}
          }
        `}</style>

        <div className="ge-wrap">
          <main className="ge-card">
            <p className="ge-tag">
              <span className="ge-dot" aria-hidden="true" />
              Falla del sistema
            </p>

            <h1 className="ge-h1">
              Algo se rompió
              <strong>de nuestro lado.</strong>
            </h1>

            <p className="ge-p">
              No es tu conexión ni algo que hayas hecho mal. Probá recargar; si
              vuelve a pasar, escribime por WhatsApp y lo resolvemos por ahí
              mismo.
            </p>

            <div className="ge-rule" aria-hidden="true" />

            <div className="ge-actions">
              <a className="ge-btn ge-wa" href={waHref}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.06 1.6 5.8L2 22l4.42-1.68a9.87 9.87 0 0 0 5.62 1.72h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.62 1 .7-2.56-.2-.31a8.18 8.18 0 0 1-1.25-4.35c0-4.53 3.7-8.22 8.24-8.22a8.22 8.22 0 0 1 0 16.44Zm4.52-6.15c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.63.8-.78.96-.14.17-.29.19-.53.07-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.12.25-.29.37-.44.12-.15.16-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z" />
                </svg>
                Escribirme por WhatsApp
              </a>

              <button type="button" className="ge-btn ge-ghost" onClick={() => reset()}>
                Reintentar
              </button>

              <a className="ge-btn ge-ghost" href="/">
                Volver al inicio
              </a>
            </div>

            {error.digest && (
              <p className="ge-meta">Referencia del error: {error.digest}</p>
            )}
          </main>
        </div>
      </body>
    </html>
  )
}
