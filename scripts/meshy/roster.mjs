/**
 * APEX Muestrario — roster de 40 artefactos 3D (5 categorías × 8 piezas).
 * ---------------------------------------------------------------------
 * Fuente ÚNICA de generación (Meshy text-to-3D). El generador (generate.mjs)
 * lee esta lista; por defecto salta las que tienen `existing: true` (ya están
 * en public/models/ de la primera tanda) para no gastar credits de más.
 *
 * Cada `name` es el basename del archivo → public/models/<name>.glb
 * y su thumbnail → public/models/thumbs/<name>.webp
 *
 * La metadata de presentación (nombre visible, tag, blurb, scale) vive en
 * lib/three/artifacts.ts — mantener ambos en sync al agregar/quitar piezas.
 */

/** @typedef {{ name: string, category: string, prompt: string, existing?: boolean, polycount?: number }} RosterEntry */

/** @type {RosterEntry[]} */
export const ROSTER = [
  // ─────────────────────────── RELIQUIAS ───────────────────────────
  // Línea tech-artefacto: metal cepillado + vidrio oscuro, facetas afiladas.
  {
    name: 'apex-monolith',
    category: 'reliquias',
    existing: true,
    prompt:
      'A sleek minimalist faceted monolith obelisk, premium aerospace-grade brushed metal and dark glass, sharp geometric facets, futuristic tech artifact, matte black with subtle metallic edges, studio product render',
  },
  {
    name: 'apex-core-orb',
    category: 'reliquias',
    existing: true,
    prompt:
      'A futuristic spherical tech core with concentric mechanical rings, aerospace instrument aesthetic, brushed titanium and dark glass, glowing seams, precision engineered, studio render',
  },
  {
    name: 'apex-gem',
    category: 'reliquias',
    existing: true,
    prompt:
      'A high quality faceted crystal gem, sharp precise facets, translucent glass with internal refraction, premium jewel, studio product render',
  },
  {
    name: 'apex-reliquia-sarcofago',
    category: 'reliquias',
    prompt:
      'A sealed futuristic sarcophagus cryo-capsule, premium aerospace-grade brushed titanium and dark glass panels, sharp geometric facets, a single glowing seam of light down the center, matte black with metallic edges, tech artifact, studio product render',
  },
  {
    name: 'apex-reliquia-sello',
    category: 'reliquias',
    prompt:
      'A circular tech sigil disc medallion, engraved concentric mechanical rings and runic grooves, brushed metal and dark glass, precision engineered, subtle glowing lines, premium sci-fi artifact, studio product render',
  },
  {
    name: 'apex-reliquia-reactor',
    category: 'reliquias',
    prompt:
      'A futuristic reactor core: a glowing spherical energy cell suspended inside a polished brushed-titanium gyroscope ring frame, dark glass, aerospace instrument aesthetic, precision engineered, sharp clean detail, studio render',
  },
  {
    name: 'apex-reliquia-prisma',
    category: 'reliquias',
    prompt:
      'A tall faceted prism totem, sharp crystalline geometry, brushed metal base and translucent dark glass body with a glowing inner edge, premium minimalist tech monument, studio product render',
  },
  {
    name: 'apex-reliquia-nucleo',
    category: 'reliquias',
    prompt:
      'A faceted metallic dodecahedron power core, sharp geometric panels, brushed titanium with dark glass insets and glowing seams, premium sci-fi artifact, floating, studio render',
  },

  // ──────────────────────────── COSMOS ────────────────────────────
  // Espacio: paneles blancos + titanio, sci-fi limpio, sellos de luz.
  {
    name: 'apex-craft',
    category: 'cosmos',
    existing: true,
    prompt:
      'A minimalist stylized aerospace craft, sharp aerodynamic silhouette, matte metal fuselage, premium clean sci-fi geometric design, floating hero object',
  },
  {
    name: 'apex-cosmos-estacion',
    category: 'cosmos',
    prompt:
      'A modular orbital space station, sleek white and titanium panels, solar arrays and docking rings, clean premium sci-fi design, precision engineered, floating hero object, studio render',
  },
  {
    name: 'apex-cosmos-sonda',
    category: 'cosmos',
    prompt:
      'A deep-space exploration probe, slender aerodynamic body with a dish antenna and sensor arrays, matte white and metal, clean premium sci-fi, floating hero object, studio render',
  },
  {
    name: 'apex-cosmos-casco',
    category: 'cosmos',
    prompt:
      'A premium astronaut helmet, sleek reflective gold visor, white and titanium shell, clean futuristic space-suit design, studio product render, sharp detail',
  },
  {
    name: 'apex-cosmos-planeta',
    category: 'cosmos',
    prompt:
      'A stylized ringed planet, smooth matte sphere with subtle surface bands and a sharp elegant orbital ring, premium minimalist cosmic object, floating hero object, studio render',
  },
  {
    name: 'apex-cosmos-satelite',
    category: 'cosmos',
    prompt:
      'A compact communications satellite, folded solar panels, dish and antennae, matte white and titanium body, clean premium sci-fi, floating, studio render',
  },
  {
    name: 'apex-cosmos-modulo',
    category: 'cosmos',
    prompt:
      'A lunar lander module, faceted gold-foil and metal body on four landing legs, clean premium sci-fi spacecraft, precision engineered, studio product render',
  },
  {
    name: 'apex-cosmos-rover',
    category: 'cosmos',
    prompt:
      'A sleek space exploration rover, six articulated wheels, a sensor mast and paneled chassis, matte white and titanium, premium clean sci-fi vehicle, studio render',
  },

  // ─────────────────────────── FANTASÍA ───────────────────────────
  // Ornamentado: oro + gemas, runas grabadas, encantado, pulido.
  {
    name: 'apex-fantasia-espada',
    category: 'fantasia',
    prompt:
      'An ornate runic fantasy longsword, engraved glowing runes along the polished steel blade, gold and silver hilt with a gemstone pommel, premium enchanted weapon, floating, studio product render',
  },
  {
    name: 'apex-fantasia-amuleto',
    category: 'fantasia',
    prompt:
      'An arcane fantasy amulet pendant, ornate gold filigree wrapped around a glowing gemstone, engraved runes, premium enchanted jewelry, floating, studio product render',
  },
  {
    name: 'apex-fantasia-cofre',
    category: 'fantasia',
    prompt:
      'An ornate treasure chest, dark polished wood with engraved gold trim and a jeweled lock, premium fantasy artifact, studio product render',
  },
  {
    name: 'apex-fantasia-cristal',
    category: 'fantasia',
    prompt:
      'A glowing arcane mana crystal cluster, sharp translucent faceted crystals with an ethereal inner light on a carved stone base, premium fantasy artifact, studio render',
  },
  {
    name: 'apex-fantasia-casco',
    category: 'fantasia',
    prompt:
      "An ornate knight's helmet, engraved polished steel with gold trim and a crested plume, premium medieval fantasy armor, studio product render, sharp detail",
  },
  {
    name: 'apex-fantasia-grimorio',
    category: 'fantasia',
    prompt:
      'An ancient closed magic spellbook grimoire lying flat, thick ornate embossed leather cover with gold filigree metal corners and a large glowing gemstone clasp, arcane runes, premium fantasy artifact, studio product render',
  },
  {
    name: 'apex-fantasia-corona',
    category: 'fantasia',
    prompt:
      'A regal royal crown, ornate polished gold with inset gemstones and sharp elegant points, premium fantasy artifact, floating, studio product render',
  },
  {
    name: 'apex-fantasia-portal',
    category: 'fantasia',
    prompt:
      'A standing runic stone archway portal, carved stone pillars with glowing engraved runes and a shimmering energy field within the arch, premium fantasy artifact, studio render',
  },

  // ─────────────────────────── CRIATURAS ──────────────────────────
  // Fauna estilizada: esculpida, sleek, con brillo metálico/iridiscente.
  {
    name: 'apex-criatura-dragon',
    category: 'criaturas',
    prompt:
      'A stylized coiled dragon wyrm, sleek sculpted scales with a metallic sheen, elegant curved horns and folded wings, premium fantasy creature, dynamic pose, studio render',
  },
  {
    name: 'apex-criatura-fenix',
    category: 'criaturas',
    prompt:
      'A stylized phoenix bird with elegant flowing feathers, sleek sculpted form with a fiery iridescent sheen, wings spread, premium mythical creature, dynamic pose, studio render',
  },
  {
    name: 'apex-criatura-bestia',
    category: 'criaturas',
    prompt:
      'A sleek mechanical guardian beast, a sculpted armored panther form of brushed metal with glowing seams, premium sci-fi creature, dynamic pose, studio render',
  },
  {
    name: 'apex-criatura-pez',
    category: 'criaturas',
    prompt:
      'An exotic bioluminescent abyssal anglerfish, sleek translucent body glowing with intricate blue patterns, long elegant flowing fins and delicate bioluminescent lures, premium deep-sea creature, dramatic studio render',
  },
  {
    name: 'apex-criatura-escarabajo',
    category: 'criaturas',
    prompt:
      'A metallic scarab beetle, polished iridescent carapace with fine engraved detail, premium sculpted insect artifact, studio product render',
  },
  {
    name: 'apex-criatura-buho',
    category: 'criaturas',
    prompt:
      'A stylized crystal owl, faceted translucent body with subtle metallic accents, elegant sculpted form, premium creature artifact, studio render',
  },
  {
    name: 'apex-criatura-lobo',
    category: 'criaturas',
    prompt:
      'A majestic spectral wolf standing proud, sleek sculpted body made of translucent glowing blue ethereal energy with wisps of light, elegant premium mythical creature, dramatic studio render',
  },
  {
    name: 'apex-criatura-medusa',
    category: 'criaturas',
    prompt:
      'An ethereal jellyfish, a translucent glowing bell with elegant flowing tentacles, bioluminescent premium sea creature, floating, studio render',
  },

  // ────────────────────────── FLORA / NATURA ──────────────────────
  // Botánica premium: cristal, translúcido, bioluminiscente, jade/oro.
  {
    name: 'apex-flora-flor',
    category: 'flora',
    prompt:
      'A blooming crystal rose flower, wide-open translucent petals of glowing pink and violet crystal catching the light, on a slender green stem with leaves, vibrant colorful premium botanical artifact, bright clean studio product render',
  },
  {
    name: 'apex-flora-bonsai',
    category: 'flora',
    prompt:
      'A luminous bonsai tree, a sculpted trunk with glowing crystal leaves in a premium ceramic pot, elegant, floating hero object, studio product render',
  },
  {
    name: 'apex-flora-hongo',
    category: 'flora',
    prompt:
      'A cluster of bioluminescent mushrooms, smooth glowing translucent caps on elegant stems over a mossy base, premium fantasy flora, studio render',
  },
  {
    name: 'apex-flora-suculenta',
    category: 'flora',
    prompt:
      'A jade succulent plant, smooth translucent green leaves with subtle gold edges in a premium stone pot, elegant, studio product render',
  },
  {
    name: 'apex-flora-loto',
    category: 'flora',
    prompt:
      'A golden lotus flower on a lily pad, polished gold petals with a subtle gem center, premium elegant botanical artifact, floating on calm water, studio render',
  },
  {
    name: 'apex-flora-cactus',
    category: 'flora',
    prompt:
      'A blooming desert cactus with delicate flowers, a sculpted matte body in a premium ceramic pot, elegant clean design, studio product render',
  },
  {
    name: 'apex-flora-helecho',
    category: 'flora',
    prompt:
      'A crystalline fern frond, translucent glass leaves with fine detail and an iridescent sheen, elegant premium botanical artifact, studio render',
  },
  {
    name: 'apex-flora-orquidea',
    category: 'flora',
    prompt:
      'An exotic orchid flower, elegant sculpted petals with a translucent iridescent sheen on a slender stem, premium botanical artifact, studio product render',
  },
]

/** Solo las piezas a generar en esta corrida (nuevas, sin `existing`). */
export const NEW_ENTRIES = ROSTER.filter((e) => !e.existing)
