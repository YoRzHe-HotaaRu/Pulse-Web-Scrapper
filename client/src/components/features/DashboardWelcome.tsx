import { ArrowRight, ShoppingBag, Tag, TrendingUp, Star, BarChart3 } from 'lucide-react'
import type { DashboardStats } from '../../types'
import Button from '../ui/Button'

interface DashboardWelcomeProps {
  stats?: DashboardStats
  onStartSearch?: () => void
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const ICON_GRID_ITEMS = [ShoppingBag, Tag, TrendingUp, Star, BarChart3, ShoppingBag]

export default function DashboardWelcome({ stats, onStartSearch }: DashboardWelcomeProps) {
  return (
    <div
      className="bg-white border border-surface-border shadow-sm flex flex-col md:flex-row"
      style={{ borderRadius: 0 }}
    >
      <div className="flex-1 p-6">
        <p className="text-sm text-text-tertiary">{getGreeting()}</p>
        <h1 className="text-2xl font-bold text-text-primary mt-0.5">
          Welcome to PricePulse
        </h1>
        <p className="text-text-secondary mt-2 leading-relaxed max-w-lg">
          Analyze products with AI-powered insights. Track pricing trends, compare products,
          and make smarter purchasing decisions.
        </p>

        {stats && (
          <div className="flex flex-wrap gap-6 mt-4">
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-wider">Total Searches</p>
              <p className="text-lg font-semibold text-text-primary">{stats.totalSearches.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-wider">Products Analyzed</p>
              <p className="text-lg font-semibold text-text-primary">{stats.totalProducts.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-text-tertiary uppercase tracking-wider">Avg. Rating</p>
              <p className="text-lg font-semibold text-text-primary">{stats.averageRating}★</p>
            </div>
          </div>
        )}

        {onStartSearch && (
          <div className="mt-6">
            <Button
              size="lg"
              onClick={onStartSearch}
              icon={<ArrowRight size={18} />}
            >
              Start Searching
            </Button>
          </div>
        )}
      </div>

      <div className="p-6 flex items-center justify-center bg-surface-page">
        <div className="grid grid-cols-3 gap-4">
          {ICON_GRID_ITEMS.map((IconComponent, i) => (
            <div key={i} className="flex items-center justify-center">
              <IconComponent className="w-16 h-16 text-primary-light opacity-30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
