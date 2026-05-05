import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Search,
  BarChart3,
  History,
  Settings,
  FileDown,
  Box,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/search', icon: Search, label: 'Search' },
  { to: '/results', icon: BarChart3, label: 'Results' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/export', icon: FileDown, label: 'Export' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-surface-card border-r border-surface-border flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-surface-border">
        <Box className="w-7 h-7 text-primary" />
        <span className="ml-3 text-lg font-bold text-text-primary tracking-tight">
          PricePulse
        </span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary text-text-inverse shadow-sm'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <span className="text-text-inverse text-xs font-bold">PP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              PricePulse
            </p>
            <p className="text-xs text-text-tertiary">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
