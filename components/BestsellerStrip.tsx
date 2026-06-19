'use client'

import { MENU } from '@/lib/menu-data'
import ProductImage from './ProductImage'
import type { MenuItem } from '@/types'

interface BestsellerStripProps {
  onOpen: (item: MenuItem) => void
}

const BESTSELLER_PIZZAS = MENU.filter(
  i => i.category === 'pizzas-tomate' && i.isBestSeller
)

export default function BestsellerStrip({ onOpen }: BestsellerStripProps) {
  return (
    <div className="px-4 pt-5 pb-1">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">⭐</span>
        <h2 className="text-base font-extrabold tracking-tight" style={{ color: '#F5F0E8' }}>Nos incontournables</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {BESTSELLER_PIZZAS.map(item => (
          <button
            key={item.id}
            onClick={() => onOpen(item)}
            className="flex-shrink-0 w-28 text-left rounded-2xl overflow-hidden active:scale-95 transition-transform"
            style={{ background: '#242424', border: '1.5px solid rgba(204,34,34,0.3)', boxShadow: '0 2px 10px rgba(204,34,34,0.1)' }}
          >
            <div className="relative w-full" style={{ height: 76 }}>
              <ProductImage
                itemId={item.id}
                name={item.name}
                category={item.category}
                fill
                className="w-full h-full"
              />
              <div
                className="absolute top-1.5 left-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-white"
                style={{
                  background: '#CC2222',
                  fontSize: 9,
                  fontWeight: 800,
                  boxShadow: '0 1px 4px rgba(204,34,34,0.45)',
                }}
              >
                🔥 Pop.
              </div>
            </div>
            <div className="px-2 py-1.5">
              <p className="text-xs font-bold leading-tight truncate" style={{ color: '#F5F0E8' }}>{item.name}</p>
              <p className="text-xs font-bold mt-0.5" style={{ color: '#CC2222' }}>
                {item.basePrice.toFixed(2)}€
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-1 mb-1 h-px" style={{ background: '#333333' }} />
    </div>
  )
}
