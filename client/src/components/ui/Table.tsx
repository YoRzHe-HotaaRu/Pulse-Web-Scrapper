import { type ReactNode, type MouseEvent } from 'react'
import { Inbox } from 'lucide-react'

interface Column<T> {
  key: string
  title: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (row: T) => void
  striped?: boolean
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-surface-hover" />
        </td>
      ))}
    </tr>
  )
}

export default function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  onRowClick,
  striped = false,
}: TableProps<T>) {
  const handleRowClick = (row: T) => (e: MouseEvent<HTMLTableRowElement>) => {
    e.stopPropagation()
    onRowClick?.(row)
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ borderRadius: 0 }}>
        <thead>
          <tr className="bg-surface-hover">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider border-b border-surface-border"
                style={{ width: col.width, borderRadius: 0 }}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
              <SkeletonRow cols={columns.length} />
            </>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="w-10 h-10 text-text-tertiary" />
                  <p className="text-sm text-text-secondary">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                onClick={onRowClick ? handleRowClick(row) : undefined}
                className={`border-b border-surface-border hover:bg-surface-hover transition-colors ${
                  striped && rowIdx % 2 === 0 ? 'bg-surface-page' : 'bg-surface-card'
                } ${onRowClick ? 'cursor-pointer' : ''}`}
                style={{ borderRadius: 0 }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-text-primary"
                    style={{ width: col.width, borderRadius: 0 }}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as ReactNode) ?? ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
