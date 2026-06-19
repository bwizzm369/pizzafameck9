'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getProductImage } from '@/lib/images-config'
import type { MenuCategory } from '@/types'

interface ProductImageProps {
  itemId: string
  name: string
  category: MenuCategory
  fill?: boolean
  height?: number
  className?: string
  priority?: boolean
}

export default function ProductImage({
  itemId,
  name,
  fill = false,
  height = 130,
  className = '',
  priority = false,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false)
  const src = getProductImage(itemId)

  // Placeholder uniforme : fond noir + nom produit en blanc
  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 select-none ${className}`}
        style={{
          background: '#242424',
          height: fill ? '100%' : height,
          width: '100%',
        }}
      >
        <span
          className="text-white font-bold text-center leading-tight px-2"
          style={{ fontSize: fill ? 18 : 13, maxWidth: '90%' }}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={fill ? { height: '100%' } : { height }}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={fill ? '(max-width: 768px) 100vw, 500px' : '(max-width: 768px) 50vw, 200px'}
        className="object-cover"
        priority={priority}
        onError={() => setHasError(true)}
      />
    </div>
  )
}
