import { useState, useEffect, useCallback } from 'react'
import { FileText, FileJson, FileSpreadsheet, Table2 } from 'lucide-react'
import api from '../services/api'
import type { Product } from '../types'
import ExportOptions from '../components/features/ExportOptions'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function Export() {
  const [loading, setLoading] = useState(false)
  const [fetchingPreview, setFetchingPreview] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productCount, setProductCount] = useState(0)
  const [previewProducts, setPreviewProducts] = useState<Product[]>([])

  const fetchData = useCallback(async () => {
    setFetchingPreview(true)
    setError(null)
    try {
      const response = await api.get('/search/products', { params: { limit: 3, page: 1 } })
      const data = response.data
      setPreviewProducts(data)
      setProductCount(data.length)
    } catch {
      setError('Failed to load product data.')
    } finally {
      setFetchingPreview(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleExport = useCallback(
    async (format: 'json' | 'csv') => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/export/${format}`, {
          responseType: 'blob',
        })

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `products-${Date.now()}.${format}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch {
        setError('Export failed. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const formatPrice = (price: number) =>
    `RM ${price.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`

  if (fetchingPreview) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-text-primary">Export Data</h1>
        <p className="text-text-secondary mt-1">Download your product data and analysis results</p>
        <div className="mt-6 bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
          <div className="p-6">
            <LoadingSpinner message="Loading product data..." />
          </div>
        </div>
      </div>
    )
  }

  if (error && productCount === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-text-primary">Export Data</h1>
        <p className="text-text-secondary mt-1">Download your product data and analysis results</p>
        <div
          className="mt-6 bg-red-50 border border-red-200 shadow-sm p-6"
          style={{ borderRadius: 0 }}
        >
          <p className="text-status-error font-medium">{error}</p>
          <button
            type="button"
            className="btn-primary mt-4"
            style={{ borderRadius: 0 }}
            onClick={fetchData}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-text-primary">Export Data</h1>
      <p className="text-text-secondary mt-1">Download your product data and analysis results</p>

      {error && (
        <div
          className="mt-4 bg-red-50 border border-red-200 shadow-sm px-4 py-3"
          style={{ borderRadius: 0 }}
        >
          <p className="text-sm text-status-error font-medium">{error}</p>
        </div>
      )}

      <div className="mt-6">
        <ExportOptions
          onExport={handleExport}
          loading={loading}
          productCount={productCount}
        />
      </div>

      {/* What's Included */}
      <Card className="mt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 mt-0.5 text-text-tertiary">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">What's Included</h3>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FileJson size={20} className="text-text-tertiary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">JSON Format</p>
              <p className="text-sm text-text-secondary mt-0.5">
                Complete product data with all fields, AI analysis, metadata, and timestamps. Ideal
                for further data processing or API integration.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FileSpreadsheet size={20} className="text-text-tertiary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">CSV Format</p>
              <p className="text-sm text-text-secondary mt-0.5">
                Flat structured data with key fields: title, price, rating, sold count, shop name,
                category, and AI summary. Compatible with Excel and Google Sheets.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Preview */}
      <Card className="mt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 mt-0.5 text-text-tertiary">
            <Table2 size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Data Preview</h3>
          </div>
        </div>
        {previewProducts.length === 0 ? (
          <EmptyState
            icon={<FileText className="w-16 h-16" />}
            title="No data to export"
            description="Start searching for products first."
          />
        ) : (
          <>
            <p className="text-sm text-text-secondary mb-4">
              Showing {previewProducts.length} of {productCount} product
              {productCount !== 1 ? 's' : ''}
            </p>
            <div className="overflow-x-auto border border-surface-border" style={{ borderRadius: 0 }}>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-hover border-b border-surface-border">
                    <th
                      className="text-left px-4 py-3 font-semibold text-text-primary"
                      style={{ borderRadius: 0 }}
                    >
                      Title
                    </th>
                    <th
                      className="text-right px-4 py-3 font-semibold text-text-primary"
                      style={{ borderRadius: 0 }}
                    >
                      Price
                    </th>
                    <th
                      className="text-center px-4 py-3 font-semibold text-text-primary"
                      style={{ borderRadius: 0 }}
                    >
                      Rating
                    </th>
                    <th
                      className="text-left px-4 py-3 font-semibold text-text-primary"
                      style={{ borderRadius: 0 }}
                    >
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`${
                        index < previewProducts.length - 1 ? 'border-b border-surface-border' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-text-primary truncate max-w-xs">
                        {product.title}
                      </td>
                      <td className="px-4 py-3 text-right text-text-primary font-medium tabular-nums">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-text-primary font-medium">{product.rating}</span>
                        <span className="text-text-tertiary">/5</span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
