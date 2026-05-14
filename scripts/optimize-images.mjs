import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename } from 'node:path'

const ROOT = process.cwd()

async function optimize(file, opts = {}) {
  const { quality = 80, maxWidth, formats = ['webp', 'avif'] } = opts
  const ext = extname(file).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  const base = file.slice(0, -ext.length)
  const results = []

  for (const fmt of formats) {
    const outPath = `${base}.${fmt}`
    try {
      const before = await stat(file).then((s) => s.size).catch(() => 0)
      let img = sharp(file)
      if (maxWidth) {
        const meta = await sharp(file).metadata()
        if (meta.width && meta.width > maxWidth) {
          img = img.resize({ width: maxWidth })
        }
      }
      if (fmt === 'webp') img = img.webp({ quality, effort: 6 })
      else if (fmt === 'avif') img = img.avif({ quality: Math.max(40, quality - 15), effort: 6 })
      const out = await img.toFile(outPath)
      results.push({
        file: outPath,
        before,
        after: out.size,
        saved: before - out.size,
      })
    } catch (err) {
      console.error(`Error procesando ${file} → ${fmt}:`, err.message)
    }
  }

  return results
}

async function processDir(dir, opts) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      await processDir(full, opts)
    } else if (e.isFile()) {
      const results = await optimize(full, opts)
      if (results) {
        for (const r of results) {
          const before = (r.before / 1024).toFixed(1)
          const after = (r.after / 1024).toFixed(1)
          const pct = ((r.saved / r.before) * 100).toFixed(0)
          console.log(`  ${basename(r.file)}: ${before}KB → ${after}KB (-${pct}%)`)
        }
      }
    }
  }
}

console.log('▶ Optimizando logo APEX (32px display, generar 96px @2x)...')
await optimize(join(ROOT, 'public/apex-logo.png'), { quality: 85, maxWidth: 96, formats: ['webp', 'avif'] })

console.log('\n▶ Optimizando imágenes de clientes...')
await processDir(join(ROOT, 'public/images/clients'), { quality: 78, maxWidth: 1200, formats: ['webp', 'avif'] })

console.log('\n▶ Optimizando imágenes de proyectos...')
await processDir(join(ROOT, 'public/projects'), { quality: 78, maxWidth: 1200, formats: ['webp', 'avif'] })

console.log('\nListo.')
