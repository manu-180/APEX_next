/**
 * shrink-heavy-sources.mjs — reduce el peso de las imágenes FUENTE pesadas y
 * genera blurDataURL para placeholders premium en <Image>.
 *
 * Distinto de optimize-images.mjs (que solo genera siblings .webp/.avif sin tocar
 * la fuente). Acá la fuente pesada misma se redimensiona: next/image igual sirve
 * AVIF/WebP, pero una fuente de 2.2 MB infla el repo, el dev server y la primera
 * optimización. Estas 4 quedaron fuera del pipeline:
 *   manuel.jpg 2.2MB · mi-lugar.png 1.4MB · imaginate.png 1MB · handy.png 1MB
 *
 * Nunca bajamos de display real ×2 (retina). Idempotente: salta si ya está liviana.
 *
 * Uso:  node scripts/shrink-heavy-sources.mjs
 */
import sharp from 'sharp'
import { readFile, writeFile, stat, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const kb = (n) => `${(n / 1024).toFixed(0)} KB`

/** blurDataURL diminuto (webp 16px) desde un buffer de imagen. */
async function makeBlur(buf) {
  const out = await sharp(buf).resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer()
  return `data:image/webp;base64,${out.toString('base64')}`
}

const targets = [
  {
    // Foto del founder: se muestra ≤360px (home) y 80px (sobre-mí). 900px sobra para retina.
    file: 'public/manuel.jpg',
    maxWidth: 900,
    skipUnder: 300_000,
    encode: (img) => img.jpeg({ quality: 82, mozjpeg: true }),
    blurKey: 'MANUEL_BLUR',
  },
  {
    // Screenshot del featured card → WebP fuente (la ref del componente pasa a .webp).
    file: 'public/images/clients/mi-lugar.png',
    out: 'public/images/clients/mi-lugar.webp',
    deleteSource: true,
    maxWidth: 1600,
    encode: (img) => img.webp({ quality: 80, effort: 6 }),
    blurKey: 'MI_LUGAR_BLUR',
  },
  // Nota: imaginate.png / handy.png son orphans (sin ref en código) y ya están
  // razonablemente comprimidos — re-encodearlos los agrandaba, así que se excluyen.
]

const blurs = {}

for (const t of targets) {
  const src = join(ROOT, t.file)
  if (!existsSync(src)) {
    console.log(`⚠ no existe: ${t.file} — salto`)
    continue
  }
  const before = (await stat(src)).size
  const buf = await readFile(src)
  const meta = await sharp(buf).metadata()

  if (!t.out && before <= t.skipUnder && (meta.width ?? 0) <= t.maxWidth) {
    console.log(`✓ ya optimizada: ${t.file} (${kb(before)}, ${meta.width}px)`)
    if (t.blurKey) blurs[t.blurKey] = await makeBlur(buf)
    continue
  }

  const outBuf = await t
    .encode(sharp(buf).resize({ width: t.maxWidth, withoutEnlargement: true }))
    .toBuffer()

  await writeFile(join(ROOT, t.out ?? t.file), outBuf)
  if (t.deleteSource && t.out && t.out !== t.file) await rm(src)

  console.log(`↓ ${t.file} → ${t.out ?? t.file}   ${kb(before)} → ${kb(outBuf.length)}`)
  if (t.blurKey) blurs[t.blurKey] = await makeBlur(outBuf)
}

const moduleBody = `// AUTO-GENERADO por scripts/shrink-heavy-sources.mjs — no editar a mano.
// blurDataURL diminutos (webp 16px) para placeholder="blur" en next/image.

${Object.entries(blurs).map(([k, v]) => `export const ${k} =\n  '${v}'`).join('\n\n')}
`
await writeFile(join(ROOT, 'lib/data/image-blur.ts'), moduleBody)
console.log(`\n✓ lib/data/image-blur.ts (${Object.keys(blurs).length} blurs)`)
