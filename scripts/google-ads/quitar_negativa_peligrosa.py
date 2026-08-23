# -*- coding: utf-8 -*-
"""
Elimina negativas amplias cuyos terminos son demasiado comunes en consultas
de compra. Detectadas por cazar_negativas.py.
"""
from _client import client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner

banner("QUITAR NEGATIVAS DEMASIADO AMPLIAS")

# "que necesito" bloquea "NECESITO QUE me hagan un sitio web", que es un pedido
# de compra directo. La intencion informativa que se queria bloquear ya la cubre
# la negativa mas especifica "que necesito para crear".
OBJETIVO = {
    "que necesito": 'bloquea "necesito que me hagan un sitio web" (compra directa)',
    "qué necesito": 'misma trampa con tilde',
}

svc = client.get_service("CampaignCriterionService")
for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.resource_name, campaign_criterion.keyword.text
    FROM campaign_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'
"""):
    texto = r.campaign_criterion.keyword.text.lower()
    if texto not in OBJETIVO:
        continue
    op = client.get_type("CampaignCriterionOperation")
    op.remove = r.campaign_criterion.resource_name
    mutate(
        f"ELIMINAR negativa '{texto}': {OBJETIVO[texto]}",
        lambda op=op: svc.mutate_campaign_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"negativa": texto, "resource_name": r.campaign_criterion.resource_name},
        after=None,
    )
print()
print("Listo.")
