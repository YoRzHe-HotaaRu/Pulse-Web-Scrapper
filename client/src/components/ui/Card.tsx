import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

const paddingClasses: Record<string, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  padding = 'md',
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={`card ${paddingClasses[padding]} ${
        hoverable ? 'hover:shadow-md transition-shadow cursor-pointer' : ''
      } ${className}`}
    >
      {title && (
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0 ml-4">{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
