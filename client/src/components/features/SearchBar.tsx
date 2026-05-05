import { useState, useCallback, type FormEvent } from 'react'
import { Search, Loader2 } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  initialValue?: string
  loading?: boolean
  size?: 'normal' | 'large'
}

export default function SearchBar({
  onSearch,
  initialValue = '',
  loading = false,
  size = 'normal',
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const isLarge = size === 'large'

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const trimmed = value.trim()
      if (trimmed) {
        onSearch(trimmed)
      }
    },
    [value, onSearch],
  )

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full ${isLarge ? 'max-w-3xl mx-auto' : ''}`}
      style={{ borderRadius: 0 }}
    >
      <div
        className="flex shadow-md"
        style={{ borderRadius: 0 }}
      >
        <div
          className={`relative flex-1 bg-white border border-surface-border border-r-0 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${
            isLarge ? 'h-14' : 'h-11'
          }`}
          style={{ borderRadius: 0 }}
        >
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary ${
              isLarge ? 'left-4' : 'left-3'
            }`}
          >
            <Search size={isLarge ? 20 : 16} />
          </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search products..."
            className={`w-full h-full bg-transparent text-text-primary placeholder:text-text-tertiary focus:outline-none ${
              isLarge
                ? 'text-lg pl-12 pr-4'
                : 'text-base pl-10 pr-4'
            }`}
            style={{ borderRadius: 0 }}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className={`btn-primary inline-flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
            isLarge
              ? 'h-14 px-8 text-base'
              : 'h-11 px-6 text-sm'
          }`}
          style={{ borderRadius: 0 }}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={isLarge ? 20 : 16} />
          ) : (
            <Search size={isLarge ? 20 : 16} />
          )}
          Search
        </button>
      </div>
    </form>
  )
}
