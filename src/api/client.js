import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 300_000, // 5 min — SAT import can be slow
})

// Set auth header synchronously at module load time so the header is
// present on the very first request after a page refresh, before any
// React useEffect has had a chance to run.
const _token = localStorage.getItem('manager_access')
if (_token) {
  client.defaults.headers.common['Authorization'] = `Bearer ${_token}`
}

// On 401, clear tokens and redirect to login
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('manager_access')
      localStorage.removeItem('manager_refresh')
      delete client.defaults.headers.common['Authorization']
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
