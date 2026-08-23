"""
Arreglos de la campana Apex search (23721057489).

    python scripts/google-ads/apply_fixes.py            # simula
    python scripts/google-ads/apply_fixes.py --apply    # ejecuta

Cada bloque es independiente y deja registro en docs/google-ads/changelog.jsonl.
"""

from _client import (
    client, CUSTOMER_ID, CAMPAIGN_ID, gaql, mutate, banner, micros, pesos, set_mask,
)

banner("ARREGLOS — campana Apex search")

# =========================================================================
# A. MEDICION
# =========================================================================
print("\n--- A. MEDICION ---")

# A1/A2: sacar PAGE_VIEW y SUBMIT_LEAD_FORM de los objetivos de puja.
#        Queda CONTACT (WhatsApp Click) como unico objetivo biddable.
DESACTIVAR = {"PAGE_VIEW", "SUBMIT_LEAD_FORM"}
goal_svc = client.get_service("CampaignConversionGoalService")
goal_ops = []
for r in gaql(f"""
    SELECT campaign.id, campaign_conversion_goal.category,
           campaign_conversion_goal.origin, campaign_conversion_goal.biddable,
           campaign_conversion_goal.resource_name
    FROM campaign_conversion_goal WHERE campaign.id = {CAMPAIGN_ID}
"""):
    g = r.campaign_conversion_goal
    if g.category.name in DESACTIVAR and g.biddable:
        op = client.get_type("CampaignConversionGoalOperation")
        goal = op.update
        goal.resource_name = g.resource_name
        goal.biddable = False
        set_mask(op, 'biddable')
        goal_ops.append((g.category.name, op))

for cat, op in goal_ops:
    mutate(
        f"objetivo de puja {cat}: biddable true -> false",
        lambda op=op: goal_svc.mutate_campaign_conversion_goals(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"category": cat, "biddable": True},
        after={"category": cat, "biddable": False},
    )
if not goal_ops:
    print("  (nada que hacer: PAGE_VIEW y SUBMIT_LEAD_FORM ya no son biddable)")

# A3-A5: conversion actions.
#   - Scroll 50% y Hero CTA salen de la columna Conversiones (son engagement).
#   - WhatsApp Click queda como la unica conversion primaria.
#
# NO se le pone un valor inventado. Un valor constante no crea senal economica
# (bidear por valor constante == bidear por cantidad) y ensucia el reporte con
# un numero que parece facturacion y no lo es. El valor real entra por la
# subida offline, con el monto de cada negocio. Ver A6.

ca_svc = client.get_service("ConversionActionService")
acciones = {r.conversion_action.name: r.conversion_action for r in gaql("""
    SELECT conversion_action.resource_name, conversion_action.name,
           conversion_action.status, conversion_action.include_in_conversions_metric,
           conversion_action.primary_for_goal,
           conversion_action.value_settings.default_value,
           conversion_action.value_settings.always_use_default_value
    FROM conversion_action WHERE conversion_action.status = 'ENABLED'
""")}

def actualizar_accion(nombre, **cambios):
    ca = acciones.get(nombre)
    if ca is None:
        print(f"  (no encontrada: {nombre})")
        return
    op = client.get_type("ConversionActionOperation")
    upd = op.update
    upd.resource_name = ca.resource_name
    before = {}
    for campo, valor in cambios.items():
        if campo == "default_value":
            before[campo] = ca.value_settings.default_value
            upd.value_settings.default_value = valor
        elif campo == "always_use_default_value":
            before[campo] = ca.value_settings.always_use_default_value
            upd.value_settings.always_use_default_value = valor
        else:
            before[campo] = getattr(ca, campo)
            setattr(upd, campo, valor)
    set_mask(op, *[('value_settings.' + c if c in ('default_value', 'always_use_default_value') else c)
                   for c in cambios])
    mutate(
        f"conversion action '{nombre}': {cambios}",
        lambda op=op: ca_svc.mutate_conversion_actions(
            customer_id=CUSTOMER_ID, operations=[op]),
        before=before, after=cambios,
    )

actualizar_accion("APEX - Scroll 50pct", include_in_conversions_metric=False)
actualizar_accion("APEX - Hero CTA Click", include_in_conversions_metric=False)
actualizar_accion("APEX - WhatsApp Click", primary_for_goal=True)
# La importacion de GA4 duplica la senal de contacto: fuera de la columna.
actualizar_accion("ceramicaapp-9abd8 (web) conversion", include_in_conversions_metric=False)

