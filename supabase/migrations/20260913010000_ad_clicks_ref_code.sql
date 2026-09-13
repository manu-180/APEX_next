-- ad_clicks.ref_code — el "talón" que conecta un click anónimo con el mensaje
-- de WhatsApp real que genera.
--
-- Por qué: el click a WhatsApp no tiene teléfono ni nombre, y el mensaje que
-- llega a apex_manager (bot) tampoco sabe de qué click vino. Sin un dato
-- compartido entre las dos puntas, no hay forma de saber después qué click
-- se convirtió en cliente real. El código se genera en el navegador (ver
-- lib/analytics/ad-clicks.ts), viaja al final del mensaje prellenado
-- ("... (ref: 8F2A)") y lo lee el webhook del bot, nunca una persona.
--
-- Corto (5 caracteres, alfabeto sin 0/O/1/I/L) porque viaja como texto visible
-- dentro de un mensaje de WhatsApp real.

alter table public.ad_clicks
  add column if not exists ref_code text;

create unique index if not exists ad_clicks_ref_code_uidx
  on public.ad_clicks (ref_code)
  where ref_code is not null;

comment on column public.ad_clicks.ref_code is
  'Código corto generado en el cliente al momento del click, embebido en el mensaje prellenado. apex_manager lo parsea del primer mensaje entrante para atribuir el lead a este click, sin que nadie lo lea ni lo tipee a mano.';
