/**
 * SafeJsonLd — wrapper que serializa un objeto a JSON-LD inline <script>.
 *
 * SEGURIDAD: el input siempre proviene de constantes controladas por el dev
 * (precios, descripciones schema.org, reviews en `lib/data/*`). No acepta
 * input de usuario.
 *
 * Patrón: React renderiza `{json}` como texto dentro del `<script>`. El
 * navegador no parsea HTML dentro de `<script type="application/ld+json">`,
 * así que no hay riesgo XSS. La única secuencia peligrosa es `</script>` —
 * la reemplazamos preventivamente.
 *
 * Si algún campo del schema empieza a venir de DB/API/form, sanitizar antes.
 */
export function SafeJsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  const json = JSON.stringify(data).replace(/<\/script/gi, '<\\/script')
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {json}
    </script>
  )
}
