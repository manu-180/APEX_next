"""
Alinea lo que promete la campana con lo que el sitio entrega.

    python scripts/google-ads/fix_coherencia.py            # simula
    python scripts/google-ads/fix_coherencia.py --apply    # ejecuta

Cada cambio nace de una contradiccion verificada leyendo el codigo del sitio.
Cuando el anuncio y el sitio se contradicen, el dato correcto es el del sitio.
"""
from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, set_mask,
)

banner("COHERENCIA CAMPANA <-> SITIO")

MAX_TITULO = 30
MAX_DESC = 90

# =========================================================================
# 1. TEXTO DE LOS ANUNCIOS
# =========================================================================
# - "30 dias": el sitio garantiza entrega en 15 dias y devuelve el deposito si
#   no cumple (app/layout.tsx, app/llms.txt/route.ts, app/servicios/content.tsx).
#   Nos estabamos vendiendo peor de lo que entregamos.
# - "$1.2M": las apps NO son pago unico. Son retainer mensual de $580.000 y
#   $1.150.000 (lib/types/services.ts, APP_PLANS, billing: 'month').
#   Prometer un precio final que no existe es un problema de confianza, no de copy.
REEMPLAZOS = {
    "Tu Web Lista en 30 Días": "Tu Web Lista en 15 Días",
    "App Profesional $1.2M ARS": "Apps desde $580.000 al Mes",
    "Apps móviles desde $1.2M. Entrega en 60 días con 3 meses de soporte post-lanzamiento.":
        "Apps con fee mensual desde $580.000: desarrollo continuo, mejoras y soporte.",
    # Variantes del mismo error de precio que quedaron fuera del primer barrido.
    "Webs desde $300k y apps desde $1.2M. Para tu negocio en Argentina.":
        "Webs desde $300.000 y apps con fee mensual desde $580.000. Argentina.",
    "Web $300K · App $1.2M ARS": "Web $300K · App $580K/Mes",
    "Webs desde $300.000 y apps desde $1.200.000 ARS. Precio final sin sorpresas. Pedí gratis.":
        "Webs desde $300.000 con precio final. Apps con fee mensual desde $580.000.",
    "App Profesional desde $1.2M": "App Profesional $580.000/Mes",
    "Apps desde $1.2M ARS. Entrega en 60 días, 3 meses de soporte post-lanzamiento.":
        "Apps con fee mensual desde $580.000. Entrega en 60 días y soporte continuo.",
}

for texto, nuevo in REEMPLAZOS.items():
    limite = MAX_TITULO if len(texto) <= MAX_TITULO else MAX_DESC
    assert len(nuevo) <= limite, f"'{nuevo}' mide {len(nuevo)}, limite {limite}"

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

    nuevos_t = [REEMPLAZOS.get(t, t) for t in titulos]
    nuevos_d = [REEMPLAZOS.get(d, d) for d in descs]
    if nuevos_t == titulos and nuevos_d == descs:
        continue

    cambios = [f"'{a}' -> '{b}'" for a, b in zip(titulos + descs, nuevos_t + nuevos_d) if a != b]

    op = client.get_type("AdOperation")
    upd = op.update
    upd.resource_name = ad_svc.ad_path(CUSTOMER_ID, ad.id)
    for i, texto in enumerate(nuevos_t):
        asset = client.get_type("AdTextAsset")
        asset.text = texto
        if rsa.headlines[i].pinned_field:
            asset.pinned_field = rsa.headlines[i].pinned_field
        upd.responsive_search_ad.headlines.append(asset)
    for i, texto in enumerate(nuevos_d):
        asset = client.get_type("AdTextAsset")
        asset.text = texto
        if rsa.descriptions[i].pinned_field:
            asset.pinned_field = rsa.descriptions[i].pinned_field
        upd.responsive_search_ad.descriptions.append(asset)
    upd.responsive_search_ad.path1 = rsa.path1
    upd.responsive_search_ad.path2 = rsa.path2
    # La mascara tiene que apuntar a hojas: nombrar el mensaje entero da
    # FIELD_HAS_SUBFIELDS (mismo caso que maximize_conversions).
    set_mask(op, "responsive_search_ad.headlines",
                 "responsive_search_ad.descriptions")

    mutate(
        f"ad {ad.id} ({r.ad_group.name}): " + " | ".join(cambios),
        lambda op=op: ad_svc.mutate_ads(customer_id=CUSTOMER_ID, operations=[op]),
        before={"ad_id": ad.id, "headlines": titulos, "descriptions": descs},
        after={"headlines": nuevos_t, "descriptions": nuevos_d},
    )

# =========================================================================
# 2. SITELINKS Y CALLOUTS
# =========================================================================
# Los assets son en su mayoria inmutables: para corregir el texto hay que crear
# uno nuevo, vincularlo a la campana y desvincular el viejo.
asset_svc = client.get_service("AssetService")
ca_svc = client.get_service("CampaignAssetService")
camp_svc = client.get_service("CampaignService")
campaign_rn = camp_svc.campaign_path(CUSTOMER_ID, CAMPAIGN_ID)


