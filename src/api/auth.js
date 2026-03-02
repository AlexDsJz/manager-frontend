import client from './client'

/** POST /api/v1/auth/token/ → { access, refresh } */
export const login = (username, password) =>
  client.post('/api/v1/auth/token/', { username, password }).then((r) => r.data)

/** POST /api/v1/auth/token/refresh/ → { access } */
export const refreshToken = (refresh) =>
  client.post('/api/v1/auth/token/refresh/', { refresh }).then((r) => r.data)
