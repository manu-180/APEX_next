# ADDENDUM POST-AUDITORÍA — verdades canónicas y fixes obligatorios

> Complementa `docs/DESIGN_BRIEF.md`. Si algo acá contradice al brief, gana el addendum.
> Origen: auditoría visual completa del sitio en dev (2026-06-11).

## VERDADES CANÓNICAS (números únicos en TODO el sitio — cero contradicciones)

| Claim | Valor único | Prohibido |
|---|---|---|
| Tiempo de respuesta | **menos de 1 hora** | "<2 hs" |
| Reunión/llamada | **15 minutos, gratis** | 20 min, 30 min |
| Proyectos | **"8+ productos y sitios en producción"** o sin número ("productos propios en producción") | "+150 proyectos", "150+ sitios" (no verificable, contradice /tecnologias) |
| Rating | Solo junto a las reviews reales: **"4.8 · 5 opiniones"** (/contacto). En hero/home NO poner rating numérico | "4.9" suelto |
| Entrega | 15 días (ya consistente) | — |
| Boceto | gratis, en 24-48 hs | — |
| Escasez | "Tomo 2 proyectos por mes" estilo (real) | inventar cupos |

## JERARQUÍA DE CTAs (decisión de diseño — TODO el sitio)

1. **CTA de dinero (abre WhatsApp): SIEMPRE botón SÓLIDO verde WhatsApp** (gradiente #25D366→#128C7E como /gracias y el botón flotante — la página /gracias es el blueprint). Con ícono WhatsApp. Esto resuelve "CTAs fantasma": el primario del tema neutral es gris #64748B y los outline desaparecen.
2. **CTA secundario (navegación: "Ver precios", "Ver detalle")**: outline con primario del tema. NUNCA mismo peso visual que el de dinero.
3. Mensajes WA prellenados SIEMPRE contextuales (plan/página/sección) — el genérico "quiero potenciarme con tecnología" solo queda para navbar/footer.

## FIXES OBLIGATORIOS POR PÁGINA (de la auditoría)

### Home
- [ ] **SACAR el blur(6px) + watermark "PREVIEW"** de los screenshots del portfolio (en mobile quedan borrosos para siempre — es la única prueba real). Mostrarlos nítidos; hover = lift/glow, no des-blur.
- [ ] Hero: CTA WhatsApp sólido verde vs "Ver precios" outline (jerarquía clara). El texto "(15 min gratis)" debe coincidir con un mensaje WA prellenado que lo refleje ("Hola Manuel, quiero arrancar mi proyecto. ¿Coordinamos 15 min?").
- [ ] Traer 1-2 citas de las reviews reales de /contacto a la home ("La landing que me hizo duplicó mis consultas en el primer mes" — Laura P.) — citar honesto, sin inflar.
- [ ] Stats hero: usar verdades canónicas (sin "+150", sin "4.9").
- [ ] Partículas: bajarlas de protagonismo si compiten con legibilidad del microcopy (o contraste del texto).

### Servicios
- [ ] **UN solo badge de ancla**: "Más elegido" en Web Interactiva $600K. Sacar "RECOMENDADO" de Tienda Online.
- [ ] **Eliminar precios tachados + "-29%/-32%/-36%"** (huele a hot sale permanente, contradice premium/precio cerrado). El precio es el precio; el valor se ancla con entregables y "3 cuotas sin interés".
- [ ] CTA por plan "Empezar proyecto" = sólido verde WhatsApp con waMsgPlan(); "Ver detalle" = ghost.
- [ ] Pricing visible más arriba (hero corto; precios en el primer o segundo viewport).
- [ ] Hay DOS tablas comparativas → dejar UNA (la de APEX vs Wix/Tiendanube/Agencia, que es la mejor) y resumir/eliminar la otra.
- [ ] Fix truncado mobile de descripciones de cards (ellipsis visible).
- [ ] "Boceto gratis" subirlo de letra chica a de-risker visible.

### Contacto
- [ ] **Booking: autoseleccionar el primer día CON slots libres** (hoy a la tarde aparece todo tachado = "está lleno"). Carve-out permitido: SOLO la inicialización/avance de `selectedDate` en el hook/UI — el flujo de confirmación/notificación NO se toca (recién verificado E2E).
- [ ] Formulario: máximo 3 campos — WhatsApp requerido, email OPCIONAL (o eliminado), sin doble-required. El sub dice "sin formularios eternos": cumplirlo.
- [ ] Reviews: mantener la de 4★ honesta (es oro), mostrar "4.8 · 5 opiniones", layout menos monótono (no una columna infinita).

### Sobre-mí / Tecnologías
- [ ] /sobre-mi: agregar SLOT de foto real (`public/manuel.jpg` con fallback elegante al avatar actual si no existe el archivo) + nota a Manuel para que suba la foto. El pitch "soy una persona real" sin cara es incoherente.
- [ ] /sobre-mi: hero centrado simétrico → asimétrico (anti-pattern explícito).
- [ ] /sobre-mi: CTA WhatsApp sólido verde y MÁS ARRIBA (hoy aparece a ~1900px en ghost gris).
- [ ] /tecnologias: stats coherentes ("8+ en producción" OK); arreglar "es una decisión. no un capricho" (minúscula tras punto); copy ya traduce a beneficio — mantener. El theme-switcher por click en cards es LA feature: darle un callout más visible ("👆 Tocá una card: el sitio entero cambia de tema").

### Transversal (integración final — lo hace el orquestador)
- [ ] Unificar footer único (hay dos: "¿Listo para construir algo increíble?" + "Hecho con Next.js+Tailwind" viejo vs el editorial nuevo de fundación) — localizar dónde se importa el viejo y matarlo.
- [ ] Verificar warning de hidratación del navbar en build limpio (probable artefacto HMR del dev server).
- [ ] Mobile /servicios: botón flotante WhatsApp tapa el toggle Web/Mobile — ajustar offset/z-index.
- [ ] Mensaje del botón flotante: contextual por página si es barato; si no, queda el genérico.
- [ ] /gracias sin `?wa=`: cambiar copy a algo neutro y botón con texto prellenado genérico.
