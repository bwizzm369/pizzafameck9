'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ChevronLeft, ChevronDown, Lock, X, CheckCircle2, Clock, Phone } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { getDeliveryFee } from '@/lib/menu-data'
import { getSavedCustomer, saveCustomer, saveOrder } from '@/lib/order-history'
import type { OrderType } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '')

type CheckoutStep = 'type' | 'info' | 'payment' | 'success'

interface CheckoutFlowProps {
  isOpen: boolean
  onClose: () => void
}

const SLIDE = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.2 },
}

// ─── Step 1 : Order type ───────────────────────────────────────────────────────
function StepType({ onNext }: { onNext: (type: OrderType) => void }) {
  return (
    <motion.div key="type" {...SLIDE} className="px-5 pt-3 pb-8 space-y-4">
      <p className="text-sm mb-2" style={{ color: '#A0A0A0' }}>Choisissez votre mode de réception</p>

      <button
        onClick={() => onNext('delivery')}
        className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 hover:border-red-500 transition-all group text-left"
        style={{ borderColor: '#333333', background: '#242424' }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: 'rgba(204,34,34,0.15)' }}>
          🛵
        </div>
        <div className="flex-1">
          <p className="font-bold" style={{ color: '#F5F0E8' }}>Livraison à domicile</p>
          <p className="text-sm mt-0.5" style={{ color: '#A0A0A0' }}>Zone 1 : 3€ · Zone 2 : 4€ · Min. 10€</p>
        </div>
        <ChevronLeft className="w-5 h-5 rotate-180 group-hover:text-red-500 transition-colors flex-shrink-0" style={{ color: '#555555' }} />
      </button>

      <button
        onClick={() => onNext('pickup')}
        className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 hover:border-red-500 transition-all group text-left"
        style={{ borderColor: '#333333', background: '#242424' }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl" style={{ background: 'rgba(34,197,94,0.12)' }}>
          🏪
        </div>
        <div className="flex-1">
          <p className="font-bold" style={{ color: '#F5F0E8' }}>À emporter</p>
          <p className="text-sm mt-0.5" style={{ color: '#A0A0A0' }}>Récupérez votre commande au restaurant</p>
        </div>
        <ChevronLeft className="w-5 h-5 rotate-180 group-hover:text-red-500 transition-colors flex-shrink-0" style={{ color: '#555555' }} />
      </button>

      <div className="p-4 rounded-2xl" style={{ background: '#242424' }}>
        <p className="text-xs font-semibold mb-1" style={{ color: '#F5F0E8' }}>📍 Restaurant</p>
        <p className="text-sm" style={{ color: '#A0A0A0' }}>1 Boucle des Dinandiers, 57290 Fameck</p>
        <p className="text-sm mt-0.5" style={{ color: '#A0A0A0' }}>📞 03 82 52 75 18</p>
      </div>
    </motion.div>
  )
}

// ─── Step 2 : Customer info ────────────────────────────────────────────────────
interface InfoData {
  customerName: string
  phone: string
  address?: string
  city?: string
}

