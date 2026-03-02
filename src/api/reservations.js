import client from './client'

const BASE = '/api/v1/reservations/'

/** GET /api/v1/reservations/  — paginated */
export const getReservations = (params = {}) =>
  client.get(BASE, { params }).then((r) => r.data)

/** POST /api/v1/reservations/ */
export const createReservation = (data) =>
  client.post(BASE, data).then((r) => r.data)
