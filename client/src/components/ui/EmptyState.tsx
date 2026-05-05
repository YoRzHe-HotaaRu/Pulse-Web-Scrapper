import { type ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: EmptyStateAction
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-text-tertiary">
        {icon ?? <Inbox className="w-16 h-16" />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mt-4">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary mt-1 max-w-sm">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary mt-6"
          style={{ borderRadius: 0 }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
