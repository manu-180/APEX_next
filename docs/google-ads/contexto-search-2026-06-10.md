# Contexto Google Ads — Campaña "Apex search" (relevamiento 2026-06-10)

Documento de trabajo: estado REAL de la cuenta consultado vía API el 2026-06-10.
Sirve de input para optimización y como registro histórico.

## Cuenta
- Customer ID: 4869983637 (ARS, America/Buenos_Aires)
- Campaña Search: "Apex search" — ID 23721057489 — **PAUSED**
- Campaña PMax: "APEX" — ID 23692206380 — PAUSED (debe QUEDAR pausada)

## Settings campaña Search
- Bidding: TARGET_SPEND (Maximize Clicks) ✅ (cambio manual hecho en UI)
- Budget: 500 ARS/día (budget ID 15488956966)
- Redes: solo Google Search (sin partners, sin display) ✅
- Geo: Argentina entera (geoTargetConstants/2032), tipo PRESENCE_OR_INTEREST ⚠️ (ideal: PRESENCE; solo se cambia en UI)
- Idioma: Español (1003)
- Dispositivos: todos, sin ajustes de puja
- Sin ad schedule (24/7)

## Performance histórica (2026-03-12 → 2026-06-10)
- 4.546 impresiones, 191 clicks, CTR 4,2%, costo total ~164.367 ARS
- 39 conversiones: 35 = "ceramicaapp-9abd8 (web) conversion" (contacto GA4 real), 2 Hero CTA, 1 WhatsApp, 1 Scroll50
- CPC promedio histórico ~860 ARS, PERO tras pasar a Maximize Clicks + negativas (fines de abril) el CPC real bajó a ~200–500 ARS
- Activa de facto 2026-04-06 → 2026-05-19 (pausada ~20 mayo). Pico de gasto 15–22 abril (10k–17k ARS/día con Maximize Conversions)

## Ad groups
| Nombre | ID | Status |
|---|---|---|
| Web - Diseño y Desarrollo | 196839024158 | ENABLED |
| Apps - Mobile | 196839024198 | ENABLED |
| Presupuesto y Precios | 196839024238 | ENABLED |
| Apex search recursos | 197972840311 | PAUSED (duplicado, dejar así) |

## Keywords actuales (grupos activos)

### Web - Diseño y Desarrollo (196839024158)
- PHRASE: crear pagina web argentina · diseño web Buenos Aires · contratar desarrollador web · página web para mi negocio · hacer una página web profesional · crear sitio web empresa · buscamos desarrollador web · agencia desarrollo web Argentina · programador web freelance Buenos Aires ⚠️(bloqueada por negativa "freelance") · empresa desarrollo web y apps
- BROAD: agencia desarrollo web argentina · contratar desarrollador web · diseno web Buenos Aires

### Apps - Mobile (196839024198)
- PHRASE: hacer una app para mi negocio · desarrollar una aplicación móvil · costo desarrollo de app · cuanto cuesta crear una app en argentina · desarrollo de apps Argentina · crear app móvil Argentina
- BROAD: empresa desarrollo de apps · desarrollar una aplicacion movil · costo desarrollo de app

### Presupuesto y Precios (196839024238)
- PHRASE: presupuesto sitio web · presupuesto página web · cuanto cuesta crear una pagina web en argentina · precio diseno web
- BROAD: presupuesto pagina web · presupuesto sitio web · precio diseno web

Notas: hay duplicados phrase+broad del mismo término. Quality scores casi todos sin datos (0). NO se pueden borrar ni pausar keywords individuales vía MCP.

## RSAs actuales (1 por grupo, 2 en Apps)
- Web: ad 806775371899, strength GOOD → headlines tipo "Diseño Web Profesional BA", "Web Profesional $300K ARS", "Sin Templates. A Medida.", "Tu Web Lista en 30 Días"
- Apps: ads 806775371902 + 806854817249, strength AVERAGE → "Tu App Lista en 60 Días", "App Profesional $1.2M ARS", "Expertos en Flutter Móvil"
- Precios: ad 806775371905, strength GOOD → "¿Cuánto Cuesta una Web?", "Web $300K — App $1.2M ARS", "Presupuesto en 24 Horas"
- Todos a https://www.theapexweb.com (homepage; uno sin www, el del grupo pausado en http://)
- NO se pueden editar RSAs vía MCP (solo UI)

