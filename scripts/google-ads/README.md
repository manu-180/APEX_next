# Operaciones de Google Ads — APEX

Cuenta `4869983637` ("APEX", ARS, America/Buenos_Aires), campaña `23721057489`
("Apex search"). Credenciales en `C:\Users\Manuel\google-ads.yaml`.

| Script | Qué hace |
|---|---|
| `_client.py` | Cliente compartido, dry-run, changelog, `set_mask()` |
| `audit.py` | Lectura completa: settings, grupos, keywords, términos, anuncios, assets |
| `audit2.py` | Conflictos negativa/keyword, duplicados, keywords sin impresiones |
| `apply_fixes.py` | Los arreglos del 22-08. Idempotente: releer antes de escribir |
| `verify.py` | Relee la cuenta y compara contra el estado esperado |

```bash
python scripts/google-ads/audit.py                 # solo lee
python scripts/google-ads/apply_fixes.py           # SIMULA
python scripts/google-ads/apply_fixes.py --apply   # ESCRIBE
python scripts/google-ads/verify.py                # confirma contra la API
```

## Dos trampas que ya nos costaron caro

**1. `protobuf_helpers.field_mask()` se come los valores falsy.** En proto3 un
campo con valor `False`, `0` o `""` es indistinguible de "no seteado", así que
queda fuera de la máscara. La API responde **éxito** sobre una actualización
vacía y el cambio se pierde en silencio. Usar siempre `set_mask(op, 'campo')`.
Así se perdieron `biddable = False` y el cambio de estrategia de puja, ambos con
respuesta OK.

**2. Verificar releyendo la cuenta, nunca por la respuesta del mutate.** Es la
única forma de detectar lo anterior. `verify.py` existe por eso.

Otros detalles: `include_in_conversions_metric` es inmutable en la creación de
una conversion action (se ajusta después); la máscara tiene que apuntar a una
hoja (`maximize_conversions.target_cpa_micros`, no `maximize_conversions`);
`change_event` no acepta rangos de más de 30 días.
