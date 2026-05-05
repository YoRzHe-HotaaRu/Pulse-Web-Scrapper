import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Grid3X3, Zap, Brain, BarChart3, Search as SearchIcon } from 'lucide-react'
import SearchBar from '../components/features/SearchBar'
import Badge from '../components/ui/Badge'

const POPULAR_SEARCHES = [
  'iPhone 15 case',
  'gaming laptop',
  'sneakers',
  'skincare',
  'wireless earbuds',
  'mechanical keyboard',
  'power bank',
  'backpack',
]

const FEATURES = [
  {
    icon: SearchIcon,
    title: 'Smart Search',
    description: 'Powerful Exa-powered search across e-commerce listings',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'OpenRouter-powered product insights and competitor comparisons',
  },
  {
    icon: BarChart3,
    title: 'Data Export',
    description: 'Export structured data in JSON or CSV formats',
  },
]

export default function Search() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = useCallback(
    (query: string) => {
      navigate(`/results?q=${encodeURIComponent(query)}`)
    },
    [navigate],
  )

  const handleChipClick = useCallback(
    (term: string) => {
      setSearchQuery(term)
      navigate(`/results?q=${encodeURIComponent(term)}`)
    },
    [navigate],
  )

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl mx-auto px-4 py-20 w-full">
        {/* Hero Section */}
        <div className="text-center mb-2">
          <Badge variant="primary" size="md">
            Product Intelligence
          </Badge>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight mt-4">
            Discover & Analyze Products
          </h1>
          <p className="text-lg text-text-secondary mt-3 max-w-2xl mx-auto">
            Search products across e-commerce stores, get AI-powered insights, and make smarter purchasing
            decisions.
          </p>
        </div>

        {/* SearchBar */}
        <div className="mt-8">
          <SearchBar onSearch={handleSearch} initialValue={searchQuery} size="large" />
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-light text-primary">
              <Package className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2">1M+</p>
            <p className="text-xs text-text-tertiary">Products</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-light text-primary">
              <Grid3X3 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2">50+</p>
            <p className="text-xs text-text-tertiary">Categories</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-light text-primary">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-text-primary mt-2">Real-time</p>
            <p className="text-xs text-text-tertiary">Analysis</p>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-12">
          <p className="text-sm font-semibold text-text-tertiary uppercase tracking-wider">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleChipClick(term)}
                className="bg-white border border-surface-border px-4 py-2 text-sm text-text-secondary hover:border-primary hover:text-primary cursor-pointer transition-colors shadow-sm"
                style={{ borderRadius: 0 }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border border-surface-border shadow-sm bg-white p-5"
              style={{ borderRadius: 0 }}
            >
              <div
                className="w-10 h-10 bg-primary-light text-primary flex items-center justify-center"
                style={{ borderRadius: 0 }}
              >
                <feature.icon size={20} />
              </div>
              <h3 className="font-semibold text-text-primary mt-3">{feature.title}</h3>
              <p className="text-sm text-text-secondary mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
