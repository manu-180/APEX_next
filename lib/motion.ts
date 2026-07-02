/**
 * APEX Design Language v2 — tokens de motion (spec §1).
 * Fuente ÚNICA para animaciones en Framer Motion / GSAP.
 * Espejo CSS en globals.css (`--ease-out`, `--dur-*`): si cambia uno,
 * debe cambiar el otro. No redefinir estos valores inline en componentes.
 */

/**
 * Curva firma del sitio — ease-out expresivo con settle largo.
 * Equivale a `cubic-bezier(0.22, 1, 0.36, 1)` (`var(--ease-out)`).
 * Tipada como tupla mutable (no `as const`) porque `BezierDefinition`
 * de framer-motion no acepta tuplas readonly.
 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

/** Solo cross-fades simétricos — espejo de `var(--ease-in-out-custom)`. */
export const EASE_IN_OUT_CUSTOM: [number, number, number, number] = [0.65, 0, 0.35, 1]

/* ── Springs ──────────────────────────────────────────────────────────────── */

/** Tilt 3D de cards premium / CTA 3D (máx 4–6°, spec §8.3). */
export const SPRING_TILT = { stiffness: 88, damping: 19, mass: 0.82 }

/** Hover-lift, UI snap, drawer. */
export const SPRING_SNAP = { stiffness: 320, damping: 22 }

/** Micro-focus de inputs. */
export const SPRING_FOCUS = { stiffness: 400, damping: 28 }

/* ── Staggers (segundos) — escala fija, spec §9 ──────────────────────────── */

/** Filas densas (p. ej. modal de shortcuts). */
export const STAGGER_TIGHT = 0.03

/** Grillas de cards (rango legal 45–80 ms). */
export const STAGGER_BASE = 0.06

/** Pasos narrativos secuenciales (proceso, beneficios). */
export const STAGGER_LOOSE = 0.12

/** Delay del contenido que entra después del spring de un panel contenedor. */
export const DELAY_AFTER_PANEL = 0.12

/* ── Duraciones (segundos) — espejo de --dur-* de globals.css ────────────── */

/** Micro: color, opacity de links, focus. */
export const DUR_FAST = 0.15

/** Hover de cards, botones, iconos cinéticos. */
export const DUR_BASE = 0.3

/** Transiciones de superficie. */
export const DUR_SLOW = 0.6

/** Entradas de sección (reveal firma, spec §2). */
export const DUR_REVEAL = 0.8
