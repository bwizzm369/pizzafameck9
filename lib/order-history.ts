/**
 * Historique des commandes — 100% localStorage, zéro serveur
 * Stocke les 3 dernières commandes + infos client pré-remplies
 */

import type { CartItem, OrderType } from '@/types'

const HISTORY_KEY = 'pcf_order_history'
const CUSTOMER_KEY = 'pcf_customer'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SavedOrder {
  id: string
  date: string          // ISO string
  items: CartItem[]
  subtotal: number
  total: number
  orderType: OrderType
  city?: string
}

export interface SavedCustomer {
  name: string
  phone: string
  address?: string
  city?: string
  orderType?: OrderType
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

// ─── Historique des commandes ─────────────────────────────────────────────────

export function getOrderHistory(): SavedOrder[] {
  if (!isBrowser()) return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function saveOrder(order: Omit<SavedOrder, 'id' | 'date'>): void {
  if (!isBrowser()) return
  const history = getOrderHistory()
  const newOrder: SavedOrder = {
    ...order,
    id: `${Date.now()}`,
    date: new Date().toISOString(),
  }
  const updated = [newOrder, ...history].slice(0, 3)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function getLastOrderItemIds(): string[] {
  const history = getOrderHistory()
  if (history.length === 0) return []
  return history[0].items.map(i => i.menuItemId)
}

// ─── Infos client (pré-remplissage) ──────────────────────────────────────────

export function getSavedCustomer(): SavedCustomer | null {
  if (!isBrowser()) return null
  try {
    const data = localStorage.getItem(CUSTOMER_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveCustomer(customer: SavedCustomer): void {
  if (!isBrowser()) return
  localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))
}

export function clearCustomer(): void {
  if (!isBrowser()) return
  localStorage.removeItem(CUSTOMER_KEY)
}

// ─── Formatage date pour affichage ──────────────────────────────────────────

export function formatOrderDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
