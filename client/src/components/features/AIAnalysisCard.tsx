import { Brain, CheckCircle, XCircle } from 'lucide-react'
import type { AIAnalysis } from '../../types'
import LoadingSpinner from '../ui/LoadingSpinner'
import Badge from '../ui/Badge'

interface AIAnalysisCardProps {
  analysis: AIAnalysis
  loading?: boolean
}

function getPriceIndicator(assessment: string): { color: string; label: string } {
  const lower = assessment.toLowerCase()
  if (lower.includes('good') || lower.includes('great') || lower.includes('worth')) {
    return { color: 'bg-status-success', label: 'Good Price' }
  }
  if (lower.includes('fair') || lower.includes('average') || lower.includes('ok')) {
    return { color: 'bg-status-warning', label: 'Fair Price' }
  }
  return { color: 'bg-status-error', label: 'Overpriced' }
}

export default function AIAnalysisCard({ analysis, loading = false }: AIAnalysisCardProps) {
  if (loading) {
    return (
      <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
        <LoadingSpinner message="Analyzing product with AI..." />
      </div>
    )
  }

  const priceIndicator = getPriceIndicator(analysis.priceAssessment)

  return (
    <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
      <div
        className="flex items-center justify-between px-4 py-4 border-b border-surface-border"
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-primary" />
          <h3 className="font-semibold text-text-primary">AI Analysis</h3>
        </div>
        <Badge variant="primary" size="sm">
          Score: {analysis.rating}/10
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Summary
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed">{analysis.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-status-success uppercase tracking-wider mb-2">
              Pros
            </h4>
            <ul className="space-y-2">
              {analysis.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle size={16} className="text-status-success flex-shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-status-error uppercase tracking-wider mb-2">
              Cons
            </h4>
            <ul className="space-y-2">
              {analysis.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <XCircle size={16} className="text-status-error flex-shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Competitor Comparison
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed">
            {analysis.competitorComparison}
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">
            Price Assessment
          </h4>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 flex-shrink-0 ${priceIndicator.color}`}
              style={{ borderRadius: 0 }}
            />
            <span className="text-sm font-medium text-text-primary">{priceIndicator.label}</span>
            <span className="text-sm text-text-secondary">— {analysis.priceAssessment}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
