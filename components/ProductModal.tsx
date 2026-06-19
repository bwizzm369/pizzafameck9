'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart } from 'lucide-react'
import type { MenuItem, PizzaSize } from '@/types'
import { CATEGORY_CONFIG } from '@/lib/category-config'
import ProductImage from './ProductImage'

interface ProductModalProps {
  item: MenuItem | null
  onClose: () => void
  onAdd?: (item: MenuItem, size: PizzaSize | undefined, price: number) => void
}

const PIZZA_CATS = ['pizzas-tomate', 'pizzas-creme']

export default function ProductModal({ item, onClose, onAdd }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('moyenne')

  const isOpen = !!item

  if (!item) return null

  const cfg = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG['pizzas-tomate']
  const isPizza = PIZZA_CATS.includes(item.category)
  const isBurger = item.category === 'burgers'
  const hasSizes = (isPizza || isBurger) && item.megaPrice !== undefined

  const currentPrice = hasSizes
    ? selectedSize === 'moyenne' ? item.basePrice : item.megaPrice!
    : item.basePrice

  function handleAdd() {
    if (onAdd) {
      onAdd(item!, hasSizes ? selectedSize : undefined, currentPrice)
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sheet-overlay"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="sheet-panel"
          >
            {/* Photo */}
            <div className="relative w-full" style={{ height: 240 }}>
              <ProductImage
                itemId={item.id}
                name={item.name}
                category={item.category}
                fill
                height={240}
                className="w-full h-full"
                priority
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm hover:bg-black/40 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" strokeWidth={2.5} />
              </button>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-1.5 z-10">
                {item.isHalal && <span className="badge-halal">Halal</span>}
                {item.isVegetarian && <span className="badge-veggie">Végétarien</span>}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pb-safe">
              <h2 className="text-2xl font-bold mb-2 leading-tight" style={{ color: '#F5F0E8' }}>
                {item.name}
              </h2>

              {item.ingredients && (
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#A0A0A0' }}>
                  {item.ingredients}
                </p>
              )}

              {item.note && (
                <p className="text-xs italic mb-4" style={{ color: '#A0A0A0' }}>{item.note}</p>
              )}

              {/* Size options */}
              {hasSizes && (
                <div className="mb-6">
                  <p className="text-sm font-semibold mb-3" style={{ color: '#F5F0E8' }}>
                    Choisir la taille
                  </p>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setSelectedSize('moyenne')}
                      className={`size-option ${selectedSize === 'moyenne' ? 'selected' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: selectedSize === 'moyenne' ? '#CC2222' : '#555555' }}
                          >
                            {selectedSize === 'moyenne' && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#CC2222' }} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>
                              {isPizza ? 'Moyenne' : 'Seul'}
                            </p>
                            <p className="text-xs" style={{ color: '#A0A0A0' }}>
                              {isPizza ? 'Ø 28 cm' : 'Sans accompagnement'}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold" style={{ color: '#CC2222' }}>
                          {item.basePrice.toFixed(2)}€
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedSize('mega')}
                      className={`size-option ${selectedSize === 'mega' ? 'selected' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: selectedSize === 'mega' ? '#CC2222' : '#555555' }}
                          >
                            {selectedSize === 'mega' && (
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#CC2222' }} />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>
                              {isPizza ? 'Méga' : 'Menu'}
                            </p>
                            <p className="text-xs" style={{ color: '#A0A0A0' }}>
                              {isPizza ? 'Ø 38 cm' : 'Frites ou potatoes + boisson'}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold" style={{ color: '#CC2222' }}>
                          {item.megaPrice!.toFixed(2)}€
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className="btn-red w-full py-4 rounded-2xl flex items-center justify-between px-6 text-base"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </span>
                <span className="font-bold text-lg">{currentPrice.toFixed(2)}€</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
