'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ArrowRight, Gift } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { getCartCrossSells, getBottleOfferProgress } from '@/lib/suggestions'
import { TrustBadges } from '@/components/Footer'
import type { MenuItem, PizzaSize } from '@/types'

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
  onOpenItem?: (item: MenuItem) => void
}

const MIN_ORDER = 10
const BOTTLE_TARGET = 50

export default function CartSheet({ isOpen, onClose, onCheckout, onOpenItem }: CartSheetProps) {
  const items = useCartStore(s => s.items)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const clearCart = useCartStore(s => s.clearCart)
  const addItem = useCartStore(s => s.addItem)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const isEmpty = items.length === 0

  // Minimum order progress (0–10€)
  const minProgress = Math.min((subtotal / MIN_ORDER) * 100, 100)
  const minReached = subtotal >= MIN_ORDER
  const minRemaining = Math.max(0, MIN_ORDER - subtotal)

  // Bottle offer (30–50€)
  const bottle = getBottleOfferProgress(subtotal)

  // Cross-sell suggestions
  const crossSells = getCartCrossSells(items)

  function handleCrossSellAdd(item: MenuItem) {
    const hasSizes = ['pizzas-tomate', 'pizzas-creme', 'burgers'].includes(item.category) && item.megaPrice !== undefined
    if (hasSizes && onOpenItem) {
      onClose()
      onOpenItem(item)
    } else {
      addItem({ menuItemId: item.id, name: item.name, size: undefined, price: item.basePrice })
    }
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
            className="sheet-overlay"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="sheet-panel flex flex-col"
            style={{ maxHeight: '90dvh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: '#333333' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#333333' }}>
              <h2 className="text-lg font-bold" style={{ color: '#F5F0E8' }}>
                Mon panier
                {count > 0 && (
                  <span className="ml-2 text-sm font-normal" style={{ color: '#A0A0A0' }}>
                    ({count} article{count > 1 ? 's' : ''})
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3">
                {!isEmpty && (
                  <button
                    onClick={clearCart}
                    className="text-xs hover:text-red-500 transition-colors flex items-center gap-1"
                    style={{ color: '#A0A0A0' }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Vider
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: '#333333' }}
                >
                  <X className="w-4 h-4" style={{ color: '#A0A0A0' }} />
                </button>
              </div>
            </div>

            {/* ── Barre progression minimum 10€ ── */}
            {!isEmpty && (
              <div className="px-5 pt-4 pb-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-semibold" style={{ color: '#F5F0E8' }}>
                    {minReached ? '✅ Minimum de commande atteint' : `Minimum de commande : 10€`}
                  </span>
                  {!minReached && (
                    <span className="text-xs font-bold" style={{ color: '#CC2222' }}>
                      encore {minRemaining.toFixed(2)}€
                    </span>
                  )}
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#333333' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${minProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: minReached ? '#16A34A' : '#CC2222' }}
                  />
                </div>
              </div>
            )}

            {/* ── Offre bouteille 50€ ── */}
            <AnimatePresence>
              {bottle.show && !isEmpty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-5 pb-3"
                >
                  <div
                    className="rounded-xl p-3"
                    style={{ background: bottle.reached ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${bottle.reached ? 'rgba(34,197,94,0.35)' : 'rgba(245,158,11,0.35)'}` }}
                  >
                    <div className="flex items-start gap-2.5">
                      <Gift className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: bottle.reached ? '#16A34A' : '#F59E0B' }} />
                      <div className="flex-1 min-w-0">
                        {bottle.reached ? (
                          <p className="text-xs font-bold text-green-500">🎉 Bouteille offerte ! Profitez-en</p>
                        ) : (
                          <>
                            <p className="text-xs font-bold text-yellow-500">
                              🍾 Plus que {bottle.remaining.toFixed(2)}€ pour une bouteille offerte !
                            </p>
                            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#333333' }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bottle.progress}%` }}
                                transition={{ duration: 0.5 }}
                                className="h-full rounded-full"
                                style={{ background: '#F59E0B' }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-2 space-y-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="text-5xl mb-4">🛒</span>
                  <p className="font-semibold mb-1" style={{ color: '#F5F0E8' }}>Votre panier est vide</p>
                  <p className="text-sm" style={{ color: '#A0A0A0' }}>Ajoutez des articles depuis le menu</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Qty controls */}
                        <div
                          className="flex items-center gap-2 rounded-full px-1 py-1"
                          style={{ background: '#2A2A2A' }}
                        >
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.size as PizzaSize, item.quantity - 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                          >
                            <Minus className="w-3.5 h-3.5" style={{ color: '#A0A0A0' }} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold" style={{ color: '#F5F0E8' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, item.size as PizzaSize, item.quantity + 1)}
                            className="w-8 h-8 rounded-full btn-red flex items-center justify-center"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
                          {item.size && (
                            <p className="text-xs" style={{ color: '#A0A0A0' }}>
                              {item.size === 'moyenne' ? 'Moyenne' : 'Méga'}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-sm" style={{ color: '#CC2222' }}>
                            {(item.price * item.quantity).toFixed(2)}€
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs" style={{ color: '#A0A0A0' }}>
                              {item.price.toFixed(2)}€/u
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {/* ── Cross-sells ── */}
              {crossSells.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: '#A0A0A0' }}>
                    Vous aimerez aussi
                  </p>
                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                    {crossSells.map(cs => (
                      <button
                        key={cs.id}
                        onClick={() => handleCrossSellAdd(cs)}
                        className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border hover:border-red-500 transition-colors"
                        style={{ minWidth: 140, background: '#242424', borderColor: '#333333' }}
                      >
                        <span className="text-lg">
                          {cs.category.includes('boisson') ? '🥤' : cs.category.includes('accompagnement') ? '🍟' : '🍕'}
                        </span>
                        <div className="text-left min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: '#F5F0E8' }}>{cs.name}</p>
                          <p className="text-xs font-bold" style={{ color: '#CC2222' }}>{cs.basePrice.toFixed(2)}€</p>
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ml-auto" style={{ background: '#CC2222' }}>
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="px-5 py-5 border-t space-y-3" style={{ borderColor: '#333333' }}>
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: '#A0A0A0' }}>Sous-total</span>
                  <span className="font-bold text-lg" style={{ color: '#F5F0E8' }}>{subtotal.toFixed(2)}€</span>
                </div>

                <button
                  onClick={() => { onClose(); onCheckout() }}
                  disabled={subtotal < MIN_ORDER}
                  className="btn-red w-full py-4 rounded-2xl flex items-center justify-between px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="font-semibold text-base">Commander</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{subtotal.toFixed(2)}€</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>

                <p className="text-xs text-center" style={{ color: '#A0A0A0' }}>
                  Frais de livraison calculés à la prochaine étape
                </p>

                <div className="pt-2 border-t" style={{ borderColor: '#333333' }}>
                  <TrustBadges compact />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
