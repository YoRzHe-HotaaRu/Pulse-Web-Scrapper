import { useState } from 'react'
import { Star, Store, Image } from 'lucide-react'
import type { Product } from '../../types'
import Badge from '../ui/Badge'

interface ProductCardProps {
  product: Product
  onClick?: () => void
  compact?: boolean
}

function formatSoldCount(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return k >= 10 ? `${Math.round(k)}k sold` : `${k.toFixed(1)}k sold`
  }
  return `${count} sold`
}

function formatPrice(price: number): string {
  return `RM ${price.toFixed(2)}`
}

export default function ProductCard({ product, onClick, compact = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const isClickable = !!onClick

  return (
    <div
      className={`bg-white border border-surface-border shadow-sm transition-shadow duration-200 ${
        isClickable ? 'hover:shadow-md cursor-pointer' : ''
      }`}
      style={{ borderRadius: 0 }}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div
        className={`bg-surface-hover overflow-hidden relative ${
          compact ? 'h-32' : 'h-48'
        }`}
        style={{ borderRadius: 0 }}
      >
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ borderRadius: 0 }}
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-hover">
            <Image size={compact ? 32 : 48} className="text-text-tertiary" />
          </div>
        )}
        {product.discount && product.discount > 0 && (
          <div
            className="absolute top-2 left-2"
            style={{ borderRadius: 0 }}
          >
            <Badge variant="error" size="sm">
              -{product.discount}%
            </Badge>
          </div>
        )}
      </div>

      <div className={compact ? 'p-3' : 'p-4'}>
        <h3
          className={`font-semibold text-text-primary line-clamp-2 ${
            compact ? 'text-sm leading-snug' : 'text-base leading-snug'
          }`}
        >
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mt-1">
          <Store size={12} className="text-text-tertiary flex-shrink-0" />
          <span className="text-xs text-text-tertiary truncate">{product.shopName}</span>
        </div>

        <div className={`flex items-baseline gap-2 ${compact ? 'mt-1.5' : 'mt-2'}`}>
          <span
            className={`font-bold text-primary ${
              compact ? 'text-base' : 'text-lg'
            }`}
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-text-tertiary line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className={`flex items-center justify-between ${compact ? 'mt-1.5' : 'mt-3'}`}>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="text-sm text-text-secondary">{product.rating.toFixed(1)}</span>
            </div>
          )}
          <span className="text-xs text-text-tertiary ml-auto">
            {product.soldCount > 0 ? formatSoldCount(product.soldCount) : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
