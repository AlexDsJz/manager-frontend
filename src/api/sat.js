import client from './client'

/** POST /api/v1/sat/batches/trigger/ — runs SAT download synchronously */
export const triggerImport = () =>
  client.post('/api/v1/sat/batches/trigger/').then((r) => r.data)

/** GET /api/v1/sat/batches/ — paginated import history */
export const getBatches = (params = {}) =>
  client.get('/api/v1/sat/batches/', { params }).then((r) => r.data)

/** GET /api/v1/sat/canceled/ — paginated canceled taxpayer records */
export const getCanceledTaxpayers = (params = {}) =>
  client.get('/api/v1/sat/canceled/', { params }).then((r) => r.data)
