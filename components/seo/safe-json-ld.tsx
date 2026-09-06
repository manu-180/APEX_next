/**
 * SafeJsonLd — wrapper que serializa un objeto a JSON-LD inline <script>.
 *
 * SEGURIDAD: el input siempre proviene de constantes controladas por el dev
 * (precios, descripciones schema.org, reviews en `lib/data/*`). No acepta
 * input de usuario.
 *
 * ⚠️ NO volver a renderizar el JSON como hijo de texto (`<script>{json}</script>`):
 * React escapa las comillas a `&quot;` en el HTML del servidor y dentro de un
 * <script> nadie decodifica entidades, así que Google recibe JSON inválido
 * ("Estos datos estructurados no se pueden analizar", GSC 30/08/2026 — 20/20
 * páginas del sitio caídas). Va por dangerouslySetInnerHTML, y el escape de
 * `<` a < es lo que cubre el `</script>` y cualquier inyección de tag.
 */
export function SafeJsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  const json = JSON.stringify(data).replace(/</g, '\u003c')
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