# A6: accion de conversion lista para la subida offline (circuito gclid).
#     Categoria PURCHASE porque hoy NO es biddable -> no puede perturbar la puja
#     hasta que decidamos activarla con datos reales.
if "APEX - Lead Calificado (offline)" not in acciones:
    op = client.get_type("ConversionActionOperation")
    ca = op.create
    ca.name = "APEX - Lead Calificado (offline)"
    ca.type_ = client.enums.ConversionActionTypeEnum.UPLOAD_CLICKS
    ca.category = client.enums.ConversionActionCategoryEnum.PURCHASE
    ca.status = client.enums.ConversionActionStatusEnum.ENABLED
    # include_in_conversions_metric es inmutable en la creacion: se ajusta despues.
    ca.primary_for_goal = False
    ca.counting_type = client.enums.ConversionActionCountingTypeEnum.ONE_PER_CLICK
    ca.click_through_lookback_window_days = 90
    ca.value_settings.always_use_default_value = False
    mutate(
        "crear conversion action 'APEX - Lead Calificado (offline)' (UPLOAD_CLICKS)",
        lambda op=op: ca_svc.mutate_conversion_actions(
            customer_id=CUSTOMER_ID, operations=[op]),
        before=None, after={"type": "UPLOAD_CLICKS", "category": "PURCHASE"},
    )
else:
    print("  (la accion offline ya existe)")

# =========================================================================
# B. PUJA Y DISPOSITIVOS
# =========================================================================
print("\n--- B. PUJA Y DISPOSITIVOS ---")

camp_svc = client.get_service("CampaignService")

# B1: TARGET_SPEND (maximizar clics) -> MAXIMIZE_CONVERSIONS.
#     Sin target CPA: primero que aprenda con el objetivo correcto.
op = client.get_type("CampaignOperation")
c = op.update
c.resource_name = camp_svc.campaign_path(CUSTOMER_ID, CAMPAIGN_ID)
# La mascara tiene que apuntar a una hoja, no al mensaje: nombrar
# 'maximize_conversions' da FIELD_HAS_SUBFIELDS. target_cpa_micros = 0
# significa "sin CPA objetivo", que es lo que queremos para que aprenda.
c.maximize_conversions.target_cpa_micros = 0
set_mask(op, 'maximize_conversions.target_cpa_micros')
mutate(
    "estrategia de puja: TARGET_SPEND -> MAXIMIZE_CONVERSIONS",
    lambda op=op: camp_svc.mutate_campaigns(customer_id=CUSTOMER_ID, operations=[op]),
    before={"bidding_strategy_type": "TARGET_SPEND"},
    after={"bidding_strategy_type": "MAXIMIZE_CONVERSIONS"},
)

# B2: desktop tenia -70% de puja y quedo con 0 gasto en 30 dias.
#     Para venta B2B de webs de $300K, desktop es donde se decide. Vuelve a neutro.
crit_svc = client.get_service("CampaignCriterionService")
op = client.get_type("CampaignCriterionOperation")
cc = op.update
cc.resource_name = crit_svc.campaign_criterion_path(CUSTOMER_ID, CAMPAIGN_ID, 30000)
cc.bid_modifier = 1.0
set_mask(op, 'bid_modifier')
mutate(
    "ajuste de puja DESKTOP: 0.30 (-70%) -> 1.0 (neutro)",
    lambda op=op: crit_svc.mutate_campaign_criteria(
        customer_id=CUSTOMER_ID, operations=[op]),
    before={"device": "DESKTOP", "bid_modifier": 0.30},
    after={"device": "DESKTOP", "bid_modifier": 1.0},
)

# =========================================================================
# C. KEYWORDS
# =========================================================================
print("\n--- C. KEYWORDS ---")

# C1-C3: pausar lo caro que no convierte y ademas tiene Quality Score bajo.
#        Regla: >= 8.000 ARS en 30d, 0 conversiones, QS <= 4 o sin QS.
#        No se toca 'presupuesto sitio web' (mejor CPA de la cuenta) ni
#        'presupuesto pagina web' (QS 7: el problema ahi es la landing).
A_PAUSAR = {
    55815017073:  "cuanto se cobra por hacer una pagina web (EXACT) — $16.044, 0 conv, QS 3",
    142318757:    "hacer una pagina web (PHRASE) — $10.452, 0 conv, sin QS",
    299155369813: "cuanto sale una pagina web (EXACT) — $8.929, 0 conv, QS 4",
}

agc_svc = client.get_service("AdGroupCriterionService")
for r in gaql(f"""
    SELECT campaign.id, ad_group.id, ad_group_criterion.criterion_id,
           ad_group_criterion.keyword.text, ad_group_criterion.status
    FROM ad_group_criterion
    WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.criterion_id IN ({','.join(str(k) for k in A_PAUSAR)})
"""):
    if r.ad_group_criterion.status.name != "ENABLED":
        continue
    op = client.get_type("AdGroupCriterionOperation")
    k = op.update
    k.resource_name = agc_svc.ad_group_criterion_path(
        CUSTOMER_ID, r.ad_group.id, r.ad_group_criterion.criterion_id)
    k.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
    set_mask(op, 'status')
    motivo = A_PAUSAR[r.ad_group_criterion.criterion_id]
    mutate(
        f"pausar keyword: {motivo}",
        lambda op=op: agc_svc.mutate_ad_group_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before={"criterion_id": r.ad_group_criterion.criterion_id, "status": "ENABLED"},
        after={"status": "PAUSED"},
    )

