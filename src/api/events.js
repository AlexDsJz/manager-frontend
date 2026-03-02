import client from './client'

const BASE = '/api/v1/events/'

/** GET /api/v1/events/  — paginated: { count, next, previous, results } */
export const getEvents = (params = {}) =>
  client.get(BASE, { params }).then((r) => r.data)

/** GET /api/v1/events/:id/ */
export const getEvent = (id) =>
  client.get(`${BASE}${id}/`).then((r) => r.data)

/** POST /api/v1/events/ */
export const createEvent = (data) =>
  client.post(BASE, data).then((r) => r.data)

/** PATCH /api/v1/events/:id/ */
export const updateEvent = (id, data) =>
  client.patch(`${BASE}${id}/`, data).then((r) => r.data)

/** DELETE /api/v1/events/:id/ */
export const deleteEvent = (id) =>
  client.delete(`${BASE}${id}/`)
