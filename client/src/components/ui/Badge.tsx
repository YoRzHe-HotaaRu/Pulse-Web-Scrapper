import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary'
  size?: 'sm' | 'md'
}

const variantClasses: Record<string, string> = {
  default: 'bg-surface-hover text-text-secondary',
  success: 'bg-green-50 text-status-success border border-green-200',
  warning: 'bg-amber-50 text-status-warning border border-amber-200',
  error: 'bg-red-50 text-status-error border border-red-200',
  info: 'bg-blue-50 text-status-info border border-blue-200',
  primary: 'bg-primary-light text-primary border border-primary/20',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}
      style={{ borderRadius: 0 }}
    >
      {children}
    </span>
  )
}
