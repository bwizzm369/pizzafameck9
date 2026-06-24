'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'
import { IMAGES } from '@/lib/images-config'

interface HeroProps {
  onOrderClick: () => void
}

export default function Hero({ onOrderClick }: HeroProps) {
  return (
    <section
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: 'clamp(280px, 40vh, 320px)', background: '#1A1A1A' }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${IMAGES.hero}')` }}
      />
      <div className="hero-overlay absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        <motion.img
          src={IMAGES.logo}
          alt="Pizza Club Fameck"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            width: 'clamp(150px, 50vw, 200px)',
            height: 'auto',
            objectFit: 'contain',
            marginBottom: '1.5rem',
          }}
        />

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
          onClick={onOrderClick}
          className="btn-red px-8 py-3.5 rounded-full text-base font-bold shadow-xl mb-3"
          style={{ boxShadow: '0 6px 24px rgba(204,34,34,0.45)' }}
        >
          Commander maintenant
        </motion.button>

        {/* Avis Google */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
            <span className="text-yellow-400 text-sm leading-none">⭐⭐⭐⭐⭐</span>
            <span className="text-white font-bold text-sm">4.8/5</span>
            <span className="text-white/60 text-xs">· 387 avis Google</span>
          </div>

          <div className="flex items-center gap-1 text-white/60 text-xs mt-1">
            <span>🎁</span>
            <span className="font-medium text-white/80">Ce soir : +10 points fidélité sur votre commande</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mt-3 text-xs text-white/50"
        >
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Mar–Sam 11h–14h / 18h–22h
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Fameck
          </span>
        </motion.div>
      </div>
    </section>
  )
}
