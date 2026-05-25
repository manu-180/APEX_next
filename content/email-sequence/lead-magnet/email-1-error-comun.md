---
day: 1
subject: 'El error #1 que cometen las PyMEs al contratar dev'
from: 'Manuel · APEX <manuel@theapexweb.com>'
preheader: 'No es el precio. No es el plazo. Es esto.'
---

Hola{{ name ? ' ' + name : '' }},

Ayer te mandé la guía de precios. Hoy quiero contarte el error que veo más
seguido cuando alguien ya contrató mal y viene a pedir ayuda para arreglar.

**El error no es elegir lo barato.**

El error es **no preguntar de quién es el código.**

Te paso 3 escenarios reales (sin nombres porque son clientes que vinieron a
rescate):

---

**Escenario 1: el cliente fantasma**

Una PyME contrata a un freelance por $200k. Sitio "listo". A los 6 meses
quieren agregar una sección. El freelance no responde más.

Resultado: tienen que pagar $400k de nuevo a otro dev para tomar el control,
porque el código original estaba en una cuenta personal del freelance. **No
podían ni mover el sitio de servidor.**

---

**Escenario 2: la agencia "incluida"**

Otra PyME contrata una agencia por $1.5M. "Incluye mantenimiento mensual de
$80k". Después de 18 meses, gastaron $1.4M extras en mantenimiento. Querían
salir, pero el código tenía dependencias del "framework propietario" de la
agencia. **No era portable.**

---

**Escenario 3: Wix premium para siempre**

Otra PyME armó su tienda en Wix. Después de 3 años pagando $45 USD/mes
(que con la cotización actual son ~$45k ARS/mes), quisieron migrar. Se
encontraron con que **no se podían llevar los datos de los clientes** ni el
diseño. Empezaron de cero con otro dev. Plata tirada: $1.6M en suscripciones
sin un activo propio al final.

---

**Las 3 preguntas que cualquier dev honesto te tiene que poder responder antes
de firmar:**

1. **¿En qué cuenta queda el código?** (Tiene que ser tuya, GitHub a tu nombre)
2. **¿En qué cuenta queda el dominio y el hosting?** (Tu cuenta, no la del dev)
3. **¿Qué pasa si en 1 año decido moverme a otro proveedor?** (Tiene que ser
   "te llevás todo en 24hs y arrancás en otro lado")

Si la respuesta es ambigua, *correlo*. Es mejor pagar más a otro que comprar
un lock-in disfrazado de servicio.

---

Mañana o pasado te mando un caso real de cómo un cliente migró de Wix sin
perder un solo cliente. Tiene un detalle técnico interesante.

Manuel
[theapexweb.com](https://theapexweb.com)

*¿No te interesa la serie? [Date de baja acá]({{ unsubUrl }}).*
