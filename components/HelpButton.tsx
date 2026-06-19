'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { MENU } from '@/lib/menu-data'

interface HelpButtonProps {
  onSearch: (query: string) => void
}

interface Message {
  from: 'bot' | 'user'
  text: string
  items?: { id: string; name: string; price: number; qty: number }[]
}

function getReply(input: string): Message {
  const q = input.toLowerCase()

  // Recherche par nom de pizza
  const exactMatch = MENU.find(m => m.name.toLowerCase() === q)
  if (exactMatch) {
    const item = { id: exactMatch.id, name: exactMatch.name, price: exactMatch.basePrice, qty: 1 }
    return { from: 'bot', text: `🍕 Voici ${exactMatch.name} :`, items: [item] }
  }

  if (q.includes('halal')) {
    const items = MENU.filter(m => m.isHalal).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🍕 Voici nos meilleures options Halal :', items }
  }

  if (q.includes('végé') || q.includes('vegetar') || q.includes('sans viande')) {
    const items = MENU.filter(m => m.isVegetarian).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🥗 Nos options végétariennes :', items }
  }

  if (q.includes('porc') || q.includes('sans porc')) {
    const items = MENU.filter(m => m.isHalal || m.isVegetarian).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🚫 Sans porc, je vous recommande :', items }
  }

  if (q.includes('4 personne') || q.includes('famille') || q.includes('groupe')) {
    const pizzas = MENU.filter(m => m.category === 'pizzas').filter(m => m.isBestSeller).slice(0, 2)
    const boissons = MENU.filter(m => m.category === 'boissons').slice(0, 2)
    const items = [...pizzas, ...boissons].map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '👨‍👩‍👧‍👦 Pour 4 personnes, je suggère :', items }
  }

  if (q.includes('13') || q.includes('budget') || q.includes('pas cher') || q.includes('moins de')) {
    const items = MENU.filter(m => m.basePrice <= 13).sort((a, b) => b.basePrice - a.basePrice).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '💶 Nos meilleures options à moins de 13€ :', items }
  }

  if (q.includes('burger')) {
    const items = MENU.filter(m => m.category === 'burgers').slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🍔 Nos burgers du moment :', items }
  }

  if (q.includes('pizza')) {
    const items = MENU.filter(m => m.category === 'pizzas' && m.isBestSeller).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🍕 Nos pizzas incontournables :', items }
  }

  if (q.includes('boisson') || q.includes('boire') || q.includes('coca') || q.includes('eau')) {
    const items = MENU.filter(m => m.category === 'boissons').slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '🥤 Nos boissons :', items }
  }

  if (q.includes('populaire') || q.includes('best') || q.includes('recommande') || q.includes('conseil')) {
    const items = MENU.filter(m => m.isBestSeller).slice(0, 3).map(m => ({ id: m.id, name: m.name, price: m.basePrice, qty: 1 }))
    return { from: 'bot', text: '⭐ Nos bestsellers du moment :', items }
  }

  return {
    from: 'bot',
    text: 'Je peux vous aider à trouver des pizzas halal, végétariennes, nos bestsellers ou composer un menu. Que cherchez-vous ?'
  }
}

const QUICK_ITEMS = [
  { emoji: '🍕', label: 'Pizzas Halal', query: 'halal' },
  { emoji: '🥗', label: 'Options végétariennes', query: 'végétarien' },
  { emoji: '👨‍👩‍👧‍👦', label: 'Menu pour 4 personnes', query: 'menu pour 4 personnes' },
  { emoji: '💶', label: 'Moins de 13€', query: 'moins de 13€' },
  { emoji: '🚫', label: 'Sans porc', query: 'sans porc' },
]

export default function HelpButton({ onSearch }: HelpButtonProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: '👋 Bonjour ! Je vous aide à trouver ce qu\'il vous faut. Que cherchez-vous ?' }
  ])
  const [input, setInput] = useState('')
  const addItem = useCartStore(s => s.addItem)

  void onSearch

  const addToCart = (items: { id: string; name: string; price: number; qty: number }[]) => {
    items.forEach(item => {
      const menuItem = MENU.find(m => m.id === item.id)
      if (!menuItem) return
      addItem({
        menuItemId: menuItem.id,
        name: menuItem.name,
        size: 'base',
        price: menuItem.basePrice,
        quantity: item.qty,
      })
    })
  }

  const send = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { from: 'user', text }
    const reply = getReply(text)
    setMessages(prev => [...prev, userMsg, reply])
    setInput('')
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed bottom-32 right-4 z-[56] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              style={{ background: '#242424', border: '1px solid #333', width: 300, maxHeight: 460 }}
            >
              {/* Header */}
              <div className="px-4 py-3 flex items-center justify-between shrink-0" style={{ borderBottom: '1px solid #333', background: '#1A1A1A' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#CC2222' }}>🍕</div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#F5F0E8' }}>Assistant Pizza Club</p>
                    <p className="text-xs" style={{ color: '#A0A0A0' }}>Je vous aide à commander</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} style={{ color: '#A0A0A0' }}><X className="w-4 h-4" /></button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 0 }}>
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="rounded-2xl px-3 py-2 text-sm"
                        style={{
                          maxWidth: '85%',
                          ...(msg.from === 'user'
                            ? { background: '#CC2222', color: '#fff' }
                            : { background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #333' })
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>

                    {/* Suggested items */}
                    {msg.items && msg.items.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between px-3 py-2 rounded-xl" style={{ background: '#1A1A1A', border: '1px solid #333' }}>
                            <div>
                              <p className="text-xs font-medium" style={{ color: '#F5F0E8' }}>{item.name}</p>
                              <p className="text-xs" style={{ color: '#A0A0A0' }}>{item.price}€</p>
                            </div>
                            <button
                              onClick={() => addToCart([item])}
                              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                              style={{ background: '#CC2222', color: '#fff' }}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Ajouter
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addToCart(msg.items!)}
                          className="w-full py-1.5 rounded-xl text-xs font-semibold"
                          style={{ background: '#CC2222', color: '#fff' }}
                        >
                          Tout ajouter au panier
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* Quick suggestions — seulement au début */}
                {messages.length === 1 && (
                  <div className="space-y-1.5 pt-1">
                    {QUICK_ITEMS.map(item => (
                      <button
                        key={item.label}
                        onClick={() => send(item.query)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm"
                        style={{ background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #333' }}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 shrink-0" style={{ borderTop: '1px solid #333' }}>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send(input)}
                    placeholder="Posez votre question..."
                    className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: '#1A1A1A', border: '1px solid #444', color: '#F5F0E8' }}
                  />
                  <button
                    onClick={() => send(input)}
                    disabled={!input.trim()}
                    className="rounded-xl px-3 py-2 text-sm font-semibold"
                    style={{ background: '#CC2222', color: '#fff', opacity: !input.trim() ? 0.4 : 1 }}
                  >
                    OK
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bouton flottant */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 right-4 z-[55] flex items-center gap-2 px-4 py-3 rounded-full shadow-xl font-semibold text-sm"
        style={{
          background: open ? '#CC2222' : '#242424',
          color: open ? '#fff' : '#F5F0E8',
          border: '1.5px solid #333333',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? <X className="w-4 h-4" /> : (
          <>
            <MessageCircle className="w-4 h-4" style={{ color: '#CC2222' }} />
            <span>Besoin d&apos;aide ?</span>
          </>
        )}
      </motion.button>
    </>
  )
}
