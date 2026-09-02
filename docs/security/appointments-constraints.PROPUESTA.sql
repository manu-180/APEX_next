-- PROPUESTA (2026-09-02) — NO es una migración todavía. Vive en docs/ a propósito:
-- el schema de public.appointments no está versionado en el repo y el proyecto
-- (osoijzjxzxdkwmobctyb) no está en ningún MCP. Antes de mover esto a
-- supabase/migrations/ hay que mirar en el dashboard:
--   \d public.appointments           (columnas y tipos reales)
--   select * from pg_policies where tablename = 'appointments';   (nombre real de la policy de INSERT)
--
-- Por qué hace falta: hooks/useBooking.ts inserta con la ANON key desde el
-- navegador. El honeypot y el rate limit de /api protegen el mensaje de
-- WhatsApp, no la tabla: cualquiera con la anon key (está en el bundle) puede
-- insertar horas fuera de rango, domingos, fechas pasadas o textos gigantes y
-- ocupar la agenda entera. La única barrera real es la DB.

begin;

-- Anti doble-booking. El código ya maneja 23505 (useBooking.ts), lo que sugiere
-- que el índice existe, pero no está versionado.
create unique index if not exists appointments_slot_uq
  on public.appointments (date_slot, hour_slot);

-- Rango real de la agenda: BOOKING_SLOT_HOURS = 9..19 (lib/constants/index.ts).
alter table public.appointments drop constraint if exists appointments_hour_slot_range;
alter table public.appointments add constraint appointments_hour_slot_range
  check (hour_slot between 9 and 19) not valid;

-- Sin domingos. extract(dow from date) es immutable → sirve en un CHECK.
alter table public.appointments drop constraint if exists appointments_no_sunday;
alter table public.appointments add constraint appointments_no_sunday
  check (extract(dow from date_slot) <> 0) not valid;

alter table public.appointments drop constraint if exists appointments_contact_type;
alter table public.appointments add constraint appointments_contact_type
  check (contact_type in ('whatsapp', 'email')) not valid;

-- Topes de tamaño: hoy son text sin techo.
alter table public.appointments drop constraint if exists appointments_text_len;
alter table public.appointments add constraint appointments_text_len
  check (
    char_length(contact_info) between 5 and 120
    and (client_name is null or char_length(client_name) <= 80)
  ) not valid;

-- NOT VALID = no revisa el histórico (puede tener filas viejas que violen esto).
-- Validar recién después de limpiarlo:
--   alter table public.appointments validate constraint appointments_hour_slot_range;
--   (ídem para las otras tres)

-- "No en el pasado" NO puede ser un CHECK: current_date no es immutable.
-- En una policy sí se permiten funciones volátiles.
drop policy if exists "anon can book" on public.appointments;   -- ¡confirmar el nombre real!
create policy "anon can book"
  on public.appointments for insert to anon
  with check (
    date_slot >= current_date
    and date_slot <= current_date + interval '90 days'
  );

-- RLS no filtra columnas; GRANT sí. El anónimo sólo escribe lo que manda el form.
revoke insert on public.appointments from anon;
grant insert (date_slot, hour_slot, contact_info, contact_type, client_name)
  on public.appointments to anon;

-- Pendiente aparte (auditoría): confirmar que anon NO puede hacer SELECT de
-- contact_info (sembrar 1 fila con service_role y leer como anon), y que
-- Realtime Authorization aplica RLS al canal postgres_changes de esta tabla.

commit;
