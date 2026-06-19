# Guide — Remplacer les photos

## Comment ça marche

Toutes les images du site sont centralisées dans un seul fichier :
**`/lib/images-config.ts`**

Pour remplacer une image, il suffit de **deux actions** :
1. Déposer la photo dans le bon dossier `/public/images/...`
2. Changer l'URL dans `images-config.ts`

Le site se met à jour automatiquement au redémarrage.

---

## Formats recommandés

| Type | Format | Taille | Rapport |
|------|--------|--------|---------|
| Photo hero | JPG | 1920×1080 px | 16:9 |
| Photo produit | JPG | 800×600 px | 4:3 |
| Logo | PNG (transparent) | 400×400 px | 1:1 |

---

## Structure des dossiers

```
/public/images/
├── hero.jpg                    ← Photo fond d'écran principal
├── logo.png                    ← Logo du restaurant
├── pizzas/
│   ├── marguerite.jpg
│   ├── reine.jpg
│   ├── 4-fromages.jpg
│   ├── bolognaise.jpg
│   └── ... (une photo par pizza)
├── burgers/
│   ├── burger-club.jpg
│   ├── vege-club.jpg
│   ├── chicken-burger.jpg
│   ├── cheese-burger.jpg
│   └── italian-burger.jpg
├── pates/
│   ├── spaghettis.jpg
│   ├── pennes.jpg
│   ├── gnocchis.jpg
│   └── lasagnes.jpg
├── salades/
│   ├── salade-thon.jpg
│   ├── salade-poulet.jpg
│   ├── salade-jambon.jpg
│   └── salade-vegetarienne.jpg
├── desserts/
│   ├── tiramisu.jpg
│   ├── mousse-chocolat.jpg
│   └── salade-fruits.jpg
├── boissons/
│   ├── eau.jpg
│   ├── soft.jpg
│   ├── vin.jpg
│   └── biere.jpg
└── accompagnements/
    ├── frites.jpg
    ├── potatoes.jpg
    └── nuggets.jpg
```

---

## Étape par étape : remplacer la photo hero

**Avant** (dans `lib/images-config.ts`) :
```ts
hero: 'https://images.unsplash.com/photo-...'
```

**Après** :
1. Copier votre photo dans `/public/images/hero.jpg`
2. Modifier `images-config.ts` :
```ts
hero: '/images/hero.jpg'
```

---

## Exemple : remplacer la photo de la Marguerite

1. Prenez une belle photo de votre Marguerite
2. Renommez-la `marguerite.jpg`
3. Déposez-la dans `/public/images/pizzas/`
4. Ouvrez `/lib/images-config.ts` et changez :

```ts
// Avant (Unsplash)
'pt-01': 'https://images.unsplash.com/photo-...'

// Après (votre photo)
'pt-01': '/images/pizzas/marguerite.jpg'
```

---

## Référence — IDs des produits

