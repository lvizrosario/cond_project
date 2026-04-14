import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { correspondenciasService } from '@/services/correspondenciasService'
import type { CorrespondenciaPayload } from '@/types/correspondencias.types'

export function useCorrespondencias() {
  return useQuery({
    queryKey: ['correspondencias'],
    queryFn: correspondenciasService.getAll,
  })
}

export function useCreateCorrespondencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CorrespondenciaPayload) => correspondenciasService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['correspondencias'] }),
  })
}

export function useUpdateCorrespondencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CorrespondenciaPayload> }) => correspondenciasService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['correspondencias'] }),
  })
}

export function usePickupCorrespondencia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => correspondenciasService.pickup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['correspondencias'] }),
  })
}
