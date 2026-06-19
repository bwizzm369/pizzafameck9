'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface ConfirmationProps {
  orderType: 'delivery' | 'pickup'
  customerName: string
  onReset: () => void
}

export default function Confirmation({ orderType, customerName, onReset }: ConfirmationProps) {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <section style={{ background: '#1A1A1A' }} className="min-h-screen flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          className="flex items-center justify-center mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(26, 74, 26, 0.2)', border: '2px solid #1A4A1A' }}
          >
            <CheckCircle2 className="w-12 h-12" style={{ color: '#2d7a2d' }} />
          </div>
        </motion.div>

        {/* Confetti emojis */}
        <div className="absolute pointer-events-none" aria-hidden>
          {['🎉', '🍕', '⭐', '🎊', '🍕'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl"
              initial={{ opacity: 1, y: 0, x: (i - 2) * 60 }}
              animate={{ opacity: 0, y: -200, rotate: (i % 2 === 0 ? 1 : -1) * 360 }}
              transition={{ duration: 1.5, delay: i * 0.1 }}
              style={{ left: '50%' }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="font-display text-4xl font-bold text-white mb-3">
            Merci {customerName} !
          </h2>
          <p className="text-lg mb-2" style={{ color: '#A0A0A0' }}>
            Votre commande est confirmée 🍕
          </p>
          <p className="text-sm mb-8" style={{ color: '#A0A0A0' }}>
            {orderType === 'delivery'
              ? 'Notre livreur est en route vers chez vous.'
              : 'Votre commande sera prête à récupérer très bientôt.'}
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-xl p-4"
              style={{ background: '#242424', border: '1px solid #333333' }}
            >
              <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#CC2222' }} />
              <p className="text-xs font-semibold text-white">
                {orderType === 'delivery' ? '30–45 min' : '20–25 min'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#A0A0A0' }}>
                {orderType === 'delivery' ? 'Délai livraison' : 'Prêt dans'}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: '#242424', border: '1px solid #333333' }}
            >
              <Phone className="w-6 h-6 mx-auto mb-2" style={{ color: '#CC2222' }} />
              <p className="text-xs font-semibold text-white">03 82 52 75 18</p>
              <p className="text-xs mt-1" style={{ color: '#A0A0A0' }}>Nous contacter</p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="btn-primary w-full py-3 rounded-xl font-semibold"
          >
            Passer une nouvelle commande
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
