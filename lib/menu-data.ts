import type { MenuItem, DeliveryZone } from '@/types'

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    name: 'Zone 1',
    cities: ['Fameck', 'Sérémange-Erzange', 'Uckange', 'Florange'],
    fee: 3,
  },
  {
    name: 'Zone 2',
    cities: ['Ranguevaux', 'Saint-Nicolas-en-Forêt', 'Hayange', 'Neufchef', 'Nilvange', 'Gandrange', 'Vitry-sur-Orne', 'Richemont'],
    fee: 4,
  },
]

export const ALL_CITIES = DELIVERY_ZONES.flatMap(z => z.cities)

export function getDeliveryFee(city: string): number {
  const zone = DELIVERY_ZONES.find(z =>
    z.cities.some(c => c.toLowerCase() === city.toLowerCase())
  )
  return zone?.fee ?? 0
}

export const MENU: MenuItem[] = [
  // ─── PIZZAS BASE TOMATE ───────────────────────────────────────────
  // Populaires en premier
  { id: 'pt-04', name: 'Reine', ingredients: 'mozzarella, jambon, champignons', basePrice: 11.50, megaPrice: 19.50, category: 'pizzas-tomate', isBestSeller: true },
  { id: 'pt-20', name: 'Kebab', ingredients: 'mozzarella, viande kebab, oignons, poivrons, crème', basePrice: 13.50, megaPrice: 20.50, category: 'pizzas-tomate', isHalal: true, isBestSeller: true },
  { id: 'pt-17', name: 'Indiana', ingredients: 'mozzarella, poulet curry, oignons, poivrons, olives, miel', basePrice: 13.50, megaPrice: 20.50, category: 'pizzas-tomate', isHalal: true, isBestSeller: true },
  { id: 'pt-21', name: '4 Fromages', ingredients: 'mozzarella, gorgonzola, raclette, chèvre, olives', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate', isBestSeller: true },
  { id: 'pt-05', name: 'Calabraise', ingredients: 'mozzarella, jambon, poivrons, olives', basePrice: 12, megaPrice: 19.70, category: 'pizzas-tomate', isBestSeller: true },
  // Reste par prix croissant
  { id: 'pt-01', name: 'Marguerite', ingredients: 'mozzarella, tomate', basePrice: 10, megaPrice: 16.50, category: 'pizzas-tomate' },
  { id: 'pt-02', name: 'Tomate Fromage Champignon', ingredients: 'mozzarella, tomate, champignons', basePrice: 10.50, megaPrice: 18, category: 'pizzas-tomate' },
  { id: 'pt-03', name: 'Tomate Fromage Jambon', ingredients: 'mozzarella, tomate, jambon', basePrice: 10.50, megaPrice: 18, category: 'pizzas-tomate' },
  { id: 'pt-06', name: 'Napolitaine', ingredients: 'mozzarella, anchois, olives, champignons', basePrice: 12.50, megaPrice: 19.70, category: 'pizzas-tomate' },
  { id: 'pt-07', name: 'Pêcheur', ingredients: 'mozzarella, thon, poivrons', basePrice: 12.50, megaPrice: 19.70, category: 'pizzas-tomate' },
  { id: 'pt-08', name: 'Mexicaine', ingredients: 'mozzarella, chorizo, poivrons, olives', basePrice: 12.80, megaPrice: 19.80, category: 'pizzas-tomate' },
  { id: 'pt-09', name: 'Salami', ingredients: 'mozzarella, salami, poivrons, olives', basePrice: 12.80, megaPrice: 19.80, category: 'pizzas-tomate' },
  { id: 'pt-10', name: 'Végétarienne 1', ingredients: 'mozzarella, brocoli, artichaut, champignons, poivrons, crème', basePrice: 12.80, megaPrice: 19.80, category: 'pizzas-tomate', isVegetarian: true },
  { id: 'pt-11', name: 'Végétarienne 2', ingredients: 'mozzarella, aubergine, crème, courgette, oignons, poivrons', basePrice: 12.80, megaPrice: 19.80, category: 'pizzas-tomate', isVegetarian: true },
  { id: 'pt-12', name: 'Bolognaise', ingredients: 'mozzarella, bœuf, oignons, poivrons, champignons', basePrice: 13, megaPrice: 20, category: 'pizzas-tomate', isHalal: true },
  { id: 'pt-13', name: 'Panchettina', ingredients: 'mozzarella, pancetta, pomme de terre, oignons, romarin', basePrice: 13, megaPrice: 20, category: 'pizzas-tomate' },
  { id: 'pt-14', name: 'Salamella', ingredients: 'mozzarella, saucisses fraîches italiennes, champignons', basePrice: 13, megaPrice: 20, category: 'pizzas-tomate' },
  { id: 'pt-15', name: 'Paysanne', ingredients: 'mozzarella, oignons, lardons, crème, champignons', basePrice: 13, megaPrice: 20, category: 'pizzas-tomate' },
  { id: 'pt-16', name: '4 Saisons', ingredients: 'mozzarella, jambon, champignons, artichaut, olives', basePrice: 13, megaPrice: 20, category: 'pizzas-tomate' },
  { id: 'pt-18', name: 'Texane', ingredients: 'mozzarella, poulet, bacon, oignons, poivrons, olives, sauce barbecue', basePrice: 13.50, megaPrice: 20.50, category: 'pizzas-tomate' },
  { id: 'pt-19', name: 'La Provençale', ingredients: 'mozzarella, bœuf, aubergine, courgette, oignons, poivrons', basePrice: 13.50, megaPrice: 20.50, category: 'pizzas-tomate', isHalal: true },
  { id: 'pt-22', name: "Pizza de l'Été", ingredients: 'mozzarella, chorizo, artichaut, poivrons, olives', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate' },
  { id: 'pt-23', name: 'Escargots', ingredients: "mozzarella, escargots, beurre Maître d'Hôtel", basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate' },
  { id: 'pt-24', name: 'Orientale', ingredients: 'mozzarella, poulet halal, merguez halal, olives, poivrons, crème', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate', isHalal: true },
  { id: 'pt-25', name: 'Hawaï', ingredients: 'mozzarella, poulet, ananas', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate', isHalal: true },
  { id: 'pt-26', name: 'Suprême', ingredients: 'mozzarella, oignons, chorizo, poivrons, bœuf épicé', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-tomate' },
  { id: 'pt-27', name: 'Lorraine', ingredients: 'mozzarella, lardons, crème, pomme de terre, champignons, oignons, œuf', basePrice: 14, megaPrice: 21, category: 'pizzas-tomate' },
  { id: 'pt-28', name: 'Fruits de Mer', ingredients: 'mozzarella, thon, calamar, crevettes, moules, beurre Maître d\'Hôtel', basePrice: 14, megaPrice: 21, category: 'pizzas-tomate' },
  { id: 'pt-29', name: 'Royale', ingredients: 'mozzarella, salami, chorizo, jambon, poivrons, olives', basePrice: 14, megaPrice: 21, category: 'pizzas-tomate' },
  { id: 'pt-30', name: 'Gina', ingredients: 'mozzarella, jambon de parme, roquette, parmesan', basePrice: 14.50, megaPrice: 21.50, category: 'pizzas-tomate' },
  { id: 'pt-31', name: 'Buffala Campana', ingredients: 'tomate, parmesan, roquette, bufala 125g, jambon italien', basePrice: 15, megaPrice: 22, category: 'pizzas-tomate' },

  // ─── PIZZAS BASE CRÈME ────────────────────────────────────────────
  { id: 'pc-01', name: 'Flambée', ingredients: 'mozzarella, oignons, lardons', basePrice: 12.50, megaPrice: 19.70, category: 'pizzas-creme' },
  { id: 'pc-02', name: 'Blanche', ingredients: 'mozzarella, oignons, jambon, olives, champignons', basePrice: 12.50, megaPrice: 19.70, category: 'pizzas-creme' },
  { id: 'pc-03', name: 'Chèvre-Miel', ingredients: 'mozzarella, fromage de chèvre, miel', basePrice: 12.50, megaPrice: 19.70, category: 'pizzas-creme' },
  { id: 'pc-04', name: 'Prestige', ingredients: 'mozzarella, oignons, saumon fumé, câpres', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-creme' },
  { id: 'pc-05', name: 'Savoyarde', ingredients: 'mozzarella, oignons, lardons, œuf, raclette, pomme de terre', basePrice: 13.80, megaPrice: 20.80, category: 'pizzas-creme' },
  { id: 'pc-06', name: 'Mortadelle', ingredients: 'mozzarella, buffala, crème de pistache, pistaches, olives', basePrice: 15, megaPrice: 22, category: 'pizzas-creme' },

  // ─── BURGERS ──────────────────────────────────────────────────────
  { id: 'bu-01', name: 'Burger Club', ingredients: 'bœuf 150g, fromage, tomates, salade', basePrice: 7, megaPrice: 11, category: 'burgers', note: 'seul / menu avec frites ou potatoes + boisson', isBestSeller: true },
  { id: 'bu-02', name: 'Végé Club', ingredients: 'courgettes et aubergines grillées, tomates, roquette, mozzarella', basePrice: 7, megaPrice: 11, category: 'burgers', isVegetarian: true, note: 'seul / menu avec frites ou potatoes + boisson' },
  { id: 'bu-03', name: 'Chicken Burger', ingredients: 'poulet, fromage, tomates, salade', basePrice: 7, megaPrice: 11, category: 'burgers', note: 'seul / menu avec frites ou potatoes + boisson' },
  { id: 'bu-04', name: 'Cheese Burger', ingredients: 'bœuf, reblochon, tomates, salade, oignons', basePrice: 7, megaPrice: 11, category: 'burgers', note: 'seul / menu avec frites ou potatoes + boisson' },
  { id: 'bu-05', name: 'Italian Burger', ingredients: 'bœuf, mozzarella, tomates, roquette, jambon italien, oignons', basePrice: 8.50, megaPrice: 12, category: 'burgers', note: 'seul / menu avec frites ou potatoes + boisson', isBestSeller: true },

  // ─── ACCOMPAGNEMENTS ──────────────────────────────────────────────
  { id: 'ac-01', name: 'Barquette de frites', basePrice: 2.50, category: 'accompagnements' },
  { id: 'ac-02', name: 'Barquette de potatoes', basePrice: 2.50, category: 'accompagnements' },
  { id: 'ac-03', name: '8 Nuggets avec frites ou potatoes', basePrice: 8, category: 'accompagnements' },

  // ─── PIZZA'KID ────────────────────────────────────────────────────
  { id: 'pk-01', name: "Pizza'Kid", ingredients: '1 petite pizza Marguerite, tomate-fromage ou champignons-reine, OU 5 nuggets + frites', basePrice: 7.50, category: 'pizza-kid' },

  // ─── PÂTES ────────────────────────────────────────────────────────
  { id: 'pa-01', name: 'Spaghettis', ingredients: 'sauces : Bolognaise, 4 Fromages, Carbonara, Saumon', basePrice: 8.50, category: 'pates' },
  { id: 'pa-02', name: 'Pennes', ingredients: 'sauces : Bolognaise, 4 Fromages, Carbonara, Saumon', basePrice: 8.50, category: 'pates' },
  { id: 'pa-03', name: 'Gnocchis', ingredients: 'sauces : Bolognaise, 4 Fromages, Carbonara, Saumon', basePrice: 8.50, category: 'pates' },
  { id: 'pa-04', name: 'Lasagnes', ingredients: '400g / 500g', basePrice: 9, category: 'pates', isBestSeller: true },

  // ─── SALADES ──────────────────────────────────────────────────────
  { id: 'sa-01', name: 'Salade Thon', basePrice: 8, category: 'salades' },
  { id: 'sa-02', name: 'Salade Poulet', basePrice: 8, category: 'salades', isHalal: true },
  { id: 'sa-03', name: 'Salade Jambon', basePrice: 8, category: 'salades' },
  { id: 'sa-04', name: 'Salade Végétarienne', basePrice: 7.50, category: 'salades', isVegetarian: true },

  // ─── DESSERTS ─────────────────────────────────────────────────────
  { id: 'de-01', name: 'Salade de fruits', basePrice: 2, category: 'desserts' },
  { id: 'de-02', name: 'Tiramisu maison', basePrice: 4.80, category: 'desserts' },
  { id: 'de-03', name: 'Mousse au chocolat', basePrice: 4, category: 'desserts' },

  // ─── BOISSONS ─────────────────────────────────────────────────────
  { id: 'bo-01', name: 'Eau 50cl', basePrice: 1, category: 'boissons' },
  { id: 'bo-02', name: 'Coca-Cola 33cl', basePrice: 2.30, category: 'boissons' },
  { id: 'bo-10', name: 'Sprite 33cl', basePrice: 2.30, category: 'boissons' },
  { id: 'bo-11', name: 'Orangina 33cl', basePrice: 2.30, category: 'boissons' },
  { id: 'bo-12', name: 'Ice-Tea 33cl', basePrice: 2.30, category: 'boissons' },
  { id: 'bo-03', name: 'Red Bull', basePrice: 3, category: 'boissons' },
  { id: 'bo-04', name: 'Coca-Cola 1,5L', basePrice: 3.80, category: 'boissons' },
  { id: 'bo-13', name: 'Orangina 1,5L', basePrice: 3.80, category: 'boissons' },
  { id: 'bo-14', name: 'Oasis 1,5L', basePrice: 3.80, category: 'boissons' },
  { id: 'bo-05', name: 'Kronenbourg 25cl', basePrice: 2.30, category: 'boissons' },
  { id: 'bo-06', name: 'Heineken 25cl', basePrice: 2.50, category: 'boissons' },
  { id: 'bo-07', name: 'Desperados 33cl', basePrice: 3, category: 'boissons' },
  { id: 'bo-08', name: 'Vin rouge ou rosé', basePrice: 8, category: 'boissons' },
  { id: 'bo-09', name: 'Lambrusco rouge', basePrice: 9, category: 'boissons' },
]

export const CATEGORY_LABELS: Record<string, string> = {
  'pizzas-tomate': 'Pizzas Tomate',
  'pizzas-creme': 'Pizzas Crème',
  'burgers': 'Burgers',
  'accompagnements': 'Accompagnements',
  'pizza-kid': "Pizza'Kid",
  'pates': 'Pâtes',
  'salades': 'Salades',
  'desserts': 'Desserts',
  'boissons': 'Boissons',
}

export const CATEGORY_ORDER = [
  'pizzas-tomate',
  'pizzas-creme',
  'burgers',
  'accompagnements',
  'pizza-kid',
  'pates',
  'salades',
  'desserts',
  'boissons',
]
