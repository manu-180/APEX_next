// Las páginas legales hablan con PostgREST por fetch y no con supabase-js a
// propósito: sumar un importador nuevo de supabase-js reparte distinto los
// chunks compartidos y agrega un request a TODAS las rutas (medido: +1 chunk).

export function configSupabase(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return { url: url.replace(/\/$/, ''), key }
}

// La anon key vieja es un JWT y va también como Bearer; una publishable key
// (sb_publishable_…) no es JWT y solo se manda en `apikey`.
export function cabecerasSupabase(key: string): Record<string, string> {
  return key.startsWith('eyJ') ? { apikey: key, Authorization: `Bearer ${key}` } : { apikey: key }
}