### Pizzas Tomate
| ID | Produit | Fichier suggéré |
|----|---------|-----------------|
| pt-01 | Marguerite | `/images/pizzas/marguerite.jpg` |
| pt-02 | Tomate Fromage Champignon | `/images/pizzas/tomate-fromage-champignon.jpg` |
| pt-03 | Tomate Fromage Jambon | `/images/pizzas/tomate-fromage-jambon.jpg` |
| pt-04 | Reine | `/images/pizzas/reine.jpg` |
| pt-05 | Calabraise | `/images/pizzas/calabraise.jpg` |
| pt-06 | Napolitaine | `/images/pizzas/napolitaine.jpg` |
| pt-07 | Pêcheur | `/images/pizzas/pecheur.jpg` |
| pt-08 | Mexicaine | `/images/pizzas/mexicaine.jpg` |
| pt-09 | Salami | `/images/pizzas/salami.jpg` |
| pt-10 | Végétarienne 1 | `/images/pizzas/vegetarienne-1.jpg` |
| pt-11 | Végétarienne 2 | `/images/pizzas/vegetarienne-2.jpg` |
| pt-12 | Bolognaise | `/images/pizzas/bolognaise.jpg` |
| pt-13 | Panchettina | `/images/pizzas/panchettina.jpg` |
| pt-14 | Salamella | `/images/pizzas/salamella.jpg` |
| pt-15 | Paysanne | `/images/pizzas/paysanne.jpg` |
| pt-16 | 4 Saisons | `/images/pizzas/4-saisons.jpg` |
| pt-17 | Indiana | `/images/pizzas/indiana.jpg` |
| pt-18 | Texane | `/images/pizzas/texane.jpg` |
| pt-19 | La Provençale | `/images/pizzas/provencale.jpg` |
| pt-20 | Kebab | `/images/pizzas/kebab.jpg` |
| pt-21 | 4 Fromages | `/images/pizzas/4-fromages.jpg` |
| pt-22 | Pizza de l'Été | `/images/pizzas/pizza-ete.jpg` |
| pt-23 | Escargots | `/images/pizzas/escargots.jpg` |
| pt-24 | Orientale | `/images/pizzas/orientale.jpg` |
| pt-25 | Hawaï | `/images/pizzas/hawaii.jpg` |
| pt-26 | Suprême | `/images/pizzas/supreme.jpg` |
| pt-27 | Lorraine | `/images/pizzas/lorraine.jpg` |
| pt-28 | Fruits de Mer | `/images/pizzas/fruits-de-mer.jpg` |
| pt-29 | Royale | `/images/pizzas/royale.jpg` |
| pt-30 | Gina | `/images/pizzas/gina.jpg` |
| pt-31 | Buffala Campana | `/images/pizzas/buffala-campana.jpg` |

### Pizzas Crème
| ID | Produit | Fichier suggéré |
|----|---------|-----------------|
| pc-01 | Flambée | `/images/pizzas/flambee.jpg` |
| pc-02 | Blanche | `/images/pizzas/blanche.jpg` |
| pc-03 | Chèvre-Miel | `/images/pizzas/chevre-miel.jpg` |
| pc-04 | Prestige | `/images/pizzas/prestige.jpg` |
| pc-05 | Savoyarde | `/images/pizzas/savoyarde.jpg` |
| pc-06 | Mortadelle | `/images/pizzas/mortadelle.jpg` |

### Burgers
| ID | Produit | Fichier suggéré |
|----|---------|-----------------|
| bu-01 | Burger Club | `/images/burgers/burger-club.jpg` |
| bu-02 | Végé Club | `/images/burgers/vege-club.jpg` |
| bu-03 | Chicken Burger | `/images/burgers/chicken-burger.jpg` |
| bu-04 | Cheese Burger | `/images/burgers/cheese-burger.jpg` |
| bu-05 | Italian Burger | `/images/burgers/italian-burger.jpg` |

### Pâtes
| ID | Produit | Fichier suggéré |
|----|---------|-----------------|
| pa-01 | Spaghettis | `/images/pates/spaghettis.jpg` |
| pa-02 | Pennes | `/images/pates/pennes.jpg` |
| pa-03 | Gnocchis | `/images/pates/gnocchis.jpg` |
| pa-04 | Lasagnes | `/images/pates/lasagnes.jpg` |

---

## Astuce : optimiser ses photos

Pour que le site reste rapide, compressez vos photos avant de les déposer :
- [Squoosh](https://squoosh.app) — gratuit, en ligne
- Ciblez **< 200 Ko** par photo produit
- Ciblez **< 500 Ko** pour le hero

---

## Si l'image ne s'affiche pas

Le site affiche automatiquement un fallback (emoji coloré) si une image
est introuvable. Vérifiez :
1. Le nom du fichier (respecter la casse, pas d'espaces)
2. L'URL dans `images-config.ts` (commence par `/images/`)
3. Le format du fichier (.jpg, .png, .webp)
