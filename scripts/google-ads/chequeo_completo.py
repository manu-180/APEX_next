# -*- coding: utf-8 -*-
"""
Chequeo end-to-end de la campana. Solo lee: no escribe nada, nunca.

    python scripts/google-ads/chequeo_completo.py

Corre los tres controles que importan y termina en un veredicto unico:

  1. El estado de la campana es el que decidimos (verify.py).
  2. Ninguna negativa mata una busqueda de compra (cazar_negativas.py).
  3. Ninguna negativa bloquea una keyword activa.

El tercero existe porque el dano de una negativa amplia es invisible: la
busqueda simplemente nunca ocurre, asi que no aparece en ningun reporte.
"""
import re
import runpy
import sys

from _client import gaql, CAMPAIGN_ID

fallos = []


def bloque(titulo):
    print()
    print("=" * 70)
    print(titulo)
    print("=" * 70)


bloque("1/3 · ESTADO DE LA CAMPANA")
salida = []
_stdout = sys.stdout


class Espia:
    def write(self, t):
        salida.append(t)
        _stdout.write(t)

    def flush(self):
        _stdout.flush()


sys.stdout = Espia()
try:
    runpy.run_path("verify.py", run_name="__verificacion__")
finally:
    sys.stdout = _stdout
if "TODO VERDE" not in "".join(salida):
    fallos.append("el estado de la campana no es el esperado")

bloque("2/3 · NEGATIVAS vs BUSQUEDAS DE COMPRA")
salida = []
sys.stdout = Espia()
try:
    runpy.run_path("cazar_negativas.py", run_name="__caza__")
finally:
    sys.stdout = _stdout
if "LIMPIO" not in "".join(salida):
    fallos.append("hay negativas que bloquean busquedas de compra")

bloque("3/3 · NEGATIVAS vs KEYWORDS ACTIVAS")


def tok(s):
    return set(re.findall(r"\w+", s.lower()))


negativas = [(r.campaign_criterion.keyword.text,
              tok(r.campaign_criterion.keyword.text)) for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.keyword.text FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
""")]

activas, minas = [], []
for r in gaql(f"""
    SELECT campaign.id, ad_group.name, ad_group.status,
           ad_group_criterion.keyword.text, ad_group_criterion.status
    FROM ad_group_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.status = 'ENABLED'
      AND ad_group_criterion.type = 'KEYWORD'
"""):
    kt = tok(r.ad_group_criterion.keyword.text)
    for texto, nt in negativas:
        if nt <= kt:
            destino = activas if r.ad_group.status.name == "ENABLED" else minas
            destino.append((r.ad_group_criterion.keyword.text, texto, r.ad_group.name))
            break

print(f"  en grupos ACTIVOS: {len(activas)}")
for kw, neg, grupo in activas:
    print(f'    "{kw}" bloqueada por "{neg}" ({grupo})')
if activas:
    fallos.append(f"{len(activas)} keywords activas bloqueadas por negativas")

print(f"  en grupos pausados (minas para cuando se reactiven): {len(minas)}")
for kw, neg, grupo in minas:
    print(f'    "{kw}" bloqueada por "{neg}" ({grupo})')

bloque("VEREDICTO")
if fallos:
    print("  NO PASA:")
    for f in fallos:
        print(f"    - {f}")
    sys.exit(1)
print("  TODO EN ORDEN")
