"""
Cliente compartido para las operaciones de Google Ads de APEX.

Todas las escrituras pasan por `mutate()`, que:
  - corre en dry-run salvo que se pase --apply,
  - deja registro en docs/google-ads/changelog.jsonl con el estado previo,
  - devuelve el resultado o el error de la API sin tragárselo.

Uso:
    from _client import client, CUSTOMER_ID, gaql, mutate, DRY_RUN
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

os.environ.setdefault(
    "GOOGLE_ADS_CONFIGURATION_FILE_PATH", r"C:\Users\Manuel\google-ads.yaml"
)

from google.ads.googleads.client import GoogleAdsClient  # noqa: E402
from google.ads.googleads.errors import GoogleAdsException  # noqa: E402

CUSTOMER_ID = "4869983637"          # APEX
CAMPAIGN_ID = "23721057489"         # Apex search
CURRENCY = "ARS"

# Escribe de verdad solo con --apply. Sin el flag, simula.
DRY_RUN = "--apply" not in sys.argv

_REPO = Path(__file__).resolve().parents[2]
CHANGELOG = _REPO / "docs" / "google-ads" / "changelog.jsonl"

client = GoogleAdsClient.load_from_storage()


def micros(pesos: float) -> int:
    return int(round(pesos * 1_000_000))


def pesos(micros_value: int) -> float:
    return (micros_value or 0) / 1_000_000


def gaql(query: str, customer_id: str = CUSTOMER_ID):
    """Corre una GAQL y devuelve las filas como objetos protobuf."""
    ga_service = client.get_service("GoogleAdsService")
    rows = []
    for batch in ga_service.search_stream(customer_id=customer_id, query=query):
        rows.extend(batch.results)
    return rows


def _log(action: str, before, after, result: str):
    CHANGELOG.parent.mkdir(parents=True, exist_ok=True)
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "customer_id": CUSTOMER_ID,
        "action": action,
        "before": before,
        "after": after,
        "dry_run": DRY_RUN,
        "result": result,
    }
    with CHANGELOG.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


def mutate(action: str, fn, before=None, after=None):
    """
    Ejecuta una mutación con registro y dry-run.

    `fn` es un callable sin argumentos que hace la llamada real a la API.
    `before` / `after` son dicts serializables para poder revertir a mano.
    """
    tag = "SIMULADO" if DRY_RUN else "APLICADO"
    if DRY_RUN:
        print(f"  [{tag}] {action}")
        _log(action, before, after, "dry-run")
        return None
    try:
        result = fn()
        print(f"  [{tag}] {action}")
        _log(action, before, after, "ok")
        return result
    except GoogleAdsException as ex:
        msg = "; ".join(e.message for e in ex.failure.errors)
        print(f"  [ERROR] {action} -> {msg}")
        _log(action, before, after, f"error: {msg}")
        raise


def set_mask(op, *paths):
    """
    Fija la mascara de actualizacion a mano.

    NO usar protobuf_helpers.field_mask() para esto: en proto3 descarta los
    campos cuyo valor coincide con el default (False, 0, ""), asi que un
    `biddable = False` se cae de la mascara y la API devuelve exito sobre una
    actualizacion vacia. Se pierde el cambio sin ningun error.
    """
    del op.update_mask.paths[:]
    op.update_mask.paths.extend(paths)
    return op


def banner(title: str):
    print()
    print("=" * 72)
    print(title)
    print("=" * 72)
    if DRY_RUN:
        print("MODO SIMULACION — nada se escribe. Agrega --apply para ejecutar.")
        print()
