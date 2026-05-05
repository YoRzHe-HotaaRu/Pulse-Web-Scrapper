import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, DollarSign, Star, AlertTriangle, ChevronRight } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { formatDistanceToNow } from 'date-fns'
import api from '../services/api'
import type { DashboardStats, Product } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Card from '../components/ui/Card'
import StatsCard from '../components/features/StatsCard'
import ChartCard from '../components/features/ChartCard'
import DashboardWelcome from '../components/features/DashboardWelcome'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

type TimeRange = '7d' | '30d' | '90d'

const PIE_COLORS = ['#E85D3A', '#D4950B', '#2D8A56', '#3B82F6', '#8B95A5']

function SkeletonStatsCard() {
  return (
    <div
      className="bg-white border border-surface-border shadow-sm p-5 animate-pulse"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 flex-shrink-0 bg-surface-hover"
          style={{ borderRadius: 0 }}
        />
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 bg-surface-hover" />
          <div className="h-7 w-32 bg-surface-hover" />
          <div className="h-4 w-16 bg-surface-hover" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange] = useState<TimeRange>('7d')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsRes, productsRes] = await Promise.all([
        api.get<DashboardStats>('/dashboard/stats', { params: { timeRange } }),
        api.get<Product[]>('/search/products', { params: { limit: 10 } }),
      ])
      setStats(statsRes.data)
      setRecentProducts(productsRes.data)
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || (err as Error)?.message
        || 'Failed to load dashboard data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange])

  if (loading) {
    return <LoadingSpinner fullPage size="lg" message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <div className="flex flex-col items-center py-16 text-center">
            <AlertTriangle className="w-12 h-12 text-status-error mb-4" />
            <h2 className="text-lg font-semibold text-text-primary">
              Failed to Load Dashboard
            </h2>
            <p className="text-sm text-text-secondary mt-2 max-w-md">{error}</p>
            <Button onClick={fetchData} className="mt-6">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isEmpty = stats !== null && stats.totalSearches === 0 && stats.totalProducts === 0
  const avgRating = stats?.averageRating != null
    ? Number(stats.averageRating).toFixed(1)
    : '0.0'
  const avgPrice = stats?.averagePrice != null
    ? `RM ${Number(stats.averagePrice).toFixed(2)}`
    : 'RM 0.00'

  return (
    <div className="p-6 space-y-6">
      <DashboardWelcome stats={stats ?? undefined} onStartSearch={() => navigate('/search')} />

      {isEmpty && (
        <Card>
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
            <p className="text-text-secondary text-sm">
              No data yet — start by searching for products!
            </p>
            <Button size="sm" onClick={() => navigate('/search')} className="ml-auto">
              Start Search
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats === null ? (
          <>
            <SkeletonStatsCard />
            <SkeletonStatsCard />
            <SkeletonStatsCard />
            <SkeletonStatsCard />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Searches"
              value={stats.totalSearches.toLocaleString()}
              icon={Search}
              trend={{ value: 12, isPositive: true }}
              color="primary"
            />
            <StatsCard
              title="Products Analyzed"
              value={stats.totalProducts.toLocaleString()}
              icon={Package}
              trend={{ value: 8, isPositive: true }}
              color="success"
            />
            <StatsCard
              title="Average Price"
              value={avgPrice}
              icon={DollarSign}
              subtitle="MYR"
              color="warning"
            />
            <StatsCard
              title="Average Rating"
              value={avgRating}
              icon={Star}
              subtitle="out of 5.0"
              color="info"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top Categories" subtitle="Most searched product categories">
          {stats?.topCategories && stats.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topCategories}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E6ED" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#8B95A5', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#5F6B7A', fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value: number) => [value, 'Products']}
                  labelFormatter={(label: string) => `Category: ${label}`}
                  contentStyle={{ borderRadius: 0, border: '1px solid #E2E6ED' }}
                />
                <Bar dataKey="count" fill="#E85D3A" barSize={24} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No category data yet" />
          )}
        </ChartCard>

        <ChartCard title="Price Distribution" subtitle="Product count by price range">
          {stats?.priceDistribution && stats.priceDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.priceDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={0}
                  dataKey="count"
                  nameKey="range"
                  label={({ range, count }: { range: string; count: number }) =>
                    `${range}: ${count}`
                  }
                  labelLine={false}
                >
                  {stats.priceDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [value, name]}
                  contentStyle={{ borderRadius: 0, border: '1px solid #E2E6ED' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No price data yet" />
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Searches" padding="none">
          {stats?.recentSearches && stats.recentSearches.length > 0 ? (
            <>
              <div>
                {stats.recentSearches.slice(0, 5).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-6 py-3 border-b border-surface-border last:border-b-0"
                  >
                    <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {item.query}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <span className="text-xs text-text-secondary bg-surface-hover px-2 py-0.5 flex-shrink-0" style={{ borderRadius: 0 }}>
                      {item.resultCount} results
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-surface-border">
                <button
                  onClick={() => navigate('/history')}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="No recent searches"
              icon={<Search className="w-16 h-16" />}
            />
          )}
        </Card>

        <Card title="Recent Products" padding="none">
          {recentProducts.length > 0 ? (
            <>
              <div>
                {recentProducts.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 px-6 py-2 border-b border-surface-border last:border-b-0"
                  >
                    <div
                      className="w-10 h-10 bg-surface-hover overflow-hidden flex-shrink-0"
                      style={{ borderRadius: 0 }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-text-tertiary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-text-tertiary">{product.shopName}</p>
                    </div>
                    <p className="text-sm font-semibold text-primary flex-shrink-0">
                      RM {product.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 border-t border-surface-border">
                <button
                  onClick={() => navigate('/results')}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <EmptyState
              title="No products yet"
              icon={<Package className="w-16 h-16" />}
            />
          )}
        </Card>
      </div>
    </div>
  )
}
