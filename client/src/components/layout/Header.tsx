import { Bell, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface-card border-b border-surface-border flex-shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
          Product Intelligence Dashboard
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-tertiary hover:text-text-primary transition-colors duration-150">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-error" />
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors duration-150">
          <User className="w-4 h-4" />
          <span>Admin</span>
        </button>
      </div>
    </header>
  )
}
