---
permissionMode: bypassPermissions
wave: 3
---

# T3 — Verificación end-to-end

## Prerrequisitos
- Todos los prompts T1 y T2 completados y mergeados.

## Objetivo
Verificar que la nueva ruta `/proyectos`, el home limpio, y el drawer mobile lateral funcionan correctamente. Reportar issues, no implementar fixes (eso sería un nuevo prompt).

## Pasos

### 1) Type check + lint
```bash
npx tsc --noEmit
npm run lint
```
Ambos deben pasar sin errores ni warnings nuevos. Si hay warnings preexistentes que no fueron tocados, listarlos pero no fallar la verificación por ellos.

### 2) Dev server
```bash
npm run dev
```
Abrir en browser y verificar las siguientes rutas/comportamientos:

#### Home `/`
- [ ] Hero, ClientBenefits, TrustedClients, HomeFinalCta — en ese orden
- [ ] **No** aparece la grilla "Productos reales" (la sección fue movida)
- [ ] No hay errores en consola del browser

#### Ruta `/proyectos`
- [ ] Hero con título "Cosas que construí. / Funcionan. Dan plata." con contraste de pesos visible
- [ ] Subtítulo correcto
- [ ] Stats inline (4 productos · 3 SaaS · ...)
- [ ] Grid 2×2 con 4 cards premium
- [ ] Cada card tiene:
  - Tilt 3D al pasar el cursor
  - Spotlight radial siguiendo el mouse
  - Hover intensifica el borde
  - Click aplica el tema del proyecto en todo el sitio
  - Click abre el drawer detallado a la derecha (ProjectDrawer existente)
- [ ] Cerrar drawer (ESC o backdrop) restaura el estado correctamente

#### Navbar
- [ ] Link "Proyectos" visible entre Servicios y Tecnologías (desktop)
- [ ] Underline animado se mueve a "Proyectos" cuando estás en `/proyectos`
- [ ] En mobile (resize a 375px o DevTools mobile): el link aparece dentro del nuevo drawer lateral

#### Mobile drawer (viewport 375×812)
- [ ] Tap al botón hamburguesa abre drawer desde la derecha (slide derecha→izquierda)
- [ ] Backdrop con blur visible
- [ ] Lista de links muestra los 6 links incluyendo "Proyectos"
- [ ] Indicador activo (dot lateral) en la ruta actual
- [ ] Tap en backdrop → cierra
- [ ] Tap en botón close (X) → cierra
- [ ] Tecla ESC → cierra
- [ ] Swipe horizontal hacia la derecha → cierra
- [ ] Tap en un link interno → navega y cierra
- [ ] Botón "Hablemos" (WhatsApp) full-width al fondo, anclado y visible
- [ ] Body scroll lock funciona (no podés scrollear el contenido detrás)
- [ ] Focus trap funciona (Tab no escapa del drawer)
- [ ] `prefers-reduced-motion` desactivado: animación slide spring se ve
- [ ] Sin errores en consola

#### Cross-cutting
- [ ] Atajos de teclado siguen funcionando (Ctrl+H, Ctrl+S, etc.)
- [ ] Cambio de tema (Ctrl+Y) funciona
- [ ] Toggle inspector (Ctrl+I) funciona en `/proyectos` también
- [ ] Realtime presence badge sigue funcionando

### 3) Lighthouse spot check
En `/proyectos`, abrir DevTools → Lighthouse → mobile + Performance/Accessibility/Best Practices/SEO.
- Performance ≥ 85 (admisible si bajó respecto al home; reportar si <85)
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

### 4) Archivos huérfanos
Buscar referencias a `components/sections/projects.tsx` post-cambios:
```bash
grep -r "from '@/components/sections/projects'" --include="*.tsx" --include="*.ts"
grep -r 'from "@/components/sections/projects"' --include="*.tsx" --include="*.ts"
```
Si ninguna referencia aparece → flagear como candidato a borrar en un próximo prompt (NO borrar en este verify).

### 5) Mobile real (si es posible)
Probar en un device físico iOS y Android al menos:
- Drawer abre/cierra suavemente
- Safe-area-inset-bottom respetado (botón WhatsApp no queda tapado por la home indicator de iOS)
- No hay flicker en la transición

## Reporte final esperado
Output del agente que ejecuta T3:
1. Resultado de typecheck/lint (PASS/FAIL + detalles)
2. Lista checklist de comportamientos verificados con ✅/❌
3. Lighthouse scores
4. Archivos huérfanos encontrados
5. Issues bloqueantes (si los hay)
6. Issues no bloqueantes / sugerencias para próximo prompt

## NO hacer
- NO modificar código en este prompt (es solo verificación)
- NO borrar `components/sections/projects.tsx` (flagear, no borrar)
- NO tunear performance ni refactorizar — si encontrás algo, reportarlo para un prompt nuevo
