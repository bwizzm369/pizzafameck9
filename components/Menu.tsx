'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MENU, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/menu-data'
import MenuItem from './MenuItem'
import type { MenuCategory } from '@/types'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('pizzas-tomate')
  const tabsRef = useRef<HTMLDivElement>(null)

  const filteredItems = MENU.filter(item => item.category === activeCategory)

  function selectCategory(cat: MenuCategory) {
    setActiveCategory(cat)
    // Smooth scroll to menu section
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="menu" style={{ background: '#1A1A1A' }} className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: '#CC2222' }}
          >
            Notre carte
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-white"
          >
            Le Menu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm mt-3"
            style={{ color: '#A0A0A0' }}
          >
            Ingrédient supplémentaire : Moyenne 1,50€ · Méga 2,50€
          </motion.p>
        </div>

        {/* Category tabs */}
        <div
          ref={tabsRef}
          className="flex gap-1 overflow-x-auto pb-2 mb-8 sticky top-0 z-20 py-3 px-2 -mx-2"
          style={{
            background: 'rgba(26,26,26,0.95)',
            backdropFilter: 'blur(12px)',
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORY_ORDER.map(cat => (
            <button
              key={cat}
              onClick={() => selectCategory(cat as MenuCategory)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeCategory === cat
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
              style={
                activeCategory === cat
                  ? { background: '#CC2222', border: '1px solid #CC2222' }
                  : { background: 'transparent', border: '1px solid #333333' }
              }
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Item count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs" style={{ color: '#A0A0A0' }}>
            {filteredItems.length} article{filteredItems.length > 1 ? 's' : ''}
          </p>
          {(activeCategory === 'pizzas-tomate' || activeCategory === 'pizzas-creme') && (
            <p className="text-xs" style={{ color: '#A0A0A0' }}>
              Moyenne Ø28cm · Méga Ø38cm
            </p>
          )}
        </div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredItems.map((item, i) => (
              <MenuItem key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
