# ANÁLISIS EXHAUSTIVO — APEX Portfolio Flutter

> Fecha de análisis: 2026-03-24
> Proyecto base: `new_apex/APEX` (Flutter Web + Mobile)
> Destino: `new_apex/APEX_next` (Next.js 16 + shadcn/ui + AI SDK)

---

## 1. DISEÑO VISUAL

### Paleta de Colores — Temas Dinámicos (7 temas)

| Tema | Primary (HEX) | Superficies Dark | Superficies Light |
|------|--------------|-----------------|-------------------|
| **Neutral** (default) | `#64748B` | `#111318` | `#F4F6F8` |
| **Flutter** | `#0175C2` | `#111318` | `#F4F6F8` |
| **Supabase** | `#3ECF8E` | `#111318` | `#F4F6F8` |
| **Riverpod** | `#6E56F8` | `#111318` | `#F4F6F8` |
| **BotLode** | `#FFC000` | `#111318` | `#F4F6F8` |
| **Assistify** | `#00A8E8` | `#111318` | `#F4F6F8` |
| **Contact Engine** | `#15803D` | `#121212` | `#F5F5F5` |

#### Surface Container Colors (Dark Mode)
```
surfaceContainerLowest: #0C0E12
surfaceContainerLow:    #161A20
surfaceContainer:       #1C2028
surfaceContainerHigh:   #222830
surfaceContainerHighest:#282E38
```

#### Surface Container Colors (Light Mode)
```
surfaceContainerLowest: #FFFFFF
surfaceContainerLow:    #F0F2F5
surfaceContainer:       #E8ECF0
surfaceContainerHigh:   #DDE2E8
surfaceContainerHighest:#D2D8E0
```

#### Colores de Acento y Estado
- **Inspector Mode border**: `#38BDF8` (dark) / `#0284C7` (light)
- **Online presence**: `#34B27B` (verde)
- **Offline**: `#E57373` (rojo)
- **Connecting**: naranja
- **Rating stars**: Amber
- **Admin comment bg**: primary al 8% de opacidad
- **Admin comment border**: primary al 40% de opacidad

---

### Tipografía

- **Familia única**: `Oxanium` (Variable Font, peso 100-900)
- **Asset**: `assets/fonts/Oxanium-VariableFont_wght.ttf`
- **Aplicación**: toda la app, sin excepciones

| Rol | Peso | Letter Spacing |
|-----|------|----------------|
| Display / Headline | 700-900 (bold) | -0.5 a -0.2 |
| Title Large/Medium | 600-700 | -0.3 |
| Body Large/Medium | 400-500 | 0 |
| Label Small/Large | 400-500 (badges) | 0 |

---

### Espaciados y Dimensiones

#### Padding
| Contexto | Mobile | Desktop |
|----------|--------|---------|
| Horizontal secciones | 24px | 60px |
| Vertical secciones | 40px | 60px |
| Cards (inner) | 24px | 45px |
| Componentes | 12–32px | 12–32px |

#### Border Radius
| Elemento | Radio |
|----------|-------|
| Contenedores grandes | 24px |
| Cards | 18–22px |
| Botones | 12–14px |
| Badges | 8–12px |
| Hero sections | 22px |

#### Escala de Espaciado Vertical (SizedBox)
`8 / 12 / 20 / 24 / 30 / 40 / 48 / 60 / 64 / 80 px`

#### Dimensiones Cards Principales
- Tech Stack cards: 350px ancho × 590px alto
- Responsive breakpoint general: **800px** (mobile/desktop)

---

### Efectos Visuales

#### CursorGlowFrame (Efecto de glow por cursor)
- Border radius: 24px
- Grosor del glow: 2.0–2.5px
- Intensidad: 1.0–1.25 (multiplicador)
- Gradiente radial con tracking del cursor
- Opacidad fuerte: 95% de la intensidad
- Opacidad media: 38% de la intensidad
- Hover lift scale: 1.01 (elevación sutil)

