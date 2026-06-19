'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { SuggestionToast as SuggestionToastType } from '@/lib/suggestions'
import { useCartStore } from '@/store/cartStore'

interface SuggestionToastProps {
  suggestion: SuggestionToastType | null
  onDismiss: () => void
  onUpsell?: () => void
}

const COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  upsell:     { bg: '#242424', accent: '#F59E0B', text: '#F5F0E8' },
  cross_sell: { bg: '#242424', accent: '#16A34A', text: '#F5F0E8' },
  offer:      { bg: '#242424', accent: '#CC2222', text: '#F5F0E8' },
  rush:       { bg: '#242424', accent: '#2563EB', text: '#F5F0E8' },
}

export default function SuggestionToast({ suggestion, onDismiss, onUpsell }: SuggestionToastProps) {
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    if (!suggestion) return
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [suggestion, onDismiss])

  function handleYes() {
    if (!suggestion) return
    if (suggestion.type === 'upsell' && onUpsell) {
      onUpsell()
    } else if (suggestion.type === 'cross_sell' && suggestion.item) {
      addItem({
        menuItemId: suggestion.item.id,
        name: suggestion.item.name,
        size: undefined,
        price: suggestion.item.basePrice,
      })
    }
    onDismiss()
  }

  const col = COLORS[suggestion?.type ?? 'cross_sell']

  return (
    <AnimatePresence>
      {suggestion && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="fixed bottom-[88px] left-4 right-4 z-[60] rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: col.bg, border: `1.5px solid ${col.accent}30` }}
        >
          {/* Content */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight" style={{ color: col.text }}>
                  {suggestion.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: `${col.text}99` }}>
                  {suggestion.description}
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${col.accent}20` }}
              >
                <X className="w-3.5 h-3.5" style={{ color: col.accent }} />
              </button>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleYes}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: col.accent }}
              >
                {suggestion.cta ?? 'Oui +'}
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: `${col.accent}15`, color: col.text }}
              >
                Non merci
              </button>
            </div>
          </div>

          {/* Barre de progression auto-dismiss */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-1 origin-left"
            style={{ background: col.accent }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
