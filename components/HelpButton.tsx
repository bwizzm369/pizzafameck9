'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { MENU } from '@/lib/menu-data'

interface HelpButtonProps {
  onSearch: (query: string) => void
}

interface SuggestedItem {
  id: string
  name: string
  price: number
  qty: number
}

interface Message {
  from: 'bot' | 'user'
  text: string
  items?: SuggestedItem[]
}

function categoryIncludes(category: unknown, value: string) {
  return String(category).toLowerCase().includes(value)
}

function toSuggestedItems(items: typeof MENU, limit = 3): SuggestedItem[] {
  return items.slice(0, limit).map(m => ({
    id: m.id,
    name: m.name,
    price: m.basePrice,
    qty: 1,
  }))
}

function getReply(input: string): Message {
  const q = input.toLowerCase().trim()

  const exactMatch = MENU.find(m => m.name.toLowerCase() === q)
  if (exactMatch) {
    return {
      from: 'bot',
      text: `🍕 Voici ${exactMatch.name} :`,
      items: toSuggestedItems([exactMatch], 1),
    }
  }

  if (q.includes('halal')) {
    return {
      from: 'bot',
      text: '🍕 Voici nos meilleures options Halal :',
      items: toSuggestedItems(MENU.filter(m => m.isHalal)),
    }
  }

  if (q.includes('végé') || q.includes('vegetar') || q.includes('sans viande')) {
    return {
      from: 'bot',
      text: '🥗 Nos options végétariennes :',
      items: toSuggestedItems(MENU.filter(m => m.isVegetarian)),
    }
  }

  if (q.includes('porc') || q.includes('sans porc')) {
    return {
      from: 'bot',
      text: '🚫 Sans porc, je vous recommande :',
      items: toSuggestedItems(MENU.filter(m => m.isHalal || m.isVegetarian)),
    }
  }

  if (q.includes('4 personne') || q.includes('famille') || q.includes('groupe')) {
    const items = MENU.filter(
      m => categoryIncludes(m.category, 'pizza') || categoryIncludes(m.category, 'boisson')
    )

    return {
      from: 'bot',
      text: '👨‍👩‍👧‍👦 Pour 4 personnes, je suggère :',
      items: toSuggestedItems(items, 6),
    }
  }

  if (q.includes('burger')) {
    return {
      from: 'bot',
      text: '🍔 Nos burgers du moment :',
      items: toSuggestedItems(MENU.filter(m => categoryIncludes(m.category, 'burger'))),
    }
  }

  if (q.includes('pizza')) {
    return {
      from: 'bot',
      text: '🍕 Nos pizzas incontournables :',
      items: toSuggestedItems(
        MENU.filter(m => categoryIncludes(m.category, 'pizza') && m.isBestSeller)
      ),
    }
  }

  if (q.includes('boisson') || q.includes('boire') || q.includes('coca') || q.includes('eau')) {
    return {
      from: 'bot',
      text: '🥤 Nos boissons :',
      items: toSuggestedItems(MENU.filter(m => categoryIncludes(m.category, 'boisson'))),
    }
  }

  if (q.includes('populaire') || q.includes('best') || q.includes('recommande') || q.includes('conseil')) {
    return {
      from: 'bot',
      text: '⭐ Nos bestsellers du moment :',
      items: toSuggestedItems(MENU.filter(m => m.isBestSeller)),
    }
  }

  if (q.includes('13') || q.includes('moins cher') || q.includes('pas cher')) {
    const items = [...MENU]
      .filter(m => m.basePrice <= 13)
      .sort((a, b) => b.basePrice - a.basePrice)

    return {
      from: 'bot',
      text: '💶 Nos meilleures options à moins de 13€ :',
      items: toSuggestedItems(items),
    }
  }

  return {
    from: 'bot',
    text: 'Je peux vous aider à trouver des pizzas halal, végétariennes, nos bestsellers ou composer un menu. Que cherchez-vous ?',
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
    { from: 'bot', text: "👋 Bonjour ! Je vous aide à trouver ce qu'il vous faut. Que cherchez-vous ?" },
  ])
  const [input, setInput] = useState('')
  const addItem = useCartStore(s => s.addItem)

  const addToCart = (items: SuggestedItem[]) => {
    items.forEach(item => {
      const menuItem = MENU.find(m => m.id === item.id)
      if (!menuItem) return

      for (let i = 0; i < item.qty; i += 1) {
        addItem({
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.basePrice,
        })
      }
    })
  }

  const send = (text: string) => {
    if (!text.trim()) return

    const reply = getReply(text)

    setMessages(prev => [
      ...prev,
      { from: 'user', text },
      reply,
    ])

    onSearch(text)
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
              className="fixed bottom-32 right-4 z-[56] flex max-h-[460px] w-[300px] flex-col overflow-hidden rounded-2xl shadow-2xl"
              style={{ background: '#242424', border: '1px solid #333' }}
            >
              <div className="flex shrink-0 items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #333', background: '#1A1A1A' }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: '#CC2222' }}>🍕</div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>Assistant Pizza Club</p>
                    <p className="text-xs" style={{ color: '#A0A0A0' }}>Je vous aide à commander</p>
                  </div>
                </div>

                <button type="button" onClick={() => setOpen(false)} style={{ color: '#A0A0A0' }}>
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-3">
                {messages.map((msg, i) => (
                  <div key={`${msg.from}-${i}`}>
                    <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className="rounded-2xl px-3 py-2 text-sm"
                        style={{
                          maxWidth: '85%',
                          ...(msg.from === 'user'
                            ? { background: '#CC2222', color: '#fff' }
                            : { background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #333' }),
                        }}
                      >
                        {msg.text}
                      </div>
                    </div>

                    {msg.items && msg.items.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {msg.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: '#1A1A1A', border: '1px solid #333' }}>
                            <div>
                              <p className="text-xs font-medium" style={{ color: '#F5F0E8' }}>{item.name}</p>
                              <p className="text-xs" style={{ color: '#A0A0A0' }}>{item.price}€</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => addToCart([item])}
                              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold"
                              style={{ background: '#CC2222', color: '#fff' }}
                            >
                              <ShoppingCart className="h-3 w-3" />
                              Ajouter
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addToCart(msg.items ?? [])}
                          className="w-full rounded-xl py-1.5 text-xs font-semibold"
                          style={{ background: '#CC2222', color: '#fff' }}
                        >
                          Tout ajouter au panier
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="space-y-1.5 pt-1">
                    {QUICK_ITEMS.map(item => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => send(item.query)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm"
                        style={{ background: '#1A1A1A', color: '#F5F0E8', border: '1px solid #333' }}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="shrink-0 p-3" style={{ borderTop: '1px solid #333' }}>
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') send(input)
                    }}
                    placeholder="Posez votre question..."
                    className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                    style={{ background: '#1A1A1A', border: '1px solid #444', color: '#F5F0E8' }}
                  />

                  <button
                    type="button"
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

      <motion.button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-24 right-4 z-[55] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-xl"
        style={{
          background: open ? '#CC2222' : '#242424',
          color: open ? '#fff' : '#F5F0E8',
          border: '1.5px solid #333333',
          boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
        }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <X className="h-4 w-4" />
        ) : (
          <>
            <MessageCircle className="h-4 w-4" style={{ color: '#CC2222' }} />
            <span>Besoin d&apos;aide ?</span>
          </>
        )}
      </motion.button>
    </>
  )
}