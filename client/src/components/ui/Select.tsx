import { type SelectHTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, helperText, fullWidth, className = '', ...props },
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
        <select
          ref={ref}
          className={`input-field appearance-none pr-10 ${
            error ? '!border-status-error !focus:border-status-error !focus:ring-status-error' : ''
          } ${className}`}
          style={{ borderRadius: 0, WebkitAppearance: 'none', MozAppearance: 'none' }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none">
          <ChevronDown size={16} />
        </span>
      </div>
      {error && <p className="mt-1.5 text-xs text-status-error">{error}</p>}
      {!error && helperText && (
        <p className="mt-1.5 text-xs text-text-tertiary">{helperText}</p>
      )}
    </div>
  )
})

export default Select
