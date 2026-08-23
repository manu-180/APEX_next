"""Segunda pasada: assets, anuncios que faltaron, y detector de conflictos negativa/keyword."""
import re
from _client import gaql, pesos, CAMPAIGN_ID

W = "2026-07-23' AND '2026-08-21"

print("### ASSETS")
for r in gaql(f"""
    SELECT campaign.id, campaign_asset.field_type, campaign_asset.status,
           asset.type, asset.sitelink_asset.link_text,
           asset.callout_asset.callout_text,
           asset.structured_snippet_asset.header,
           asset.structured_snippet_asset.values, asset.final_urls
    FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
"""):
    ca, a = r.campaign_asset, r.asset
    label = (a.sitelink_asset.link_text or a.callout_asset.callout_text
             or a.structured_snippet_asset.header or "")
    extra = ""
    if a.type_.name == "SITELINK":
        extra = f" -> {list(a.final_urls)}"
    if a.type_.name == "STRUCTURED_SNIPPET":
        extra = f" {list(a.structured_snippet_asset.values)}"
    print(f"  {ca.field_type.name:20s} [{ca.status.name:8s}] {label}{extra}")

print()
print("### ANUNCIOS DEL GRUPO 'Presupuesto y Precios'")
for r in gaql(f"""
    SELECT ad_group.name, ad_group_ad.ad.id, ad_group_ad.status, ad_group_ad.ad_strength,
           ad_group_ad.ad.final_urls,
           ad_group_ad.ad.responsive_search_ad.headlines,
           ad_group_ad.ad.responsive_search_ad.descriptions,
           ad_group_ad.ad.responsive_search_ad.path1,
           ad_group_ad.ad.responsive_search_ad.path2
    FROM ad_group_ad WHERE ad_group.id = 196839024238
"""):
    ad = r.ad_group_ad.ad
    rsa = ad.responsive_search_ad
    print(f"  ad {ad.id} [{r.ad_group_ad.status.name}] fuerza={r.ad_group_ad.ad_strength.name}")
    print(f"    final_urls: {list(ad.final_urls)}   path: /{rsa.path1}/{rsa.path2}")
    for h in rsa.headlines:
        print(f"      H: {h.text}" + (f" [PIN {h.pinned_field.name}]" if h.pinned_field else ""))
    for d in rsa.descriptions:
        print(f"      D: {d.text}" + (f" [PIN {d.pinned_field.name}]" if d.pinned_field else ""))

# ------------------------------------------------------------ conflictos
print()
print("### CONFLICTOS negativa de campana vs keyword activa")

negs = [r.campaign_criterion.keyword.text.lower()
        for r in gaql(f"""
            SELECT campaign.id, campaign_criterion.keyword.text
            FROM campaign_criterion
            WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
              AND campaign_criterion.type = 'KEYWORD'
        """)]

kws = gaql(f"""
    SELECT campaign.id, ad_group.id, ad_group.name, ad_group.status,
           ad_group_criterion.criterion_id, ad_group_criterion.keyword.text,
           ad_group_criterion.keyword.match_type, ad_group_criterion.status,
           metrics.cost_micros, metrics.conversions
    FROM keyword_view
    WHERE campaign.id = {CAMPAIGN_ID} AND segments.date BETWEEN '{W}'
""")


def tokens(s):
    return set(re.findall(r"\w+", s.lower()))


conflicts = []
for r in kws:
    if r.ad_group_criterion.status.name != "ENABLED":
        continue
    kw = r.ad_group_criterion.keyword.text.lower()
    kt = tokens(kw)
    for n in negs:
        # negativa de concordancia amplia: bloquea si TODOS sus terminos estan en la keyword
        if tokens(n) <= kt:
            conflicts.append((
                r.ad_group_criterion.criterion_id, kw,
                r.ad_group_criterion.keyword.match_type.name, n,
                pesos(r.metrics.cost_micros), r.metrics.conversions,
                r.ad_group.name, r.ad_group.status.name,
            ))
            break

conflicts.sort(key=lambda x: -x[4])
total = sum(c[4] for c in conflicts)
print(f"  {len(conflicts)} keywords activas bloqueadas por una negativa. Gasto 30d: {total:,.0f} ARS")
for cid, kw, mt, n, cost, conv, ag, ags in conflicts:
    print(f"  [{cid}] {kw[:44]:44s} {mt:7s} bloqueada por '{n}'  cost={cost:>8,.0f} conv={conv:.0f}  ({ag[:22]}/{ags})")

# ------------------------------------------------------------ duplicados
print()
print("### KEYWORDS DUPLICADAS (mismo texto, distinto match o grupo)")
from collections import defaultdict
by_text = defaultdict(list)
for r in kws:
    by_text[r.ad_group_criterion.keyword.text.lower()].append(r)
for text, group in sorted(by_text.items()):
    if len(group) > 1:
        detail = " | ".join(
            f"{g.ad_group_criterion.keyword.match_type.name}/{g.ad_group.name[:14]}/"
            f"{g.ad_group_criterion.status.name[:4]}/{pesos(g.metrics.cost_micros):,.0f}"
            for g in group)
        print(f"  {text[:40]:40s} -> {detail}")

# ------------------------------------------------------------ cero impresiones
print()
print("### KEYWORDS ACTIVAS CON 0 IMPRESIONES EN 30d (en grupos activos)")
zero = [r for r in kws
        if r.metrics.impressions == 0
        and r.ad_group_criterion.status.name == "ENABLED"
        and r.ad_group.status.name == "ENABLED"]
print(f"  {len(zero)} keywords")
print("  " + " | ".join(sorted(r.ad_group_criterion.keyword.text for r in zero)))
