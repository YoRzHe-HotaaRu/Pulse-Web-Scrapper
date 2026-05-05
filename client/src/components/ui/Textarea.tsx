import { type TextareaHTMLAttributes, forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  rows?: number
  maxLength?: number
  showCount?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, helperText, rows = 4, maxLength, showCount = false, className = '', ...props },
  ref,
) {
  const currentLength =
    typeof props.value === 'string' ? props.value.length : 0

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        className={`input-field resize-y ${
          error ? '!border-status-error !focus:border-status-error !focus:ring-status-error' : ''
        } ${className}`}
        style={{ borderRadius: 0 }}
        {...props}
      />
      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error && <p className="text-xs text-status-error">{error}</p>}
          {!error && helperText && (
            <p className="text-xs text-text-tertiary">{helperText}</p>
          )}
        </div>
        {showCount && maxLength !== undefined && (
          <p className="text-xs text-text-tertiary ml-auto">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  )
})

export default Textarea
