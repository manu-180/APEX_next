# -*- coding: utf-8 -*-
"""
Pausa las keywords que no tuvieron una sola impresion en 90 dias.

    python scripts/google-ads/limpiar_peso_muerto.py            # simula
    python scripts/google-ads/limpiar_peso_muerto.py --apply    # ejecuta

Se PAUSA, no se elimina: es reversible y conserva el historial.

Alcance deliberado:
  - Solo grupos ACTIVOS. Las verticales aparcadas (contadores, medicos, apps)
    tienen keywords intencionales, no basura: reactivarlas es una decision de
    negocio, no de higiene.
  - Se preservan las keywords creadas o tocadas en los ultimos 30 dias: no
    tuvieron tiempo de juntar datos.
  - Ninguna de las candidatas tuvo jamas un clic ni una conversion (verificado
    antes de correr).
"""
from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, set_mask,
)

banner("LIMPIEZA DE PESO MUERTO")

VENTANA = "'2026-05-26' AND '2026-08-23'"

# Keywords tocadas hace poco: no se juzgan todavia.
recientes = set()
for r in gaql("""
    SELECT change_event.change_date_time, change_event.change_resource_type,
           change_event.new_resource
    FROM change_event WHERE change_event.change_date_time >= '2026-07-25'
      AND change_event.change_date_time <= '2026-08-24'
      AND change_event.change_resource_type = 'AD_GROUP_CRITERION' LIMIT 500
"""):
    nr = r.change_event.new_resource
    if nr and nr.ad_group_criterion.keyword.text:
        recientes.add(nr.ad_group_criterion.keyword.text.lower())

candidatas = []
for r in gaql(f"""
    SELECT campaign.id, ad_group.id, ad_group.name, ad_group.status,
           ad_group_criterion.criterion_id, ad_group_criterion.keyword.text,
           ad_group_criterion.keyword.match_type, ad_group_criterion.status,
           metrics.impressions, metrics.clicks
    FROM keyword_view WHERE campaign.id = {CAMPAIGN_ID}
      AND segments.date BETWEEN {VENTANA}
"""):
    k = r.ad_group_criterion
    if r.ad_group.status.name != "ENABLED" or k.status.name != "ENABLED":
        continue
    if r.metrics.impressions > 0 or r.metrics.clicks > 0:
        continue
    if k.keyword.text.lower() in recientes:
        continue
    candidatas.append(r)

print(f"  {len(candidatas)} keywords sin una sola impresion en 90 dias, en grupos activos")
print()

svc = client.get_service("AdGroupCriterionService")
for r in candidatas:
    k = r.ad_group_criterion
    op = client.get_type("AdGroupCriterionOperation")
    upd = op.update
    upd.resource_name = svc.ad_group_criterion_path(
        CUSTOMER_ID, r.ad_group.id, k.criterion_id)
    upd.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
    set_mask(op, "status")
    mutate(
        f"pausar '{k.keyword.text}' ({k.keyword.match_type.name}, {r.ad_group.name})",
        lambda op=op: svc.mutate_ad_group_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"criterion_id": k.criterion_id, "status": "ENABLED",
                "impresiones_90d": 0},
        after={"status": "PAUSED"},
    )

print()
print("Listo.")
