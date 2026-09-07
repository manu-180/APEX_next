# Auditoría de negativas conflictivas — Apex search (2026-09-06)

**Cuenta:** 4869983637 · **Campaña:** Apex search (`23721057489`) · Moneda ARS
**Alcance:** solo análisis y propuesta. Cero escrituras aplicadas en la cuenta.

## 1. Qué se trajo de la API (todo por `mcp__google-ads__search`, lectura)

| Fuente | Resultado |
|---|---|
| `campaign_criterion` (negativas a nivel campaña) | **450 negativas**: 438 en concordancia amplia (BROAD) + 12 en frase (PHRASE) |
| `ad_group_criterion` con `negative = TRUE` | **0 resultados** — no hay negativas a nivel ad group en esta campaña |
| `campaign_shared_set` | **0 resultados** — no hay listas de negativas compartidas aplicadas a la campaña |
| `keyword_view` (keywords propias, todos los ad groups) | **135 keywords** en 6 ad groups (2 activos: Presupuesto y Precios, Web - Diseño y Desarrollo; 4 pausados: Web para Contadores, Apps - Mobile, Presupuesto/recursos "Apex search recursos", Web para Médicos) |
| `search_term_view` (últimos 30 días: 2026-08-07 a 2026-09-06) | **798 filas** → 718 términos de búsqueda únicos, agregando **136 clics / $80.299 / 2 conversiones** |
| `campaign` (mismo rango, para contraste) | **260 clics / $152.624 / 7 conversiones** |

**Nota sobre la brecha 136 vs 260 clics:** Google Ads no reporta el término de búsqueda exacto para consultas de bajo volumen (umbral de privacidad/agrupamiento de "otros términos"). Esa diferencia (~124 clics, ~$72.300, 5 conversiones) es tráfico real que **no tiene término de búsqueda visible** — no lo pude auditar palabra por palabra porque la propia API no lo expone, no porque yo no lo haya buscado. Esto refuerza el punto central del brief: hay una porción del tráfico que es estructuralmente invisible.

Todas las 450 negativas están a nivel de campaña. No hay ad groups negativos ni listas compartidas que auditar por separado.

## 2. Metodología

Para cada una de las 450 negativas se buscó solapamiento de palabras de contenido (excluyendo artículos/preposiciones) contra:
- El texto de las 135 keywords propias (activas y pausadas, para no perder de vista los verticales que podrían reactivarse).
- Los 718 términos de búsqueda reales observados en 30 días (con sus métricas).

Ese cruce dio **91 negativas con algún solapamiento de vocabulario** (82 tocan vocabulario de los 2 ad groups *activos*), un universo comparable al de las 74 que reportó `pulida.py`. A partir de ahí, cada negativa se evaluó a mano: una negativa amplia bloquea una búsqueda solo si la búsqueda contiene **todas** sus palabras — así que compartir una sola palabra genérica ("web", "app", "pagina") con una keyword propia casi nunca implica riesgo real si la otra palabra de la negativa es ajena a nuestro rubro (ej. "web developer", "posicionamiento web", "web studio" no bloquean nada de lo que vendemos, solo comparten "web"). El riesgo real aparece cuando **todas** las palabras de la negativa coinciden con una forma natural de preguntar por nuestros servicios.

## 3. Resumen ejecutivo

| Clasificación | Cantidad |
|---|---:|
| **ELIMINAR** | 12 |
| **CONVERTIR A EXACTO** | 3 |
| **DEJAR COMO ESTÁ** | 435 |
| **Total negativas auditadas** | 450 |

La inmensa mayoría de las 450 negativas (incluidas casi todas las 289 de una sola palabra: marcas de competidores, plataformas no-code, ciudades, países, cursos, bolsas de trabajo) están bien puestas y no tocan intención de compra. El problema real está concentrado en **un puñado de negativas construidas con palabras interrogativas y verbos genéricos en español**, que por diseño de la concordancia amplia bloquean mucho más de lo que su autor probablemente pretendía.

## 4. El hallazgo más grave: "como" y "cómo" en concordancia amplia

```
criterion_id 11413781 | "como"  | BROAD
criterion_id 14976776 | "cómo"  | BROAD
```

Estas dos negativas, por sí solas, bloquean **toda búsqueda que contenga la palabra "como" o "cómo"** — una de las palabras interrogativas más comunes del español y la forma natural en que mucha gente pregunta por nuestros servicios: *"cómo hago una página web"*, *"cómo consigo que me hagan una app"*, *"cómo contrato un desarrollador"*. No hay nada leve en esto: es una negativa de una sola palabra en amplia, exactamente el patrón que ya costó plata una vez (precedente 2026-09-02).

