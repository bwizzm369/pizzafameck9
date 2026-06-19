/**
 * Moteur de suggestions intelligent — cross-sell / upsell / triggers
 * Basé 100% sur menu-data.ts, zéro API externe
 */

import { MENU } from './menu-data'
import type { MenuItem, CartItem } from '@/types'

// ─── Cross-sell rules ────────────────────────────────────────────────────────

const CROSS_SELL_RULES: Record<string, string[]> = {
  'pizzas-tomate': ['bo-02', 'bo-06', 'bo-04'],
  'pizzas-creme':  ['bo-02', 'bo-08', 'bo-04'],
  'burgers':       ['ac-01', 'bo-02', 'bo-06'],
  'pates':         ['bo-08', 'bo-09', 'bo-02'],
  'salades':       ['bo-01', 'bo-02'],
  'accompagnements': ['bo-02', 'bo-06'],
}

const POPULAR_ITEMS = ['pt-04', 'pt-12', 'pt-21', 'pt-17', 'bu-01', 'pa-01']

function getItem(id: string): MenuItem | undefined {
  return MENU.find(m => m.id === id)
}

function crossSellTitle(category: string): string {
  if (category === 'boissons') return '🥤 Ajouter une boisson ?'
  if (category === 'accompagnements') return '🍟 Ajouter des frites ?'
  return 'Ajoutez aussi…'
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SuggestionToast {
  type: 'upsell' | 'cross_sell' | 'offer' | 'rush'
  title: string
  description: string
  cta?: string
  item?: MenuItem
  dismiss?: boolean
}

// ─── Suggestions après ajout d'un item ───────────────────────────────────────

export function getSuggestionsAfterAdd(
  addedItem: MenuItem,
  cartItems: CartItem[],
  selectedSize: 'moyenne' | 'mega' | undefined,
  shownItemIds: Set<string>
): SuggestionToast[] {
  const suggestions: SuggestionToast[] = []
  const cartIds = cartItems.map(i => i.menuItemId)

  // 1. Upsell taille : pizza/burger moyenne → méga
  const isPizza = addedItem.category.startsWith('pizzas')
  const isBurger = addedItem.category === 'burgers'
  if ((isPizza || isBurger) && addedItem.megaPrice && selectedSize === 'moyenne') {
    const diff = (addedItem.megaPrice - addedItem.basePrice).toFixed(2)
    suggestions.push({
      type: 'upsell',
      title: isPizza ? `🍕 Passer en Méga (Ø38cm) ?` : `🍔 Passer en Menu ?`,
      description: isPizza
        ? `+${diff}€ seulement — presque 2× plus grande !`
        : `+${diff}€ · frites ou potatoes + boisson inclus`,
      cta: `Oui, +${diff}€`,
      item: addedItem,
    })
  }

  // 2. Cross-sell — jamais le même item deux fois (shownItemIds)
  const rules = CROSS_SELL_RULES[addedItem.category] ?? []
  const suggId = rules.find(id => !cartIds.includes(id) && !shownItemIds.has(id))
  if (suggId) {
    const suggItem = getItem(suggId)
    if (suggItem) {
      suggestions.push({
        type: 'cross_sell',
        title: crossSellTitle(suggItem.category),
        description: `${suggItem.name} — ${suggItem.basePrice.toFixed(2)}€`,
        cta: 'Oui +',
        item: suggItem,
      })
    }
  }

  return suggestions.slice(0, 1)
}

// ─── Suggestions dans le panier ───────────────────────────────────────────────

export function getCartCrossSells(cartItems: CartItem[]): MenuItem[] {
  const cartIds = new Set(cartItems.map(i => i.menuItemId))
  const categories = new Set(
    cartItems.map(i => {
      const item = MENU.find(m => m.id === i.menuItemId)
      return item?.category ?? ''
    })
  )

  const candidates = new Set<string>()

  categories.forEach(cat => {
    const rules = CROSS_SELL_RULES[cat] ?? []
    rules.forEach(id => { if (!cartIds.has(id)) candidates.add(id) })
  })

  if (!categories.has('pizzas-tomate') && !categories.has('pizzas-creme')) {
    POPULAR_ITEMS.filter(id => !cartIds.has(id)).slice(0, 2).forEach(id => candidates.add(id))
  }

  return [...candidates]
    .map(id => getItem(id))
    .filter(Boolean)
    .slice(0, 3) as MenuItem[]
}

// ─── Trigger offre bouteille ──────────────────────────────────────────────────

export function getBottleOfferProgress(subtotal: number): {
  show: boolean
  progress: number
  remaining: number
  reached: boolean
} {
  const TARGET = 50
  const START = 30
  if (subtotal < START) return { show: false, progress: 0, remaining: TARGET - subtotal, reached: false }
  if (subtotal >= TARGET) return { show: true, progress: 100, remaining: 0, reached: true }

  return {
    show: true,
    progress: Math.round(((subtotal - START) / (TARGET - START)) * 100),
    remaining: parseFloat((TARGET - subtotal).toFixed(2)),
    reached: false,
  }
}

// ─── Recommandations personnalisées depuis historique ─────────────────────────

export function getRecommendations(lastOrderIds: string[]): MenuItem[] {
  if (lastOrderIds.length === 0) return POPULAR_ITEMS.map(id => getItem(id)).filter(Boolean) as MenuItem[]

  const orderedCats = new Set(
    lastOrderIds.map(id => getItem(id)?.category).filter(Boolean) as string[]
  )

  return MENU
    .filter(item => orderedCats.has(item.category) && !lastOrderIds.includes(item.id))
    .slice(0, 6)
}

// ─── Statut d'ouverture ───────────────────────────────────────────────────────

export type OpenStatus = 'open' | 'closing_soon' | 'closed'

export function getOpenStatus(now: Date): { status: OpenStatus; minutesLeft?: number } {
  const day = now.getDay() // 0=Sun, 1=Mon, 2-6=Tue-Sat
  const h = now.getHours()
  const m = now.getMinutes()
  const total = h * 60 + m

  // Lundi fermé
  if (day === 1) return { status: 'closed' }

  // Dimanche : uniquement 18h–22h
  if (day === 0) {
    if (total >= 18 * 60 && total < 22 * 60) {
      const left = 22 * 60 - total
      return left <= 45
        ? { status: 'closing_soon', minutesLeft: left }
        : { status: 'open' }
    }
    return { status: 'closed' }
  }

  // Mar–Sam : 11h–14h et 18h–22h
  const inLunch = total >= 11 * 60 && total < 14 * 60
  const inDinner = total >= 18 * 60 && total < 22 * 60

  if (inLunch) {
    const left = 14 * 60 - total
    return left <= 45 ? { status: 'closing_soon', minutesLeft: left } : { status: 'open' }
  }
  if (inDinner) {
    const left = 22 * 60 - total
    return left <= 45 ? { status: 'closing_soon', minutesLeft: left } : { status: 'open' }
  }
  return { status: 'closed' }
}