#### TechCard Glassmorphism
- Backdrop filter blur: sigma 10×10
- Opacidad base glass: 62% (dark) / 96% (light)
- Glass tint neutral: `#B0B0B0` (dark) / `#E0E0E0` (light)
- Glass tint frío: `#B8C8E0` (dark) / `#E2EAF5` (light)
- Tint alpha: 6% (dark) / 8% (light)

#### Sombras
| Estado | Color | Blur | Offset |
|--------|-------|------|--------|
| Card hover (light) | Negro 10% | 30px | (0, 10px) |
| Card base (light) | Negro 7% | 22px | (0, 7px) |
| Dark mode | Sin sombras | — | — |

#### Animaciones
- Duración general: 240–420ms
- Curves: `easeOutCubic`, `easeInOut`, `easeOut`
- Hover effects: Scale 1.008 / Slide -0.012
- Shimmer loading: presencia online

---

## 2. SECCIONES Y CONTENIDO

### HOME / LANDING

**Hero Header:**
- Título: _"Desarrollador Full-Stack & Mobile"_
- Subtítulo: _"Especializado en crear experiencias de usuario fluidas y eficientes con Flutter, Supabase y Riverpod."_

**Cards Tech Stack (3 cards, cambian el tema global al hacer click):**

| Card | Color | Features |
|------|-------|----------|
| Flutter | `#0175C2` | Lista de features Flutter |
| Supabase | `#3ECF8E` | Lista de features Supabase |
| Riverpod | `#6E56F8` | Lista de features Riverpod |

**Cards de Proyectos (3 cards):**

| Proyecto | Color | Tagline |
|----------|-------|---------|
| Contact Engine | `#15803D` | "Encuentra clientes y convierte conversaciones en ventas, de forma automática" |
| BotLode | `#FFC000` | "Ecosistema de Bots IA" |
| Assistify | `#00A8E8` | "Gestión para Profesores" |

---

### SERVICIOS

**Header:**
- Título: _"Mis Servicios"_
- Subtítulo: _"Soluciones tecnológicas diseñadas para escalar tu negocio"_

**Toggle de plataforma:** "Sitio Web" / "Aplicación Móvil"

---

#### PRECIOS — Planes Web (ARS)

**1. Landing Page** — Badge: "Esencial"
- **Precio**: $300.000 ARS ~~$420.000~~ (28% off)
- Descripción: _"Tu mejor vendedor, disponible las 24 h. Diseñada para convertir visitas en clientes reales."_
- Para: Coaches, abogados, psicólogos, contadores, profesionales independientes
- Features:
  - Diseño 100% a medida (sin plantillas genéricas)
  - Secciones de servicios, bio, testimonios y contacto
  - Botón WhatsApp + formulario con auto-respuesta por email
  - Carga ultrarrápida optimizada con Flutter Web
  - SEO técnico para aparecer en Google
  - Hosting + 3 meses de mantenimiento incluidos
- Casos de éxito: Simon Mindset, Pérez Yeregui, Metal Wailers, Poncho Spanish

**2. Web Interactiva** — Badge: "Más elegido" ⭐ (isFeatured)
- **Precio**: $600.000 ARS ~~$880.000~~ (32% off)
- Descripción: _"Automatizá el contacto con tus clientes y agregá cualquier funcionalidad a medida."_
- Para: Pequeñas empresas y startups
- Features:
  - Todo lo del plan Landing Page
  - Base de datos conectada (Supabase)
  - Funcionalidades complejas: control de stock, cotizadores, calculadoras, reservas y dashboards
  - Panel de administración para gestionar contenido sin tocar código
  - Integraciones: WhatsApp, MercadoPago, Google Calendar y más
  - Hosting + 3 meses de mantenimiento incluidos
- Casos de éxito: Assistify, Botrive, Botlode

