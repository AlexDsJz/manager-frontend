import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { triggerImport, getBatches, getCanceledTaxpayers } from '../api/sat'

export function useSATBatches(params = {}) {
  return useQuery({
    queryKey: ['sat-batches', params],
    queryFn: () => getBatches(params),
    staleTime: 60_000,
  })
}

export function useTriggerImport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: triggerImport,
    // Use onSettled so the list always refreshes, whether the import
    // succeeded or failed — the new batch (FAILED/SUCCESS) must appear.
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['sat-batches'] })
      qc.invalidateQueries({ queryKey: ['sat-canceled'] })
    },
  })
}

export function useCanceledTaxpayers(params = {}) {
  return useQuery({
    queryKey: ['sat-canceled', params],
    queryFn: () => getCanceledTaxpayers(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev, // keep previous data while fetching next page
  })
}
