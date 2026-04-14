import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reunioesService } from '@/services/reunioesService'
import type { ReuniaoPayload } from '@/types/reunioes.types'

export function useReunioes() {
  return useQuery({
    queryKey: ['reunioes'],
    queryFn: reunioesService.getAll,
  })
}

export function useCreateReuniao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReuniaoPayload) => reunioesService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reunioes'] }),
  })
}

export function useUpdateReuniao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ReuniaoPayload> }) => reunioesService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reunioes'] }),
  })
}

export function useAddAgendaItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, pauta }: { id: string; pauta: string }) => reunioesService.addAgendaItem(id, pauta),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reunioes'] }),
  })
}

export function usePublishAta() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, resumo }: { id: string; resumo: string }) => reunioesService.publishAta(id, resumo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['reunioes'] }),
  })
}
