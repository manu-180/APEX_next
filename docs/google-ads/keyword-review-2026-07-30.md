# Revisión Apex search — 2026-07-30

Período analizado: 2026-07-23 → 2026-07-30 (últimos 7 días)
Campaña: Apex search (`23721057489`) · Cuenta `4869983637`

## Volumen total (últimos 7 días)

- Impresiones: **1.117**
- Clicks: **33** (CTR 2,95%)
- Conversiones (WhatsApp Click): **0**
- Gasto: **$16.218,53 ARS**
- CPC promedio: **~$491 ARS**
- Search terms únicos: 433

## Top 5 search terms por clicks

| # | Término | Clicks | Impr. | Conv. | Costo |
|---|---------|--------|-------|-------|-------|
| 1 | `https posicionamientoweb club meta tags` | 2 | 66 | 0 | $1.066 |
| 2 | `cuanto cuesta crear una pagina web` | 2 | 3 | 0 | $1.087 |
| 3 | `programacion web` | 2 | 1 | 0 | $1.027 |
| 4 | `costo por pagina web` | 2 | 1 | 0 | $1.013 |
| 5 | `desarrollador web` | 2 | 12 | 0 | $929 |

(también `crear sitio web` con 2 clicks / $921)

## Top keyword/grupo ganador

| Grupo | Search terms | Impr. | Clicks | CTR | Costo |
|---|---|---|---|---|---|
| Presupuesto y Precios | 249 | 737 | 18 | 2,4% | $8.903 |
| Web - Diseño y Desarrollo | 184 | 380 | 15 | 3,9% | $7.315 |

**Ganador: "Web - Diseño y Desarrollo"** en calidad de tráfico — mitad del volumen pero CTR 60% superior y sus términos son mucho más limpios (`desarrollador web`, `crear sitio web`, `diseño web`, `paginas web interactivas`). "Presupuesto y Precios" trae más volumen pero está contaminado con búsquedas navegacionales a sitios de terceros y con intención de dominio/hosting.

## Negativas agregadas esta corrida (20)

Priorizadas por gasto/impresiones desperdiciadas:

| Negativa | Motivo | Desperdicio evitado |
|---|---|---|
| `posicionamientoweb` | Navegacional a sitio de terceros (posicionamientoweb.club) | 123 impr, 3 clicks, ~$1.572 |
| `dominio` | Intención de comprar dominio, no contratar agencia | ~25 impr, 1 click ($510) |
| `dominios` | Ídem (el negativo no matchea plurales) | ~10 impr |
| `hosting` | Intención de contratar hosting | ~20 impr |
| `como` | DIY/educativo (`como se arma una pagina web`, `como diseñar…`) | ~25 impr |
| `cómo` | Ídem con tilde | ~15 impr |
| `strawpage` | Constructor DIY gratuito | 22 impr |
| `cardd` | Constructor DIY (Carrd) | 16 impr |
| `carrdco` | Ídem, variante sin espacio | 2 impr |
| `notlocals` | Constructor DIY | 11 impr |
| `wixsite` | Wix (DIY) | 5 impr |
| `hostingersite` | Constructor gratuito de Hostinger | 2 impr, 1 click ($549) |
| `palimpalem` | Hosting gratuito | 4 impr, 1 click ($535) |
| `streamfield` | Feature técnica de Wagtail CMS (dev, no cliente) | 2 impr, 1 click ($483) |
| `themeforest` | Marketplace de templates | 3 impr |
| `mmm page` | Constructor DIY | 4 impr |
| `htmlrev` | Directorio de templates gratis | 2 impr |
| `siteinspire` | Galería de inspiración | 2 impr |
| `tooplate` | Templates gratis | 1 impr |
| `gratis` | Preventiva (regla fija: DIY/gratis) | 1 impr |

### Decisión que conviene revisar
`como` / `cómo` es la negativa más agresiva del lote: bloquea toda la clase informacional (~30 términos DIY tipo *"cómo se hace una página web"*), pero también bloquearía un eventual *"cómo contratar un desarrollador web"*. Con 0 conversiones y $16k gastados en 7 días la poda se justifica; si en 2 semanas cae el volumen relevante, se revierte sacando ambas del listado de negativas.

## Quedaron en fila para la próxima corrida
Marcas DIY con 1 impresión cada una (no entraron por el tope de 20): `site123`, `w3spaces`, `builderall`, `jimbo`, `yola`, `zonelets`, `readymaga`, `elfsight`, `vuetify`, `sitesgoogle`, `hostgator builder`, `generador de paginas web`.

## Alertas

1. **0 conversiones con $16.218 ARS gastados en 7 días.** Es el dato más importante de la corrida: 33 clicks y ningún click a WhatsApp. O el tracking de "APEX - WhatsApp Click" no está disparando, o la landing no está convirtiendo el tráfico de search. **Verificar primero que la conversion action registre eventos** antes de seguir optimizando keywords.
2. **CPC promedio ~$491 ARS**, con clicks individuales de hasta $1.087. Para un presupuesto acotado, cada click tiene que valer mucho — refuerza la necesidad de la poda.
3. **Términos navegacionales de terceros quemando presupuesto**: `posicionamientoweb club` (5 variantes) consumió el 10% del gasto de la semana antes de esta corrida. Ya bloqueado.
4. **Alta fragmentación de la cola**: 287 de 433 términos tuvieron 1 sola impresión y 0 clicks. Es ruido normal en broad match, pero indica que las keywords están demasiado amplias en "Presupuesto y Precios".
5. Ningún grupo silenciado ni keyword con gasto sin impresiones detectada.

---
*Generado automáticamente por la tarea programada `apex-ads-keyword-review`.*
