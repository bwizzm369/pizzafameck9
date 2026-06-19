'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface CartBarProps {
  onOpen: () => void
}

export default function CartBar({ onOpen }: CartBarProps) {
  const items = useCartStore(s => s.items)
  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="cart-bar"
        >
          <button
            onClick={onOpen}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold"
            style={{
              background: '#CC2222',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(204,34,34,0.4)',
            }}
          >
            {/* Gauche : badge + libellé */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ background: '#fff', color: '#CC2222' }}
                >
                  {count}
                </span>
              </div>
              <span className="text-[15px] font-semibold">
                Voir mon panier
              </span>
            </div>

            {/* Droite : total + flèche */}
            <div className="flex items-center gap-2">
              <span className="text-lg font-black">{total.toFixed(2)}€</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
