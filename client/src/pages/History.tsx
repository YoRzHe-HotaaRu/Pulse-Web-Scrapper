import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import api from '../services/api'
import type { SearchHistory } from '../types'
import SearchHistoryList from '../components/features/SearchHistoryList'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'

export default function History() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<SearchHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showClearModal, setShowClearModal] = useState(false)
  const [clearing, setClearing] = useState(false)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/history')
      setHistory(response.data)
    } catch (err) {
      setError('Failed to load search history. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/history/${id}`)
      setHistory((prev) => prev.filter((h) => h.id !== id))
    } catch {
      setError('Failed to delete history entry.')
    }
  }, [])

  const handleClearAll = useCallback(async () => {
    setClearing(true)
    try {
      await api.delete('/history')
      setHistory([])
      setShowClearModal(false)
    } catch {
      setError('Failed to clear all history.')
    } finally {
      setClearing(false)
    }
  }, [])

  const handleReSearch = useCallback(
    (query: string) => {
      navigate(`/results?q=${encodeURIComponent(query)}`)
    },
    [navigate],
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
          <LoadingSpinner message="Loading history..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div
          className="bg-red-50 border border-red-200 shadow-sm p-6"
          style={{ borderRadius: 0 }}
        >
          <p className="text-status-error font-medium">{error}</p>
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={fetchHistory}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-text-primary">Search History</h1>
      <p className="text-text-secondary mt-1">Your past product searches and their results</p>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-text-tertiary">{history.length} search{history.length !== 1 ? 'es' : ''}</p>
        {history.length > 0 && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowClearModal(true)}
            disabled={clearing}
          >
            Clear All History
          </Button>
        )}
      </div>

      <div className="mt-4">
        {history.length === 0 ? (
          <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
            <EmptyState
              icon={<Clock className="w-16 h-16" />}
              title="No Search History"
              description="Your search history will appear here after you search for products."
              action={{
                label: 'Start Searching',
                onClick: () => navigate('/search'),
              }}
            />
          </div>
        ) : (
          <SearchHistoryList
            history={history}
            onDelete={handleDelete}
            onReSearch={handleReSearch}
            loading={false}
          />
        )}
      </div>

      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All History?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="md" onClick={handleClearAll} loading={clearing}>
              Delete All
            </Button>
          </>
        }
      >
        <p className="text-text-secondary">
          This will permanently delete all your search history. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
