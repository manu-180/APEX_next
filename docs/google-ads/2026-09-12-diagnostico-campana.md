# Diagnóstico completo — Apex search (2026-09-12)

Cuenta `4869983637` · campaña `23721057489` · leído por API, no por consola.
Ventana principal: 2026-08-13 a 2026-09-11 (30 días). Tendencia: 90 días.

## Los números

| Métrica | 30 días |
|---|---:|
| Costo | $153.363 |
| Impresiones | 3.684 |
| Clics | 238 |
| CTR | 6,46% |
| CPC promedio | $644 |
| Conversiones | 9 |
| CPA | $17.040 |
| Impression share | <10% |
| Perdido por **ranking** | **81%** |
| Perdido por presupuesto | 13% |
| Presupuesto/día | $6.612 |

### Tendencia por semana — el CPC se duplicó y las impresiones se desplomaron

| Semana | Impr. | Clics | Costo | CPC | Conv |
|---|---:|---:|---:|---:|---:|
| 22-06 | 2.155 | 80 | $36.147 | $452 | 3 |
| 29-06 | 2.061 | 79 | $33.614 | $425 | 2 |
| 20-07 | 1.571 | 69 | $35.113 | $509 | 0 |
| 10-08 | 1.370 | 67 | $36.129 | $539 | 1 |
| 24-08 | 561 | 45 | $31.314 | $696 | 3 |
| 07-09 | 600 | 40 | $32.114 | **$803** | 2 |

Impresiones −72%, CPC +89%, gasto plano. Se paga cada vez más por cada vez
menos. No es estacionalidad: es Ad Rank cayendo mientras la puja automática
compensa subiendo el precio.

---

## Hallazgo 1 — Las landings por intención existen y la campaña no las usa

Es el más caro y el más fácil de arreglar.

| Ad group | Final URL actual | La que debería usar |
|---|---|---|
| Presupuesto y Precios (ad `806775371905`) | `/servicios#pricing` | `/cuanto-cuesta-una-pagina-web` |
| Web - Diseño y Desarrollo (ad `806775371899`) | `/servicios` | `/diseno-de-paginas-web` |

Las dos páginas están en producción desde el 06/09, son `force-static`, y
**usan el mismo `WhatsAppOutboundLink`** que `/servicios` → repuntar el anuncio
no rompe el tracking de conversiones.

Un `#pricing` no es una URL distinta para Google: el `post_click_quality_score`
se calcula sobre `/servicios`, que tiene que servir dos intenciones opuestas
("cuánto cuesta" vs "con quién lo hago") y sale castigada para las dos. Hoy hay
**26 keywords con la landing en BELOW_AVERAGE** y el QS promedio es 3,52.

Existen además `/tienda-online` y `/landing-page`, también sin usar, y
"landing page" es uno de los n-gramas que más plata quema sin convertir
($2.581 en 30 días).

## Hallazgo 2 — Una sola keyword amplia se come la mitad del presupuesto y convierte 6x peor

`presupuesto sitio web` en **BROAD**:

| | Esa keyword | Todo el resto |
|---|---:|---:|
| Clics | 99 | 139 |
| Costo | **$72.497 (47%)** | $80.866 |
| Conversiones | 1 | 8 |
| CVR | **1,0%** | **5,8%** |

Lo que trae: `página web`, `pagina web`, `paginas web`, `alojamiento web
argentina`, `mantenimiento web`, `web de contacto`, `una página de`,
`herramientas para crear paginas web`, `agencia de marketing`. Casi nada con
intención de contratar. Solo los tres genéricos de 1-2 palabras se llevaron
$23.692.

Además ahoga a sus propias versiones: `presupuesto sitio web` existe también en
EXACT (0 impresiones) y PHRASE (1 impresión).

Aritmética: si esos $72.497 compraran clics al CVR del resto de la campaña,
el mismo gasto daría ~13-14 conversiones en vez de 9, y el CPA bajaría de
$17.040 a ~$11.000. Sin tocar una línea del sitio.

## Hallazgo 3 — Se puja por un click, no por un cliente

La única conversión que entra en la puja es **`APEX - WhatsApp Click`**
(CONTACT, ONE_PER_CLICK). 21 en 90 días. Es un click en un botón, no un mensaje
enviado ni un lead calificado.

