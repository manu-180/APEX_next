---
day: 6
subject: '¿Sabés cuándo NO conviene una app móvil?'
from: 'Manuel · APEX <manuel@theapexweb.com>'
preheader: 'Contrarian take. Yo vivo de hacer apps y a veces digo que no.'
---

Hola{{ name ? ' ' + name : '' }},

Va sin vueltas: hay un montón de PyMEs en Argentina pagando por apps móviles
que NO necesitaban. Y otras que no se animan a hacer la app que SÍ les
convendría.

Esta es mi heurística después de 8+ productos en producción:

---

**TE CONVIENE una app móvil si tu negocio tiene al menos 2 de estas 5:**

1. **Uso recurrente** — el usuario abriría tu app más de 1 vez/semana.
   Ejemplo: gimnasio que registra clases, app de turnos médicos para pacientes
   crónicos, app de pedidos para un restaurante con clientes habituales.

2. **Necesidad offline** — el usuario necesita usarla sin internet o con
   internet inestable. Ejemplo: vendedores en ruta, logística, catálogo en
   visitas a clientes.

3. **Notificaciones push como canal real** — necesitás avisar al usuario
   eventos en tiempo real y SMS es caro. Ejemplo: cambio de turno, lista de
   espera, llegada de pedido.

4. **Hardware del celular** — necesitás cámara, GPS preciso, lector de QR,
   biometría. Ejemplo: registro de asistencia con QR, geolocalización de
   delivery.

5. **Experiencia "appy" como diferenciador** — tu producto se siente bien en
   formato app y no web. Ejemplo: app de meditación, app de fitness con plan
   diario, plataforma de venta con scroll infinito.

---

**NO TE CONVIENE una app si:**

- Tu uso real es 1 vez/mes o menos (mejor PWA o web mobile-first)
- Tu cliente es B2B con dueño +50 años (rara vez instala apps)
- Tu valor principal es contenido que se comparte por link (mejor web)
- Estás en early stage y todavía no tenés product-market fit (validá en web
  primero, app después)

---

**La trampa más común:**

> "Quiero tener mi app en App Store y Google Play para que la gente me busque."

❌ La gente NO busca apps en las stores. Buscan en Google, llegan a tu web, y
DESPUÉS deciden si instalan tu app (porque le ven valor).

Tu app no es discovery. Es retention. Si no tenés un canal de discovery (web,
ads, referidos), la app va a salir y no la va a instalar nadie.

---

**¿Y entonces qué hago?**

Si tu uso encaja en los criterios → app nativa con Flutter (iOS + Android,
ARS 580k–1.150k según complejidad, 4-6 semanas).

Si no encaja → web responsive + PWA installable (ARS 600k–900k, 15 días).
Te lleva el 80% del valor a un 40% del costo.

---

**¿Querés una segunda opinión sobre tu caso?**

Mandame respondiendo este email:
- Qué hace tu negocio
- Qué pensaste para la app
- Cuántos usuarios estimás el primer año

Te respondo en menos de 24hs si vale la pena o no. Sin pitch. Sin guardarme
nada.

Manuel
[theapexweb.com](https://theapexweb.com)

*[Darme de baja]({{ unsubUrl }})*
