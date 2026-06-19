'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, LogOut, RefreshCw, Clock, CheckCircle2,
  XCircle, Bike, Package, Eye, ChevronDown
} from 'lucide-react'
import type { Order, OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: '#F5C842', icon: <Clock className="w-4 h-4" /> },
  preparing: { label: 'En préparation', color: '#CC2222', icon: <Package className="w-4 h-4" /> },
  ready: { label: 'Prête', color: '#2d7a2d', icon: <CheckCircle2 className="w-4 h-4" /> },
  delivered: { label: 'Livrée', color: '#555', icon: <Bike className="w-4 h-4" /> },
  cancelled: { label: 'Annulée', color: '#ff4444', icon: <XCircle className="w-4 h-4" /> },
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'pizzaclub2024'

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function login(e: React.FormEvent) {
    e.preventDefault()
    if (password === 'pizzaclub2024') {
      setAuthenticated(true)
      loadOrders()
    } else {
      setPasswordError(true)
      setTimeout(() => setPasswordError(false), 2000)
    }
  }

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      if (data.orders) setOrders(data.orders)
    } catch {}
    setLoading(false)
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id)
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)))
    } catch {}
    setUpdatingId(null)
  }

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    total: orders.filter(o => o.status === 'delivered').length,
    revenue: orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total ?? 0), 0),
  }

  if (!authenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: '#1A1A1A' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(204,34,34,0.15)' }}
            >
              <Lock className="w-8 h-8" style={{ color: '#CC2222' }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">Dashboard Admin</h1>
            <p className="text-sm" style={{ color: '#A0A0A0' }}>Pizza Club Fameck</p>
          </div>

          <form
            onSubmit={login}
            className="rounded-2xl p-6 space-y-4"
            style={{ background: '#242424', border: '1px solid #333333' }}
          >
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mot de passe"
              className="input-field"
              autoFocus
            />
            {passwordError && (
              <p className="text-xs" style={{ color: '#ff4444' }}>
                Mot de passe incorrect
              </p>
            )}
            <button
              type="submit"
              className="btn-primary w-full py-3 rounded-xl font-semibold"
            >
              Accéder au dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1A1A1A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(26,26,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #333333' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍕</span>
          <div>
            <h1 className="font-bold text-white text-sm">Pizza Club Fameck</h1>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>Dashboard commandes</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadOrders}
            disabled={loading}
            className="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="btn-ghost px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'En attente', value: stats.pending, color: '#F5C842' },
            { label: 'En préparation', value: stats.preparing, color: '#CC2222' },
            { label: 'Livrées aujourd\'hui', value: stats.total, color: '#2d7a2d' },
            { label: 'CA total', value: `${stats.revenue.toFixed(2)}€`, color: '#A0A0A0' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-xl p-4"
              style={{ background: '#242424', border: '1px solid #333333' }}
            >
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs mt-1" style={{ color: '#A0A0A0' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-12" style={{ color: '#A0A0A0' }}>
              Chargement…
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-12 rounded-2xl" style={{ background: '#242424', border: '1px solid #333333' }}>
              <p style={{ color: '#A0A0A0' }}>Aucune commande pour le moment</p>
            </div>
          )}

          <AnimatePresence>
            {orders.map(order => {
              const statusCfg = STATUS_CONFIG[order.status]
              const isExpanded = expandedId === order.id

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#242424', border: '1px solid #333333' }}
                >
                  {/* Order header */}
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : (order.id ?? null))}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {order.customer_name}
                        </p>
                        <p className="text-xs" style={{ color: '#A0A0A0' }}>
                          {order.phone} ·{' '}
                          {order.order_type === 'delivery' ? `🛵 ${order.city}` : '🏪 À emporter'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5"
                        style={{
                          color: statusCfg.color,
                          background: `${statusCfg.color}20`,
                          border: `1px solid ${statusCfg.color}40`,
                        }}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                      <span className="font-bold text-white">{order.total?.toFixed(2)}€</span>
                      <ChevronDown
                        className="w-4 h-4 transition-transform"
                        style={{
                          color: '#A0A0A0',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ borderTop: '1px solid #333333' }}
                      >
                        <div className="p-5 space-y-4">
                          {/* Items */}
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: '#A0A0A0' }}>
                              ARTICLES
                            </p>
                            <div className="space-y-1">
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-sm">
                                  <span style={{ color: '#A0A0A0' }}>
                                    {item.quantity}× {item.name}
                                    {item.size && ` (${item.size === 'moyenne' ? 'Moy.' : 'Méga'})`}
                                  </span>
                                  <span className="text-white">
                                    {(item.price * item.quantity).toFixed(2)}€
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Status controls */}
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: '#A0A0A0' }}>
                              CHANGER LE STATUT
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                                <button
                                  key={s}
                                  onClick={() => order.id && updateStatus(order.id, s)}
                                  disabled={order.status === s || updatingId === order.id}
                                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                                  style={
                                    order.status === s
                                      ? {
                                          background: `${STATUS_CONFIG[s].color}20`,
                                          color: STATUS_CONFIG[s].color,
                                          border: `1px solid ${STATUS_CONFIG[s].color}`,
                                        }
                                      : {
                                          background: 'transparent',
                                          color: '#A0A0A0',
                                          border: '1px solid #333333',
                                        }
                                  }
                                >
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
