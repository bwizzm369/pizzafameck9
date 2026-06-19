'use client'

import { useEffect, useRef } from 'react'
import { MENU_CATEGORIES, CATEGORY_CONFIG } from '@/lib/category-config'

interface CategoryNavProps {
  activeCategory: string
  onSelect: (cat: string) => void
}

export default function CategoryNav({ activeCategory, onSelect }: CategoryNavProps) {
  const navRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Auto-scroll la pill active au centre
  useEffect(() => {
    const pill = navRef.current?.querySelector(`[data-cat="${activeCategory}"]`) as HTMLElement
    if (!pill) return
    pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeCategory])

  function handleClick(cat: string) {
    onSelect(cat)
    const section = document.getElementById(`section-${cat}`)
    if (!section) return
    const navHeight = (navRef.current?.closest('.cat-nav')?.clientHeight ?? 56) + 40
    const top = section.getBoundingClientRect().top + window.scrollY - navHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav className="cat-nav">
      {/* Wrapper relatif pour le dégradé */}
      <div ref={wrapRef} className="relative">
        <div
          ref={navRef}
          className="flex gap-1.5 px-4 py-2.5 overflow-x-auto no-scrollbar"
        >
          {MENU_CATEGORIES.map(cat => {
            const cfg = CATEGORY_CONFIG[cat]
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                data-cat={cat}
                onClick={() => handleClick(cat)}
                className="flex-shrink-0 flex items-center gap-1 rounded-full font-semibold whitespace-nowrap transition-all"
                style={{
                  fontSize: 13,
                  padding: '6px 12px',
                  background: isActive ? '#CC2222' : '#242424',
                  color: isActive ? '#fff' : '#A0A0A0',
                  border: `1.5px solid ${isActive ? '#CC2222' : '#333333'}`,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <span style={{ fontSize: 14 }}>{cfg.emoji}</span>
                {cfg.label}
              </button>
            )
          })}
        </div>

        {/* Dégradé droit → indique que ça scroll */}
        <div
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
          style={{
            width: 40,
            background: 'linear-gradient(to right, transparent, rgba(26,26,26,0.97))',
          }}
        />
      </div>
    </nav>
  )
}
