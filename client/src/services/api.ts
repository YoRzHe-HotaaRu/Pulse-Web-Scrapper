import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const keys = localStorage.getItem('api_keys')
  if (keys) {
    const parsed = JSON.parse(keys)
    if (parsed.exa) config.headers['x-exa-api-key'] = parsed.exa
    if (parsed.openrouter) config.headers['x-openrouter-api-key'] = parsed.openrouter
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type']
    const isJson = typeof contentType === 'string' && contentType.includes('application/json')
    if (isJson && response.data?.success === true && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (error.response?.data?.success === false && error.response.data.error?.message) {
      error.message = error.response.data.error.message
    }
    return Promise.reject(error)
  },
)

export default api
