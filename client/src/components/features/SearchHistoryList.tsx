import { Search, RotateCcw, Trash2 } from 'lucide-react'
import type { SearchHistory } from '../../types'
import LoadingSpinner from '../ui/LoadingSpinner'
import EmptyState from '../ui/EmptyState'

interface SearchHistoryListProps {
  history: SearchHistory[]
  onDelete: (id: string) => void
  onReSearch: (query: string) => void
  loading?: boolean
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SearchHistoryList({
  history,
  onDelete,
  onReSearch,
  loading = false,
}: SearchHistoryListProps) {
  if (loading) {
    return (
      <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
        <LoadingSpinner message="Loading history..." />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
        <EmptyState title="No search history" description="Your recent searches will appear here." />
      </div>
    )
  }

  return (
    <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
      {history.map((entry, index) => (
        <div
          key={entry.id}
          className={`flex items-center gap-3 px-4 py-3 ${
            index < history.length - 1 ? 'border-b border-surface-border' : ''
          } hover:bg-surface-hover transition-colors duration-150`}
          style={{ borderRadius: 0 }}
        >
          <div className="flex-shrink-0 text-text-tertiary">
            <Search size={16} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary text-sm truncate">{entry.query}</p>
            <p className="text-xs text-text-tertiary mt-0.5">
              {formatTimestamp(entry.timestamp)}
              {entry.resultCount > 0 && <span> · {entry.resultCount} results</span>}
            </p>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              className="p-2 text-text-tertiary hover:text-primary transition-colors duration-150"
              style={{ borderRadius: 0 }}
              onClick={() => onReSearch(entry.query)}
              title="Search again"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              className="p-2 text-text-tertiary hover:text-status-error transition-colors duration-150"
              style={{ borderRadius: 0 }}
              onClick={() => onDelete(entry.id)}
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
