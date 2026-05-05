import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const totalPageNumbers = siblingCount * 2 + 5

  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    if (totalPages <= totalPageNumbers) {
      return range(1, totalPages)
    }

    const leftSiblingIdx = Math.max(currentPage - siblingCount, 2)
    const rightSiblingIdx = Math.min(currentPage + siblingCount, totalPages - 1)

    const showLeftEllipsis = leftSiblingIdx > 2
    const showRightEllipsis = rightSiblingIdx < totalPages - 1

    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1]

    if (showLeftEllipsis) {
      pages.push('ellipsis-start')
    } else {
      for (let i = 2; i < leftSiblingIdx; i++) {
        pages.push(i)
      }
    }

    for (let i = leftSiblingIdx; i <= rightSiblingIdx; i++) {
      pages.push(i)
    }

    if (showRightEllipsis) {
      pages.push('ellipsis-end')
    } else {
      for (let i = rightSiblingIdx + 1; i < totalPages; i++) {
        pages.push(i)
      }
    }

    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  const btnBase =
    'inline-flex items-center justify-center h-9 px-3 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm'

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} text-text-secondary bg-white border border-surface-border hover:bg-surface-hover`}
        style={{ borderRadius: 0 }}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) => {
        if (page === 'ellipsis-start' || page === 'ellipsis-end') {
          return (
            <span
              key={page}
              className="inline-flex items-center justify-center h-9 px-2 text-sm text-text-tertiary"
            >
              ...
            </span>
          )
        }

        return (
          <button
            key={`${page}-${idx}`}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${
              page === currentPage
                ? 'bg-primary text-text-inverse font-bold'
                : 'text-text-secondary bg-white border border-surface-border hover:bg-surface-hover'
            }`}
            style={{ borderRadius: 0 }}
          >
            {page}
          </button>
        )
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} text-text-secondary bg-white border border-surface-border hover:bg-surface-hover`}
        style={{ borderRadius: 0 }}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
