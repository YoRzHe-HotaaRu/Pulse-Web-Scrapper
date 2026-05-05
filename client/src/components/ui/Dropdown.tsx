import {
  type ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'

interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  danger?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  width?: string
}

export default function Dropdown({
  trigger,
  items,
  align = 'left',
  width = '180px',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleClickOutside])

  const handleItemClick = (item: DropdownItem) => {
    item.onClick()
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute z-50 mt-1 bg-white border border-surface-border shadow-lg ${align === 'right' ? 'right-0' : 'left-0'}`}
          style={{ borderRadius: 0, minWidth: width }}
        >
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="border-t border-surface-border" />}
              <button
                onClick={() => handleItemClick(item)}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors duration-150
                  ${
                    item.danger
                      ? 'text-status-error hover:bg-red-50'
                      : 'text-text-primary hover:bg-surface-hover'
                  }`}
                style={{ borderRadius: 0 }}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
