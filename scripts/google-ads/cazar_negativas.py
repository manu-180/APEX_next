# -*- coding: utf-8 -*-
"""
Busca negativas de concordancia amplia que maten busquedas de alta intencion.

Una negativa amplia bloquea TODA busqueda que contenga TODOS sus terminos, en
cualquier orden. Por eso "web me" mata "busco alguien que ME haga una pagina
WEB". El dano no aparece en los reportes: la busqueda simplemente nunca ocurre.

Este script no espera a que el dano se vea en los datos: prueba el diccionario
de negativas contra un banco de consultas que un cliente real escribiria.
"""
import re
from _client import gaql, CAMPAIGN_ID

# Como pide el servicio alguien que lo quiere comprar, en Argentina.
CONSULTAS = [
    "necesito una pagina web para mi negocio",
    "quiero que me hagan una pagina web",
    "busco alguien que me haga una pagina web",
    "quien me puede hacer una pagina web",
    "me hacen una pagina web",
    "cuanto me sale una pagina web",
    "cuanto me cuesta una pagina web",
    "precio de una pagina web profesional",
    "empresa que haga paginas web en argentina",
    "necesito una tienda online para mi negocio",
    "quiero vender por internet mi negocio",
    "desarrollador de paginas web buenos aires",
    "agencia de diseno web argentina",
    "hacer una web para mi empresa",
    "presupuesto para una pagina web",
    "cotizar pagina web",
    "diseno de pagina web para empresa",
    "necesito una app para mi empresa",
    "quiero una app para mi negocio",
    "sistema a medida para mi empresa",
    "pagina web con tienda online",
    "renovar mi pagina web",
    "mejorar mi sitio web",
    "pagina web autoadministrable",
    "landing page para mi producto",
    "me pueden hacer una tienda online",
    "necesito que me hagan un sitio web",
    "quien hace paginas web en argentina",
    "pagina web profesional para mi empresa",
    "desarrollo web a medida para mi negocio",
    # segunda tanda: variantes de pedido directo
    "necesito que me hagan una pagina web",
    "quiero que me armen una pagina web",
    "me arman una pagina web",
    "necesito a alguien que me haga una web",
    "busco quien me haga una tienda online",
    "quiero contratar a alguien para mi pagina web",
    "necesito ayuda con mi pagina web",
    "que precio tiene una pagina web",
    "que cuesta una pagina web",
    "cuanto sale que me hagan una pagina web",
    "donde puedo hacer una pagina web para mi negocio",
    "servicio de diseno de paginas web argentina",
    "programador para mi pagina web",
    "necesito un sitio web para mi emprendimiento",
    "quiero mi propia pagina web profesional",
    "hacer mi pagina web con un profesional",
    "empresa de desarrollo de software argentina",
    "necesito una plataforma para mi negocio",
    "quiero digitalizar mi negocio",
    "app a medida para mi empresa argentina",
    "presupuesto de diseno web",
    "cotizacion pagina web argentina",
    "cuanto cobran por una pagina web",
    "pagina web para mi consultorio",
    "sitio web para mi estudio contable",
]


def tok(s):
    return set(re.findall(r"\w+", s.lower()))


negs = [r.campaign_criterion.keyword.text for r in gaql(f"""
    SELECT campaign.id, campaign_criterion.keyword.text
    FROM campaign_criterion WHERE campaign.id = {CAMPAIGN_ID}
      AND campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD'
""")]

print(f"negativas en la cuenta: {len(negs)}")
print(f"consultas de alta intencion probadas: {len(CONSULTAS)}")
print()

danos = {}
for n in negs:
    nt = tok(n)
    victimas = [c for c in CONSULTAS if nt <= tok(c)]
    if victimas:
        danos[n] = victimas

if not danos:
    print("LIMPIO: ninguna negativa bloquea una consulta de compra.")
else:
    print(f"PELIGRO: {len(danos)} negativas bloquean consultas de compra")
    print()
    for n, victimas in sorted(danos.items(), key=lambda x: -len(x[1])):
        print(f'  negativa "{n}"  bloquea {len(victimas)}:')
        for v in victimas:
            print(f'      - "{v}"')
