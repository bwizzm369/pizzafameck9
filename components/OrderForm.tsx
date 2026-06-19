'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Package, ChevronDown } from 'lucide-react'
import { ALL_CITIES, getDeliveryFee } from '@/lib/menu-data'
import { useCartStore } from '@/store/cartStore'
import type { OrderFormData, OrderType } from '@/types'

interface OrderFormProps {
  onNext: (data: OrderFormData & { deliveryFee: number }) => void
}

export default function OrderForm({ onNext }: OrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [selectedCity, setSelectedCity] = useState('')
  const subtotal = useCartStore(s => s.subtotal())
  const items = useCartStore(s => s.items)

  const { register, handleSubmit, formState: { errors } } = useForm<OrderFormData>()

  const deliveryFee = orderType === 'delivery' && selectedCity
    ? getDeliveryFee(selectedCity)
    : 0

  const total = subtotal + deliveryFee

  function onSubmit(data: OrderFormData) {
    if (subtotal < 10) return
    onNext({
      ...data,
      orderType,
      city: selectedCity,
      deliveryFee,
    })
  }

  return (
    <section id="order" style={{ background: '#1A1A1A' }} className="py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#CC2222' }}>
            Étape 1
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Votre commande
          </h2>
        </div>

        {/* Order type toggle */}
        <div
          className="flex rounded-xl overflow-hidden mb-8 p-1"
          style={{ background: '#242424', border: '1px solid #333333' }}
        >
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={
              orderType === 'delivery'
                ? { background: '#CC2222', color: '#fff' }
                : { color: '#A0A0A0' }
            }
          >
            🛵 Livraison
          </button>
          <button
            type="button"
            onClick={() => setOrderType('pickup')}
            className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={
              orderType === 'pickup'
                ? { background: '#CC2222', color: '#fff' }
                : { color: '#A0A0A0' }
            }
          >
            🏪 À emporter
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A0A0A0' }}>
              <User className="w-4 h-4 inline mr-1.5" />
              Nom complet *
            </label>
            <input
              {...register('customerName', { required: 'Nom requis' })}
              placeholder="Jean Dupont"
              className="input-field"
            />
            {errors.customerName && (
              <p className="text-xs mt-1" style={{ color: '#CC2222' }}>
                {errors.customerName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#A0A0A0' }}>
              <Phone className="w-4 h-4 inline mr-1.5" />
              Téléphone *
            </label>
            <input
              {...register('phone', {
                required: 'Téléphone requis',
                pattern: { value: /^[0-9+\s]{10,}$/, message: 'Numéro invalide' },
              })}
              placeholder="06 12 34 56 78"
              type="tel"
              className="input-field"
            />
            {errors.phone && (
              <p className="text-xs mt-1" style={{ color: '#CC2222' }}>
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Delivery specific fields */}
          {orderType === 'delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#A0A0A0' }}>
                  <MapPin className="w-4 h-4 inline mr-1.5" />
                  Ville de livraison *
                </label>
                <div className="relative">
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="input-field appearance-none pr-10"
                    required={orderType === 'delivery'}
                  >
                    <option value="">Sélectionner une ville</option>
                    <optgroup label="Zone 1 — 3€">
                      <option>Fameck</option>
                      <option>Sérémange-Erzange</option>
                      <option>Uckange</option>
                      <option>Florange</option>
                    </optgroup>
                    <optgroup label="Zone 2 — 4€">
                      <option>Ranguevaux</option>
                      <option>Saint-Nicolas-en-Forêt</option>
                      <option>Hayange</option>
                      <option>Neufchef</option>
                      <option>Nilvange</option>
                      <option>Gandrange</option>
                      <option>Vitry-sur-Orne</option>
                      <option>Richemont</option>
                    </optgroup>
                  </select>
                  <ChevronDown
                    className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: '#A0A0A0' }}
                  />
                </div>
                {selectedCity && (
                  <p className="text-xs mt-1" style={{ color: '#CC2222' }}>
                    Frais de livraison : {deliveryFee.toFixed(2)}€
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#A0A0A0' }}>
                  Adresse complète *
                </label>
                <input
                  {...register('address', {
                    required: orderType === 'delivery' ? 'Adresse requise' : false,
                  })}
                  placeholder="12 rue de la Paix"
                  className="input-field"
                />
                {errors.address && (
                  <p className="text-xs mt-1" style={{ color: '#CC2222' }}>
                    {errors.address.message}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Order recap */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: '#242424', border: '1px solid #333333' }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: '#A0A0A0' }}>Sous-total</span>
              <span className="text-white font-medium">{subtotal.toFixed(2)}€</span>
            </div>
            {orderType === 'delivery' && selectedCity && (
              <div className="flex justify-between text-sm">
                <span style={{ color: '#A0A0A0' }}>Livraison ({selectedCity})</span>
                <span className="text-white font-medium">{deliveryFee.toFixed(2)}€</span>
              </div>
            )}
            <div
              className="flex justify-between font-bold text-base pt-2"
              style={{ borderTop: '1px solid #333333' }}
            >
              <span className="text-white">Total</span>
              <span style={{ color: '#CC2222' }}>{total.toFixed(2)}€</span>
            </div>
          </div>

          {subtotal < 10 && (
            <p className="text-xs text-center py-2 rounded-lg" style={{ color: '#F5C842', background: 'rgba(245,200,66,0.08)' }}>
              ⚠️ Minimum de commande : 10€ (manque {(10 - subtotal).toFixed(2)}€)
            </p>
          )}

          <button
            type="submit"
            disabled={subtotal < 10}
            className="btn-primary w-full py-4 rounded-xl font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuer vers le paiement →
          </button>
        </form>
      </div>
    </section>
  )
}