**3. Tienda Online** — Badge: "E-commerce"
- **Precio**: $900.000 ARS ~~$1.400.000~~ (36% off)
- Descripción: _"Vendé productos o servicios con tu propio canal de ventas. Sin comisiones de terceros."_
- Para: Comercios y emprendimientos
- Features:
  - Catálogo de productos con filtros y búsqueda
  - Carrito + checkout con MercadoPago / Stripe
  - Panel admin para gestionar pedidos, stock y clientes
  - Sistema de cuentas de clientes con historial de compras
  - SEO técnico avanzado para atraer tráfico orgánico
  - Hosting + 3 meses de mantenimiento incluidos
- Casos de éxito: Pulpiprint, MNL Tecno

---

#### PRECIOS — Planes Mobile (ARS)

**1. App Profesional** — Badge: "Starter"
- **Precio**: $1.200.000 ARS ~~$1.700.000~~ (29% off)
- Descripción: _"Tu idea, convertida en app lista para las tiendas. Funcional, rápida y con buena UX."_
- Para: Emprendedores con apps de gestión, reservas, clientes o contenido
- Features:
  - Android + iOS desde un único proyecto (Flutter)
  - Funcionalidades core de tu negocio
  - Autenticación segura (email, Google o Apple)
  - Notificaciones push básicas
  - Publicación en App Store y Play Store
  - 3 meses de mantenimiento incluidos

**2. App Empresarial** — Badge: "Empresas" ⭐ (isFeatured)
- **Precio**: $2.700.000 ARS ~~$3.800.000~~ (29% off)
- Descripción: _"Automatizá procesos, reducí la carga laboral y escalá tu negocio con tecnología real."_
- Para: Empresas digitalizando operaciones
- Features:
  - Todo lo del plan Starter
  - Panel de administración web o de escritorio
  - Roles y permisos para múltiples usuarios
  - Pagos integrados (MercadoPago / Stripe)
  - Reportes y métricas en tiempo real
  - 3 meses de mantenimiento incluidos

**3. Plataforma Avanzada** — Badge: "Premium"
- **Precio**: A consultar (isCustom: true)
- Descripción: _"Arquitectura de nivel Uber o Rappi. Tecnología sin límites para startups con visión."_
- Para: Startups con financiamiento
- Features:
  - Múltiples apps (cliente, operador y administrador)
  - Geolocalización y tracking en tiempo real
  - Arquitectura de microservicios escalable
  - Infraestructura en la nube (AWS / GCP)
  - Equipo técnico dedicado (modelo de partner)
  - Mantenimiento continuo + SLA garantizado

---

#### CALCULADORA / ESTIMADOR

**Título**: "Arma tu Proyecto a Medida"
**Subtítulo**: "Selecciona los módulos que necesitas. Precios optimizados para emprendedores."

**Módulos Web:**
| Módulo | Precio ARS | Original | ¿Core? |
|--------|-----------|----------|--------|
| Identidad Digital (Landing) | $300.000 | $400.000 | ✅ |
| Cuentas de Usuario | $200.000 | $300.000 | |
| Base de Datos Dinámica | $250.000 | $350.000 | |
| Gestión de Contenidos (CMS) | $200.000 | $300.000 | |
| Pasarela de Pagos | $300.000 | $450.000 | |
| Chat o Soporte en Vivo | $100.000 | $150.000 | |
| Panel de Administración Full | $400.000 | $600.000 | |

**Módulos App:**
| Módulo | Precio ARS | Original | ¿Core? |
|--------|-----------|----------|--------|
| App Híbrida (iOS + Android) | $1.200.000 | $1.600.000 | ✅ |
| Autenticación Biométrica | $350.000 | $500.000 | |
| Sistema de Notificaciones | $300.000 | $450.000 | |
| Geolocalización Avanzada | $600.000 | $900.000 | |
| Panel Admin Web | $700.000 | $1.000.000 | |
| Cobros In-App & Wallet | $500.000 | $750.000 | |
| Modo Offline (Sync) | $450.000 | $650.000 | |

---

### SOBRE MÍ

**Hero:**
- Videos WebM por tema (con canal alpha):
  - Flutter: `assets/videos/yoflutter.webm`
  - Supabase: `assets/videos/yosupabase.webm`
  - Riverpod: `assets/videos/yoriverpod.webm`
  - BotLode: `assets/videos/yoapex.webm`
  - Assistify: `assets/videos/yoassistify.webm`
  - Contact Engine / Neutral: `assets/videos/yoapex.webm`

