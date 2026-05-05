import { useState, useEffect, useCallback, type ElementType } from 'react'
import {
  Key,
  Eye,
  EyeOff,
  Wifi,
  Settings2,
  Info,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react'
import api from '../services/api'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

interface TestResult {
  exa: boolean | null
  openrouter: boolean | null
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: ElementType; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 mt-0.5 text-text-tertiary">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && <p className="text-sm text-text-secondary mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Settings() {
  const [exaKey, setExaKey] = useState('')
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<TestResult>({ exa: null, openrouter: null })
  const [keyStatus, setKeyStatus] = useState<{
    exa: { configured: boolean; savedAt?: string; source?: string }
    openrouter: { configured: boolean; savedAt?: string; source?: string }
  }>({
    exa: { configured: false },
    openrouter: { configured: false },
  })
  const [loading, setLoading] = useState(true)
  const [showKeys, setShowKeys] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [resultsPerPage, setResultsPerPage] = useState(() => {
    return localStorage.getItem('pref_resultsPerPage') || '20'
  })
  const [defaultSort, setDefaultSort] = useState(() => {
    return localStorage.getItem('pref_defaultSort') || 'relevance'
  })
  const [autoAnalysis, setAutoAnalysis] = useState(() => {
    return localStorage.getItem('pref_autoAnalysis') === 'true'
  })

  const fetchKeys = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/settings/keys')
      const data = response.data
      setKeyStatus({
        exa: data.exa || { configured: false },
        openrouter: data.openrouter || { configured: false },
      })
    } catch {
      // Keys endpoint not available yet — ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchKeys()
  }, [fetchKeys])

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveMessage(null)
    try {
      const payload: Record<string, string> = {}
      if (exaKey && !exaKey.includes('****')) payload.exa = exaKey
      if (openRouterKey && !openRouterKey.includes('****')) payload.openrouter = openRouterKey

      if (Object.keys(payload).length > 0) {
        await api.post('/settings/keys', payload)
      }

      const keys = {
        exa: exaKey || '',
        openrouter: openRouterKey || '',
      }
      localStorage.setItem('api_keys', JSON.stringify(keys))

      setKeyStatus(prev => ({
        exa: exaKey ? { configured: true, savedAt: new Date().toISOString(), source: 'db' } : prev.exa,
        openrouter: openRouterKey ? { configured: true, savedAt: new Date().toISOString(), source: 'db' } : prev.openrouter,
      }))

      setSaveMessage('success')
      setTimeout(() => setSaveMessage(null), 3000)
    } catch {
      setSaveMessage('error')
      setTimeout(() => setSaveMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }, [exaKey, openRouterKey])

  const handleTest = useCallback(
    async () => {
      setTesting(true)
      setTestResult({ exa: null, openrouter: null })
      try {
        await api.post('/settings/keys/test', { exa: exaKey, openrouter: openRouterKey })
        setTestResult({ exa: true, openrouter: true })
      } catch {
        setTestResult({ exa: false, openrouter: false })
      } finally {
        setTesting(false)
      }
    },
    [exaKey, openRouterKey],
  )

  const handlePreferenceChange = useCallback(
    (key: string, value: string | boolean) => {
      localStorage.setItem(`pref_${key}`, String(value))
      if (key === 'resultsPerPage') setResultsPerPage(value as string)
      if (key === 'defaultSort') setDefaultSort(value as string)
      if (key === 'autoAnalysis') setAutoAnalysis(value as boolean)
    },
    [],
  )

  const TECH_STACK = [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Express',
    'SQLite',
    'Exa API',
    'OpenRouter',
  ]

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-surface-border shadow-sm" style={{ borderRadius: 0 }}>
          <div className="inline-flex items-center gap-2 p-6">
            <Loader2 className="animate-spin text-primary w-8 h-8" />
            <p className="text-sm text-text-secondary">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <p className="text-text-secondary mt-1">Manage your API keys and application preferences</p>

      {saveMessage && (
        <div
          className={`mt-4 border px-4 py-3 shadow-sm ${
            saveMessage === 'success'
              ? 'bg-green-50 border-green-200 text-status-success'
              : 'bg-red-50 border-red-200 text-status-error'
          }`}
          style={{ borderRadius: 0 }}
        >
          <p className="text-sm font-medium">
            {saveMessage === 'success' ? 'API keys saved successfully.' : 'Failed to save API keys.'}
          </p>
        </div>
      )}

      {/* API Keys Section */}
      <Card className="mt-6">
        <SectionHeader
          icon={Key}
          title="API Keys"
          subtitle="Enter your API keys to enable product searching and AI analysis. Keys are stored securely and sent only with API requests."
        />
        {(keyStatus.exa.configured || keyStatus.openrouter.configured) ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 px-3 py-2 bg-green-50 border border-green-200" style={{ borderRadius: 0 }}>
            <CheckCircle size={16} className="text-status-success flex-shrink-0" />
            <span className="text-sm text-status-success font-medium">API keys configured</span>
            {keyStatus.exa.savedAt && (
              <span className="text-xs text-text-tertiary">Exa &middot; {new Date(keyStatus.exa.savedAt).toLocaleDateString()}</span>
            )}
            {keyStatus.openrouter.savedAt && (
              <span className="text-xs text-text-tertiary">OpenRouter &middot; {new Date(keyStatus.openrouter.savedAt).toLocaleDateString()}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200" style={{ borderRadius: 0 }}>
            <Info size={16} className="text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-700 font-medium">No API keys configured</span>
          </div>
        )}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="block text-sm font-medium text-text-secondary">
                Exa Search API Key
              </label>
              {keyStatus.exa.configured && (
                <Badge variant="success" size="sm">Configured</Badge>
              )}
            </div>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={exaKey}
              onChange={(e) => setExaKey(e.target.value)}
              placeholder={keyStatus.exa.configured ? 'Override saved key...' : 'exa_••••••••••••••••'}
              fullWidth
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              {keyStatus.exa.configured
                ? 'Key is already configured. Keys from .env are loaded automatically on the server.'
                : 'Used for searching products.'}{' '}
              <a
                href="https://dashboard.exa.ai/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get Exa API Key
              </a>
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <label className="block text-sm font-medium text-text-secondary">
                OpenRouter API Key
              </label>
              {keyStatus.openrouter.configured && (
                <Badge variant="success" size="sm">Configured</Badge>
              )}
            </div>
            <Input
              type={showKeys ? 'text' : 'password'}
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              placeholder={keyStatus.openrouter.configured ? 'Override saved key...' : 'sk-or-••••••••••••••••'}
              fullWidth
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              {keyStatus.openrouter.configured
                ? 'Key is already configured. Keys from .env are loaded automatically on the server.'
                : 'Used for AI-powered product analysis.'}{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Get OpenRouter Key
              </a>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              icon={showKeys ? <EyeOff size={16} /> : <Eye size={16} />}
            >
              {showKeys ? 'Hide Keys' : 'Show Keys'}
            </Button>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={saving}
            icon={!saving ? <Key size={16} /> : undefined}
          >
            Save API Keys
          </Button>
        </div>
      </Card>

      {/* Test Connection Section */}
      <Card className="mt-6">
        <SectionHeader
          icon={Wifi}
          title="Test Connection"
          subtitle="Verify that your API keys are working correctly."
        />
        <div className="flex gap-4">
          <div>
            <Button
              variant="secondary"
              size="md"
              onClick={handleTest}
              disabled={testing}
              loading={testing}
              icon={!testing ? <Wifi size={16} /> : undefined}
            >
              Test All Keys
            </Button>
            <div className="flex items-center gap-2 mt-2">
              {testResult.exa === true && testResult.openrouter === true && (
                <>
                  <CheckCircle size={16} className="text-status-success" />
                  <span className="text-sm text-status-success font-medium">All connections successful</span>
                </>
              )}
              {testResult.exa === false && testResult.openrouter === false && (
                <>
                  <XCircle size={16} className="text-status-error" />
                  <span className="text-sm text-status-error font-medium">All connections failed</span>
                </>
              )}
              {testing && (
                <span className="text-sm text-text-tertiary">Testing...</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card className="mt-6">
        <SectionHeader
          icon={Settings2}
          title="Preferences"
          subtitle="Customize your experience"
        />
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Results per page
            </label>
            <select
              value={resultsPerPage}
              onChange={(e) => handlePreferenceChange('resultsPerPage', e.target.value)}
              className="input-field"
              style={{ borderRadius: 0 }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Default sort order
            </label>
            <select
              value={defaultSort}
              onChange={(e) => handlePreferenceChange('defaultSort', e.target.value)}
              className="input-field"
              style={{ borderRadius: 0 }}
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoAnalysis"
              checked={autoAnalysis}
              onChange={(e) => handlePreferenceChange('autoAnalysis', e.target.checked)}
              className="w-4 h-4 border-surface-border text-primary focus:ring-primary"
              style={{ borderRadius: 0 }}
            />
            <label htmlFor="autoAnalysis" className="text-sm text-text-secondary cursor-pointer">
              Automatically analyze products when searching
            </label>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="mt-6">
        <SectionHeader
          icon={Info}
          title="About PricePulse"
        />
        <p className="text-sm text-text-secondary">
          Enterprise-grade product intelligence platform powered by Exa Search and OpenRouter
          AI.
        </p>
        <p className="text-sm text-text-secondary mt-1">
          Version <span className="font-semibold text-text-primary">v1.0.0</span>
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {TECH_STACK.map((tech) => (
            <Badge key={tech} variant="default" size="sm">
              {tech}
            </Badge>
          ))}
        </div>
      </Card>
    </div>
  )
}
