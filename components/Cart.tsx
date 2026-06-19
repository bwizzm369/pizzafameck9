'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface CartProps {
  onCheckout: () => void
}

export default function Cart({ onCheckout }: CartProps) {
  const items = useCartStore(s => s.items)
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const removeItem = useCartStore(s => s.removeItem)
  const clearCart = useCartStore(s => s.clearCart)
  const itemCount = useCartStore(s => s.itemCount())
  const subtotal = useCartStore(s => s.subtotal())

  const isEmpty = items.length === 0

  return (
    <>
      {/* ─── Desktop sticky sidebar ─────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col sticky top-6 h-fit rounded-2xl overflow-hidden cart-shadow"
        style={{ background: '#242424', border: '1px solid #333333', minWidth: '320px', maxWidth: '360px' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid #333333' }}
        >
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" style={{ color: '#CC2222' }} />
            <span className="font-semibold text-white">Mon panier</span>
            {itemCount > 0 && (
              <span
                className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: '#CC2222', color: '#fff' }}
              >
                {itemCount}
              </span>
            )}
          </div>
          {!isEmpty && (
            <button
              onClick={clearCart}
              className="text-xs flex items-center gap-1 hover:text-white transition-colors"
              style={{ color: '#A0A0A0' }}
            >
              <Trash2 className="w-3 h-3" />
              Vider
            </button>
          )}
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto max-h-[50vh] px-4 py-3 space-y-3">
          <AnimatePresence>
            {isEmpty ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <span className="text-4xl mb-3">🛒</span>
                <p className="text-sm" style={{ color: '#A0A0A0' }}>
                  Votre panier est vide
                </p>
                <p className="text-xs mt-1" style={{ color: '#A0A0A0' }}>
                  Ajoutez des articles du menu
                </p>
              </motion.div>
            ) : (
              items.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                    {item.size && (
                      <p className="text-xs" style={{ color: '#A0A0A0' }}>
                        {item.size === 'moyenne' ? 'Moyenne' : 'Méga'}
                      </p>
                    )}
                    <p className="text-xs font-semibold mt-0.5" style={{ color: '#CC2222' }}>
                      {(item.price * item.quantity).toFixed(2)}€
                    </p>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.size as any, item.quantity - 1)
                      }
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-red-900"
                      style={{ background: '#333333' }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.menuItemId, item.size as any, item.quantity + 1)
                      }
                      className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-red-900"
                      style={{ background: '#333333' }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.menuItemId, item.size as any)}
                      className="w-6 h-6 rounded flex items-center justify-center ml-1 hover:text-red-400 transition-colors"
                      style={{ color: '#A0A0A0' }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-5 py-4" style={{ borderTop: '1px solid #333333' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm" style={{ color: '#A0A0A0' }}>
                Sous-total
              </span>
              <span className="font-bold text-white text-lg">{subtotal.toFixed(2)}€</span>
            </div>
            <button
              onClick={onCheckout}
              className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold"
            >
              Commander <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-xs text-center mt-2" style={{ color: '#A0A0A0' }}>
              Minimum de commande : 10€
            </p>
          </div>
        )}
      </aside>

      {/* ─── Mobile bottom bar ───────────────────────────────── */}
      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-3 bottom-bar-shadow"
            style={{ background: 'rgba(26,26,26,0.97)', backdropFilter: 'blur(12px)', borderTop: '1px solid #333333' }}
          >
            <button
              onClick={onCheckout}
              className="btn-primary w-full py-4 rounded-xl flex items-center justify-between px-5 font-semibold"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span
                  className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  {itemCount}
                </span>
                Voir mon panier
              </span>
              <span className="font-bold text-lg">{subtotal.toFixed(2)}€</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