function StepInfo({
  orderType,
  onNext,
}: {
  orderType: OrderType
  onNext: (data: InfoData & { deliveryFee: number }) => void
}) {
  const saved = getSavedCustomer()
  const [selectedCity, setSelectedCity] = useState(saved?.city ?? '')

  const { register, handleSubmit, formState: { errors } } = useForm<InfoData>({
    defaultValues: {
      customerName: saved?.name ?? '',
      phone: saved?.phone ?? '',
      address: saved?.address ?? '',
    },
  })

  const deliveryFee = orderType === 'delivery' && selectedCity ? getDeliveryFee(selectedCity) : 0

  function onSubmit(data: InfoData) {
    saveCustomer({ name: data.customerName, phone: data.phone, address: data.address, city: selectedCity || undefined, orderType })
    onNext({ ...data, city: selectedCity, deliveryFee })
  }

  return (
    <motion.div key="info" {...SLIDE} className="px-5 pt-3 pb-8">
      <p className="text-sm mb-5" style={{ color: '#A0A0A0' }}>
        {orderType === 'delivery' ? '🛵 Livraison à domicile' : '🏪 À emporter'}
        {saved && <span className="ml-2 text-xs text-green-500 font-medium">✓ Pré-rempli</span>}
      </p>

      <form id="info-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Nom complet</label>
          <input
            {...register('customerName', { required: 'Nom requis' })}
            placeholder="Jean Dupont"
            className="input-field"
          />
          {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Téléphone</label>
          <input
            {...register('phone', {
              required: 'Téléphone requis',
              pattern: { value: /^[0-9+\s]{10,}$/, message: 'Numéro invalide' },
            })}
            placeholder="06 12 34 56 78"
            type="tel"
            className="input-field"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        {orderType === 'delivery' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Ville</label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="input-field appearance-none pr-10"
                  required
                >
                  <option value="">Sélectionner votre ville</option>
                  <optgroup label="Zone 1 — Livraison 3€">
                    <option>Fameck</option>
                    <option>Sérémange-Erzange</option>
                    <option>Uckange</option>
                    <option>Florange</option>
                  </optgroup>
                  <optgroup label="Zone 2 — Livraison 4€">
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
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#A0A0A0' }} />
              </div>
              {selectedCity && (
                <p className="text-xs font-medium mt-1.5" style={{ color: '#CC2222' }}>Frais de livraison : {deliveryFee.toFixed(2)}€</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Adresse complète</label>
              <input
                {...register('address', { required: orderType === 'delivery' ? 'Adresse requise' : false })}
                placeholder="12 rue de la Paix"
                className="input-field"
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
          </motion.div>
        )}

        <button type="submit" className="btn-red w-full py-4 rounded-2xl font-semibold text-base mt-2">
          Continuer vers le paiement →
        </button>
      </form>
    </motion.div>
  )
}

// ─── Step 3 : Payment ──────────────────────────────────────────────────────────
const CARD_OPTS = {
  style: {
    base: {
      color: '#F5F0E8',
      fontFamily: 'Inter, sans-serif',
      fontSize: '15px',
      '::placeholder': { color: '#A0A0A0' },
    },
    invalid: { color: '#CC2222' },
  },
}

function StepPaymentInner({
  orderType, customerName, phone, address, city, deliveryFee, onSuccess,
}: {
  orderType: OrderType
  customerName: string
  phone: string
  address?: string
  city?: string
  deliveryFee: number
  onSuccess: (name: string, orderType: OrderType) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const items = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal + deliveryFee
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100), customerName }),
      })
      const { clientSecret, error: se } = await res.json()
      if (se) throw new Error(se)

      const card = elements.getElement(CardElement)
      if (!card) throw new Error('Erreur carte')

      const { paymentIntent, error: pe } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card, billing_details: { name: customerName } },
      })
      if (pe) throw new Error(pe.message)

      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          phone,
          order_type: orderType,
          address,
          city,
          delivery_fee: deliveryFee,
          items,
          subtotal,
          total,
          status: 'pending',
          stripe_payment_intent_id: paymentIntent?.id,
        }),
      })

      saveOrder({ items, subtotal, total, orderType, city })
      clearCart()
      onSuccess(customerName, orderType)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur de paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 pt-3 pb-8">
      <p className="text-sm mb-4" style={{ color: '#A0A0A0' }}>🔒 Sécurisé par Stripe</p>

      {/* Récapitulatif */}
      <div className="rounded-2xl border p-4 mb-5 space-y-2" style={{ borderColor: '#333333', background: '#242424' }}>
        {items.map(item => (
          <div key={item.id} className="flex justify-between text-sm">
            <span style={{ color: '#A0A0A0' }}>
              {item.quantity}× {item.name}
              {item.size && ` (${item.size === 'moyenne' ? 'Moy.' : 'Méga'})`}
            </span>
            <span className="font-medium" style={{ color: '#F5F0E8' }}>{(item.price * item.quantity).toFixed(2)}€</span>
          </div>
        ))}
        {deliveryFee > 0 && (
          <div className="flex justify-between text-sm">
            <span style={{ color: '#A0A0A0' }}>Livraison</span>
            <span className="font-medium" style={{ color: '#F5F0E8' }}>{deliveryFee.toFixed(2)}€</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: '#333333', color: '#F5F0E8' }}>
          <span>Total</span>
          <span style={{ color: '#CC2222' }}>{total.toFixed(2)}€</span>
        </div>
      </div>

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Informations de carte</label>
          <div className="StripeElement">
            <CardElement options={CARD_OPTS} />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'rgba(204,34,34,0.12)', color: '#ff6b6b' }}>
            ⚠️ {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !stripe}
          className="btn-red w-full py-4 rounded-2xl flex items-center justify-between px-6 disabled:opacity-40"
        >
          <span className="flex items-center gap-2 font-semibold text-base">
            <Lock className="w-4 h-4" />
            {loading ? 'Traitement…' : 'Payer maintenant'}
          </span>
          <span className="font-bold text-xl">{total.toFixed(2)}€</span>
        </button>
      </form>
    </div>
  )
}

