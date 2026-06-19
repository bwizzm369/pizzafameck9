'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { MenuItem as MenuItemType, PizzaSize } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface MenuItemProps {
  item: MenuItemType
  index: number
}

const PIZZA_CATEGORIES = ['pizzas-tomate', 'pizzas-creme']

export default function MenuItem({ item, index }: MenuItemProps) {
  const isPizza = PIZZA_CATEGORIES.includes(item.category)
  const isBurger = item.category === 'burgers'
  const hasSizes = (isPizza || isBurger) && item.megaPrice !== undefined

  const [selectedSize, setSelectedSize] = useState<PizzaSize>('moyenne')
  const addItem = useCartStore(s => s.addItem)

  const currentPrice = hasSizes
    ? selectedSize === 'moyenne' ? item.basePrice : item.megaPrice!
    : item.basePrice

  const sizeLabel = isPizza
    ? selectedSize === 'moyenne' ? 'Ø28cm' : 'Ø38cm'
    : selectedSize === 'moyenne' ? 'Seul' : 'Menu'

  function handleAdd() {
    addItem({
      menuItemId: item.id,
      name: item.name,
      size: hasSizes ? selectedSize : undefined,
      price: currentPrice,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className="card-glow rounded-xl p-4 flex flex-col gap-3 relative"
      style={{ background: '#242424' }}
    >
      {/* Badges */}
      {(item.isHalal || item.isVegetarian) && (
        <div className="flex gap-1.5 absolute top-3 right-3">
          {item.isHalal && <span className="badge-halal">Halal</span>}
          {item.isVegetarian && <span className="badge-veggie">🌿</span>}
        </div>
      )}

      {/* Name & ingredients */}
      <div className="pr-12">
        <h3 className="font-semibold text-white text-sm leading-tight mb-1">
          {item.name}
        </h3>
        {item.ingredients && (
          <p className="text-xs leading-relaxed" style={{ color: '#A0A0A0' }}>
            {item.ingredients}
          </p>
        )}
        {item.note && (
          <p className="text-xs mt-1 italic" style={{ color: '#A0A0A0' }}>
            {item.note}
          </p>
        )}
      </div>

      {/* Size selector */}
      {hasSizes && (
        <div className="flex gap-2">
          <button
            className={`size-btn ${selectedSize === 'moyenne' ? 'active' : ''}`}
            onClick={() => setSelectedSize('moyenne')}
          >
            {isPizza ? 'Moyenne' : 'Seul'} — {item.basePrice.toFixed(2)}€
          </button>
          <button
            className={`size-btn ${selectedSize === 'mega' ? 'active' : ''}`}
            onClick={() => setSelectedSize('mega')}
          >
            {isPizza ? 'Méga' : 'Menu'} — {item.megaPrice!.toFixed(2)}€
          </button>
        </div>
      )}

      {/* Price + Add button */}
      <div className="flex items-center justify-between mt-auto">
        <div>
          <span className="text-lg font-bold" style={{ color: '#CC2222' }}>
            {currentPrice.toFixed(2)}€
          </span>
          {hasSizes && (
            <span className="text-xs ml-1" style={{ color: '#A0A0A0' }}>
              / {sizeLabel}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className="btn-primary w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          aria-label={`Ajouter ${item.name} au panier`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
