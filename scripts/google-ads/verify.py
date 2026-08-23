"""Relee el estado real de la cuenta y lo compara con lo que deberia haber quedado."""
from _client import gaql, pesos, CAMPAIGN_ID

fallos = []


def check(desc, ok, detalle=""):
    print(f"  {'OK  ' if ok else 'FALLA'}  {desc}  {detalle}")
    if not ok:
        fallos.append(desc)


print("### VERIFICACION")

# --- objetivos de puja
goals = {r.campaign_conversion_goal.category.name: r.campaign_conversion_goal.biddable
         for r in gaql(f"""
    SELECT campaign.id, campaign_conversion_goal.category, campaign_conversion_goal.biddable
    FROM campaign_conversion_goal WHERE campaign.id = {CAMPAIGN_ID}
""")}
check("PAGE_VIEW fuera de la puja", goals.get("PAGE_VIEW") is False, f"biddable={goals.get('PAGE_VIEW')}")
check("SUBMIT_LEAD_FORM fuera de la puja", goals.get("SUBMIT_LEAD_FORM") is False, f"biddable={goals.get('SUBMIT_LEAD_FORM')}")
check("CONTACT sigue siendo el objetivo", goals.get("CONTACT") is True, f"biddable={goals.get('CONTACT')}")

# --- conversion actions
acc = {r.conversion_action.name: r.conversion_action for r in gaql("""
    SELECT conversion_action.name, conversion_action.status, conversion_action.type,
           conversion_action.category, conversion_action.primary_for_goal,
           conversion_action.include_in_conversions_metric
    FROM conversion_action WHERE conversion_action.status = 'ENABLED'
""")}
for n in ["APEX - Scroll 50pct", "APEX - Hero CTA Click", "ceramicaapp-9abd8 (web) conversion"]:
    a = acc.get(n)
    check(f"'{n}' fuera de la columna Conversiones",
          a is not None and not a.include_in_conversions_metric,
          f"include={a.include_in_conversions_metric if a else 'n/a'}")
wa = acc.get("APEX - WhatsApp Click")
check("'APEX - WhatsApp Click' cuenta y es primaria",
      wa is not None and wa.include_in_conversions_metric and wa.primary_for_goal)
off = acc.get("APEX - Lead Calificado (offline)")
check("accion offline creada como UPLOAD_CLICKS",
      off is not None and off.type_.name == "UPLOAD_CLICKS",
      f"tipo={off.type_.name if off else 'no existe'} categoria={off.category.name if off else '-'}")

# --- campana
for r in gaql(f"""
    SELECT campaign.id, campaign.bidding_strategy_type, campaign.status,
           campaign_budget.amount_micros
    FROM campaign WHERE campaign.id = {CAMPAIGN_ID}
"""):
    check("estrategia = MAXIMIZE_CONVERSIONS",
          r.campaign.bidding_strategy_type.name == "MAXIMIZE_CONVERSIONS",
          r.campaign.bidding_strategy_type.name)
    check("campana sigue activa", r.campaign.status.name == "ENABLED", r.campaign.status.name)
    print(f"         budget diario: {pesos(r.campaign_budget.amount_micros):,.0f} ARS")

# --- dispositivos
for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.device.type, campaign_criterion.bid_modifier
    FROM campaign_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_criterion.type = 'DEVICE'
"""):
    cc = r.campaign_criterion
    if cc.device.type_.name == "DESKTOP":
        check("desktop sin castigo de puja", abs(cc.bid_modifier - 1.0) < 0.001,
              f"bid_modifier={cc.bid_modifier:.2f}")

# --- estado esperado de las keywords que se tocaron
#
# Solo queda pausada la que no convirtio en TRES meses. Las otras dos se
# pausaron el 22-08 mirando 30 dias y se reactivaron el 23-08: con ~5
# conversiones al mes, una ventana de 30 dias no distingue "no convierte" de
# "todavia no le toco". A 90 dias tienen 2 conversiones cada una, con CPA mejor
# que el promedio de la cuenta.
ESPERADO = {
    55815017073:  "PAUSED",   # cuanto se cobra por hacer una pagina web: $16.950, 0 conv en 3 meses
    142318757:    "ENABLED",  # hacer una pagina web: 2 conv, CPA $9.177
    299155369813: "ENABLED",  # cuanto sale una pagina web: 2 conv, CPA $9.969
}
for r in gaql(f"""
    SELECT campaign.id, ad_group_criterion.criterion_id, ad_group_criterion.keyword.text,
           ad_group_criterion.status FROM ad_group_criterion
    WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.criterion_id IN ({','.join(map(str, ESPERADO))})
"""):
    k = r.ad_group_criterion
    esperado = ESPERADO[k.criterion_id]
    check(f"keyword {k.keyword.text[:34]} -> {esperado}",
          k.status.name == esperado, k.status.name)

# --- negativas que NO pueden volver: matan busquedas de compra
PROHIBIDAS = ["web me", "tarifario", "3d", "que necesito", "qué necesito"]
negs_actuales = {r.campaign_criterion.keyword.text.lower() for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.keyword.text FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
""")}
volvieron = [n for n in PROHIBIDAS if n in negs_actuales]
check("ninguna negativa asesina volvio", not volvieron, f"volvieron={volvieron}")

# --- keyword nueva
nueva = gaql(f"""
    SELECT campaign.id, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
           ad_group_criterion.status FROM ad_group_criterion
    WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_criterion.keyword.text = 'busco alguien que me haga una pagina web'
""")
check("keyword 'busco alguien que me haga una pagina web' activa",
      any(r.ad_group_criterion.status.name == "ENABLED" for r in nueva),
      f"{len(nueva)} coincidencia(s)")

# --- negativas
negs = {r.campaign_criterion.keyword.text.lower() for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.keyword.text FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
""")}
esperadas = ["herramientas", "alojamiento", "mantenimiento", "adobe", "bkninja",
             "venta de paginas", "dev web", "web developer", "page design", "blogs"]
faltan = [n for n in esperadas if n not in negs]
check(f"negativas nuevas presentes (total en cuenta: {len(negs)})", not faltan, f"faltan={faltan}")

# --- anuncios
URLS = {806775371905: "https://www.theapexweb.com/servicios#pricing",
        806775371902: "https://www.theapexweb.com/servicios",
        806854817249: "https://www.theapexweb.com/servicios"}
for r in gaql(f"""
    SELECT campaign.id, ad_group_ad.ad.id, ad_group_ad.ad.final_urls
    FROM ad_group_ad WHERE campaign.id = {CAMPAIGN_ID}
      AND ad_group_ad.ad.id IN ({','.join(map(str, URLS))})
"""):
    ad = r.ad_group_ad.ad
    check(f"final_url del ad {ad.id}", list(ad.final_urls) == [URLS[ad.id]], list(ad.final_urls))

print()
print("TODO VERDE" if not fallos else f"{len(fallos)} FALLAS: {fallos}")