## Assets de campaña
- Sitelinks (10, con duplicados): "Ver Presios" ⚠️TYPO → /servicios · "Consulta gratis" → /contacto · "Apps móviles" → /servicios · "Sobre nosotros" → /sobre-mi · "Contacto" → /contacto · "Ver proyectos" → home ⚠️(página /proyectos fue ocultada del sitio) · "Nuestros Servicios" → /servicios · "Contacto y Precios" → /contacto · "Sobre Nosotros" → /sobre-mi · "Portfolio y Proyectos" → home ⚠️
- Callouts (con duplicados): Presupuesto Gratis ×3 · 100% a Medida · Flutter + Next.js · Sin Formularios · Webs desde $300k · Diseño Premium · Respuesta en 1 Hora ×2 · 3 Meses de Soporte ×2 · Entrega en Plazo ×2 · Sin Intermediarios ×2 · Proyectos a Medida ×2
- Structured snippet "Servicios": Diseño Web, Desarrollo de Apps, E-commerce, Landing Pages
- 11 imágenes
- NO se pueden crear/editar assets vía MCP (solo UI)

## Conversion actions ENABLED
| ID | Nombre | Categoría | Primary |
|---|---|---|---|
| 7550069502 | ceramicaapp-9abd8 (web) conversion | CONTACT | ✅ (ES de APEX, slug legado) |
| 7599046466 | APEX - Hero CTA Click | SUBMIT_LEAD_FORM | ✅ |
| 7599046973 | APEX - WhatsApp Click | CONTACT | ✅ |
| 7599420714 | APEX - Scroll 50pct | PAGE_VIEW | ⚠️ debería ser Secondary (solo UI) |

## Search terms que CONVIRTIERON (período analizado)
wix paginas web (1) · crear una app (1) · cómo se crea una aplicación (1) · hacer app para android (2) · www appcreator24 com (1) · buscamos desarrollador web (1) · como crear una app desde cero (1) · como puedo crear una aplicación (1) · crear aplicaciones (1) · crear app con ia (1) · cuanto cuesta una app (1) · cómo crear aplicaciones (1) · cómo crear mi propia tienda en línea (1) · desarrollo de apps (1) · diseño pagina web empresa (1) · precio de paginas web argentina (1) · presupuesto para una página web ejemplo (1) · programador apk (1) · programadores de app (1)
(⚠️ muchas de estas eran intent DIY/curiosidad — el evento GA4 "conversion" se dispara fácil; tomar con pinzas)

## Search terms BASURA que se filtraron (ya bloqueadas en su mayoría)
empleos php · frontend remote · trabajar de desarrollador web · wireframe · thunkable · webviewgold · appcreator24 · android studio crear app · app inventor 2 · como crear una aplicación sin saber programar · zyro · wix · crear tu sitio web con wordpress · tienda nube · diseño web cordoba/rosario/tandil · 10web · donweb · empretienda · framer · desarrollador wordpress · hostings

