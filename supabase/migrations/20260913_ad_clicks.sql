-- ad_clicks — registro de clics a WhatsApp que llegan con gclid/gbraid/wbraid.
--
-- Por qué: el click a WhatsApp de los anuncios no pasa por ningún formulario,
-- así que hoy no hay forma de saber después cuál de esos clics se convirtió
-- en cliente real. Sin esta tabla, "APEX - Lead Calificado (offline)" (ya
-- creada en Google Ads como UPLOAD_CLICKS) nunca va a recibir un upload:
-- la API de conversiones offline exige gclid + fecha del click, y ese dato
-- se pierde apenas se cierra la pestaña si no queda guardado en algún lado.
--
-- Aplicar: supabase db push (o vía MCP apply_migration)
--
-- Flujo previsto (parte pendiente, no implementada todavía):
--   1. Esta migración guarda cada click con gclid (anon insert, sin lectura).
--   2. Manuel marca `qualified_at` cuando el contacto se convierte en cliente
--      real (falta decidir cómo: panel propio o edición directa en Supabase).
--   3. Un script sube a Google Ads como offline conversion las filas con
--      `qualified_at` y `uploaded_at is null`, y completa `uploaded_at`.

create table if not exists public.ad_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  click_id_kind text not null check (click_id_kind in ('gclid', 'gbraid', 'wbraid')),
  click_id text not null,
  landing_path text,
  -- Se completan a mano / por un script futuro. NULL = todavía no.
  qualified_at timestamptz,
  uploaded_at timestamptz
);

create index if not exists ad_clicks_created_at_idx
  on public.ad_clicks (created_at desc);

create index if not exists ad_clicks_pending_upload_idx
  on public.ad_clicks (qualified_at)
  where qualified_at is not null and uploaded_at is null;

alter table public.ad_clicks enable row level security;

-- Insert anónimo: el visitante no tiene identidad, cualquiera puede insertar
-- un click (es telemetría de marketing, no dato sensible de un usuario).
-- Sin policy de SELECT/UPDATE para anon: no puede leer ni marcar clicks
-- ajenos como calificados.
drop policy if exists "anon can insert click" on public.ad_clicks;
create policy "anon can insert click"
  on public.ad_clicks
  for insert
  to anon
  with check (
    click_id is not null
    and char_length(click_id) between 5 and 200
    and (landing_path is null or char_length(landing_path) <= 200)
  );

revoke insert on public.ad_clicks from anon;
grant insert (click_id_kind, click_id, landing_path) on public.ad_clicks to anon;

-- Sólo service_role lee, marca qualified_at/uploaded_at (admin / script de upload).
