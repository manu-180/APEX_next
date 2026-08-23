"""
Revierte decisiones que los datos a 90 dias muestran equivocadas.

    python scripts/google-ads/revertir_dano.py            # simula
    python scripts/google-ads/revertir_dano.py --apply    # ejecuta

Origen: con ~5 conversiones/mes, una ventana de 30 dias no tiene poder
estadistico. Dos keywords pausadas el 22-08 por "0 conversiones en 30 dias"
tienen 2 conversiones cada una desde junio, con CPA mejor que el promedio.
Y tres negativas de concordancia amplia estaban bloqueando busquedas que
convirtieron.
"""
from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, pesos, set_mask,
)

banner("REVERTIR DANO — decisiones que los datos a 90 dias desmienten")

# ---------------------------------------------------------------- keywords
# Se despausan las que SI convierten mirando jun-ago.
# Se mantiene pausada 'cuanto se cobra por hacer una pagina web':
# $16.950 y CERO conversiones en tres meses. Esa estuvo bien.
DESPAUSAR = {
    142318757:    "hacer una pagina web (PHRASE) — 2 conv desde junio, CPA $9.177",
    299155369813: "cuanto sale una pagina web (EXACT) — 2 conv desde junio, CPA $9.969",
}

agc_svc = client.get_service("AdGroupCriterionService")
for r in gaql(f"""
    SELECT campaign.id, ad_group.id, ad_group_criterion.criterion_id,
           ad_group_criterion.keyword.text, ad_group_criterion.status
    FROM ad_group_criterion
    WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.criterion_id IN ({','.join(map(str, DESPAUSAR))})
"""):
    cid = r.ad_group_criterion.criterion_id
    if r.ad_group_criterion.status.name == "ENABLED":
        print(f"  (ya activa: {r.ad_group_criterion.keyword.text})")
        continue
    op = client.get_type("AdGroupCriterionOperation")
    k = op.update
    k.resource_name = agc_svc.ad_group_criterion_path(CUSTOMER_ID, r.ad_group.id, cid)
    k.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
    set_mask(op, "status")
    mutate(
        f"REACTIVAR keyword: {DESPAUSAR[cid]}",
        lambda op=op: agc_svc.mutate_ad_group_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"criterion_id": cid, "status": "PAUSED"},
        after={"status": "ENABLED"},
    )

# --------------------------------------------------------------- negativas
# Concordancia amplia negativa = bloquea cualquier busqueda que contenga TODOS
# sus terminos. Por eso "web me" mata "busco alguien que ME haga una pagina WEB",
# que es la forma mas natural de pedir el servicio en Argentina.
ELIMINAR = {
    "web me": "bloquea 'busco alguien que me haga una pagina web' (convirtio) y "
              "toda la familia 'me hacen / me pueden hacer una web'",
    "tarifario": "bloquea 'tarifario diseno web argentina', que convirtio con CPA $548",
    "3d": "bloquea 'pagina web 3d' — APEX vende justamente webs con 3D",
}

crit_svc = client.get_service("CampaignCriterionService")
for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.resource_name,
           campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
"""):
    texto = r.campaign_criterion.keyword.text.lower()
    if texto not in ELIMINAR:
        continue
    op = client.get_type("CampaignCriterionOperation")
    op.remove = r.campaign_criterion.resource_name
    mutate(
        f"ELIMINAR negativa '{texto}': {ELIMINAR[texto]}",
        lambda op=op: crit_svc.mutate_campaign_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"negativa": texto, "resource_name": r.campaign_criterion.resource_name},
        after=None,
    )

print()
print("Listo.")
