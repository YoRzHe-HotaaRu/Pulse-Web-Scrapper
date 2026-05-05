import { useState, useEffect, useCallback } from 'react'
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import type { SearchParams } from '../../types'
import Select from '../ui/Select'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface FilterPanelProps {
  filters: SearchParams
  onFilterChange: (filters: SearchParams) => void
  isOpen?: boolean
  onToggle?: () => void
  loading?: boolean
}

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Fashion', label: 'Fashion' },
  { value: 'Home & Living', label: 'Home & Living' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Food & Beverages', label: 'Food & Beverages' },
  { value: 'Automotive', label: 'Automotive' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Books', label: 'Books' },
  { value: 'Toys', label: 'Toys' },
  { value: 'Others', label: 'Others' },
]

const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4★ & above' },
  { value: '4.5', label: '4.5★ & above' },
]

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'sales', label: 'Best Selling' },
]

function countActiveFilters(filters: SearchParams): number {
  let count = 0
  if (filters.category) count++
  if (filters.minPrice !== undefined) count++
  if (filters.maxPrice !== undefined) count++
  if (filters.minRating !== undefined) count++
  if (filters.sortBy && filters.sortBy !== 'relevance') count++
  return count
}

export default function FilterPanel({
  filters,
  onFilterChange,
  isOpen = false,
  onToggle,
  loading = false,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchParams>(filters)
  const activeCount = countActiveFilters(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleChange = useCallback(
    (key: keyof SearchParams, value: string | number | undefined) => {
      setLocalFilters((prev) => {
        const updated = { ...prev, [key]: value || undefined }
        onFilterChange(updated)
        return updated
      })
    },
    [onFilterChange],
  )

  const handleClearAll = useCallback(() => {
    const cleared: SearchParams = { query: filters.query }
    setLocalFilters(cleared)
    onFilterChange(cleared)
  }, [filters.query, onFilterChange])

  return (
    <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ borderRadius: 0 }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-text-secondary" />
          <span className="font-medium text-text-primary text-sm">Filters</span>
          {activeCount > 0 && (
            <Badge variant="primary" size="sm">
              {activeCount}
            </Badge>
          )}
        </div>
        <span className="text-text-tertiary">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isOpen && (
        <div
          className="border-t border-surface-border p-4 space-y-5"
          style={{ borderRadius: 0 }}
        >
          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={localFilters.category ?? ''}
            onChange={(e) => handleChange('category', e.target.value)}
            disabled={loading}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters.minPrice ?? ''}
                onChange={(e) =>
                  handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)
                }
                disabled={loading}
                className="flex-1"
              />
              <span className="text-text-tertiary text-sm">—</span>
              <Input
                type="number"
                placeholder="Max"
                value={localFilters.maxPrice ?? ''}
                onChange={(e) =>
                  handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                }
                disabled={loading}
                className="flex-1"
              />
            </div>
          </div>

          <Select
            label="Minimum Rating"
            options={RATING_OPTIONS}
            value={localFilters.minRating?.toString() ?? ''}
            onChange={(e) =>
              handleChange('minRating', e.target.value ? Number(e.target.value) : undefined)
            }
            disabled={loading}
            fullWidth
          />

          <Select
            label="Sort by"
            options={SORT_OPTIONS}
            value={localFilters.sortBy ?? 'relevance'}
            onChange={(e) =>
              handleChange('sortBy', e.target.value as SearchParams['sortBy'])
            }
            disabled={loading}
            fullWidth
          />

          <div className="flex justify-end gap-3 pt-1">
            <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={loading}>
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