**Nombre:** Manuel Navarro
**Experiencia:** 3 años

**Bio principal:**
> _"Programar es mucho más que tirar líneas de código, para mí es una disciplina de constancia diaria. Llevo tres años dedicándole cada día a entender cómo construir soluciones que realmente funcionen. Estoy convencido de que hoy no existen límites técnicos: cualquier idea se puede materializar si se tiene el compromiso de entender el problema y la destreza para construir la solución que el usuario realmente necesita."_

**Filosofía extendida:**
> _"Considero que la verdadera brecha entre un programador junior y un arquitecto de software de alto nivel radica en la capacidad de resolución de problemas bajo cualquier circunstancia. Mi filosofía es clara: no existe desafío técnico que no tenga solución. He perfeccionado mi capacidad para desglosar problemas complejos mediante el uso estratégico de herramientas de vanguardia, transformando obstáculos críticos en procesos lógicos y ejecutables."_

**Skill Tags (6):**
1. Resolución de Problemas (icono puzzle)
2. Arquitectura Limpia (icono layer group)
3. Constancia Diaria (icono calendar check)
4. Pensamiento Lógico (icono brain)
5. Enfoque en Resultados (icono bullseye)
6. Adaptabilidad (icono sliders)

**CTA Card:**
- Título: _"¿Listo para llevar tu proyecto al siguiente nivel?"_
- Subtítulo: _"Agenda una reunión gratuita y validamos tu idea con foco en resultados."_
- Botón: "Agendar consulta gratis" → ruta `/contact`

---

### CONTACTO

**Agenda inteligente (Booking Scheduler):**
- Selección automática de la fecha actual
- Filtra domingos
- Time slots disponibles
- Prevención de doble reserva (validación SQL)
- Opciones de contacto: WhatsApp o Email
- Estado de éxito: _"¡Reunión Agendada! Te contactaré brevemente para confirmar los detalles."_

**Formulario de contacto:**
- Nombre (opcional)
- Email (requerido)
- Mensaje (requerido)
- Animaciones Lottie por tema al enviar:
  - Flutter: `assets/animations/envia_flutter.json`
  - Supabase: `assets/animations/envia_supabase.json`
  - Riverpod: `assets/animations/envia_riverpod.json`
  - Assistify: `assets/animations/envia_assistify.json`
  - Default: `assets/animations/envia_apex.json`

**Opiniones y Ratings:**
- Resumen con promedio de estrellas y distribución
- Tarjetas de comentarios con: nombre, avatar, contenido, timestamp, likes, replies, rating
- Soporte para respuestas anidadas
- Comentarios del admin (UUID `37dad3e9-531c-4657-8db6-ddebbdcfa878`) con estilo destacado
- Requiere autenticación para comentar

---

### PROYECTOS (detalle)

#### BotLode
- **URL:** https://botlode.com
- **Color:** `#FFC000`
- **Logo:** `assets/icons/logo_botlode.png`
- **Tagline:** "Ecosistema de Bots IA — Fábrica • Player • History • 24/7"

Componentes:
1. **BotLode Factory** — Creación instantánea de bots sin código
   - Personalización completa
   - Producto listo para vender
   - Inversión inicial cero

2. **Cat Bot (IA Conversacional)** — 6 modos de personalidad:
   - Feliz, Enojado, Técnico, Confundido, Neutro, **Vendedor**
   - Modo Vendedor recopila: emails, teléfonos, intereses

3. **Command Center History** — Tracking de leads, alertas por email, integración con calendario

