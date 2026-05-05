import type { ReactNode } from 'react'
import EmptyState from '../ui/EmptyState'

interface ChartCardProps {
  title: string
  subtitle?: string
  children?: ReactNode
  action?: ReactNode
  height?: number
}

export default function ChartCard({
  title,
  subtitle,
  children,
  action,
  height = 300,
}: ChartCardProps) {
  return (
    <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
      <div className="px-5 pt-5 pb-0 flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-xs text-text-tertiary mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
      <div
        className="px-5 py-5 flex items-center justify-center"
        style={{ height: `${height}px`, borderRadius: 0 }}
      >
        {children ?? <EmptyState title="No data available" />}
      </div>
    </div>
  )
}
