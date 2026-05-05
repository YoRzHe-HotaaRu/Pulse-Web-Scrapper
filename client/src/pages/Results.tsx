import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  Package,
} from 'lucide-react'
import api from '../services/api'
import type { SearchResult, SearchParams } from '../types'
import SearchBar from '../components/features/SearchBar'
import FilterPanel from '../components/features/FilterPanel'
import ProductCard from '../components/features/ProductCard'
import Pagination from '../components/ui/Pagination'
import EmptyState from '../components/ui/EmptyState'

const SORT_LABELS: Record<string, string> = {
  relevance: 'sorted by relevance',
  price_asc: 'sorted by lowest price',
  price_desc: 'sorted by highest price',
  rating: 'sorted by rating',
  sales: 'sorted by best selling',
}

export default function Results() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || undefined
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minRating = searchParams.get('minRating')
  const sortBy = (searchParams.get('sortBy') as SearchParams['sortBy']) || 'relevance'
  const page = searchParams.get('page')

  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filters = useMemo<SearchParams>(
    () => ({
      query,
      category,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      sortBy,
      page: page ? Number(page) : 1,
      limit: 20,
    }),
    [query, category, minPrice, maxPrice, minRating, sortBy, page],
  )

  useEffect(() => {
    if (!query) {
      navigate('/search', { replace: true })
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    api
      .post<SearchResult>('/search', filters)
      .then((res) => {
        if (!cancelled) {
          setSearchResult(res.data)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || err.message || 'Search failed. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [query, filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.sortBy, filters.page])

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery })
  }

  const handleFilterChange = (newFilters: SearchParams) => {
    const params: Record<string, string> = { q: newFilters.query }
    if (newFilters.category) params.category = newFilters.category
    if (newFilters.minPrice !== undefined) params.minPrice = String(newFilters.minPrice)
    if (newFilters.maxPrice !== undefined) params.maxPrice = String(newFilters.maxPrice)
    if (newFilters.minRating !== undefined) params.minRating = String(newFilters.minRating)
    if (newFilters.sortBy && newFilters.sortBy !== 'relevance') params.sortBy = newFilters.sortBy
    if (newFilters.page && newFilters.page > 1) params.page = String(newFilters.page)

    setSearchParams(params)
    setFiltersOpen(false)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    if (newPage > 1) {
      params.set('page', String(newPage))
    } else {
      params.delete('page')
    }
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearFilters = () => {
    setSearchParams({ q: query })
    setFiltersOpen(false)
  }

  const currentPage = searchResult?.page ?? (page ? Number(page) : 1)
  const totalPages = searchResult?.totalPages ?? 1
  const sortLabel = SORT_LABELS[sortBy] || ''

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => navigate('/search')}
          className="flex items-center justify-center h-9 w-9 bg-white border border-surface-border shadow-sm hover:bg-surface-hover transition-colors text-text-secondary flex-shrink-0"
          style={{ borderRadius: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Search Results</h1>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        initialValue={query}
        loading={loading}
        size="normal"
      />

      {/* Filter Panel */}
      <div className="mt-4">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          isOpen={filtersOpen}
          onToggle={() => setFiltersOpen(!filtersOpen)}
          loading={loading}
        />
      </div>

      {/* Result Summary */}
      {searchResult && !loading && (
        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1">
          <p className="text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{searchResult.totalCount}</span>{' '}
            results found for &apos;<span className="text-text-primary">{searchResult.query}</span>&apos;
          </p>
          <p className="text-xs text-text-tertiary">
            {searchResult.searchTime}ms
          </p>
          {sortLabel && (
            <p className="text-xs text-text-tertiary">{sortLabel}</p>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-surface-border shadow-sm animate-pulse"
              style={{ borderRadius: 0 }}
            >
              <div
                className="h-48 bg-surface-hover"
                style={{ borderRadius: 0 }}
              />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-surface-hover w-full" />
                <div className="h-4 bg-surface-hover w-3/4" />
                <div className="h-3 bg-surface-hover w-1/2" />
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-surface-hover w-20" />
                  <div className="h-4 bg-surface-hover w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="mt-6">
          <div
            className="border border-red-200 shadow-sm bg-white p-8 flex flex-col items-center text-center"
            style={{ borderRadius: 0 }}
          >
            <div className="w-12 h-12 bg-red-50 text-red-500 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mt-4">Search Error</h3>
            <p className="text-sm text-text-secondary mt-1 max-w-md">{error}</p>
            <button
              type="button"
              onClick={() => handleSearch(query)}
              className="btn-primary mt-6"
              style={{ borderRadius: 0 }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {searchResult && !loading && !error && searchResult.products.length === 0 && (
        <div className="mt-6">
          <EmptyState
            icon={<Package className="w-16 h-16" />}
            title="No products found"
            description="Try adjusting your search terms or filters"
            action={{ label: 'Clear Filters', onClick: handleClearFilters }}
          />
        </div>
      )}

      {/* Results Grid */}
      {searchResult && !loading && !error && searchResult.products.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResult.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              compact={false}
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {searchResult && !loading && !error && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}
