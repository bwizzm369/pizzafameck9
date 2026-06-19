'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { searchMenu, QUICK_SEARCHES } from '@/lib/search'
import type { MenuItem } from '@/types'
import ProductImage from './ProductImage'

interface SearchBarProps {
  value: string
  onChange: (q: string) => void
  onAddItem: (item: MenuItem) => void
  onOpenItem: (item: MenuItem) => void
}

export default function SearchBar({ value, onChange, onAddItem, onOpenItem }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  const results = value.trim().length >= 2 ? searchMenu(value) : []
  const showChips = isFocused && value.length === 0
  const showResults = results.length > 0
  const showNoResults = value.trim().length >= 2 && results.length === 0

  function clear() {
    onChange('')
    inputRef.current?.blur()
  }

  function handleQuickSearch(q: string) {
    onChange(q)
    inputRef.current?.focus()
  }

  function handleAdd(e: React.MouseEvent, item: MenuItem) {
    e.stopPropagation()
    const hasSizes = ['pizzas-tomate', 'pizzas-creme', 'burgers'].includes(item.category) && item.megaPrice !== undefined
    if (hasSizes) {
      onOpenItem(item)
    } else {
      onAddItem(item)
    }
    clear()
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') clear()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative px-4 pb-3 pt-2 z-20" style={{ background: '#1A1A1A', borderBottom: '1px solid #333333' }}>
      {/* Input */}
      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          style={{ color: '#CC2222' }}
        />
        <input
          id="search-input"
          ref={inputRef}
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder="Rechercher une pizza, un ingrédient…"
          style={{
            fontSize: 16,
            background: '#242424',
            border: '2px solid',
            borderColor: isFocused ? '#CC2222' : '#333333',
            borderRadius: 14,
            padding: '11px 40px 11px 44px',
            outline: 'none',
            color: '#F5F0E8',
            transition: 'border-color 0.2s',
            fontFamily: 'Inter, sans-serif',
            width: '100%',
          }}
        />
        {value.length > 0 && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: '#333333' }}
          >
            <X className="w-3.5 h-3.5" style={{ color: '#A0A0A0' }} />
          </button>
        )}
      </div>

      {/* Quick chips */}
      <AnimatePresence>
        {showChips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 pt-2.5 overflow-x-auto no-scrollbar">
              {QUICK_SEARCHES.map(qs => (
                <button
                  key={qs.query}
                  onMouseDown={() => handleQuickSearch(qs.query)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                  style={{ background: 'rgba(204,34,34,0.12)', color: '#CC2222', border: '1px solid rgba(204,34,34,0.35)' }}
                >
                  {qs.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-4 right-4 top-full mt-1 rounded-2xl shadow-xl overflow-hidden"
            style={{ background: '#242424', border: '1px solid #333333', zIndex: 100 }}
          >
            <div className="max-h-72 overflow-y-auto">
              {results.map(({ item }) => {
                const hasSizes =
                  ['pizzas-tomate', 'pizzas-creme', 'burgers'].includes(item.category) &&
                  item.megaPrice !== undefined
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b last:border-0"
                    style={{ borderColor: '#2A2A2A' }}
                    onClick={e => handleAdd(e, item)}
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                      <ProductImage
                        itemId={item.id}
                        name={item.name}
                        category={item.category}
                        height={44}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="font-semibold text-sm truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
                        {item.isHalal && <span className="badge-halal">Halal</span>}
                        {item.isVegetarian && <span className="badge-veggie">Végé</span>}
                      </div>
                      {item.ingredients && (
                        <p className="text-xs truncate" style={{ color: '#A0A0A0' }}>{item.ingredients}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="font-bold text-sm" style={{ color: '#CC2222' }}>{item.basePrice.toFixed(2)}€</p>
                        {hasSizes && (
                          <p className="text-xs" style={{ color: '#A0A0A0' }}>–{item.megaPrice?.toFixed(2)}€</p>
                        )}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: '#CC2222' }}
                      >
                        <span className="text-white font-bold text-lg leading-none">+</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="px-4 py-2" style={{ background: '#1A1A1A', borderTop: '1px solid #333333' }}>
              <p className="text-xs" style={{ color: '#A0A0A0' }}>
                {results.length} résultat{results.length > 1 ? 's' : ''} · Échap pour fermer
              </p>
            </div>
          </motion.div>
        )}

        {showNoResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-4 right-4 top-full mt-1 rounded-2xl shadow-lg px-4 py-5 text-center"
            style={{ background: '#242424', border: '1px solid #333333', zIndex: 100 }}
          >
            <p className="text-2xl mb-1">🔍</p>
            <p className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>Aucun résultat</p>
            <p className="text-xs mt-0.5" style={{ color: '#A0A0A0' }}>Essayez : halal, végétarien, chorizo…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
