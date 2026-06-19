'use client'

import { Clock, MapPin, Phone, ShieldCheck } from 'lucide-react'

const TRUST_BADGES = [
  { icon: '✅', text: 'Paiement sécurisé Stripe' },
  { icon: '✅', text: 'Sans commission Uber Eats' },
  { icon: '✅', text: 'Fidélité : 15 pts = 10€ de remise' },
  { icon: '✅', text: 'Livraison locale Fameck & environs' },
]

export function TrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`${compact ? 'flex flex-wrap gap-x-4 gap-y-1 justify-center' : 'grid grid-cols-2 gap-2'}`}>
      {TRUST_BADGES.map(b => (
        <div key={b.text} className="flex items-center gap-1.5">
          <span className="text-green-500 text-sm">{b.icon}</span>
          <span className={`${compact ? 'text-xs' : 'text-xs'}`} style={{ color: '#A0A0A0' }}>{b.text}</span>
        </div>
      ))}
    </div>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A', borderTop: '1px solid #333333' }}>
      {/* Trust badges */}
      <div style={{ background: '#242424', borderBottom: '1px solid #333333' }} className="px-6 py-5">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-center mb-3" style={{ color: '#A0A0A0' }}>Pourquoi commander ici ?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRUST_BADGES.map(b => (
              <div
                key={b.text}
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)' }}
              >
                <span className="text-base">{b.icon}</span>
                <span className="text-xs font-semibold leading-tight text-green-500">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍕</span>
              <div>
                <p className="font-bold" style={{ color: '#F5F0E8' }}>Pizza Club</p>
                <p className="text-xs" style={{ color: '#CC2222' }}>Fameck</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#A0A0A0' }}>
              Pizzas artisanales, burgers généreux et pâtes maison. Livraison ou à emporter.
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <span className="text-yellow-400 text-sm">⭐⭐⭐⭐⭐</span>
              <span className="text-xs font-bold" style={{ color: '#F5F0E8' }}>4.8/5</span>
              <span className="text-xs" style={{ color: '#A0A0A0' }}>· 387 avis</span>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#F5F0E8' }}>
              <Clock className="w-4 h-4" style={{ color: '#CC2222' }} /> Horaires
            </h4>
            <div className="space-y-1.5 text-sm" style={{ color: '#A0A0A0' }}>
              <div className="flex justify-between"><span>Lundi</span><span className="text-red-500">Fermé</span></div>
              <div className="flex justify-between"><span>Mar – Sam</span><span className="font-medium" style={{ color: '#F5F0E8' }}>11h–14h / 18h–22h</span></div>
              <div className="flex justify-between"><span>Dimanche</span><span className="font-medium" style={{ color: '#F5F0E8' }}>18h–22h</span></div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#F5F0E8' }}>
              <Phone className="w-4 h-4" style={{ color: '#CC2222' }} /> Contact
            </h4>
            <div className="space-y-2 text-sm" style={{ color: '#A0A0A0' }}>
              <a href="tel:0382527518" className="flex items-center gap-2 hover:text-red-400 transition-colors">
                <Phone className="w-4 h-4" /> 03 82 52 75 18
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#CC2222' }} />
                <span>1 Boucle des Dinandiers<br />57290 Fameck</span>
              </div>
              <a
                href="https://maps.google.com/?q=1+Boucle+des+Dinandiers+Fameck"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium hover:underline"
                style={{ color: '#CC2222' }}
              >
                Voir sur Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs" style={{ borderTop: '1px solid #333333', color: '#A0A0A0' }}>
          <p>© 2024 Pizza Club Fameck · Tous droits réservés</p>
          <p>Paiement sécurisé par <span className="font-semibold" style={{ color: '#F5F0E8' }}>Stripe</span></p>
        </div>
      </div>
    </footer>
  )
}
