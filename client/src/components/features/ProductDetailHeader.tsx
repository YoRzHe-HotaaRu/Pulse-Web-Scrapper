import { useState } from 'react'
import { Star, Store, MapPin, ExternalLink, Image } from 'lucide-react'
import type { Product } from '../../types'
import Badge from '../ui/Badge'
import LoadingSpinner from '../ui/LoadingSpinner'

interface ProductDetailHeaderProps {
  product: Product
  loading?: boolean
}

function formatPrice(price: number): string {
  return `RM ${price.toFixed(2)}`
}

function formatSoldCount(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return k >= 10 ? `${Math.round(k)}k sold` : `${k.toFixed(1)}k sold`
  }
  return `${count} sold`
}

export default function ProductDetailHeader({ product, loading = false }: ProductDetailHeaderProps) {
  const [imageError, setImageError] = useState(false)

  if (loading) {
    return (
      <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
        <LoadingSpinner message="Loading product details..." />
      </div>
    )
  }

  return (
    <div
      className="bg-white border border-surface-border shadow-sm grid md:grid-cols-5"
      style={{ borderRadius: 0 }}
    >
      <div
        className="col-span-2 bg-surface-hover overflow-hidden aspect-square md:aspect-auto"
        style={{ borderRadius: 0 }}
      >
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            style={{ borderRadius: 0 }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface-hover">
            <Image size={64} className="text-text-tertiary" />
          </div>
        )}
      </div>

      <div className="col-span-3 p-6">
        <Badge variant="primary" size="sm">
          {product.category}
        </Badge>

        <h1 className="text-2xl font-bold text-text-primary leading-tight mt-2">
          {product.title}
        </h1>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5">
            <Store size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{product.shopName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} className="text-text-tertiary" />
            <span className="text-xs text-text-tertiary">{product.shopLocation}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-surface-border'
                }
              />
            ))}
          </div>
          <span className="font-semibold text-text-primary">{product.rating.toFixed(1)}</span>
          <span className="text-sm text-text-tertiary">{formatSoldCount(product.soldCount)}</span>
        </div>

        <div
          className="mt-4 p-4 bg-surface-page border border-surface-border"
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-text-tertiary line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discount && product.discount > 0 && (
              <Badge variant="error" size="md">
                -{product.discount}%
              </Badge>
            )}
          </div>
        </div>

        <div className="mt-4">
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            View Store Page
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
