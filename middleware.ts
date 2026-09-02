import { NextResponse, type NextRequest } from 'next/server'
import { rateLimit, clientIpFromHeaders } from '@/lib/security/rate-limit'

/**
 * Puerta de entrada para /api/*. Defensa en profundidad contra abuso/bots y
 * peticiones cross-site. El handler de cada route sigue validando por su cuenta
 * (fail-closed en capas): esto es la primera barrera, no la única.
 *
 * Qué hace:
 *  1. Método: sólo se permiten métodos esperados; el resto corta con 405.
 *  2. Origen: en métodos que mutan (POST/PUT/PATCH/DELETE) rechaza peticiones
 *     cross-site del navegador (Sec-Fetch-Site) o con Origin de host ajeno.
 *  3. Rate limit por IP con respuesta 429 + Retry-After.
 *
 * Nota de alcance: el rate limit es en memoria por instancia (ver
 * lib/security/rate-limit.ts). Sube el costo de spamear, no es un tope global.
 */

// Sólo corremos sobre la API. El resto del sitio no pasa por acá.
export const config = {
  matcher: ['/api/:path*'],
}

const ALLOWED_METHODS = new Set(['GET', 'POST', 'OPTIONS', 'HEAD'])
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

// Límite general para cualquier /api/*: generoso para no molestar a nadie real,
// pero corta el flood. Se puede afinar por-ruta si hace falta.
const RL_LIMIT = 30
const RL_WINDOW_MS = 60_000

function isAllowedOrigin(req: NextRequest): boolean {
  const secFetchSite = req.headers.get('sec-fetch-site')
  // Navegadores modernos: same-origin/none son seguros; cross-site/same-site no.
  if (secFetchSite) {
    return secFetchSite === 'same-origin' || secFetchSite === 'none'
  }

  // Fallback sin Sec-Fetch-Site: comparar Origin contra el host del request.
  const origin = req.headers.get('origin')
  if (!origin) {
    // Ni Sec-Fetch-Site ni Origin (p. ej. curl): no es una petición de
    // navegador; la dejamos pasar y que el rate limit + honeypot + validación
    // del handler hagan su trabajo. Bloquear acá rompería integraciones legítimas
    // server-to-server sin frenar a un bot decidido.
    return true
  }
  try {
    const originHost = new URL(origin).host
    const reqHost = req.headers.get('host') || ''
    return originHost === reqHost
  } catch {
    return false
  }
}

export function middleware(req: NextRequest) {
  const method = req.method.toUpperCase()

  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json(
      { error: 'Método no permitido.' },
      { status: 405, headers: { Allow: 'GET, POST, OPTIONS, HEAD' } }
    )
  }

  if (MUTATING_METHODS.has(method) && !isAllowedOrigin(req)) {
    return NextResponse.json(
      { error: 'Origen no permitido.' },
      { status: 403 }
    )
  }

  // Rate limit por IP (clave por método+ruta para no mezclar GET con POST).
  const ip = clientIpFromHeaders(req.headers)
  const key = `${ip}:${method}:${req.nextUrl.pathname}`
  const rl = rateLimit(key, RL_LIMIT, RL_WINDOW_MS)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Esperá un momento y probá de nuevo.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rl.retryAfterSec),
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  return NextResponse.next()
}
