# DESIGN BRIEF — Refactor premium APEX (pre-campaña)

> Contrato de diseño para TODO el refactor. Cualquier agente/sesión que toque UI lee esto primero.
> Fuentes: research CRO de landings de agencias 2025-26 + reglas estéticas de `CLAUDE.md` + auditoría visual del sitio actual.

---

## 0. OBJETIVO DE NEGOCIO (no negociable)

Una sola métrica: **conversaciones de WhatsApp iniciadas** por pymes/emprendedores argentinos que quieren una web o una app. Todo lo demás (temas, animaciones, easter eggs) está al servicio de eso sin estorbar.

Servicios y precios (ARS, NO inventar otros):
- Web: Landing $300K · Interactiva $600K · E-commerce $900K (3 cuotas sin interés ya existe en calculadora)
- Mobile: Profesional $1.2M · Empresarial $2.7M · Plataforma: consultar
- Addon AFIP/ARCA: $200K-$400K (diferenciador único — mantener sección)

## 1. ESTRATEGIA DE CONVERSIÓN (del research)

1. **Headline outcome-driven, no feature-driven.** Nada de "Hago páginas web". Sí: el resultado para el negocio del cliente. Fórmula PAS (Problema → Agitación → Solución) en home.
2. **WhatsApp es EL canal.** CTA primario siempre WhatsApp con **mensaje prellenado contextual** (distinto por sección: hero ≠ pricing ≠ FAQ ≠ calculadora — ya existe `whatsappUrl()` + `waMsgPlan()`/`waMsgEstimator()`, extender ese patrón). Formularios = secundario. Respuesta esperada <1h (el agente apex_hunter sigue la charla).
3. **Prueba social temprana**: logos/casos reales debajo del hero (existe cliente real: mi-lugar inmobiliaria + productos propios BotLode/Botrive/Assistify como "productos que construí y operan en producción"). Case study con narrativa antes→después. NO inventar testimonios ni métricas falsas.
4. **Proceso visible** ("mecanismo único"): 4 pasos concretos con tiempos (ej: 1. Charlamos por WhatsApp → 2. Boceto gratis en 24-48h → 3. Desarrollo 1-4 semanas → 4. Lanzamiento + soporte). El "boceto gratis en 24hs" ya existe como promesa del agente hunter — usarlo como oferta de riesgo invertido en la web.
5. **Pricing visible con 3 tiers y entregables específicos** (5-7 bullets concretos por tier, no vaguedades). Anclaje: tier del medio destacado. Mantener calculadora/estimador como herramienta de engagement.
6. **FAQ que anticipa objeciones** en orden: precio → tiempo → confianza → proceso → ROI → garantía (accordion ya existe en /servicios, mejorar copy).
7. **CTA final fuerte por página** + botón flotante WhatsApp (ya premium, mantener).
8. **Errores que matan conversión — prohibido**: formularios >3 campos, contacto escondido, CTAs genéricos ("Enviar"), promesas vagas, carga >3s mobile.

## 2. SISTEMA VISUAL