**Evidencia de que ya está actuando:** en los 718 términos de búsqueda de los últimos 30 días, **ni uno solo** contiene la palabra "como" o "cómo" como palabra completa (la única coincidencia fue "diseño web comodoro rivadavia", que matchea por substring dentro de "Comodoro", no por la palabra). Para un mercado hispanohablante buscando servicios web, la ausencia total de esa palabra en 30 días de datos es la firma del daño invisible: no es que nadie pregunte "cómo hago una página web" en Google, es que Google Ads nunca deja que esa búsqueda llegue a figurar en ningún reporte.

**Por qué se puede eliminar sin miedo:** la cuenta ya tiene negativas específicas y correctas para el tráfico educativo/DIY que "como"/"cómo" probablemente quiso filtrar — están cubiertas por separado: `curso`, `cursos`, `tutorial`, `tutoriales`, `guia`, `aprende`, `aprender`, `certificacion`, `bootcamp`, `coderhouse`, `platzi`, `udemy`, `freecodecamp`, `coursera`, `diy`, `nocode`. Sacar "como"/"cómo" no reabre esa puerta porque ya está tapada por negativas más específicas.

## 5. Top 10 a eliminar (con la keyword propia o el término real que pisan)

| # | Negativa | Match | Qué pisa | Por qué |
|---|---|---|---|---|
| 1 | `como` | BROAD | Toda pregunta con "como": adyacente a keyword activa **"cuanto sale hacer una pagina web"** (clics/conversión real observados) | Bloquea la palabra interrogativa más común del español para pedir un servicio. Cero cobertura en 30 días de search terms — señal directa de bloqueo total. |
| 2 | `cómo` | BROAD | Idéntico al anterior, variante con tilde | Mismo problema, duplicado con tilde — Google Ads no unifica automáticamente variantes con/sin tilde en negativas de texto libre. |
| 3 | `como hacer` | BROAD | Bloquea *"como hacer una pagina web"* / *"como hacer una app"* — adyacente a **"hacer pagina web online"**, **"hacer pagina web para empresa"** (Web - Diseño y Desarrollo, activo) y **"cuanto cuesta hacer una app"** (Presupuesto y Precios) | Redundante con #1 pero además específico: "como hacer X" es una de las formas más naturales de pedir ayuda para construir algo. |
| 4 | `cómo hacer` | BROAD | Igual que #3, variante con tilde | Mismo riesgo, duplicado. |
| 5 | `como crear` | BROAD | Bloquea *"como crear una pagina web"* — variante casi calcada de la keyword activa **"crear pagina web argentina"**, que sí convierte tráfico (*"crear página web"*: 2 clics observados) | "Como crear X" es la otra forma dominante de pedir el mismo servicio. |
| 6 | `cómo crear` | BROAD | Igual que #5, variante con tilde | Duplicado. |
| 7 | `como hacer una app` | BROAD | Bloquea consultas de compra para apps ("como hacer una app para mi negocio") | Ad group Apps - Mobile está pausado hoy, pero es la keyword natural para reactivarlo. Bajo costo actual, alto costo si se reactiva sin corregir esto antes. |
| 8 | `cómo hacer una app` | BROAD | Igual que #7 | Duplicado con tilde. |
| 9 | `como crear una app` | BROAD | Igual que #7/#8 pero con "crear" | Mismo riesgo para el vertical de apps. |
| 10 | `para android` | BROAD | Bloquea *"quiero hacer una app para android"* / *"empresa que desarrolla apps para android"* — pisa directamente **"desarrollo de apps ios y android"** (keyword de Apps - Mobile) | Bloquea la forma más común de especificar la plataforma al pedir una app. La keyword propia ya usa "android" en su texto — la negativa amenaza a su propio vocabulario. |

**Runners-up que también recomiendo eliminar** (no entraron al top 10 por menor volumen de patrón, pero mismo diagnóstico): `cómo crear una app` con tilde ya contado arriba; `como se crea`, `cómo se crea una app`, `emergent crea` (misma familia "como + verbo", aunque más específicas y de menor riesgo); `como crear tienda` (pisa el vertical e-commerce, "cuanto cuesta una tienda online").

## 6. Convertir a exacto (3)

