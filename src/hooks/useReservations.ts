import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservasService } from '@/services/reservasService'
import type { AreaCondominio, CreateReservationPayload } from '@/types/reservas.types'

export function useReservations(area?: AreaCondominio) {
  return useQuery({
    queryKey: ['reservas', area],
    queryFn: () => reservasService.getAll(area),
  })
}

export function useMyReservations(moradorId: string) {
  return useQuery({
    queryKey: ['reservas', 'mine', moradorId],
    queryFn: () => reservasService.getMine(moradorId),
    enabled: !!moradorId,
  })
}

export function useAreaAvailability(area: AreaCondominio | null) {
  return useQuery({
    queryKey: ['reservas', 'availability', area],
    queryFn: () => reservasService.getAvailability(area!),
    enabled: !!area,
  })
}

export function useReservationOptions() {
  return useQuery({
    queryKey: ['reservas', 'options'],
    queryFn: () => reservasService.getOptions(),
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateReservationPayload) => reservasService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
    },
  })
}

export function useApproveReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reservasService.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
    },
  })
}

export function useRejectReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, motivo }: { id: string; motivo: string }) => reservasService.reject(id, { motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
    },
  })
}

export function useCancelReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => reservasService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservas'] })
    },
  })
}
