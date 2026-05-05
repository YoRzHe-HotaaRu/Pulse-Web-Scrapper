import { type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon?: ReactNode
  badge?: number
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'pills'
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
}: TabsProps) {
  if (variant === 'pills') {
    return (
      <div
        className="inline-flex border border-surface-border shadow-sm"
        style={{ borderRadius: 0 }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-150
              ${
                activeTab === tab.id
                  ? 'bg-primary text-text-inverse'
                  : 'text-text-secondary hover:bg-surface-hover'
              }`}
            style={{ borderRadius: 0 }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-text-inverse/20">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="border-b border-surface-border">
      <div className="flex -mb-px" style={{ borderRadius: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150
              ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary'
              }`}
            style={{ borderRadius: 0 }}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={`inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold ${
                  activeTab === tab.id ? 'bg-primary-light' : 'bg-surface-hover'
                }`}
                style={{ borderRadius: 0 }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
