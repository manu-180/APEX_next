"""
Lectura completa de la cuenta APEX. No escribe nada.

    python scripts/google-ads/audit.py
"""
from _client import gaql, pesos, CAMPAIGN_ID

W = "2026-07-23' AND '2026-08-21"  # ventana de 30 dias


def section(t):
    print()
    print("### " + t)


# --------------------------------------------------------------- settings
section("CAMPAIGN SETTINGS")
for r in gaql(f"""
    SELECT campaign.id, campaign.name, campaign.status,
           campaign.advertising_channel_type, campaign.advertising_channel_sub_type,
           campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros,
           campaign.target_spend.target_spend_micros,
           campaign.network_settings.target_google_search,
           campaign.network_settings.target_search_network,
           campaign.network_settings.target_content_network,
           campaign.optimization_score,
           campaign_budget.amount_micros, campaign_budget.delivery_method,
           campaign_budget.explicitly_shared
    FROM campaign WHERE campaign.id = {CAMPAIGN_ID}
"""):
    c, b = r.campaign, r.campaign_budget
    print(f"  nombre           {c.name}  [{c.status.name}]")
    print(f"  tipo             {c.advertising_channel_type.name} / {c.advertising_channel_sub_type.name}")
    print(f"  puja             {c.bidding_strategy_type.name}")
    print(f"  cpc ceiling      {pesos(c.target_spend.cpc_bid_ceiling_micros):,.0f} ARS  (0 = sin techo)")
    print(f"  budget diario    {pesos(b.amount_micros):,.0f} ARS  ({b.delivery_method.name}, compartido={b.explicitly_shared})")
    print(f"  optimization sc. {c.optimization_score:.2f}")
    n = c.network_settings
    print(f"  redes            google_search={n.target_google_search} search_partners={n.target_search_network} display={n.target_content_network}")

section("GEO / IDIOMA / SCHEDULE / DEVICE")
for r in gaql(f"""
    SELECT campaign_criterion.type, campaign_criterion.negative,
           campaign_criterion.location.geo_target_constant,
           campaign_criterion.language.language_constant,
           campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour,
           campaign_criterion.ad_schedule.end_hour,
           campaign_criterion.device.type, campaign_criterion.bid_modifier
    FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_criterion.type IN ('LOCATION','LANGUAGE','AD_SCHEDULE','DEVICE')
"""):
    cc = r.campaign_criterion
    t = cc.type_.name
    if t == "LOCATION":
        print(f"  LOCATION  {cc.location.geo_target_constant}  negativo={cc.negative}  mod={cc.bid_modifier:.2f}")
    elif t == "LANGUAGE":
        print(f"  LANGUAGE  {cc.language.language_constant}")
    elif t == "AD_SCHEDULE":
        print(f"  SCHEDULE  {cc.ad_schedule.day_of_week.name} {cc.ad_schedule.start_hour}-{cc.ad_schedule.end_hour} mod={cc.bid_modifier:.2f}")
    else:
        print(f"  DEVICE    {cc.device.type_.name} mod={cc.bid_modifier:.2f}")

# --------------------------------------------------------------- ad groups
section("AD GROUPS (30d)")
for r in gaql(f"""
    SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.cpc_bid_micros,
           metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions
    FROM ad_group
    WHERE campaign.id = {CAMPAIGN_ID} AND segments.date BETWEEN '{W}'
    ORDER BY metrics.cost_micros DESC
"""):
    a, m = r.ad_group, r.metrics
    print(f"  {a.id}  {a.name[:34]:34s} {a.status.name:8s} bid={pesos(a.cpc_bid_micros):>7,.0f} "
          f"cost={pesos(m.cost_micros):>9,.0f} clk={m.clicks:>4} imp={m.impressions:>5} conv={m.conversions:.0f}")

print("  --- ad groups sin datos en la ventana ---")
for r in gaql(f"""
    SELECT ad_group.id, ad_group.name, ad_group.status
    FROM ad_group WHERE campaign.id = {CAMPAIGN_ID}
"""):
    print(f"  {r.ad_group.id}  {r.ad_group.name[:40]:40s} {r.ad_group.status.name}")

