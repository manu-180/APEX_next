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

## Chequeo de rutina

```bash
python scripts/google-ads/chequeo_completo.py
```

Un solo comando, solo lectura, veredicto unico. Corre tres controles:

1. **Estado de la campana** (`verify.py`) — que los objetivos de puja, la
   estrategia, los dispositivos, las keywords y las final URLs sigan siendo los
   que decidimos, y que no haya vuelto ninguna negativa asesina.
2. **Negativas vs busquedas de compra** (`cazar_negativas.py`) — prueba las
   negativas contra un banco de consultas escritas como las escribiria alguien
   que quiere contratar el servicio en Argentina.
3. **Negativas vs keywords activas** — separa las que rompen algo hoy de las
   que son minas para cuando se reactive un grupo pausado.

Sale con codigo 1 si algo no pasa, asi que sirve para un cron.

### Por que existe el control 2

Una negativa de concordancia amplia bloquea **toda** busqueda que contenga
**todos** sus terminos, en cualquier orden. El dano es invisible: la busqueda
nunca ocurre, asi que no aparece en ningun panel de Google Ads. `web me`
—pensada para bloquear el creador de sitios web.me— estuvo matando
"busco alguien que **me** haga una pagina **web**", el termino de mayor
intencion de la cuenta, que ya habia convertido.

### Minas conocidas en grupos pausados

Hay que resolverlas **antes** de reactivar esos grupos, o arrancan rotos:

| Grupo | Keyword | Negativa que la mata |
|---|---|---|
| Web para Medicos | sistema de turnos medicos | `turnos` |
| Web para Medicos | turnos online para consultorio | `turnos` |
| Apps - Mobile | cuanto cuesta crear una app en argentina | `cuanto cuesta crear una app` |

`turnos` no se quita hoy porque bloquea una categoria grande de basura (gente
sacando turno en una clinica, no comprando software) y el grupo esta pausado.
Cuando se reactive, hay que cambiarla por negativas mas especificas.
