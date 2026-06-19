'use client'

import { useEffect, useState } from 'react'
import { getOpenStatus, type OpenStatus } from '@/lib/suggestions'

export default function StatusBanner() {
  const [status, setStatus] = useState<OpenStatus>('closed')
  const [minutesLeft, setMinutesLeft] = useState<number | undefined>()

  useEffect(() => {
    function update() {
      const res = getOpenStatus(new Date())
      setStatus(res.status)
      setMinutesLeft(res.minutesLeft)
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  if (status === 'closed') return null

  const isClosingSoon = status === 'closing_soon'

  return (
    <div
      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold"
      style={{
        background: isClosingSoon ? 'rgba(204,34,34,0.12)' : 'rgba(34,197,94,0.1)',
        borderBottom: `1px solid ${isClosingSoon ? 'rgba(204,34,34,0.35)' : 'rgba(34,197,94,0.3)'}`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: isClosingSoon ? '#CC2222' : '#16A34A' }}
      />
      {isClosingSoon ? (
        <span style={{ color: '#CC2222' }}>
          Ferme dans {minutesLeft} min · Commandez vite !
        </span>
      ) : (
        <span style={{ color: '#4ADE80' }}>
          Ouvert maintenant · Livraison ~30 min
        </span>
      )}
    </div>
  )
}
