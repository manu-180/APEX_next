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
  /**
   * Ventana con la que se creó el balde. El store es único: si el barrido
   * usara la ventana del llamador, el middleware (60 s) podaría los hits del
   * balde de reservas (600 s) y el tope de 5/10 min se degradaría a 5/min.
   */
  windowMs: number
}

const store = new Map<string, Bucket>()
let lastSweep = 0
/**
 * Techo duro de claves. Si se supera es un flood con claves sintéticas
 * (IPs o paths inventados): preferible perder el conteo a quedarse sin memoria.
 */
const MAX_KEYS = 5_000

function sweep(now: number, windowMs: number) {
  // Limpieza barata: como mucho una vez por ventana (o ya mismo si el Map se
  // pasó del techo), para que no crezca sin fin con claves que no vuelven.
  if (store.size <= MAX_KEYS && now - lastSweep < windowMs) return
  lastSweep = now
  for (const [key, bucket] of store) {
    bucket.hits = bucket.hits.filter((t) => now - t < bucket.windowMs)
    if (bucket.hits.length === 0) store.delete(key)
  }
  if (store.size > MAX_KEYS) store.clear()
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
    bucket = { hits: [], windowMs }
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
 * Deriva la IP del cliente. Orden de confianza:
 * 1. `x-vercel-forwarded-for`: Vercel borra cualquier `x-vercel-*` que mande el
 *    cliente, así que es el único que no se puede falsificar.
 * 2. `x-real-ip`: lo setea el proxy.
 * 3. El ÚLTIMO valor de `x-forwarded-for`: es el que agregó el proxy más
 *    cercano. El PRIMERO lo pone el cliente (`curl -H "x-forwarded-for: ..."`)
 *    y usarlo dejaba el rate limit evadible con un header.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const vercel = headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()
  if (vercel) return vercel
  const real = headers.get('x-real-ip')?.trim()
  if (real) return real
  const parts = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean)
  return parts[parts.length - 1] ?? ''
}
