/**
 * SYSTÈME DE GESTION DES IMAGES — PIZZA CLUB FAMECK
 *
 * Pour remplacer une image :
 *   1. Déposez votre photo dans le bon dossier /public/images/...
 *   2. Changez l'URL ci-dessous par '/images/dossier/nom-fichier.jpg'
 *   3. Sauvegardez → le site se met à jour instantanément
 *
 * Tant qu'une vraie photo n'est pas disponible, Unsplash est utilisé.
 */

// ─── Unsplash pools par catégorie ──────────────────────────────────────────
// Différentes photos pour varier l'apparence des cards

const U = (id: string, w = 400) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`

const PIZZA_PHOTOS = [
  U('1574071318508-1cdbab80d002'),   // margherita classique
  U('1565299624946-b28f40a0ae38'),   // pizza généreuse
  U('1552539618-7eec9b4d1796'),      // pizza fines tranches
  U('1571997488117-b4f4a0e2e17b'),   // pizza au four
  U('1513104890138-7c749659a591'),   // pizza coupée
  U('1595854341625-f33ee10dbf5f'),   // pizza rustique
  U('1604382354936-07c5d9983bd3'),   // pizza napolitaine
  U('1593560708920-61dd98c46a4e'),   // pizza fromage
  U('1588315029754-2dd089d39a1a'),   // pizza légumes
  U('1571407140515-6e7f3bc17fc9'),   // pizza italienne
] as const

const BURGER_PHOTOS = [
  U('1568901346375-23c9450c58cd'),   // burger classique
  U('1550547660-d9450f859349'),      // burger cheese
  U('1484723091739-30a097e8f929'),   // burger gourmet
  U('1571091718767-18b5b1457add'),   // burger poulet
  U('1553979459-d1f7cf9a4c38'),      // burger généreux
] as const

const PASTA_PHOTOS = [
  U('1563379926898-05f4575a45d8'),   // spaghetti
  U('1555949258-eb67b1ef0ceb'),      // penne sauce
  U('1551183053-bf91798d792e'),      // lasagnes
  U('1621996659650-3d8c78d2a4e0'),   // gnocchi
] as const

const SALAD_PHOTOS = [
  U('1512621776951-a57141f2eefd'),   // salade mixte
  U('1540420773420-3366772f4999'),   // salade caesar
  U('1546069901-ba9599a7e63c'),      // salade verte
  U('1504674900247-0877df9cc836'),   // salade colorée
] as const

const DESSERT_PHOTOS = [
  U('1551024601-bec78aea704b'),      // tiramisu
  U('1571877227200-a0d98ea607e9'),   // mousse chocolat
  U('1563805042-7684c019e1cb'),      // salade de fruits
] as const

const DRINK_PHOTOS = [
  U('1536935338788-846bb9981813'),   // soft drinks
  U('1548839140-29a749e1cf4d'),      // jus et sodas
  U('1613478881763-859b0afb5a08'),   // boissons froides
  U('1551538827-9c037cb4f32a'),      // vin
  U('1608270586695-610f38a6e14d'),   // bière
] as const

// Helper pour cycler les photos
function cycle<T>(arr: readonly T[], index: number): T {
  return arr[index % arr.length]
}

// ─── Configuration principale ──────────────────────────────────────────────
export const IMAGES = {

  // Hero (fond d'écran principal)
  hero: '/images/hero/mortadelle_hero_ultra.webp',
  // → Pour remplacer : '/images/hero.jpg'

  // Logo / avatar du restaurant
  logo: '/images/logo/logo_transparent.png',
  // → Pour remplacer : '/images/logo.png'

  // ─── Pizzas Base Tomate ─────────────────────────────────────────────────
  products: {
    'pt-01': cycle(PIZZA_PHOTOS, 0),   // Marguerite          → /images/pizzas/marguerite.jpg
    'pt-02': cycle(PIZZA_PHOTOS, 1),   // Tomate Fromage Champ → /images/pizzas/tomate-fromage-champignon.jpg
    'pt-03': cycle(PIZZA_PHOTOS, 2),   // Tomate Fromage Jambon → /images/pizzas/tomate-fromage-jambon.jpg
    'pt-04': cycle(PIZZA_PHOTOS, 3),   // Reine               → /images/pizzas/reine.jpg
    'pt-05': cycle(PIZZA_PHOTOS, 4),   // Calabraise          → /images/pizzas/calabraise.jpg
    'pt-06': cycle(PIZZA_PHOTOS, 5),   // Napolitaine         → /images/pizzas/napolitaine.jpg
    'pt-07': cycle(PIZZA_PHOTOS, 6),   // Pêcheur             → /images/pizzas/pecheur.jpg
    'pt-08': cycle(PIZZA_PHOTOS, 7),   // Mexicaine           → /images/pizzas/mexicaine.jpg
    'pt-09': cycle(PIZZA_PHOTOS, 8),   // Salami              → /images/pizzas/salami.jpg
    'pt-10': cycle(PIZZA_PHOTOS, 9),   // Végétarienne 1      → /images/pizzas/vegetarienne-1.jpg
    'pt-11': cycle(PIZZA_PHOTOS, 0),   // Végétarienne 2      → /images/pizzas/vegetarienne-2.jpg
    'pt-12': cycle(PIZZA_PHOTOS, 1),   // Bolognaise          → /images/pizzas/bolognaise.jpg
    'pt-13': cycle(PIZZA_PHOTOS, 2),   // Panchettina         → /images/pizzas/panchettina.jpg
    'pt-14': cycle(PIZZA_PHOTOS, 3),   // Salamella           → /images/pizzas/salamella.jpg
    'pt-15': cycle(PIZZA_PHOTOS, 4),   // Paysanne            → /images/pizzas/paysanne.jpg
    'pt-16': cycle(PIZZA_PHOTOS, 5),   // 4 Saisons           → /images/pizzas/4-saisons.jpg
    'pt-17': cycle(PIZZA_PHOTOS, 6),   // Indiana             → /images/pizzas/indiana.jpg
    'pt-18': cycle(PIZZA_PHOTOS, 7),   // Texane              → /images/pizzas/texane.jpg
    'pt-19': cycle(PIZZA_PHOTOS, 8),   // La Provençale       → /images/pizzas/provencale.jpg
    'pt-20': cycle(PIZZA_PHOTOS, 9),   // Kebab               → /images/pizzas/kebab.jpg
    'pt-21': cycle(PIZZA_PHOTOS, 0),   // 4 Fromages          → /images/pizzas/4-fromages.jpg
    'pt-22': cycle(PIZZA_PHOTOS, 1),   // Pizza de l'Été      → /images/pizzas/pizza-ete.jpg
    'pt-23': cycle(PIZZA_PHOTOS, 2),   // Escargots           → /images/pizzas/escargots.jpg
    'pt-24': cycle(PIZZA_PHOTOS, 3),   // Orientale           → /images/pizzas/orientale.jpg
    'pt-25': cycle(PIZZA_PHOTOS, 4),   // Hawaï               → /images/pizzas/hawaii.jpg
    'pt-26': cycle(PIZZA_PHOTOS, 5),   // Suprême             → /images/pizzas/supreme.jpg
    'pt-27': cycle(PIZZA_PHOTOS, 6),   // Lorraine            → /images/pizzas/lorraine.jpg
    'pt-28': cycle(PIZZA_PHOTOS, 7),   // Fruits de Mer       → /images/pizzas/fruits-de-mer.jpg
    'pt-29': cycle(PIZZA_PHOTOS, 8),   // Royale              → /images/pizzas/royale.jpg
    'pt-30': cycle(PIZZA_PHOTOS, 9),   // Gina                → /images/pizzas/gina.jpg
    'pt-31': cycle(PIZZA_PHOTOS, 0),   // Buffala Campana     → /images/pizzas/buffala-campana.jpg

    // ─── Pizzas Base Crème ──────────────────────────────────────────────
    'pc-01': cycle(PIZZA_PHOTOS, 3),   // Flambée             → /images/pizzas/flambee.jpg
    'pc-02': cycle(PIZZA_PHOTOS, 4),   // Blanche             → /images/pizzas/blanche.jpg
    'pc-03': cycle(PIZZA_PHOTOS, 5),   // Chèvre-Miel         → /images/pizzas/chevre-miel.jpg
    'pc-04': cycle(PIZZA_PHOTOS, 6),   // Prestige            → /images/pizzas/prestige.jpg
    'pc-05': cycle(PIZZA_PHOTOS, 7),   // Savoyarde           → /images/pizzas/savoyarde.jpg
    'pc-06': cycle(PIZZA_PHOTOS, 8),   // Mortadelle          → /images/pizzas/mortadelle.jpg

    // ─── Burgers ────────────────────────────────────────────────────────
    'bu-01': cycle(BURGER_PHOTOS, 0),  // Burger Club         → /images/burgers/burger-club.jpg
    'bu-02': cycle(BURGER_PHOTOS, 1),  // Végé Club           → /images/burgers/vege-club.jpg
    'bu-03': cycle(BURGER_PHOTOS, 2),  // Chicken Burger      → /images/burgers/chicken-burger.jpg
    'bu-04': cycle(BURGER_PHOTOS, 3),  // Cheese Burger       → /images/burgers/cheese-burger.jpg
    'bu-05': cycle(BURGER_PHOTOS, 4),  // Italian Burger      → /images/burgers/italian-burger.jpg

    // ─── Accompagnements ────────────────────────────────────────────────
    'ac-01': U('1576107232122-b4c2bef41a0e'),  // Frites       → /images/accompagnements/frites.jpg
    'ac-02': U('1576107232122-b4c2bef41a0e'),  // Potatoes     → /images/accompagnements/potatoes.jpg
    'ac-03': U('1562967914-7c78abb00cf9'),      // Nuggets      → /images/accompagnements/nuggets.jpg

    // ─── Pizza'Kid ──────────────────────────────────────────────────────
    'pk-01': cycle(PIZZA_PHOTOS, 0),   // Pizza'Kid           → /images/pizza-kid.jpg

    // ─── Pâtes ──────────────────────────────────────────────────────────
    'pa-01': cycle(PASTA_PHOTOS, 0),   // Spaghettis          → /images/pates/spaghettis.jpg
    'pa-02': cycle(PASTA_PHOTOS, 1),   // Pennes              → /images/pates/pennes.jpg
    'pa-03': cycle(PASTA_PHOTOS, 3),   // Gnocchis            → /images/pates/gnocchis.jpg
    'pa-04': cycle(PASTA_PHOTOS, 2),   // Lasagnes            → /images/pates/lasagnes.jpg

    // ─── Salades ────────────────────────────────────────────────────────
    'sa-01': cycle(SALAD_PHOTOS, 0),   // Salade Thon         → /images/salades/salade-thon.jpg
    'sa-02': cycle(SALAD_PHOTOS, 1),   // Salade Poulet       → /images/salades/salade-poulet.jpg
    'sa-03': cycle(SALAD_PHOTOS, 2),   // Salade Jambon       → /images/salades/salade-jambon.jpg
    'sa-04': cycle(SALAD_PHOTOS, 3),   // Salade Végétarienne → /images/salades/salade-vegetarienne.jpg

    // ─── Desserts ───────────────────────────────────────────────────────
    'de-01': cycle(DESSERT_PHOTOS, 2), // Salade de fruits    → /images/desserts/salade-fruits.jpg
    'de-02': cycle(DESSERT_PHOTOS, 0), // Tiramisu maison     → /images/desserts/tiramisu.jpg
    'de-03': cycle(DESSERT_PHOTOS, 1), // Mousse au chocolat  → /images/desserts/mousse-chocolat.jpg

    // ─── Boissons ───────────────────────────────────────────────────────
    'bo-01': cycle(DRINK_PHOTOS, 0),   // Eau 50cl            → /images/boissons/eau.jpg
    'bo-02': cycle(DRINK_PHOTOS, 0),   // Coca-Cola 33cl      → /images/boissons/coca-33cl.jpg
    'bo-10': cycle(DRINK_PHOTOS, 0),   // Sprite 33cl         → /images/boissons/sprite-33cl.jpg
    'bo-11': cycle(DRINK_PHOTOS, 0),   // Orangina 33cl       → /images/boissons/orangina-33cl.jpg
    'bo-12': cycle(DRINK_PHOTOS, 0),   // Ice-Tea 33cl        → /images/boissons/icetea-33cl.jpg
    'bo-03': cycle(DRINK_PHOTOS, 1),   // Red Bull            → /images/boissons/redbull.jpg
    'bo-04': cycle(DRINK_PHOTOS, 1),   // Coca-Cola 1,5L      → /images/boissons/coca-1l5.jpg
    'bo-13': cycle(DRINK_PHOTOS, 1),   // Orangina 1,5L       → /images/boissons/orangina-1l5.jpg
    'bo-14': cycle(DRINK_PHOTOS, 1),   // Oasis 1,5L          → /images/boissons/oasis-1l5.jpg
    'bo-05': cycle(DRINK_PHOTOS, 4),   // Kronenbourg         → /images/boissons/kronenbourg.jpg
    'bo-06': cycle(DRINK_PHOTOS, 4),   // Heineken            → /images/boissons/heineken.jpg
    'bo-07': cycle(DRINK_PHOTOS, 4),   // Desperados          → /images/boissons/desperados.jpg
    'bo-08': cycle(DRINK_PHOTOS, 3),   // Vin rouge/rosé      → /images/boissons/vin.jpg
    'bo-09': cycle(DRINK_PHOTOS, 3),   // Lambrusco           → /images/boissons/lambrusco.jpg
  },
} as const

export type ProductImageKey = keyof typeof IMAGES.products

/** Récupère l'image d'un produit par son ID, avec fallback catégorie */
export function getProductImage(itemId: string): string {
  return (IMAGES.products as Record<string, string>)[itemId] ?? IMAGES.hero
}
