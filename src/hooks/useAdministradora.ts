import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { administradoraService } from '@/services/administradoraService'
import type { AdministradoraContato, AdministradoraContrato, AdministradoraPayload } from '@/types/administradora.types'

export function useAdministradora() {
  return useQuery({
    queryKey: ['administradora'],
    queryFn: administradoraService.getProfile,
  })
}

export function useUpdateAdministradora() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AdministradoraPayload) => administradoraService.updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['administradora'] }),
  })
}

export function useAddAdministradoraContato() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<AdministradoraContato, 'id'>) => administradoraService.addContact(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['administradora'] }),
  })
}

export function useAddAdministradoraContrato() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Omit<AdministradoraContrato, 'id'>) => administradoraService.addContract(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['administradora'] }),
  })
}
