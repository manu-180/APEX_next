/**
 * Features de framer-motion cargadas ASYNC vía LazyMotion (app-shell).
 *
 * domMax incluye gestos + drag + layout (los drawers/sheets usan drag y
 * AnimatePresence popLayout usa layout). Al cargarse como chunk separado,
 * el runtime de animación (~25 kB gz) sale del First Load de TODAS las rutas:
 * el bundle inicial solo lleva los shells `m.*` (~5 kB).
 */
export { domMax as default } from 'framer-motion'
