import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { avisosService } from '@/services/avisosService'
import type { AvisoFilters, AvisoPayload } from '@/types/avisos.types'

export function useAvisos(filters?: AvisoFilters) {
  return useQuery({
    queryKey: ['avisos', filters],
    queryFn: () => avisosService.getAll(filters),
  })
}

export function useAviso(id?: string) {
  return useQuery({
    queryKey: ['avisos', id],
    queryFn: () => avisosService.getById(id!),
    enabled: !!id,
  })
}

function useAvisosInvalidation() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['avisos'] })
  }
}

export function useCreateAviso() {
  const invalidate = useAvisosInvalidation()
  return useMutation({
    mutationFn: (payload: AvisoPayload) => avisosService.create(payload),
    onSuccess: invalidate,
  })
}

export function useUpdateAviso() {
  const invalidate = useAvisosInvalidation()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AvisoPayload> }) => avisosService.update(id, payload),
    onSuccess: invalidate,
  })
}

export function usePublishAviso() {
  const invalidate = useAvisosInvalidation()
  return useMutation({
    mutationFn: (id: string) => avisosService.publish(id),
    onSuccess: invalidate,
  })
}

export function useMarkAvisoAsRead() {
  const invalidate = useAvisosInvalidation()
  return useMutation({
    mutationFn: (id: string) => avisosService.markAsRead(id),
    onSuccess: invalidate,
  })
}