def reemplazar_sitelink(asset_id, motivo, link_text, d1, d2, url):
    """Crea un sitelink corregido, lo vincula y desvincula el viejo."""
    assert len(link_text) <= 25, f"link_text '{link_text}' mide {len(link_text)}"
    for d in (d1, d2):
        assert len(d) <= 35, f"descripcion '{d}' mide {len(d)}"

    viejo = gaql(f"""
        SELECT campaign.id, campaign_asset.resource_name, asset.id,
               asset.sitelink_asset.link_text, asset.sitelink_asset.description1,
               asset.final_urls
        FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
          AND campaign_asset.field_type = 'SITELINK'
          AND campaign_asset.status = 'ENABLED' AND asset.id = {asset_id}
    """)
    if not viejo:
        print(f"  (sitelink {asset_id} ya no esta vinculado)")
        return
    v = viejo[0]

    op_a = client.get_type("AssetOperation")
    a = op_a.create
    a.sitelink_asset.link_text = link_text
    a.sitelink_asset.description1 = d1
    a.sitelink_asset.description2 = d2
    a.final_urls.append(url)

    def aplicar():
        res = asset_svc.mutate_assets(customer_id=CUSTOMER_ID, operations=[op_a])
        nuevo_rn = res.results[0].resource_name
        op_link = client.get_type("CampaignAssetOperation")
        link = op_link.create
        link.campaign = campaign_rn
        link.asset = nuevo_rn
        link.field_type = client.enums.AssetFieldTypeEnum.SITELINK
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_link])
        op_del = client.get_type("CampaignAssetOperation")
        op_del.remove = v.campaign_asset.resource_name
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_del])
        return nuevo_rn

    mutate(
        f"sitelink '{link_text}': {motivo}",
        aplicar,
        before={
            "asset_id": asset_id,
            "link_text": v.asset.sitelink_asset.link_text,
            "description1": v.asset.sitelink_asset.description1,
            "final_urls": list(v.asset.final_urls),
            "campaign_asset": v.campaign_asset.resource_name,
        },
        after={"link_text": link_text, "description1": d1, "description2": d2, "url": url},
    )


# El sitio promete "Te respondo en menos de 1 hora" en 8 lugares, y el callout
# activo dice "Respuesta en 1 Hora". Este sitelink decia 2 horas: la campana se
# contradecia a si misma en la misma pagina de resultados.
reemplazar_sitelink(
    343513150619,
    "decia 'menos de 2 horas' y el sitio (y el propio callout) prometen 1 hora",
    "Consultá gratis",
    "Respondemos en menos de 1 hora",
    "Sin compromiso, 100% gratuito",
    "https://www.theapexweb.com/contacto",
)

# lib/data/showcase.ts tiene 9 proyectos. "+15" era una cifra que el sitio no
# respalda: quien entra a /sobre-mi y cuenta, encuentra la diferencia.
reemplazar_sitelink(
    343513150625,
    "decia '+15 proyectos' y el sitio muestra 9",
    "Sobre nosotros",
    "Quién está detrás de APEX",
    "Trabajás con el desarrollador",
    "https://www.theapexweb.com/sobre-mi",
)

# Sin www: cada clic pago se comia un 308 antes de ver la pagina.
reemplazar_sitelink(
    353745228073,
    "apuntaba a theapexweb.com sin www y devolvia 308 en cada clic pago",
    "Qué ofrecés",
    "Webs, apps y más a medida",
    "Precios reales, sin sorpresas",
    "https://www.theapexweb.com/servicios",
)


def reemplazar_callout(asset_id, motivo, texto_nuevo):
    assert len(texto_nuevo) <= 25, f"callout '{texto_nuevo}' mide {len(texto_nuevo)}"
    viejo = gaql(f"""
        SELECT campaign.id, campaign_asset.resource_name, asset.id,
               asset.callout_asset.callout_text
        FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
          AND campaign_asset.field_type = 'CALLOUT'
          AND campaign_asset.status = 'ENABLED' AND asset.id = {asset_id}
    """)
    if not viejo:
        print(f"  (callout {asset_id} ya no esta vinculado)")
        return
    v = viejo[0]

    op_a = client.get_type("AssetOperation")
    op_a.create.callout_asset.callout_text = texto_nuevo

    def aplicar():
        res = asset_svc.mutate_assets(customer_id=CUSTOMER_ID, operations=[op_a])
        op_link = client.get_type("CampaignAssetOperation")
        link = op_link.create
        link.campaign = campaign_rn
        link.asset = res.results[0].resource_name
        link.field_type = client.enums.AssetFieldTypeEnum.CALLOUT
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_link])
        op_del = client.get_type("CampaignAssetOperation")
        op_del.remove = v.campaign_asset.resource_name
        ca_svc.mutate_campaign_assets(customer_id=CUSTOMER_ID, operations=[op_del])

    mutate(
        f"callout '{v.asset.callout_asset.callout_text}' -> '{texto_nuevo}': {motivo}",
        aplicar,
        before={"asset_id": asset_id, "callout_text": v.asset.callout_asset.callout_text,
                "campaign_asset": v.campaign_asset.resource_name},
        after={"callout_text": texto_nuevo},
    )


# /contacto SI tiene un formulario (app/contacto/content.tsx: input type=email
# dentro del flujo de reserva). El sitio dice "sin formularios eternos"; el
# callout se comio la palabra que lo hacia cierto.
reemplazar_callout(
    347071465188,
    "/contacto tiene formulario; el sitio dice 'sin formularios eternos'",
    "Sin Formularios Eternos",
)

print()
print("Listo.")
