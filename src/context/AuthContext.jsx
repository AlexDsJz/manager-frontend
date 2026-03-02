import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { login as apiLogin } from '../api/auth'
import client from '../api/client'

const AuthContext = createContext(null)

/** Decode JWT payload without a library (it's just base64). */
function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

const STORAGE_KEY = 'manager_access'
const REFRESH_KEY = 'manager_refresh'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    return token ? decodeToken(token) : null
  })

  // Keep axios Authorization header in sync
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete client.defaults.headers.common['Authorization']
    }
  }, [user])

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password)
    localStorage.setItem(STORAGE_KEY, data.access)
    localStorage.setItem(REFRESH_KEY, data.refresh)
    client.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
    setUser(decodeToken(data.access))
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(REFRESH_KEY)
    delete client.defaults.headers.common['Authorization']
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.is_staff === true }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
