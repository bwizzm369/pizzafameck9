'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Phone, ChevronLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import type { OrderType } from '@/types'

interface SuccessScreenProps {
  customerName: string
  orderType: OrderType
  onReset: () => void
}

export default function SuccessScreen({ customerName, orderType, onReset }: SuccessScreenProps) {
  const clearCart = useCartStore(s => s.clearCart)

  useEffect(() => { clearCart() }, [clearCart])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center" style={{ background: '#1A1A1A' }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(34,197,94,0.12)', border: '3px solid #16A34A' }}
      >
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#F5F0E8' }}>
          Merci {customerName} !
        </h1>
        <p className="mb-8" style={{ color: '#A0A0A0' }}>
          Votre commande est confirmée 🍕<br />
          {orderType === 'delivery'
            ? 'Notre livreur arrive dans 30–45 minutes.'
            : 'Prête dans 20–25 minutes au restaurant.'}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
          <div className="rounded-2xl border p-4 text-center" style={{ borderColor: '#333333', background: '#242424' }}>
            <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: '#CC2222' }} />
            <p className="font-bold text-sm" style={{ color: '#F5F0E8' }}>
              {orderType === 'delivery' ? '30–45 min' : '20–25 min'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>Délai estimé</p>
          </div>
          <div className="rounded-2xl border p-4 text-center" style={{ borderColor: '#333333', background: '#242424' }}>
            <Phone className="w-6 h-6 mx-auto mb-2" style={{ color: '#CC2222' }} />
            <p className="font-bold text-sm" style={{ color: '#F5F0E8' }}>03 82 52 75 18</p>
            <p className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>Nous appeler</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="btn-red w-full max-w-xs py-4 rounded-2xl font-semibold text-base"
        >
          Retour au menu
        </button>
      </motion.div>
    </div>
  )
}
