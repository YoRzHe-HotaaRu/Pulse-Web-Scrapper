import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Check,
  Star,
  Store,
  MapPin,
  ExternalLink,
  Brain,
  AlertTriangle,
} from 'lucide-react'
import api from '../services/api'
import type { Product } from '../types'
import ProductDetailHeader from '../components/features/ProductDetailHeader'
import AIAnalysisCard from '../components/features/AIAnalysisCard'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import Tabs from '../components/ui/Tabs'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatSoldCount(count: number): string {
  if (count >= 1000) {
    const k = count / 1000
    return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1)}k`
  }
  return `${count}`
}

function formatPrice(price: number): string {
  return `RM ${price.toFixed(2)}`
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      setProduct(null)

      try {
        const { data } = await api.get(`/search/products/${id}`)
        if (!cancelled) {
          setProduct(data)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : 'Failed to load product details'
          setError(msg)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      cancelled = true
    }
  }, [id])

  const handleRequestAnalysis = async () => {
    if (!id || !product) return
    setAnalyzing(true)
    try {
      const { data } = await api.post(`/search/products/${id}/analyze`)
      setProduct({ ...product, aiAnalysis: data.analysis ?? data })
    } catch (err: unknown) {
      // silently handle; user can retry
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <LoadingSpinner fullPage size="lg" message="Loading product details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card padding="lg" className="text-center">
          <AlertTriangle size={48} className="text-status-error mx-auto" />
          <h2 className="text-lg font-semibold text-text-primary mt-4">
            Failed to Load Product
          </h2>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto">
            {error}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary mt-6"
          >
            Go Back
          </button>
        </Card>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <EmptyState
          title="Product not found"
          description="The product you're looking for doesn't exist or has been removed."
          action={{
            label: 'Back to Results',
            onClick: () => navigate('/results'),
          }}
        />
      </div>
    )
  }

  const highlights = product.highlights ?? []

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors duration-150"
      >
        <ChevronLeft size={16} />
        Back to Results
      </button>

      {/* Product Header */}
      <ProductDetailHeader product={product} />

      {/* Tabs Navigation */}
      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview' },
          {
            id: 'analysis',
            label: 'AI Analysis',
            badge: product.aiAnalysis ? 1 : undefined,
          },
          { id: 'specs', label: 'Specifications' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <Card padding="md">
            {/* Product Description */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">
                Product Description
              </h3>
              {product.description ? (
                <p className="text-text-secondary leading-relaxed">
                  {product.description}
                </p>
              ) : (
                <p className="text-text-tertiary italic">
                  No description available
                </p>
              )}
            </div>

            {/* Key Highlights */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Key Highlights
              </h3>
              {highlights.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check
                        size={16}
                        className="text-status-success w-4 h-4 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-text-secondary">{h}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-tertiary italic text-sm">
                  No highlights available
                </p>
              )}
            </div>

            {/* Product Details Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Category
                </span>
                <div className="mt-1">
                  <Badge variant="primary" size="sm">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Shop
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Store size={14} className="text-text-secondary" />
                  <span className="text-sm text-text-primary">
                    {product.shopName}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Location
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin size={14} className="text-text-tertiary" />
                  <span className="text-sm text-text-primary">
                    {product.shopLocation}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Rating
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-surface-border'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-text-primary">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Sold
                </span>
                <p className="text-sm text-text-primary mt-1">
                  {formatSoldCount(product.soldCount)} units sold
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                  Original Link
                </span>
                <div className="mt-1">
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

              {product.originalPrice && product.originalPrice > product.price && (
                <div>
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Original Price
                  </span>
                  <p className="text-sm text-text-tertiary line-through mt-1">
                    {formatPrice(product.originalPrice)}
                  </p>
                </div>
              )}

              {product.discount && product.discount > 0 && (
                <div>
                  <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Discount
                  </span>
                  <div className="mt-1">
                    <Badge variant="error" size="sm">
                      -{product.discount}%
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {activeTab === 'analysis' && (
          <>
            {product.aiAnalysis ? (
              <AIAnalysisCard analysis={product.aiAnalysis} />
            ) : analyzing ? (
              <Card padding="lg" className="flex flex-col items-center py-12">
                <LoadingSpinner size="lg" message="Analyzing product..." />
              </Card>
            ) : (
              <Card padding="lg" className="text-center py-8">
                <Brain
                  size={64}
                  className="text-text-tertiary mx-auto"
                  style={{ borderRadius: 0 }}
                />
                <h2 className="text-lg font-semibold text-text-primary mt-4">
                  No AI Analysis Available
                </h2>
                <p className="text-sm text-text-secondary mt-1 max-w-md mx-auto">
                  Run a new search with AI analysis enabled to get insights on
                  this product.
                </p>
                <button
                  onClick={handleRequestAnalysis}
                  className="btn-primary mt-4"
                >
                  Request Analysis
                </button>
              </Card>
            )}
          </>
        )}

        {activeTab === 'specs' && (
          <Card padding="md">
            <div className="divide-y divide-surface-border">
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Product ID
                </span>
                <span className="text-sm text-text-primary font-mono">
                  {product.id}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Category
                </span>
                <span className="text-sm text-text-primary">
                  {product.category}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Price
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.originalPrice && (
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium text-text-tertiary">
                    Original Price
                  </span>
                  <span className="text-sm text-text-tertiary line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                </div>
              )}
              {product.discount && product.discount > 0 && (
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium text-text-tertiary">
                    Discount
                  </span>
                  <span className="text-sm text-status-error font-semibold">
                    -{product.discount}%
                  </span>
                </div>
              )}
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Rating
                </span>
                <span className="text-sm text-text-primary">
                  {product.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Sold
                </span>
                <span className="text-sm text-text-primary">
                  {product.soldCount} units
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Shop
                </span>
                <span className="text-sm text-text-primary">
                  {product.shopName}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Location
                </span>
                <span className="text-sm text-text-primary">
                  {product.shopLocation}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Added
                </span>
                <span className="text-sm text-text-primary">
                  {formatDate(product.createdAt)}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm font-medium text-text-tertiary">
                  Source
                </span>
                <span className="text-sm text-text-primary">
                  Original Store
                </span>
              </div>
              {product.aiAnalysis && (
                <div className="flex justify-between py-3">
                  <span className="text-sm font-medium text-text-tertiary">
                    AI Score
                  </span>
                  <span className="text-sm text-text-primary">
                    {product.aiAnalysis.rating}/10
                  </span>
                </div>
              )}
            </div>
            {!product.aiAnalysis && (
              <p className="text-sm text-text-tertiary italic mt-4">
                Basic product information shown. Run AI analysis for deeper
                insights.
              </p>
            )}
          </Card>
        )}
      </div>

      {/* Similar Products */}
      <div className="mt-8">
        <Card title="You May Also Like">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-hover h-48 flex items-center justify-center text-text-tertiary text-sm border border-surface-border shadow-sm"
                style={{ borderRadius: 0 }}
              >
                Coming soon
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
