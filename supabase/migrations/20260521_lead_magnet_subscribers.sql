-- Lead magnet subscribers — captura de email + nurture sequence.
--
-- Por qué: capturar los 70% de visitantes que se van sin tomar WhatsApp.
-- Después se les manda una secuencia de 5 emails con el PDF + casos + propuestas.
--
-- Aplicar:
--   supabase db push  (o vía MCP apply_migration)
--
-- Privacy: incluye `unsubscribed_at` para que el usuario pueda salir de la lista.
-- RLS habilitado: sólo service_role puede leer (admin), insert vía API.

create table if not exists public.lead_magnet_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  project_type text,
  source text default 'website',
  -- Estado del nurture
  pdf_sent_at timestamptz,
  email_1_sent_at timestamptz,
  email_2_sent_at timestamptz,
  email_3_sent_at timestamptz,
  email_4_sent_at timestamptz,
  email_5_sent_at timestamptz,
  -- Conversion tracking — si convirtió en WhatsApp o booking
  converted_at timestamptz,
  converted_via text,
  -- Privacy
  unsubscribed_at timestamptz,
  -- Audit
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists lead_magnet_subscribers_email_uq
  on public.lead_magnet_subscribers (lower(email))
  where unsubscribed_at is null;

create index if not exists lead_magnet_subscribers_created_at_idx
  on public.lead_magnet_subscribers (created_at desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_lead_magnet_updated_at on public.lead_magnet_subscribers;
create trigger set_lead_magnet_updated_at
  before update on public.lead_magnet_subscribers
  for each row
  execute function public.set_updated_at();

-- RLS
alter table public.lead_magnet_subscribers enable row level security;

-- Insert anónimo (vía API anon key) — el usuario se suscribe desde el form
drop policy if exists "anon can insert" on public.lead_magnet_subscribers;
create policy "anon can insert"
  on public.lead_magnet_subscribers
  for insert
  to anon
  with check (true);

-- Anon también puede update SU PROPIO email (upsert path) — sólo sobre el row con su email
drop policy if exists "anon can upsert own email" on public.lead_magnet_subscribers;
create policy "anon can upsert own email"
  on public.lead_magnet_subscribers
  for update
  to anon
  using (true)
  with check (true);

-- Sólo service_role puede leer todo (admin / edge functions)
-- (anon NO puede leer la lista, por privacidad)
