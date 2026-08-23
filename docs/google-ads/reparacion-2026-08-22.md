# Reparación de la campaña Apex search — 2026-08-22

Cuenta `4869983637` · campaña `23721057489` "Apex search" · API v23 (google-ads 30.0.0)
Ventana de datos analizada: **23-07-2026 → 21-08-2026**.

Todo lo aplicado quedó registrado en [`changelog.jsonl`](./changelog.jsonl) con el
estado previo de cada campo, y verificado releyendo la cuenta con
[`scripts/google-ads/verify.py`](../../scripts/google-ads/verify.py).

---

## Punto de partida

| Métrica 30d | Valor |
|---|---|
| Inversión | $146.721 ARS |
| Clics | 293 (CTR 5,6%) |
| CPC promedio | $501 |
| Conversiones | 5 — las 5 son *APEX - WhatsApp Click* |
| CPA | $29.344 |
| Valor de conversión | **$0** |

---

## Qué estaba roto y qué se hizo

### 1. La puja compraba scroll

`PAGE_VIEW` estaba como objetivo **biddable**: la acción *APEX - Scroll 50pct*
alimentaba Smart Bidding. `SUBMIT_LEAD_FORM` también, con *Hero CTA Click* —
un clic en un botón del hero, que no es un lead.

- `PAGE_VIEW` → fuera de la puja
- `SUBMIT_LEAD_FORM` → fuera de la puja
- `CONTACT` (WhatsApp Click) queda como **único objetivo**, y como conversión primaria
- *Scroll 50pct*, *Hero CTA Click* y la importación GA4 *ceramicaapp-9abd8 (web) conversion*
  salen de la columna Conversiones → el CPA que se reporta ahora es real

### 2. La estrategia ni miraba las conversiones

Estaba en `TARGET_SPEND` (maximizar clics), sin techo de CPC.

- → **`MAXIMIZE_CONVERSIONS`**, sin CPA objetivo para que aprenda primero.

> Con ~5 conversiones/mes el volumen es bajo para Smart Bidding. Esperar 2–3
> semanas de aprendizaje con CPC irregular antes de juzgar el cambio. Aun así es
> estrictamente mejor que optimizar a clics.

### 3. Desktop estaba prácticamente excluido

`bid_modifier` de DESKTOP en **0.30**, o sea **−70%**. Resultado medido: 30
impresiones y **$0 de gasto** en 30 días. El 100% del presupuesto se fue a mobile,
a un CPA de $29.240.

- → modificador a **1.0 (neutro)**.

Para vender desarrollo de $300K–$900K a dueños de negocio, desktop es donde se
compara y se decide. Estaba apagado.

### 4. Tres keywords caras que no convertían

Regla aplicada: ≥ $8.000 en 30d, 0 conversiones y QS ≤ 4.

| Keyword | Match | Gasto 30d | QS |
|---|---|---|---|
| cuanto se cobra por hacer una pagina web | EXACT | $16.044 | 3 |
| hacer una pagina web | PHRASE | $10.452 | — |
| cuanto sale una pagina web | EXACT | $8.929 | 4 |

**No se tocaron** dos que parecían candidatas:
- `presupuesto sitio web` (BROAD) — es el **mejor CPA de la cuenta**: $32.558 y
  2 de las 5 conversiones ($16.279 por conversión, contra $29.344 del promedio).
- `presupuesto página web` (PHRASE) — $18.508 sin conversión, pero **QS 7**. Ahí
  el problema no es la keyword, es la landing.

### 5. Basura entrando por concordancia amplia

`presupuesto sitio web` en BROAD traía *venta de paginas*, *bkninja*,
*alojamiento web argentina*, *agencia de marketing*, *concept page design*,
*precio de los blogs*, *adobe pagina web*, *paginas para crear paginas web*.

- → **20 negativas nuevas** (465 en total en la cuenta). Ninguna toca un término
  que haya convertido.

### 6. Un término de alta intención sin keyword propia

*busco alguien que me haga una página web* convirtió, entrando por amplia.

- → agregada como keyword **PHRASE** en el grupo *Web - Diseño y Desarrollo*.

### 7. Anuncios que aterrizaban donde no correspondía

| Anuncio | Antes | Ahora |
|---|---|---|
| 806775371905 — *Presupuesto y Precios* (path `/presupuesto/web`) | `/servicios` | `/servicios#pricing` |
| 806775371902 — *Apps - Mobile* | home | `/servicios` |
| 806854817249 — *Apps - Mobile* | home | `/servicios` |

El anuncio de precios prometía precios y dejaba al visitante en el hero, con la
tabla 2.400px más abajo. `#pricing` viene en el HTML del servidor, así que el
salto lo hace el navegador solo — no hace falta código.

### 8. Preparado para el circuito de valor real

Creada la conversion action **`APEX - Lead Calificado (offline)`** de tipo
`UPLOAD_CLICKS`, categoría `PURCHASE` (hoy **no** biddable, así no perturba la
puja). Es el destino de la subida offline cuando exista el circuito
gclid → lead → monto cerrado.

**No se le puso un valor inventado a WhatsApp Click.** Un valor constante no crea
señal económica —pujar por valor constante es idéntico a pujar por cantidad— y
mete en el reporte un número que parece facturación sin serlo. El valor real
entra por la subida offline.

---

## Lo que sigue roto, y no se arregla desde Google Ads

**La experiencia de landing.** De las 30 keywords con Quality Score asignado:

| | |
|---|---|
| Experiencia en la página de destino **por debajo del promedio** | **26 de 30** |
| Keywords con QS ≤ 4 | 23 de 30 |
| Gasto 30d en keywords con QS ≤ 4 | $55.554 |

Ese es el motivo del CPC de $501. Quality Score es un multiplicador directo del
costo por clic: pasar de QS 3 a QS 7 lo baja aproximadamente a la mitad. Es la
palanca más grande que queda y **vive en el repo, no en la campaña**.

---

## ¿Conviene arrancar una campaña de cero?

**No.** La estructura no era el problema:

- Red correcta (solo Búsqueda de Google; Partners y Display apagados)
- Geo Argentina, idioma español
- Dos grupos temáticos coherentes

Lo que estaba mal era configuración —medición, puja, dispositivos, unas pocas
keywords— y ya está corregido. Empezar de cero costaría las **465 negativas**
construidas durante meses y el historial de conversiones, y **no arreglaría el
Quality Score**: una campaña nueva hereda la misma experiencia de landing por
debajo del promedio y arranca con el mismo CPC alto.

---

## Cómo medir si sirvió

Comparar **22-08 → 21-09** contra la ventana previa, mirando:

1. **CPA real** (ahora la columna Conversiones son solo WhatsApp, no scrolls)
2. **Reparto por dispositivo** — desktop debería dejar de ser 0%
3. **CPC promedio** — debería bajar al salir las keywords de QS bajo
4. **Términos de búsqueda** — que no reaparezca la basura ya negativizada

```bash
python scripts/google-ads/audit.py
```

Los primeros 14 días son período de aprendizaje del cambio de estrategia: ruido
esperable, no conclusiones.

---

## Pendiente de Manuel

1. **Activar conversiones mejoradas para clientes potenciales.** El campo
   `enhanced_conversions_for_leads_enabled` es de solo lectura por API: hay que
   darlo en la consola, una vez.
2. **Definir el valor de un lead.** Sin la tasa de cierre real no hay forma
   honesta de asignar valor. Con ese dato se activa la puja por valor.
3. **Decidir si el presupuesto de $5.000/día sigue.** Son ~$150.000/mes. No se
   tocó: subirlo o bajarlo es decisión de negocio, no técnica.
