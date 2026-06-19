'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, PizzaSize } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeItem: (menuItemId: string, size?: PizzaSize) => void
  updateQuantity: (menuItemId: string, size: PizzaSize | undefined, quantity: number) => void
  clearCart: () => void
  itemCount: () => number
  subtotal: () => number
}

function makeId(menuItemId: string, size?: PizzaSize) {
  return size ? `${menuItemId}-${size}` : menuItemId
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const id = makeId(item.menuItemId, item.size)
        set(state => {
          const existing = state.items.find(i => i.id === id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...item, id, quantity: 1 }] }
        })
      },

      removeItem: (menuItemId, size) => {
        const id = makeId(menuItemId, size)
        set(state => ({ items: state.items.filter(i => i.id !== id) }))
      },

      updateQuantity: (menuItemId, size, quantity) => {
        const id = makeId(menuItemId, size)
        if (quantity <= 0) {
          set(state => ({ items: state.items.filter(i => i.id !== id) }))
        } else {
          set(state => ({
            items: state.items.map(i => i.id === id ? { ...i, quantity } : i),
          }))
        }
      },

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'pizza-club-cart' }
  )
)