- `ceramicaapp-9abd8 (web) conversion` está ENABLED pero `include_in_conversions_metric = false` **y no registró un solo evento en 90 días**. Está muerta, no excluida.
- `APEX - Hero CTA Click`: 4 en 90 días, fuera de la puja (correcto).
- **`APEX - Lead Calificado (offline)`** existe (`UPLOAD_CLICKS`, PURCHASE) y **nunca recibió un upload**. Es la pieza que falta: sin ella Google no sabe distinguir un click curioso de un cliente.

Maximize Conversions con 9 conversiones/mes está por debajo del mínimo que la
estrategia necesita (~30/mes) para tener señal. Google mismo recomienda
`SET_TARGET_CPA`.

## Hallazgo 4 — Mobile se lleva 90% del gasto y convierte a menos de la mitad

60 días:

| Device | Clics | Costo | Conv | CVR | CPA |
|---|---:|---:|---:|---:|---:|
| Mobile | 507 | $275.775 | 11 | 2,2% | $25.070 |
| Desktop | 38 | $28.069 | 3 | **7,9%** | **$9.356** |
| Tablet | 1 | $522 | 0 | — | — |

Desktop convierte 3,6x mejor y cuesta 2,7x menos por conversión. El problema no
es la campaña: es qué pasa en mobile después del click. Conecta con el LCP de la
landing.

## Hallazgo 5 — Cosas menores que igual cuestan

- **Un solo RSA por ad group.** Sin variante no hay rotación ni aprendizaje. Todos los assets siguen en `PENDING` (Google no tiene volumen para calificarlos).
- **`cuanto se cobra por hacer una pagina web`** EXACT está **PAUSED** con el mejor CTR de la cuenta (25,6%) y el mejor IS (43,9%). Se pausó con 11 clics — exactamente el error de ventana corta que el propio registro advierte.
- **19 keywords sin una sola impresión** en 30 días.
- **74 negativas amplias pisan el vocabulario propio** (`web`, `crear`, `app`, `pagina`, `tienda`, `costo`…). Una negativa amplia bloquea sin dejar rastro en ningún reporte.
- **Faltan assets de llamada y de precio.** Con 94% mobile y el CTA siendo WhatsApp, no hay extensión de llamada ni de mensaje. Y para "cuánto cuesta", un PRICE asset es el formato natural.
- **3 de 6 sitelinks apuntan al mismo destino** (`/servicios`).
- **Desalineación de estado**: `estado.json` del autobudget dice presupuesto $5.750; la cuenta dice **$6.612**. Hay un `UPDATE amount_micros` el 06/09 09:00 que el log de autobudget no explica (ese día registró "sin acción"). Cabo suelto a revisar antes de confiar en el automatismo.
- Google recomienda **Search Partners** y **Display Expansion**: no aceptar. Con el cuello en Ad Rank y un presupuesto chico, diluyen.

## Lo que NO está roto

Vale decirlo porque acota dónde buscar:

- Red: solo Google Search. Sin Display ni partners.
- Geo: Argentina, `PRESENCE` (no "interés en"). Correcto.
- Idioma: español.
- Ad strength: GOOD en los dos anuncios activos.
- CTR 6,46%: **muy por encima** del promedio del sector. El anuncio funciona; el problema está antes (subasta) y después (landing).
- Assets: 6 sitelinks, 10 callouts, structured snippet, 10 imágenes. Poblado.
- El tracking de WhatsApp funciona y se arregló en agosto.

---

## Orden de ataque sugerido

1. **Repuntar los 2 final URLs** a las landings por intención. Costo: 2 llamadas a la API. Es la palanca directa sobre el 81% de subastas perdidas por ranking.
2. **Pausar `presupuesto sitio web` en BROAD** y dejar viva su versión PHRASE/EXACT. Libera 47% del presupuesto hacia tráfico que convierte 6x mejor.
3. **Reactivar `cuanto se cobra por hacer una pagina web`** EXACT.
4. **Alimentar `APEX - Lead Calificado (offline)`**: capturar `gclid` en el sitio + tabla de leads. Sin esto, Google seguirá optimizando hacia gente que hace click en botones.
5. **Segundo RSA** por ad group, apuntando a la landing nueva y con el titular calcado a la intención.
6. Esperar **2 a 4 semanas** antes de evaluar el QS. No tocar presupuesto mientras tanto.

No hacer todavía: subir presupuesto (el cuello es ranking, no plata), reactivar
los 4 ad groups pausados (parten el budget y frenan el aprendizaje de los dos
que funcionan), aceptar Search Partners o Display Expansion.