# --------------------------------------------------------------- keywords
section("KEYWORDS (30d, incluye las que no gastaron)")
rows = gaql(f"""
    SELECT ad_group.name, ad_group_criterion.criterion_id,
           ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type,
           ad_group_criterion.status, ad_group_criterion.quality_info.quality_score,
           ad_group_criterion.quality_info.creative_quality_score,
           ad_group_criterion.quality_info.post_click_quality_score,
           ad_group_criterion.quality_info.search_predicted_ctr,
           metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions,
           metrics.average_cpc, metrics.search_impression_share
    FROM keyword_view
    WHERE campaign.id = {CAMPAIGN_ID} AND segments.date BETWEEN '{W}'
    ORDER BY metrics.cost_micros DESC
""")
print(f"  total con datos: {len(rows)}")
for r in rows:
    k, q, m = r.ad_group_criterion.keyword, r.ad_group_criterion.quality_info, r.metrics
    print(f"  [{r.ad_group_criterion.criterion_id}] {k.text[:38]:38s} {k.match_type.name:7s} "
          f"{r.ad_group_criterion.status.name:8s} QS={q.quality_score or 0} "
          f"(ad={q.creative_quality_score.name[:5]}/lp={q.post_click_quality_score.name[:5]}/ctr={q.search_predicted_ctr.name[:5]}) "
          f"cost={pesos(m.cost_micros):>8,.0f} clk={m.clicks:>3} imp={m.impressions:>4} conv={m.conversions:.0f} "
          f"cpc={pesos(m.average_cpc):>7,.0f} IS={m.search_impression_share:.0%}")

# --------------------------------------------------------------- search terms
section("SEARCH TERMS (30d, top 40 por costo)")
for r in gaql(f"""
    SELECT search_term_view.search_term, search_term_view.status,
           segments.search_term_match_type,
           metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.conversions
    FROM search_term_view
    WHERE campaign.id = {CAMPAIGN_ID} AND segments.date BETWEEN '{W}'
    ORDER BY metrics.cost_micros DESC LIMIT 40
"""):
    m = r.metrics
    print(f"  {r.search_term_view.search_term[:52]:52s} {r.search_term_view.status.name:12s} "
          f"cost={pesos(m.cost_micros):>8,.0f} clk={m.clicks:>3} imp={m.impressions:>4} conv={m.conversions:.0f}")

# --------------------------------------------------------------- negatives
section("NEGATIVAS ACTUALES A NIVEL CAMPANA")
negs = gaql(f"""
    SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id = {CAMPAIGN_ID} AND campaign_criterion.negative = TRUE
      AND campaign_criterion.type = 'KEYWORD'
""")
print(f"  total: {len(negs)}")
print("  " + " | ".join(sorted(n.campaign_criterion.keyword.text for n in negs)))

# --------------------------------------------------------------- ads
section("ANUNCIOS")
for r in gaql(f"""
    SELECT ad_group.name, ad_group_ad.ad.id, ad_group_ad.status,
           ad_group_ad.ad_strength, ad_group_ad.ad.final_urls,
           ad_group_ad.ad.responsive_search_ad.headlines,
           ad_group_ad.ad.responsive_search_ad.descriptions,
           ad_group_ad.ad.responsive_search_ad.path1, ad_group_ad.ad.responsive_search_ad.path2
    FROM ad_group_ad WHERE campaign.id = {CAMPAIGN_ID}
"""):
    ad = r.ad_group_ad.ad
    rsa = ad.responsive_search_ad
    print(f"  ad {ad.id} [{r.ad_group_ad.status.name}] grupo={r.ad_group.name[:26]} fuerza={r.ad_group_ad.ad_strength.name}")
    print(f"    final_urls: {list(ad.final_urls)}")
    print(f"    path: /{rsa.path1}/{rsa.path2}")
    print(f"    {len(rsa.headlines)} titulos:")
    for h in rsa.headlines:
        pin = f" [PIN {h.pinned_field.name}]" if h.pinned_field else ""
        print(f"      - {h.text}{pin}")
    print(f"    {len(rsa.descriptions)} descripciones:")
    for d in rsa.descriptions:
        pin = f" [PIN {d.pinned_field.name}]" if d.pinned_field else ""
        print(f"      - {d.text}{pin}")

# --------------------------------------------------------------- assets
section("ASSETS (sitelinks, callouts, snippets)")
for r in gaql(f"""
    SELECT campaign_asset.asset, campaign_asset.field_type, campaign_asset.status,
           asset.type, asset.sitelink_asset.link_text, asset.sitelink_asset.description1,
           asset.sitelink_asset.description2, asset.callout_asset.callout_text,
           asset.structured_snippet_asset.header, asset.structured_snippet_asset.values,
           asset.final_urls
    FROM campaign_asset WHERE campaign.id = {CAMPAIGN_ID}
"""):
    ca, a = r.campaign_asset, r.asset
    label = (a.sitelink_asset.link_text or a.callout_asset.callout_text
             or a.structured_snippet_asset.header or a.type_.name)
    extra = ""
    if a.type_.name == "SITELINK":
        extra = f" -> {list(a.final_urls)}"
    if a.type_.name == "STRUCTURED_SNIPPET":
        extra = f" {list(a.structured_snippet_asset.values)}"
    print(f"  {ca.field_type.name:22s} [{ca.status.name}] {label}{extra}")