Producto relacionado: Botrive (https://botrive.com)

---

#### Assistify
- **URL:** https://assistify.lat
- **Color:** `#00A8E8`
- **Logo:** `assets/icons/logo_assistify.png`
- **Tagline:** "Gestión para Profesores — App en Producción • iOS & Android"

Problema resuelto: Coordinación de cambios de horario vía WhatsApp = tiempo perdido + ingresos perdidos

Features:
1. **Autogestión Total** — Alumnos autogestionan cancelaciones y reprogramaciones
2. **Ingresos Blindados** — Sistema de créditos + lista de espera auto-llena huecos
3. **Cero Fricción** — Notificaciones WhatsApp sin abrir la app
4. **Control Operativo Total** — Crear clases, ajustar cupos, gestionar alumnos

---

#### Contact Engine
- **Color:** `#15803D`
- **Tagline:** "Encuentra clientes y convierte conversaciones en ventas, de forma automática"

Features:
1. **Prospección 24/7** — Detecta negocios y prepara contacto incluso fuera de horario
2. **Atención en Canal Correcto** — Combinación Email + WhatsApp
3. **Operación Bajo Control** — Dashboard con estados, volumen de envíos, conversaciones centralizadas
4. **Modelo Escalable** — Multi-tenant: usar en marca propia o revender como servicio

---

## 3. FUNCIONALIDADES A PRESERVAR AL 100%

### Sistema de Temas Dinámicos
- **7 temas** con color primario diferente
- Preview al hacer hover sobre TechCard (sin persistir)
- Click aplica el tema globalmente y persiste (SharedPreferences → localStorage en Next.js)
- Toast de confirmación del tema aplicado
- Modo claro/oscuro independiente del tema
- Superficies siempre neutrales (solo el accent color cambia)

**Providers Flutter → equivalente Next.js:**
- `dynamicThemeProvider` → Zustand / Context + localStorage
- `brightnessModeProvider` → next-themes
- `currentAppThemeConfigProvider` → Config derivada del tema activo

---

### Modo Claro/Oscuro
- Default: Modo oscuro
- Persistencia: localStorage
- Atajo: `Ctrl+T`
- next-themes maneja esto nativamente

---

### Modo Inspector (Rayos X)
- Toggle con `Ctrl+I`
- Muestra borde azul (`#38BDF8`) + badge en cada componente
- Tooltip/overlay con nombre del componente y specs técnicas
- Opacidad borde: 50%, fondo: 5%

---

### Comandos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+H` | Ir a Home `/` |
| `Ctrl+A` | Ir a About `/about` |
| `Ctrl+C` | Ir a Contact `/contact` |
| `Ctrl+S` | Ir a Servicios Web (tab 0) |
| `Ctrl+M` | Ir a Servicios Mobile (tab 1) |
| `Ctrl+T` | Toggle claro/oscuro |
| `Ctrl+R` | Reset a tema Neutral |
| `Ctrl+W` | Abrir WhatsApp |
| `Ctrl+I` | Toggle modo Inspector |
| `Ctrl+K` / `Ctrl+?` | Mostrar diálogo de atajos |

Protección: desactivar cuando el usuario está escribiendo en inputs.

---

### Presencia Online en Tiempo Real
- Supabase Realtime → equivalente en Next.js: Supabase Realtime (mismo stack) o WebSockets
- Estados: "Online (N usuarios)" / "Connecting..." / "Offline"
- Lista de usuarios reales con nombre y avatar
- Contador de visitantes anónimos
- Badge animado en navbar (parpadeo cuando offline, estático cuando online)
- Shimmer mientras conecta

---

### Login con Google (Supabase Auth)
- OAuth via Supabase (mismo stack en Next.js)
- Modal con animación Lottie por tema
- Texto modal: "Veracidad Garantizada"
- Se requiere para: comentar, dar likes, agendar con datos guardados
- Limpieza del `?code=` de la URL tras OAuth callback

---

### APEXbot (Chatbot Flotante)
- Burbuja flotante con avatar
- Notificación WiFi (indicador de conexión)
- Historial de conversaciones
- Theme-aware (cambia color/estilo con el tema activo)
- Posición: esquina inferior derecha
- Animación de entrada/salida

---

### Burbuja WhatsApp Flotante
- Número: `5491124842720`
- Posición: esquina inferior (cerca del APEXbot)
- Accesible también via `Ctrl+W`
- Mensaje predeterminado configurable por contexto

---

### Sistema de Agenda / Calendario
- Selección de fecha (sin domingos)
- Selección de franja horaria
- Campo nombre (opcional) + contacto (requerido)
- Canal: WhatsApp o Email
- Validación de disponibilidad en tiempo real (Supabase)
- Prevención de doble bookings (constraint SQL)
- Estado de éxito con animación

---

### Opiniones y Rating
- Resumen: promedio + distribución de estrellas
- Comentarios con: avatar, nombre, contenido, timestamp, likes, replies, rating (1-5)
- Respuestas anidadas (1 nivel)
- Resaltado de comentarios del dueño
- Autenticación requerida para interactuar
- Real-time updates (Supabase)

---

## 4. ANÁLISIS CRÍTICO Y MEJORAS PROPUESTAS

### Lo que está muy bien
- Sistema de temas dinámicos: diferenciador visual único y memorable
- Glassmorphism + CursorGlowFrame: efecto premium muy logrado
- Comandos de teclado: toque pro que deleita a devs
- Modo Inspector: excelente demostración técnica en vivo
- Contenido real (proyectos en producción, precios reales): muy creíble
- Estimador interactivo: convierte visitantes en leads calificados

### Mejoras para elevar el WOW Factor

#### 1. Animaciones de entrada tipo "code typing"
- El hero podría mostrar el nombre o stack escribiéndose como si fuera código en vivo
- Herramienta: `framer-motion` + efecto typewriter

#### 2. Cursor personalizado
- Cursor custom que cambia de forma/color según el tema activo
- En hover de cards: se convierte en un punto con glow del color del tema

#### 3. Transiciones entre páginas con tema
- Al navegar, el color del tema hace una transición de "flood fill" (como un splash de pintura)
- Efecto: `View Transitions API` en Next.js 16

#### 4. Terminal/CLI widget en Hero
- Un widget que simula una terminal mostrando outputs "reales" de proyectos
- Ejemplo: `> flutter build web --release ✓ 847ms`
- Refuerza la identidad técnica

#### 5. Métricas reales en tiempo real
- "1.200 líneas de código escritas hoy", "3 proyectos activos", contador de commits
- Conexión a GitHub API para datos reales
- Alta credibilidad, efecto impresionante

#### 6. "Hall of Fame" de proyectos con antes/después
- Capturas del problema vs. solución
- Mucho más convincente que solo features

#### 7. Modo "DevMode" adicional al Inspector
- Muestra el stack técnico exacto de cada sección con íconos
- Al estilo de las DevTools del browser pero para el portfolio

#### 8. Hover 3D en cards de proyectos
- Efecto de inclinación 3D suave al mover el mouse (CSS `perspective`)
- Librería: `react-tilt` o CSS transform puro

#### 9. Sonidos opcionales (opt-in)
- Sonidos sutiles: click al cambiar tema, "beep" suave en comandos de teclado
- Toggle explícito para no molestar
- Refuerza la sensación de sistema vivo

#### 10. Mini-roadmap/estado de proyectos
- Tarjeta "En desarrollo: proyecto X — 60% completado"
- Genera expectativa y demuestra actividad constante

---

### Cambios en la Estructura

#### SEO (sin romper diseño)
1. **Server-Side Rendering con Next.js 16**: todo el contenido visible al bot de Google desde el primer render
2. **Metadata dinámico por ruta**: `generateMetadata()` con título, descripción, OG image por sección
3. **OG Images dinámicas**: con el color del tema activo por defecto (usando `@vercel/og`)
4. **Schema.org JSON-LD**:
   - `Person` para la sección Sobre Mí
   - `Service` para cada plan de servicios
   - `Product` para BotLode y Assistify (con precios)
   - `Review`/`AggregateRating` para el sistema de opiniones
5. **Sitemap.xml dinámico**: Next.js lo genera automáticamente con `sitemap.ts`
6. **URL canónicas**: Evitar duplicados
7. **Core Web Vitals**: Next.js 16 con Turbopack mejora LCP, CLS automáticamente
8. **next/image**: Todas las imágenes optimizadas (WebP, lazy loading automático)
9. **Preload fonts**: Oxanium preloaded para evitar FOUT

#### Estructura de rutas Next.js sugerida
```
app/
├── page.tsx              # Home / Landing
├── servicios/
│   └── page.tsx          # Servicios + Estimador
├── sobre-mi/
│   └── page.tsx          # Sobre Mí
├── contacto/
│   └── page.tsx          # Contacto + Agenda + Reviews
├── api/
│   ├── chat/route.ts     # APEXbot (AI SDK + Supabase)
│   ├── contact/route.ts  # Formulario de contacto
│   └── bookings/route.ts # Sistema de agenda
└── layout.tsx            # Shell: navbar, footer, floating widgets, theme provider
```

#### Componentización mejorada
- `ThemeProvider` en root layout (next-themes + context propio para los 7 temas)
- `KeyboardShortcuts` como hook global en layout
- `FloatingWidgets` como portal (WhatsApp + APEXbot) en layout
- `PresenceBadge` en navbar (Supabase Realtime via hook)
- `InspectorMode` como HOC / context provider

---

### Stack Técnico Recomendado para Next.js

| Categoría | Tecnología | Justificación |
|-----------|-----------|---------------|
| Framework | Next.js 16 (App Router) | SSR nativo, SEO, Turbopack |
| UI Base | shadcn/ui + Tailwind CSS | Equivalente al Material 3 del Flutter, totalmente personalizable |
| Tipografía | next/font (Oxanium de Google Fonts) | Optimización automática, zero layout shift |
| Temas | next-themes + CSS variables | Light/dark + los 7 temas custom con CSS vars |
| Animaciones | Framer Motion | Equivalente a animate_do + Flutter animations |
| Estado Global | Zustand | Equivalente a Riverpod (ligero, sin boilerplate) |
| Backend/DB | Supabase (mismo stack) | Sin cambios en DB, auth, realtime |
| Chat AI | AI SDK v6 + AI Gateway | APEXbot con streaming real |
| Íconos | Font Awesome + Lucide | Mismo sistema de íconos |
| Lottie | lottie-react | Mismas animaciones JSON |
| Formularios | React Hook Form + Zod | Validación type-safe |
| Efectos 3D | CSS `perspective` + Framer Motion | Cards con hover 3D |
| SEO | next/metadata + next-sitemap | Automático |
| Analytics | Vercel Analytics + Firebase | Ya integrado |

---

## 5. ASSETS CATALOGADOS

### Fuentes
- `assets/fonts/Oxanium-VariableFont_wght.ttf`

### Animaciones Lottie (JSON)
- `assets/animations/envia_flutter.json`
- `assets/animations/envia_supabase.json`
- `assets/animations/envia_riverpod.json`
- `assets/animations/envia_assistify.json`
- `assets/animations/envia_apex.json`
- `assets/animations/assistify_lottie.json`

### Videos (WebM con alpha)
- `assets/videos/yoflutter.webm`
- `assets/videos/yosupabase.webm`
- `assets/videos/yoriverpod.webm`
- `assets/videos/yoapex.webm`
- `assets/videos/yoassistify.webm`

### Imágenes
- `assets/images/placeholder_fallback.png`

### Íconos / Logos
- `assets/icons/logo_botlode.png`
- `assets/icons/logo_assistify.png`

---

## 6. DATOS DE CONFIGURACIÓN

### WhatsApp
- Número: `5491124842720`
- Mensaje desde atajo Ctrl+W: "Hola, vengo desde los atajos de teclado 🚀"

### Admin UUID (Supabase)
- `37dad3e9-531c-4657-8db6-ddebbdcfa878` (comentarios con estilo especial)

### Rutas Originales Flutter (go_router)
- `/` → `home`
- `/services` → `services`
- `/about` → `about`
- `/contact` → `contact`

---

*Documento generado automáticamente por análisis exhaustivo del código fuente.*
*No se escribió ningún componente Next.js todavía.*
