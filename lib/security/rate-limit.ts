/**
 * Rate limiter en memoria por clave (IP), ventana deslizante simple.
 *
 * Alcance y límites REALES (leer antes de confiar en esto):
 * - El estado vive en el proceso. En Vercel cada instancia lambda/edge tiene
 *   su propio Map: el conteo NO se comparte entre instancias ni sobrevive a un
 *   cold start. Es una primera barrera anti-spam/abuso, no un límite global
 *   duro. Para un tope real y compartido hace falta un store externo
 *   (Upstash Redis / Vercel KV) — ver docs/security/AUDIT.md.
 * - Aun así sube muchísimo el costo de spamear el bridge de WhatsApp desde una
 *   sola IP, que es el vector concreto que nos importa hoy.
 */

interface Bucket {
  hits: number[]
}

const store = new Map<string, Bucket>()
let lastSweep = 0

function sweep(now: number, windowMs: number) {
  // Limpieza barata: como mucho una vez por ventana, para que el Map no crezca
  // sin techo con IPs que no vuelven.
  if (now - lastSweep < windowMs) return
  lastSweep = now
  for (const [key, bucket] of store) {
    bucket.hits = bucket.hits.filter((t) => now - t < windowMs)
    if (bucket.hits.length === 0) store.delete(key)
  }
}

export interface RateLimitResult {
  ok: boolean
  /** Segundos sugeridos para el header Retry-After cuando ok=false. */
  retryAfterSec: number
  /** Peticiones restantes en la ventana (informativo). */
  remaining: number
}

/**
 * @param key       identificador del cliente (IP). Si viene vacío, se usa
 *                  'unknown' — que agrupa a todos los sin-IP en un solo balde
 *                  (fail-closed: comparten cupo, no se saltean el límite).
 * @param limit     máximo de peticiones permitidas dentro de la ventana.
 * @param windowMs  tamaño de la ventana en milisegundos.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  sweep(now, windowMs)

  const id = key && key.trim().length > 0 ? key : 'unknown'
  let bucket = store.get(id)
  if (!bucket) {
    bucket = { hits: [] }
    store.set(id, bucket)
  }

  bucket.hits = bucket.hits.filter((t) => now - t < windowMs)

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000))
    return { ok: false, retryAfterSec, remaining: 0 }
  }

  bucket.hits.push(now)
  return { ok: true, retryAfterSec: 0, remaining: Math.max(0, limit - bucket.hits.length) }
}

/**
 * Deriva la IP del cliente de los headers que pone Vercel. `x-forwarded-for`
 * puede traer una lista ("cliente, proxy1, proxy2"): el primero es el cliente.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const xff = headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  return headers.get('x-real-ip')?.trim() || ''
}
