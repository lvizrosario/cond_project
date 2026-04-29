import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { configuracoesService } from '@/services/configuracoesService'
import type { TenantSettings } from '@/types/configuracoes.types'

export function useConfiguracoes() {
  return useQuery({
    queryKey: ['configuracoes'],
    queryFn: configuracoesService.getAll,
  })
}

export function useUpdateConfiguracoes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TenantSettings) => configuracoesService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
      queryClient.invalidateQueries({ queryKey: ['reservas', 'options'] })
    },
  })
}