| Negativa | Match actual | Por qué convertir y no eliminar |
|---|---|---|
| `android studio` | BROAD (además existe una segunda entrada idéntica en PHRASE — están duplicadas) | El término exacto "android studio" no sirve (herramienta de desarrollo, cero intención de compra). Pero ya existe la versión en frase que cubre el caso real; la versión BROAD es redundante y menos precisa. Recomiendo pasarla a exacta (o eliminar la BROAD y quedarse solo con la PHRASE ya existente) para no duplicar superficie de riesgo sin necesidad. |
| `como crear una aplicacion` | BROAD | Más específica que "como crear" a secas (4 palabras: como+crear+una+aplicacion todas deben estar), así que el riesgo de colisión accidental es menor — pero al ser BROAD igual puede bloquear variantes con esas 4 palabras en otro orden. Convertirla a EXACTO conserva el filtro del término literal sin el riesgo de la concordancia amplia. |
| `programador de app` | BROAD | Comparte vocabulario con la propia keyword pausada **"programadores de app"** (Apps - Mobile) y "programador de app" puede ser exactamente cómo alguien busca para *contratar* (no solo para conseguir trabajo). Ad group pausado hoy → prioridad baja, pero conviene resolverlo antes de reactivar el vertical. |

## 7. Riesgo inverso — qué se abriría si se sacan estas negativas

Sacar `como` / `cómo` en amplia no reabre la puerta a cursos, tutoriales o DIY: esas categorías ya están cubiertas por negativas específicas y correctas que quedan intactas (`curso`, `cursos`, `tutorial`, `tutoriales`, `guia`, `aprende`, `aprender`, `certificacion`, `bootcamp`, `coderhouse`, `platzi`, `udemy`, `freecodecamp`, `coursera`, `diy`, `nocode`, `sin saber programar`). Lo único que se reabre es exactamente lo que se quiere reabrir: preguntas de compra formuladas con "cómo".

Como salvaguarda adicional, si al sacar `como`/`cómo` en amplia aparecieran términos de búsqueda claramente ajenos (ej. "como llegar a [dirección]", "como se dice X en inglés", "como bajar de peso" — ruido genérico no relacionado a nuestro rubro), la corrección sería agregar esos términos puntuales **en concordancia exacta**, nunca volver a una negativa amplia de una sola palabra interrogativa.

Para `para android` (top 10, #10): si se elimina, el riesgo inverso es dejar pasar búsquedas de desarrolladores freelance de Android buscando trabajo o tutoriales "programar para android". Esa categoría específica ya está cubierta por separado (`android studio`, `kodular`, `thunkable`, `appinventor`, `flutterflow`, etc., todas negativas de plataformas no-code/DIY que permanecen intactas), así que el riesgo real es bajo.

## 8. Qué NO pude verificar

- **El costo/impacto exacto en pesos de cada negativa individual.** Por definición, una búsqueda bloqueada no genera clic, costo ni impresión reportable — no existe la métrica de "cuánto dejamos de ganar" por cada negativa. La priorización del punto 5 es por solapamiento estructural de vocabulario y por la ausencia total de la palabra "como"/"cómo" en 30 días de search terms, no por un número de pesos verificado. Sería falsear evidencia inventar una cifra ahí.
- **~124 de los 260 clics del período no tienen término de búsqueda expuesto por la API** (ver sección 1) — no se pudieron auditar palabra por palabra.
- **La fecha de alta de cada negativa.** El campo no está expuesto por `campaign_criterion` en este servidor MCP, así que no puedo saber si `como`/`cómo` se agregaron hace mucho o recientemente, ni si algunas de las 91 negativas con solapamiento fueron agregadas después de que el término de búsqueda ya hubiera dejado de aparecer por otras razones.
- **El algoritmo exacto de `pulida.py`.** No tuve acceso a su código en este worktree (está fuera de git, en `C:\Users\Manuel\apex-ads-ops\`), así que la lista de 74 que menciona el brief es una referencia, no algo que pude reproducir bit a bit. Mi propio cruce de vocabulario (independiente, hecho contra la API en vivo) encontró 91 negativas con algún solapamiento — orden de magnitud comparable — y de esas, solo 15 pasan el filtro de "efectivamente pisa una forma real de pedir el servicio".

## 9. Negativas nuevas en exacto propuestas

Ninguna nueva negativa por ahora: no encontré, en los 718 términos de búsqueda observados, tráfico claramente ajeno al rubro que hoy esté sin cubrir. Si al aplicar los cambios de la sección 5 aparece tráfico basura puntual, agregarlo en exacto (nunca en amplia), siguiendo la restricción dura del brief.
