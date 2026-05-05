import { useState } from 'react'
import { FileJson, FileSpreadsheet } from 'lucide-react'
import Button from '../ui/Button'

type ExportFormat = 'json' | 'csv'

interface ExportOptionsProps {
  onExport: (format: ExportFormat) => void
  loading?: boolean
  productCount?: number
}

export default function ExportOptions({
  onExport,
  loading = false,
  productCount = 0,
}: ExportOptionsProps) {
  const [format, setFormat] = useState<ExportFormat>('json')

  const handleExport = () => {
    onExport(format)
  }

  return (
    <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-primary">Export Data</h3>
        <p className="text-sm text-text-secondary mt-1">
          Export your product data and analysis results
        </p>

        <div className="flex gap-4 mt-5">
          <button
            type="button"
            className={`flex-1 flex flex-col items-center gap-2 p-4 border transition-colors duration-150 ${
              format === 'json'
                ? 'border-primary bg-primary-light'
                : 'border-surface-border bg-white hover:bg-surface-hover'
            }`}
            style={{ borderRadius: 0 }}
            onClick={() => setFormat('json')}
            disabled={loading}
          >
            <FileJson size={32} className="text-text-tertiary" />
            <span className="font-semibold text-text-primary text-sm">JSON</span>
            <span className="text-xs text-text-tertiary text-center">
              Structured data for further processing
            </span>
          </button>

          <button
            type="button"
            className={`flex-1 flex flex-col items-center gap-2 p-4 border transition-colors duration-150 ${
              format === 'csv'
                ? 'border-primary bg-primary-light'
                : 'border-surface-border bg-white hover:bg-surface-hover'
            }`}
            style={{ borderRadius: 0 }}
            onClick={() => setFormat('csv')}
            disabled={loading}
          >
            <FileSpreadsheet size={32} className="text-text-tertiary" />
            <span className="font-semibold text-text-primary text-sm">CSV</span>
            <span className="text-xs text-text-tertiary text-center">
              Open in Excel or Google Sheets
            </span>
          </button>
        </div>

        {productCount > 0 && (
          <p className="text-sm text-text-secondary mt-4">
            {productCount} product{productCount !== 1 ? 's' : ''} will be exported
          </p>
        )}

        <div className="mt-5">
          <Button
            size="lg"
            onClick={handleExport}
            loading={loading}
            disabled={loading || productCount === 0}
            className="w-full"
            icon={!loading ? <FileJson size={16} /> : undefined}
          >
            {loading ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
