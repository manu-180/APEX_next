-- Correctiva de RLS para public.lead_magnet_subscribers.
--
-- PROBLEMA (en 20260521_lead_magnet_subscribers.sql):
--   La policy "anon can upsert own email" es
--       for update to anon using (true) with check (true)
--   El comentario dice "sólo sobre el row con su email", pero un anónimo NO
--   tiene identidad: `using(true)` deja que CUALQUIER anónimo actualice
--   CUALQUIER fila de la tabla (pisar emails, marcar unsubscribed/converted,
--   corromper el estado del nurture de todos los suscriptores).
--
-- FIX:
--   Se elimina por completo la policy de UPDATE para anon. El "upsert" del
--   formulario NO necesita que el anónimo pueda actualizar: si el email ya
--   existe, el INSERT choca contra el índice único y ese caso se resuelve del
--   lado servidor (service_role, en una Edge Function / route con la key de
--   servicio), nunca con la anon key en el navegador. El anónimo queda sólo con
--   INSERT (alta) y sin lectura (privacidad), como pide el diseño original.
--
-- Aplicar (NO se aplica solo):
--   supabase db push        (o vía MCP apply_migration)
--   Requiere que 20260521_lead_magnet_subscribers.sql ya esté aplicada.
--
-- Verificar después, como anónimo (debe dar 401/42501 en el UPDATE):
--   curl -s -X PATCH "$URL/rest/v1/lead_magnet_subscribers?id=eq.<algún-id>" \
--     -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
--     -H "Content-Type: application/json" -d '{"unsubscribed_at":"2020-01-01"}'

-- Elimina la policy peligrosa (idempotente).
drop policy if exists "anon can upsert own email" on public.lead_magnet_subscribers;

-- Endurece también el INSERT anónimo: exige un email con forma mínima válida,
-- para que el alta no sea un buzón abierto de basura arbitraria.
drop policy if exists "anon can insert" on public.lead_magnet_subscribers;
create policy "anon can insert"
  on public.lead_magnet_subscribers
  for insert
  to anon
  with check (
    email is not null
    and char_length(email) between 3 and 254
    and position('@' in email) > 1
  );

-- (Sin policy de SELECT/UPDATE/DELETE para anon: lectura y mutaciones quedan
--  reservadas a service_role, que ignora RLS. Es el comportamiento buscado.)
