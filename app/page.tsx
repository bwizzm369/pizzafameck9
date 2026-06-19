'use client'

import { useState, useRef } from 'react'
import Hero from '@/components/Hero'
import InfoBand from '@/components/InfoBand'
import MenuPage from '@/components/MenuPage'
import CheckoutFlow from '@/components/CheckoutFlow'
import Footer from '@/components/Footer'

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  function scrollToMenu() {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main>
      <Hero onOrderClick={scrollToMenu} />
      <InfoBand />
      <div ref={menuRef}>
        <MenuPage onCheckout={() => setCheckoutOpen(true)} />
      </div>
      <Footer />

      <CheckoutFlow isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </main>
  )
}
