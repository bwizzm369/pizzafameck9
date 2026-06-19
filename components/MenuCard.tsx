'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { MenuItem, PizzaSize } from '@/types'
import { CATEGORY_CONFIG } from '@/lib/category-config'
import ProductImage from './ProductImage'

interface MenuCardProps {
  item: MenuItem
  index: number
  onOpen: (item: MenuItem) => void
  onAdd: (item: MenuItem, size?: PizzaSize) => void
}

const SIZE_CATS = ['pizzas-tomate', 'pizzas-creme', 'burgers']

export default function MenuCard({ item, index, onOpen, onAdd }: MenuCardProps) {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('moyenne')
  const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG['pizzas-tomate']
  const hasSizes = SIZE_CATS.includes(item.category) && item.megaPrice !== undefined
  const isPizza = item.category.startsWith('pizzas')

  function handleSizeClick(e: React.MouseEvent, size: PizzaSize) {
    e.stopPropagation()
    setSelectedSize(size)
  }

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    onAdd(item, hasSizes ? selectedSize : undefined)
  }

  const displayPrice = hasSizes
    ? selectedSize === 'moyenne' ? item.basePrice : item.megaPrice!
    : item.basePrice

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className="menu-card"
      style={item.isBestSeller ? { border: '1.5px solid rgba(204,34,34,0.35)', boxShadow: '0 2px 12px rgba(204,34,34,0.12)' } : undefined}
      onClick={() => onOpen(item)}
    >
      {/* Photo area */}
      <div className="relative w-full" style={{ height: 120 }}>
        <ProductImage
          itemId={item.id}
          name={item.name}
          category={item.category}
          fill
          className="w-full h-full"
        />

        {/* Best-seller badge */}
        {item.isBestSeller && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-full text-white"
            style={{
              background: '#CC2222',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '-0.01em',
              boxShadow: '0 2px 8px rgba(204,34,34,0.5)',
            }}
          >
            🔥 Populaire
          </div>
        )}

        {/* Halal / Végé badges */}
        {!item.isBestSeller && (
          <div className="absolute top-2 left-2 flex gap-1">
            {item.isHalal && <span className="badge-halal">Halal</span>}
            {item.isVegetarian && <span className="badge-veggie">Végé</span>}
          </div>
        )}

        {/* Halal/Végé quand best-seller aussi */}
        {item.isBestSeller && (item.isHalal || item.isVegetarian) && (
          <div className="absolute top-8 left-2 flex gap-1">
            {item.isHalal && <span className="badge-halal">Halal</span>}
            {item.isVegetarian && <span className="badge-veggie">Végé</span>}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5">
        {/* Nom — pas de troncature */}
        <h3 className="font-bold text-sm leading-snug mb-1" style={{ wordBreak: 'break-word', color: '#F5F0E8' }}>
          {item.name}
        </h3>

        {/* Ingrédients — 1 ligne max */}
        {item.ingredients && (
          <p className="text-xs mb-2 truncate" style={{ color: '#A0A0A0' }}>{item.ingredients}</p>
        )}
        {item.note && !item.ingredients && (
          <p className="text-xs mb-2 truncate" style={{ color: '#A0A0A0' }}>{item.note}</p>
        )}

        {hasSizes ? (
          /* ── Sélecteur taille inline ── */
          <div className="space-y-1.5">
            <div className="flex gap-1">
              <button
                onClick={e => handleSizeClick(e, 'moyenne')}
                className="flex-1 py-1.5 rounded-lg text-center transition-all"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: selectedSize === 'moyenne' ? '#CC2222' : '#2A2A2A',
                  color: selectedSize === 'moyenne' ? '#fff' : '#A0A0A0',
                  border: `1.5px solid ${selectedSize === 'moyenne' ? '#CC2222' : '#333333'}`,
                }}
              >
                {isPizza ? 'Moy. 28cm' : 'Seul'}<br />
                {item.basePrice.toFixed(2)}€
              </button>
              <button
                onClick={e => handleSizeClick(e, 'mega')}
                className="flex-1 py-1.5 rounded-lg text-center transition-all"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  lineHeight: 1.2,
                  background: selectedSize === 'mega' ? '#CC2222' : '#2A2A2A',
                  color: selectedSize === 'mega' ? '#fff' : '#A0A0A0',
                  border: `1.5px solid ${selectedSize === 'mega' ? '#CC2222' : '#333333'}`,
                }}
              >
                {isPizza ? 'Méga 38cm' : 'Menu'}<br />
                {item.megaPrice?.toFixed(2)}€
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="btn-red w-full flex items-center justify-center gap-1 py-2 rounded-xl"
              style={{ fontSize: 13 }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              <span className="font-bold">{displayPrice.toFixed(2)}€</span>
            </button>
          </div>
        ) : (
          /* ── Prix simple + bouton + ── */
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold text-sm" style={{ color: '#CC2222' }}>{item.basePrice.toFixed(2)}€</span>
            <button
              onClick={handleAdd}
              className="btn-red w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              aria-label={`Ajouter ${item.name}`}
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
