import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReservations, createReservation } from '../api/reservations'

const KEY = ['reservations']

export function useReservations(params = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getReservations(params),
    staleTime: 30_000,
  })
}

export function useCreateReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY })
      // Refresh events so available_spots updates immediately
      qc.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
