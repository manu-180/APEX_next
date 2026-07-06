#!/usr/bin/env node
/**
 * QC contact-sheet: monta todos los thumbnails de public/models/thumbs/ en una
 * sola grilla PNG etiquetada, para revisar las 40 piezas de un vistazo y
 * detectar cuáles regenerar. Uso: node scripts/meshy/contact-sheet.mjs
 */
import sharp from 'sharp'
import { readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..')
const THUMB_DIR = path.join(REPO_ROOT, 'public', 'models', 'thumbs')
const OUT = path.join(__dirname, 'contact-sheet.png')

const COLS = 8
const CELL = 200
const PAD = 8
const LABEL_H = 26

const files = (await readdir(THUMB_DIR)).filter((f) => f.endsWith('.webp')).sort()
if (!files.length) {
  console.error('No thumbnails yet in', THUMB_DIR)
  process.exit(1)
}

const rows = Math.ceil(files.length / COLS)
const W = COLS * CELL
const H = rows * (CELL + LABEL_H)

const composites = []
for (let i = 0; i < files.length; i++) {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  const x = col * CELL
  const y = row * (CELL + LABEL_H)
  const buf = await sharp(path.join(THUMB_DIR, files[i]))
    .resize(CELL - PAD * 2, CELL - PAD * 2, { fit: 'cover' })
    .toBuffer()
  composites.push({ input: buf, left: x + PAD, top: y + PAD })

  const name = files[i].replace('apex-', '').replace('.webp', '')
  const svg = `<svg width="${CELL}" height="${LABEL_H}"><text x="${CELL / 2}" y="17" font-family="monospace" font-size="12" fill="#d0d4dc" text-anchor="middle">${name}</text></svg>`
  composites.push({ input: Buffer.from(svg), left: x, top: y + CELL })
}

await sharp({ create: { width: W, height: H, channels: 4, background: { r: 12, g: 12, b: 14, alpha: 1 } } })
  .composite(composites)
  .png()
  .toFile(OUT)

console.log(`contact-sheet -> ${path.relative(REPO_ROOT, OUT)}  (${files.length} thumbs, ${COLS}×${rows})`)
