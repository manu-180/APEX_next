# -*- coding: utf-8 -*-
"""
Barrido final: cualquier texto de anuncio que siga prometiendo las apps como
pago unico, y el sitelink 'Sobre nosotros' que quedo repitiendo la descripcion
de 'Portfolio'.

El primer barrido comparaba por texto exacto y se le escaparon variantes con
separadores distintos. Este busca por subcadena.
"""
import re
from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, set_mask,
)

banner("BARRIDO FINAL")

# --------------------------------------------------------------- anuncios
PATRON = re.compile(r"1\.2M|1\.200\.000")

# Reescrituras por texto exacto una vez detectado el patron.
ARREGLOS = {
    "Web $300K · App $1.2M ARS": "Web $300K · App $580K/Mes",
    "Web $300K - App $1.2M ARS": "Web $300K - App $580K/Mes",
}

ad_svc = client.get_service("AdService")

for r in gaql(f"""
    SELECT campaign.id, ad_group.name, ad_group_ad.ad.id,
           ad_group_ad.ad.responsive_search_ad.headlines,
           ad_group_ad.ad.responsive_search_ad.descriptions
    FROM ad_group_ad WHERE campaign.id = {CAMPAIGN_ID}
"""):
    ad = r.ad_group_ad.ad
    rsa = ad.responsive_search_ad
    titulos = [h.text for h in rsa.headlines]
    descs = [d.text for d in rsa.descriptions]
    if not any(PATRON.search(t) for t in titulos + descs):
        continue

    def corregir(t, limite):
        if not PATRON.search(t):
            return t
        if t in ARREGLOS:
            return ARREGLOS[t]
        # Generico: el precio de app pasa a fee mensual.
        nuevo = PATRON.sub("580.000/mes", t).replace("$580.000/mes ARS", "$580.000/mes")
        return nuevo[:limite]

    nuevos_t = [corregir(t, 30) for t in titulos]
    nuevos_d = [corregir(d, 90) for d in descs]
    cambios = [f"'{a}' -> '{b}'" for a, b in zip(titulos + descs, nuevos_t + nuevos_d) if a != b]
    if not cambios:
        continue

    op = client.get_type("AdOperation")
    upd = op.update
    upd.resource_name = ad_svc.ad_path(CUSTOMER_ID, ad.id)
    for i, texto in enumerate(nuevos_t):
        a = client.get_type("AdTextAsset"); a.text = texto
        if rsa.headlines[i].pinned_field:
            a.pinned_field = rsa.headlines[i].pinned_field
        upd.responsive_search_ad.headlines.append(a)
    for i, texto in enumerate(nuevos_d):
        a = client.get_type("AdTextAsset"); a.text = texto
        if rsa.descriptions[i].pinned_field:
            a.pinned_field = rsa.descriptions[i].pinned_field
        upd.responsive_search_ad.descriptions.append(a)
    upd.responsive_search_ad.path1 = rsa.path1
    upd.responsive_search_ad.path2 = rsa.path2
    set_mask(op, "responsive_search_ad.headlines", "responsive_search_ad.descriptions")

    mutate(
        f"ad {ad.id} ({r.ad_group.name}): " + " | ".join(cambios),
        lambda op=op: ad_svc.mutate_ads(customer_id=CUSTOMER_ID, operations=[op]),
        before={"ad_id": ad.id, "headlines": titulos, "descriptions": descs},
        after={"headlines": nuevos_t, "descriptions": nuevos_d},
    )

# -------------------------------------------------------------- sitelink
asset_svc = client.get_service("AssetService")
ca_svc = client.get_service("CampaignAssetService")
campaign_rn = client.get_service("CampaignService").campaign_path(CUSTOMER_ID, CAMPAIGN_ID)

for r in gaql(f"""
    SELECT campaign.id, campaign_asset.resource_name, asset.id,
           asset.sitelink_asset.link_text, asset.sitelink_asset.description1,
           asset.sitelink_asset.description2, asset.final_urls
    FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_asset.field_type = 'SITELINK'
      AND campaign_asset.status = 'ENABLED'
"""):
    s = r.asset.sitelink_asset
    if s.link_text != "Sobre nosotros" or "Proyectos reales" not in s.description1:
        continue

    op_a = client.get_type("AssetOperation")
    a = op_a.create
    a.sitelink_asset.link_text = "Sobre nosotros"
    a.sitelink_asset.description1 = "Quién está detrás de APEX"
    a.sitelink_asset.description2 = "Trabajás con el desarrollador"
    a.final_urls.append("https://www.theapexweb.com/sobre-mi")
    viejo_rn = r.campaign_asset.resource_name

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
        "sitelink 'Sobre nosotros': repetia la descripcion de 'Portfolio'",
        aplicar,
        before={"description1": s.description1},
        after={"description1": "Quién está detrás de APEX"},
    )

print()
print("Listo.")