### Identidad
- **Dark-first** (el sitio ya es dark con temas) con light mode impecable.
- **Tipografía**: Oxanium (variable 100-900) es la voz de marca para display/headings — usar **contraste extremo de peso** (200 junto a 800 en el mismo título). Cuerpo: la sans actual del proyecto (NO Inter/Roboto/Arial como protagonista). NO agregar fuentes nuevas pesadas sin necesidad.
- **Color**: TODO color de marca via CSS vars del sistema de temas (`var(--color-primary)`, `rgba(var(--color-primary-rgb), α)`, superficies `--color-surface-*`). Excepción única: verde WhatsApp (#25D366→#128C7E) en elementos de WhatsApp. Máx 3 familias por composición: primario del tema + neutros + 1 acento.
- **El sistema de 7 temas es SAGRADO**: neutral/flutter/supabase/riverpod/botlode/assistify/contact-engine, hover-preview + click-persist, shortcuts Ctrl+H/A/C/S/M/T/R/W/I/K intactos. Cualquier componente nuevo debe verse bien con LOS 7 temas (usar las vars, jamás hex hardcodeado de marca).

### Layout
- **Asimetría intencional**: composiciones 2 columnas desbalanceadas, números de sección gigantes, elementos que rompen el grid (≥1 por página). PROHIBIDO: hero texto-centrado+botón+imagen flotante; features 3 columnas icono+título+texto; cards uniformes con sombrita; footer 4 columnas gris.
- **Bento grid** para portfolio/productos y para "qué incluye" de servicios.
- **Espaciado generoso**: secciones hero py ≥120px desktop; aire entre bloques; máx ~6 secciones por página, cada una con UN trabajo.
- **Detalles editoriales** (ya existen, extender): líneas de acento con gradiente del tema, labels uppercase tracking ancho, numeración 01/02/03, glow sutil del primario.

### Motion
- Scroll-triggered con propósito (revelar jerarquía, no decorar): GSAP ScrollTrigger ya instalado + Framer Motion para micro.
- Micro-interacciones en CTAs (scale 1.02 hover / 0.98 active ya es patrón del sitio).
- **SIEMPRE** `prefers-reduced-motion` (patrón existente: `useReducedMotion()` de framer-motion — replicar en todo lo nuevo).
- Nada de fade-in genérico en cascada infinita; preferir: stagger corto en listas, parallax sutil en hero, counters animados en métricas, draw de líneas.

## 3. ARQUITECTURA POR PÁGINA (orden de secciones objetivo)

### Home `/`
1. **Hero** (asimétrico): eyebrow con disponibilidad ("2 lugares este mes" si es real) · H1 outcome-driven con peso 200/800 · subhead 1 línea con para-quién · CTA primario WhatsApp + CTA secundario "Ver precios" (ancla a /servicios) · strip de confianza (años, proyectos en prod, respuesta <1h).
2. **Prueba social inmediata**: logos clientes/productos (mi-lugar, BotLode, Botrive, Assistify) con frase de contexto honesta.
3. **Problema→Solución** (PAS comprimido, 2 columnas asimétricas).
4. **Servicios** (bento 3 tiers web + mobile teaser) con precios y CTA contextual por tier.
5. **Proceso 4 pasos** con la oferta "boceto gratis en 24-48h" destacada.
6. **Case study mi-lugar** (antes→después, qué se construyó, resultado honesto).
7. **Addon AFIP** (mantener, es diferenciador).
8. **CTA final** + FAQ corto (3-4 preguntas top) si cabe.

### /servicios
Hero corto orientado a decisión → pricing 3 tiers web con entregables → calculadora → mobile tiers → AFIP addon → FAQ completo (accordion existente) → CTA final.

### /contacto
Decisión binaria SIN fricción: **WhatsApp ahora** (primario, gigante) o **agendá una reunión** (booking existente: calendario sin domingos, anti double-booking, 9-19h). Reviews con estrellas (social proof) debajo. Nada más.

### /sobre-mi
Founder card honesta (historia, stack, por qué directo sin agencia = precio/velocidad), foto/avatar, productos propios como prueba de capacidad, CTA WhatsApp personal.

### /tecnologias
Tech cards existentes (glassmorphism) curadas — explicar EN BENEFICIOS de negocio qué aporta cada tecnología, no specs. CTA al final.

### /gracias
Ya está bien (icono WA + reabrir). Solo alinear visual al nuevo sistema si hace falta.

## 4. FUNCIONALIDAD A PRESERVAR (checklist de regresión)

- [ ] 7 temas: hover preview + click persist (localStorage) + los 7 se ven bien en CADA sección nueva
- [ ] Shortcuts Ctrl+H/A/C/S/M/T/R/W/I/K + panel Ctrl+K
- [ ] Dark/light toggle (next-themes, `class="dark"`)
- [ ] Inspector X-Ray (Ctrl+I)
- [ ] Presence badge realtime (Supabase)
- [ ] Google OAuth login
- [ ] APEXbot chatbot flotante
- [ ] WhatsApp floating button (oculto en /contacto y /gracias)
- [ ] Booking: sin domingos, anti double-booking, slots 9-19, notificación via bridge apex-leads
- [ ] Reviews con estrellas + replies anidadas
- [ ] Flujo /gracias con `?wa=` + tracking centralizado en `openWhatsAppWithThankYouPage` (NO volver a agregar tracking en callers — se cuenta doble)
- [ ] SEO: metadata por página, JSON-LD, sitemap, robots, llms.txt, internal links del blog
- [ ] Analytics: GA4 + Meta Pixel + PostHog + Sentry intactos

## 5. COPY — REGLAS

- Voseo argentino, directo, sin jerga técnica con el cliente ("conexión automática con tus herramientas", no "API REST").
- Números concretos > adjetivos ("respuesta en menos de 1 hora", "boceto en 24-48h").
- Honestidad brutal: NO inventar testimonios, métricas ni clientes. Si un dato no existe, usar los reales: productos propios en producción, cliente mi-lugar, tiempo de respuesta, proceso.
- Mensajes WA prellenados: específicos por contexto, sin emojis (ya hay `stripEmojis`), 1-2 líneas, terminan con pregunta.

## 6. FUERA DE SCOPE

- NO migrar Next 14→15/16, NO tocar IDs de temas, NO cambiar rutas (SEO), NO tocar precios, NO renombrar `middleware`/infra, NO feature branches (main directo).
