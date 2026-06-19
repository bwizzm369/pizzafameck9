'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import CategoryNav from './CategoryNav'
import MenuCard from './MenuCard'
import ProductModal from './ProductModal'
import CartBar from './CartBar'
import CartSheet from './CartSheet'
import SearchBar from './SearchBar'
import SuggestionToast from './SuggestionToast'
import StatusBanner from './StatusBanner'
import HelpButton from './HelpButton'
import BestsellerStrip from './BestsellerStrip'
import { MENU } from '@/lib/menu-data'
import { MENU_CATEGORIES, CATEGORY_CONFIG } from '@/lib/category-config'
import { useCartStore } from '@/store/cartStore'
import { getSuggestionsAfterAdd } from '@/lib/suggestions'
import type { MenuItem, PizzaSize } from '@/types'
import type { SuggestionToast as SuggestionToastType } from '@/lib/suggestions'

interface MenuPageProps {
  onCheckout: () => void
}

export default function MenuPage({ onCheckout }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0])
  const [modalItem, setModalItem] = useState<MenuItem | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<SuggestionToastType | null>(null)
  const [lastAddedItem, setLastAddedItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const addItem = useCartStore(s => s.addItem)
  const cartItems = useCartStore(s => s.items)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const scrollingTo = useRef(false)
  // Tracks cross-sell item IDs déjà suggérés — jamais la même deux fois
  const shownSuggestions = useRef<Set<string>>(new Set())

  // Intersection Observer for auto-highlight
  useEffect(() => {
    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      entries => {
        if (scrollingTo.current) return
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-category')
            if (cat) setActiveCategory(cat)
          }
        })
      },
      { rootMargin: '-64px 0px -65% 0px', threshold: 0 }
    )
    MENU_CATEGORIES.forEach(cat => {
      const el = document.getElementById(`section-${cat}`)
      if (el) observerRef.current?.observe(el)
    })
    return () => observerRef.current?.disconnect()
  }, [])

  function handleCategorySelect(cat: string) {
    scrollingTo.current = true
    setActiveCategory(cat)
    setTimeout(() => { scrollingTo.current = false }, 800)
  }

  function triggerSuggestion(item: MenuItem, size?: PizzaSize) {
    const suggestions = getSuggestionsAfterAdd(item, cartItems, size, shownSuggestions.current)
    if (suggestions.length > 0) {
      const s = suggestions[0]
      if (s.item) shownSuggestions.current.add(s.item.id)
      setLastAddedItem(item)
      setToast(s)
    }
  }

  function handleAdd(item: MenuItem, size?: PizzaSize) {
    const price = size === 'mega' ? (item.megaPrice ?? item.basePrice) : item.basePrice
    addItem({ menuItemId: item.id, name: item.name, size, price })
    triggerSuggestion(item, size)
  }

  function handleAddFromModal(item: MenuItem, size: PizzaSize | undefined, price: number) {
    addItem({ menuItemId: item.id, name: item.name, size, price })
    setModalItem(null)
    triggerSuggestion(item, size)
  }

  function handleSearch(q: string) {
    setSearchQuery(q)
  }

  return (
    <div className="min-h-screen" style={{ background: '#1A1A1A' }}>
      {/* Category nav */}
      <CategoryNav activeCategory={activeCategory} onSelect={handleCategorySelect} />

      {/* Statut ouverture */}
      <StatusBanner />

      {/* Search bar — controlled */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onAddItem={item => handleAdd(item)}
        onOpenItem={setModalItem}
      />

      {/* Bestsellers strip */}
      <BestsellerStrip onOpen={setModalItem} />

      {/* Menu sections */}
      <div className="pb-36">
        {MENU_CATEGORIES.map(cat => {
          const items = MENU.filter(i => i.category === cat)
          const cfg = CATEGORY_CONFIG[cat]
          if (items.length === 0) return null

          return (
            <section
              key={cat}
              id={`section-${cat}`}
              data-category={cat}
              className="px-4 pt-8 pb-4"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-2xl">{cfg.emoji}</span>
                <h2 className="section-title">{cfg.label}</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {items.map((item, i) => (
                  <MenuCard
                    key={item.id}
                    item={item}
                    index={i}
                    onOpen={setModalItem}
                    onAdd={handleAdd}
                  />
                ))}
              </div>

              {cat === 'pizzas-tomate' && (
                <p className="text-xs mt-3 text-center" style={{ color: '#A0A0A0' }}>
                  Ingrédient supplémentaire : Moyenne 1,50€ · Méga 2,50€
                </p>
              )}
            </section>
          )
        })}
      </div>

      {/* Product modal */}
      <ProductModal item={modalItem} onClose={() => setModalItem(null)} onAdd={handleAddFromModal} />

      {/* Suggestion toast */}
      <SuggestionToast
        suggestion={toast}
        onDismiss={() => setToast(null)}
        onUpsell={() => { if (lastAddedItem) setModalItem(lastAddedItem) }}
      />

      {/* Bouton aide flottant */}
      <HelpButton onSearch={handleSearch} />

      {/* Cart */}
      <CartBar onOpen={() => setCartOpen(true)} />
      <CartSheet
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={onCheckout}
        onOpenItem={setModalItem}
      />
    </div>
  )
}
