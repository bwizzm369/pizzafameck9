'use client'

import { Clock, Truck, Star } from 'lucide-react'

export default function InfoBand() {
  return (
    <section className="border-b px-4 py-5" style={{ background: '#1A1A1A', borderColor: '#333333' }}>
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(204,34,34,0.12)' }}>
            <Clock className="w-4 h-4" style={{ color: '#CC2222' }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#F5F0E8' }}>Mar–Sam</p>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>11h–14h · 18h–22h</p>
          </div>
        </div>

        <div className="w-px h-8 hidden sm:block" style={{ background: '#333333' }} />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(204,34,34,0.12)' }}>
            <Truck className="w-4 h-4" style={{ color: '#CC2222' }} />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#F5F0E8' }}>Livraison</p>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>Zone 1 : 3€ · Zone 2 : 4€</p>
          </div>
        </div>

        <div className="w-px h-8 hidden sm:block" style={{ background: '#333333' }} />

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(245,200,66,0.12)' }}>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-xs font-bold" style={{ color: '#F5F0E8' }}>Carte fidélité</p>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>15 pts = 10€ de remise</p>
          </div>
        </div>

        <div className="w-px h-8 hidden sm:block" style={{ background: '#333333' }} />

        <div className="flex items-center gap-2.5">
          <span className="text-xl">📞</span>
          <div>
            <p className="text-xs font-bold" style={{ color: '#F5F0E8' }}>03 82 52 75 18</p>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>Fameck</p>
          </div>
        </div>
      </div>
    </section>
  )
}