## Negativas existentes a nivel campaña (229) — NO duplicar
10web, abogados ⚠️, adalo, adolo, android games develop, android studio ×2, angular, apk creator, apk studio, app con python, app de juegos, app inventor, app inventor 2, appcreator24, appgyver, appinventor, appsheet, appy pie, aprende, aprender, aprender a programar, aprender programacion, arquitectura, backend, beca, becas, bubble.io, builda apk, buscamos desarrollador, busco trabajo, carrera, carreras, como armar tienda, como cobrar, como cotizar, como crear, como crear mi propia, como crear tienda, como crear una aplicacion ×2, como crear una app, como crear una pagina web, como descargar, como funciona, como hacer, como hacer una aplicacion, como hacer una app, como instalar, como programar, como programar una app, como puedo, como puedo crear una aplicacion, como se crea, como se crea una app, como se hace, como se vende, computrabajo, cordoba, coursera, crear apk, crear aplicaciones android, crear app con ia, crear app gratis, css, cuanto cobrar ×2, cuanto pagan, cuanto puedo cobrar, cuanto se vende, cuánto cobrar, cuánto pagan, cuánto puedo cobrar, cuánto se vende, cómo cotizar, cómo crear, cómo crear una aplicación, cómo crear una app, cómo hacer, cómo hacer una aplicación, cómo hacer una app, cómo se crea una app, córdoba, definicion, definición, desarrollador wordpress, descargar, desde cero, diy, do it yourself, download, draftbit, duda, ejemplo, ejemplos, emergent, emergent crea, empleo, empleos, empretienda, estudiar, facultad, flutter programacion, flutterflow, footer, framer, free, freecodecamp, freelance ⚠️, freelance gratis, freelance javascript, freelancer, front end junior, frontend, frontend developer trainee, full stack, fullstack, github, glide, godaddy, gratis, gratuito, guia, guía, header, html, ia app builder, indeed, inmobiliarias, instalar, ionos, javascript, jobs, joomla, joomlancers, jr, junior, junior sin experiencia, kodular, linkedin, linkedin desarrollador, livewire, lovable, magento, manual, mar del plata, mendoza, mockup, neuquen, neuquén, para android, para empezar, para estudiantes, para ios, para principiantes, para vender online, para vender productos, pasante, pasantia, pasantía, paso a paso, plantilla, plantillas, platzi, play store, prestashop, programador junior, prototipo, proyectos freelance, puesto de, python, que es, que necesito, qué es, qué necesito, react, remote, remoto, responsive, rosario, salario, salary, salta, santa fe, senior, shopify, significado, sin saber, sin saber programar ×2, squarespace, step by step, sueldo, template, templates, thunkable, tienda nube ×2, tilda, trabajar de, trabajar de desarrollador, trabajo, trabajo remoto, trainee, tucuman, tucumán, tutorial, tutoriales, ucraft, udemy, universidad, vacante, vacantes, video tutorial, vue, web2apk, webflow, weblium, website 2 apk, weebly, wireframe, wix, wix paginas web, wordpress, youtube, zyro, zyro com

⚠️ Conflictos detectados:
- Negativa "abogados" bloquea búsquedas para la landing nueva /web-para-abogados → evaluar sacarla (solo UI)
- Negativa "freelance"/"freelancer" bloquea la keyword propia "programador web freelance Buenos Aires"
- Negativas "frontend", "backend", "react", "javascript", "python", "html", "css" — pensadas para job-seekers, también bloquean búsquedas B2B tipo "desarrollo frontend para mi empresa" (aceptable, bajo volumen)

## Sitio real (theapexweb.com) — páginas linkeables
- / (home) · /servicios · /contacto · /sobre-mi · /tecnologias · /blog · /gracias (thank-you)
- Verticals con landing dedicada: /web-para-medicos (desde $600k, 15-25 días) · /web-para-abogados (desde $600k, 15-30 días) · /web-para-contadores (desde $900k, 20-35 días)
- Precios oficiales: Web Landing $300K · Web Interactiva $600K · E-commerce $900K · App Profesional $1.2M · App Empresarial $2.7M · Plataforma: consultar
- WhatsApp oficial: 5491168049457

## Capacidades del MCP (lo que se puede hacer por API)
✅ add_keywords (EXACT/PHRASE/BROAD) · add_negative_keywords (campaña, BROAD) · set_campaign_status · set_ad_group_status · update_campaign_budget · create_conversion_action · search (GAQL)
❌ NO: crear/editar ads, crear ad groups, editar assets/sitelinks, borrar keywords o negativas, cambiar primary_for_goal, cambiar geo_target_type, bidding strategy (bug conocido)
