// Optimiza los screenshots capturados → public/projects/showcase/<slug>.webp
// Fuentes en la raíz del repo (capturadas con Playwright MCP a 1280x800 = 16:10).
// BotLode estaba caído (503): se usa el screenshot real previo de public/projects/botlode.png.
import sharp from 'sharp'
import { existsSync, mkdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'public', 'projects', 'showcase')
mkdirSync(OUT, { recursive: true })

/** slug → source path (relativo a ROOT). */
const JOBS = {
  handy: 'handy.png',
  'luma-invita': 'luma-invita.png',
  assistify: 'assistify.png',
  'taller-marcelo': 'taller-marcelo.png',
  botlode: 'public/projects/botlode.png', // fallback: sitio caído al capturar
  moda: 'moda.png',
  'poncho-spanish': 'poncho-spanish.png',
}

const TARGET_W = 1200
const TARGET_H = 750 // 16:10

let ok = 0
for (const [slug, src] of Object.entries(JOBS)) {
  const srcPath = join(ROOT, src)
  if (!existsSync(srcPath)) {
    console.warn(`SKIP ${slug}: no existe ${src}`)
    continue
  }
  const outPath = join(OUT, `${slug}.webp`)
  const meta = await sharp(srcPath).metadata()
  // Encaja a 16:10 recortando desde arriba (igual que object-top en la UI).
  await sharp(srcPath)
    .resize(TARGET_W, TARGET_H, { fit: 'cover', position: 'top' })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath)
  console.log(`OK  ${slug}.webp  (src ${meta.width}x${meta.height} → ${TARGET_W}x${TARGET_H})`)
  ok++
}
console.log(`\n${ok}/${Object.keys(JOBS).length} procesadas → public/projects/showcase/`)

// Limpieza de los PNG temporales en la raíz.
for (const src of Object.values(JOBS)) {
  if (src.startsWith('public/')) continue
  const p = join(ROOT, src)
  if (existsSync(p)) {
    unlinkSync(p)
    console.log(`rm  ${src}`)
  }
}
