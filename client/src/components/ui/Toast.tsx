import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const barColorMap: Record<ToastType, string> = {
  success: 'bg-status-success',
  error: 'bg-status-error',
  warning: 'bg-status-warning',
  info: 'bg-status-info',
}

const iconColorMap: Record<ToastType, string> = {
  success: 'text-status-success',
  error: 'text-status-error',
  warning: 'text-status-warning',
  info: 'text-status-info',
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}: ToastProps) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setExiting(false)
      return
    }

    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(onClose, 200)
    }, duration)

    return () => clearTimeout(timer)
  }, [isVisible, duration, onClose])

  if (!isVisible && !exiting) return null

  const Icon = iconMap[type]

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-start bg-white border border-surface-border shadow-lg max-w-sm w-full transition-all duration-200
        ${exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}
      style={{ borderRadius: 0 }}
    >
      <div className={`w-1 self-stretch flex-shrink-0 ${barColorMap[type]}`} />
      <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
        <Icon className={`${iconColorMap[type]} flex-shrink-0`} size={18} />
        <p className="text-sm text-text-primary flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary transition-colors flex-shrink-0"
          style={{ borderRadius: 0 }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