// ─── Step 4 : Success ──────────────────────────────────────────────────────────
function StepSuccess({
  customerName,
  orderType,
  onClose,
}: {
  customerName: string
  orderType: OrderType
  onClose: () => void
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="px-5 pt-6 pb-8 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ background: 'rgba(34,197,94,0.12)', border: '3px solid #16A34A' }}
      >
        <CheckCircle2 className="w-10 h-10 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full"
      >
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#F5F0E8' }}>Merci {customerName} !</h2>
        <p className="mb-6 text-sm" style={{ color: '#A0A0A0' }}>
          Votre commande est confirmée 🍕<br />
          {orderType === 'delivery'
            ? 'Notre livreur arrive dans 30–45 minutes.'
            : 'Prête dans 20–25 minutes au restaurant.'}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 w-full">
          <div className="rounded-2xl border p-4 text-center" style={{ borderColor: '#333333', background: '#242424' }}>
            <Clock className="w-5 h-5 mx-auto mb-1.5" style={{ color: '#CC2222' }} />
            <p className="font-bold text-sm" style={{ color: '#F5F0E8' }}>{orderType === 'delivery' ? '30–45 min' : '20–25 min'}</p>
            <p className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>Délai estimé</p>
          </div>
          <div className="rounded-2xl border p-4 text-center" style={{ borderColor: '#333333', background: '#242424' }}>
            <Phone className="w-5 h-5 mx-auto mb-1.5" style={{ color: '#CC2222' }} />
            <p className="font-bold text-sm" style={{ color: '#F5F0E8' }}>03 82 52 75 18</p>
            <p className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>Nous appeler</p>
          </div>
        </div>

        <button onClick={onClose} className="btn-red w-full py-4 rounded-2xl font-semibold text-base">
          Retour au menu
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main CheckoutFlow ─────────────────────────────────────────────────────────
export default function CheckoutFlow({ isOpen, onClose }: CheckoutFlowProps) {
  const [step, setStep] = useState<CheckoutStep>('type')
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [infoData, setInfoData] = useState<(InfoData & { deliveryFee: number }) | null>(null)
  const [successInfo, setSuccessInfo] = useState<{ name: string; orderType: OrderType } | null>(null)

  // Reset to step 1 each time the sheet opens
  useEffect(() => {
    if (isOpen) {
      setStep('type')
      setInfoData(null)
      setSuccessInfo(null)
    }
  }, [isOpen])

  const stepIndex = { type: 0, info: 1, payment: 2, success: 3 }[step]

  function goBack() {
    if (step === 'info') setStep('type')
    else if (step === 'payment') setStep('info')
  }

  function handlePaymentSuccess(name: string, ot: OrderType) {
    setSuccessInfo({ name, orderType: ot })
    setStep('success')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 52 }}
            onClick={step !== 'payment' ? onClose : undefined}
          />

          {/* Sheet */}
          <motion.div
            key="checkout-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            className="fixed bottom-0 left-0 right-0 flex flex-col"
            style={{
              zIndex: 53,
              borderRadius: '24px 24px 0 0',
              maxHeight: '92dvh',
              paddingBottom: 'env(safe-area-inset-bottom)',
              background: '#1A1A1A',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: '#333333' }} />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b flex-shrink-0" style={{ borderColor: '#333333' }}>
              <div className="w-9 flex-shrink-0">
                {(step === 'info' || step === 'payment') && (
                  <button
                    onClick={goBack}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
                    style={{ background: '#242424' }}
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: '#F5F0E8' }} />
                  </button>
                )}
              </div>

              <p className="flex-1 text-center font-bold text-base" style={{ color: '#F5F0E8' }}>
                {step === 'type' && 'Commander'}
                {step === 'info' && 'Vos informations'}
                {step === 'payment' && 'Paiement'}
                {step === 'success' && 'Commande confirmée !'}
              </p>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10 flex-shrink-0"
                style={{ background: '#242424' }}
              >
                <X className="w-4 h-4" style={{ color: '#A0A0A0' }} />
              </button>
            </div>

            {/* Step dots */}
            {step !== 'success' && (
              <div className="flex justify-center gap-2 pt-3 pb-1 flex-shrink-0">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: i === stepIndex ? 24 : 6,
                      background: i === stepIndex ? '#CC2222' : '#333333',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Step content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {step === 'type' && (
                  <StepType onNext={type => { setOrderType(type); setStep('info') }} />
                )}

                {step === 'info' && (
                  <StepInfo
                    orderType={orderType}
                    onNext={data => { setInfoData(data); setStep('payment') }}
                  />
                )}

                {step === 'payment' && infoData && (
                  <motion.div key="payment" {...SLIDE}>
                    <Elements stripe={stripePromise}>
                      <StepPaymentInner
                        orderType={orderType}
                        customerName={infoData.customerName}
                        phone={infoData.phone}
                        address={infoData.address}
                        city={infoData.city}
                        deliveryFee={infoData.deliveryFee}
                        onSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  </motion.div>
                )}

                {step === 'success' && successInfo && (
                  <StepSuccess
                    customerName={successInfo.name}
                    orderType={successInfo.orderType}
                    onClose={onClose}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
