import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  fullPage?: boolean
}

const sizeClasses: Record<string, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export default function LoadingSpinner({
  size = 'md',
  message,
  fullPage = false,
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
          {message && (
            <p className="text-sm text-text-secondary">{message}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {message && (
        <p className="text-sm text-text-secondary">{message}</p>
      )}
    </div>
  )
}
