import { type ReactNode, type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    helperText,
    icon,
    iconPosition = 'left',
    fullWidth,
    className = '',
    ...props
  },
  ref,
) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`input-field ${
            error ? '!border-status-error !focus:border-status-error !focus:ring-status-error' : ''
          } ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${
            icon && iconPosition === 'right' ? 'pr-10' : ''
          } ${className}`}
          style={{ borderRadius: 0 }}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {icon}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-status-error">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-text-tertiary">{helperText}</p>
      )}
    </div>
  )
})

export default Input