# C4: 'busco alguien que me haga una pagina web' es el termino de mayor intencion
#     que aparecio y convirtio. Hoy entra por concordancia amplia; le damos
#     su propia keyword exacta.
GRUPO_WEB = 196839024158  # Web - Diseno y Desarrollo
NUEVA = "busco alguien que me haga una pagina web"
existe = gaql(f"""
    SELECT campaign.id, ad_group_criterion.keyword.text
    FROM ad_group_criterion WHERE ad_group.id = {GRUPO_WEB}
      AND ad_group_criterion.keyword.text = '{NUEVA}'
""")
if not existe:
    op = client.get_type("AdGroupCriterionOperation")
    k = op.create
    k.ad_group = client.get_service("AdGroupService").ad_group_path(CUSTOMER_ID, GRUPO_WEB)
    k.status = client.enums.AdGroupCriterionStatusEnum.ENABLED
    k.keyword.text = NUEVA
    k.keyword.match_type = client.enums.KeywordMatchTypeEnum.PHRASE
    mutate(
        f"agregar keyword PHRASE '{NUEVA}' (convirtio via amplia)",
        lambda op=op: agc_svc.mutate_ad_group_criteria(
            customer_id=CUSTOMER_ID, operations=[op]),
        before=None, after={"keyword": NUEVA, "match": "PHRASE"},
    )
else:
    print(f"  (ya existe la keyword '{NUEVA}')")

# C5: negativas para la basura observada en terminos de busqueda de 30 dias.
#     Ninguna toca un termino que haya convertido.
NEGATIVAS = [
    # herramientas / hazlo-vos-mismo
    "herramientas", "plantilla web", "generador",
    # servicios que no vendemos
    "alojamiento", "mantenimiento", "agencia de marketing", "posicionamiento web",
    # informacional / aprendizaje
    "novedades", "programacion web", "que necesito para crear",
    # marcas y productos ajenos
    "adobe", "bkninja", "canva pagina", "meta tags",
    # fuera de servicio
    "blogs", "venta de paginas", "concept page", "page design",
    "dev web", "web developer",
]
existentes = {
    r.campaign_criterion.keyword.text.lower()
    for r in gaql(f"""
        SELECT campaign.id, campaign_criterion.keyword.text
        FROM campaign_criterion
        WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
          AND campaign_criterion.type = 'KEYWORD'
    """)
}
nuevas = [n for n in NEGATIVAS if n.lower() not in existentes]
if nuevas:
    ops = []
    for texto in nuevas:
        op = client.get_type("CampaignCriterionOperation")
        cc = op.create
        cc.campaign = camp_svc.campaign_path(CUSTOMER_ID, CAMPAIGN_ID)
        cc.negative = True
        cc.keyword.text = texto
        cc.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
        ops.append(op)
    mutate(
        f"agregar {len(nuevas)} negativas: {', '.join(nuevas)}",
        lambda ops=ops: crit_svc.mutate_campaign_criteria(
            customer_id=CUSTOMER_ID, operations=ops),
        before=None, after={"negativas": nuevas},
    )
else:
    print("  (todas las negativas ya estaban)")

# =========================================================================
# D. ANUNCIOS
# =========================================================================
print("\n--- D. ANUNCIOS ---")

# El anuncio de 'Presupuesto y Precios' promete precios (path /presupuesto/web)
# y aterriza en el tope de /servicios. La tabla de precios vive en #pricing.
# Los de Apps apuntan a la home, que no habla de apps.
URLS = {
    806775371905: "https://www.theapexweb.com/servicios#pricing",
    806775371902: "https://www.theapexweb.com/servicios",
    806854817249: "https://www.theapexweb.com/servicios",
}
ad_svc = client.get_service("AdService")
for r in gaql(f"""
    SELECT campaign.id, ad_group_ad.ad.id, ad_group_ad.ad.final_urls
    FROM ad_group_ad WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_ad.ad.id IN ({','.join(str(k) for k in URLS)})
"""):
    ad_id = r.ad_group_ad.ad.id
    actual = list(r.ad_group_ad.ad.final_urls)
    destino = URLS[ad_id]
    if actual == [destino]:
        print(f"  (ad {ad_id} ya apunta a {destino})")
        continue
    op = client.get_type("AdOperation")
    ad = op.update
    ad.resource_name = ad_svc.ad_path(CUSTOMER_ID, ad_id)
    ad.final_urls.append(destino)
    set_mask(op, 'final_urls')
    mutate(
        f"ad {ad_id}: final_url {actual} -> {destino}",
        lambda op=op: ad_svc.mutate_ads(customer_id=CUSTOMER_ID, operations=[op]),
        before={"ad_id": ad_id, "final_urls": actual},
        after={"final_urls": [destino]},
    )

print()
print("Listo.")
