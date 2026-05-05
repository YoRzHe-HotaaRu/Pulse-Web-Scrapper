import { type ElementType } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TrendData {
  value: number
  isPositive: boolean
}

interface StatsCardProps {
  title: string
  value: string | number
  icon: ElementType
  trend?: TrendData
  subtitle?: string
  color?: 'primary' | 'success' | 'warning' | 'info'
}

const iconBgClasses: Record<string, string> = {
  primary: 'bg-primary-light text-primary',
  success: 'bg-green-50 text-status-success',
  warning: 'bg-amber-50 text-status-warning',
  info: 'bg-blue-50 text-status-info',
}

export default function StatsCard({
  title,
  value,
  icon: IconComponent,
  trend,
  subtitle,
  color = 'primary',
}: StatsCardProps) {
  return (
    <div className="bg-white border border-surface-border shadow-sm p-5" style={{ borderRadius: 0 }}>
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${iconBgClasses[color]}`}
          style={{ borderRadius: 0 }}
        >
          <IconComponent size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-text-primary mt-1 truncate">{value}</p>
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm font-medium ${
                trend.isPositive ? 'text-status-success' : 'text-status-error'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-text-tertiary mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
