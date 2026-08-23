# -*- coding: utf-8 -*-
"""
Resuelve los choques entre negativas y keywords activas.

Criterio: cuando una negativa y una keyword se pisan, gana la que representa
mejor la intencion de compra. No siempre gana la keyword.
"""
from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, set_mask,
)

banner("CONFLICTOS NEGATIVA <-> KEYWORD")

# ---------------------------------------------------------------------
# 1. Gana la KEYWORD: se elimina la negativa.
# ---------------------------------------------------------------------
# "presupuesto sitio web" estaba cargada como negativa Y como keyword tres
# veces en el grupo que mas gasta. La broad de ese texto lleva $60.928 y
# CUATRO conversiones desde junio: es la mejor keyword de la cuenta. La
# negativa impedia que el grupo apareciera para su termino mas literal.
QUITAR_NEGATIVA = {
    "presupuesto sitio web":
        "es la mejor keyword de la cuenta ($60.928 y 4 conversiones desde junio) "
        "y la negativa la bloqueaba en su propio grupo",
}

svc_neg = client.get_service("CampaignCriterionService")
for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.resource_name, campaign_criterion.keyword.text
    FROM campaign_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'
"""):
    texto = r.campaign_criterion.keyword.text.lower()
    if texto not in QUITAR_NEGATIVA:
        continue
    op = client.get_type("CampaignCriterionOperation")
    op.remove = r.campaign_criterion.resource_name
    mutate(
        f"ELIMINAR negativa '{texto}': {QUITAR_NEGATIVA[texto]}",
        lambda op=op: svc_neg.mutate_campaign_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"negativa": texto, "resource_name": r.campaign_criterion.resource_name},
        after=None,
    )

# ---------------------------------------------------------------------
# 2. Gana la NEGATIVA: se pausa la keyword.
# ---------------------------------------------------------------------
# Las negativas de busqueda de empleo ("buscamos desarrollador", "freelance",
# "busco trabajo", "cv", "sueldo"...) bloquean una categoria enorme de basura:
# gente que busca TRABAJO, no que quiere contratarnos. Esas keywords chocaban
# con esa familia y no traen resultados, asi que la que sobra es la keyword.
PAUSAR_KEYWORD = {
    "buscamos desarrollador web":
        "choca con la negativa 'buscamos desarrollador' (intencion de contratar "
        "empleado, no de comprar). $1.299 y 0 conversiones",
    "programador web freelance buenos aires":
        "choca con la familia de negativas de busqueda de empleo. Sin datos",
}

agc_svc = client.get_service("AdGroupCriterionService")
for r in gaql(f"""
    SELECT campaign.id, ad_group.id, ad_group.status, ad_group_criterion.criterion_id,
           ad_group_criterion.keyword.text, ad_group_criterion.status
    FROM ad_group_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.status = 'ENABLED'
"""):
    k = r.ad_group_criterion
    motivo = PAUSAR_KEYWORD.get(k.keyword.text.lower())
    if not motivo:
        continue
    op = client.get_type("AdGroupCriterionOperation")
    upd = op.update
    upd.resource_name = agc_svc.ad_group_criterion_path(
        CUSTOMER_ID, r.ad_group.id, k.criterion_id)
    upd.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
    set_mask(op, "status")
    mutate(
        f"PAUSAR keyword '{k.keyword.text}': {motivo}",
        lambda op=op: agc_svc.mutate_ad_group_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"criterion_id": k.criterion_id, "status": "ENABLED"},
        after={"status": "PAUSED"},
    )

# ---------------------------------------------------------------------
# 3. Sitelink "Ver Precios" tiene que llevar a los precios.
# ---------------------------------------------------------------------
# Apuntaba a /servicios pelado, donde a 375 px no se ve ni un precio sin
# scrollear. El ancla #pricing aterriza directo en la tabla.
asset_svc = client.get_service("AssetService")
ca_svc = client.get_service("CampaignAssetService")
campaign_rn = client.get_service("CampaignService").campaign_path(CUSTOMER_ID, CAMPAIGN_ID)

for r in gaql(f"""
    SELECT campaign.id, campaign_asset.resource_name, asset.id,
           asset.sitelink_asset.link_text, asset.sitelink_asset.description1,
           asset.sitelink_asset.description2, asset.final_urls
    FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_asset.field_type = 'SITELINK' AND campaign_asset.status = 'ENABLED'
"""):
    s = r.asset.sitelink_asset
    if s.link_text != "Ver Precios" or "#pricing" in "".join(r.asset.final_urls):
        continue
    viejo_rn = r.campaign_asset.resource_name
    op_a = client.get_type("AssetOperation")
    a = op_a.create
    a.sitelink_asset.link_text = s.link_text
    a.sitelink_asset.description1 = s.description1
    a.sitelink_asset.description2 = s.description2
    a.final_urls.append("https://www.theapexweb.com/servicios#pricing")

    def aplicar(op_a=op_a, viejo_rn=viejo_rn):
        res = asset_svc.mutate_assets(customer_id=CUSTOMER_ID, operations=[op_a])
        op_link = client.get_type("CampaignAssetOperation")
        lk = op_link.create
        lk.campaign = campaign_rn
        lk.asset = res.results[0].resource_name
        lk.field_type = client.enums.AssetFieldTypeEnum.SITELINK
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_link])
        op_del = client.get_type("CampaignAssetOperation")
        op_del.remove = viejo_rn
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_del])

    mutate(
        "sitelink 'Ver Precios' -> /servicios#pricing (aterrizaba sin precios a la vista)",
        aplicar,
        before={"final_urls": list(r.asset.final_urls)},
        after={"final_urls": ["https://www.theapexweb.com/servicios#pricing"]},
    )

print()
print("Listo.")
