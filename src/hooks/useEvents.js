import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/events'

const KEY = ['events']

export function useEvents(params = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => getEvents(params),
    staleTime: 30_000,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  })
}
