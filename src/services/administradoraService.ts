import { api } from './api'
import type { AdministradoraContato, AdministradoraContrato, AdministradoraPayload, AdministradoraPerfil } from '@/types/administradora.types'

export const administradoraService = {
  getProfile: async (): Promise<AdministradoraPerfil> => {
    const { data } = await api.get<AdministradoraPerfil>('/administradora')
    return data
  },

  updateProfile: async (payload: AdministradoraPayload): Promise<AdministradoraPerfil> => {
    const { data } = await api.patch<AdministradoraPerfil>('/administradora', payload)
    return data
  },

  addContact: async (payload: Omit<AdministradoraContato, 'id'>): Promise<AdministradoraContato> => {
    const { data } = await api.post<AdministradoraContato>('/administradora/contacts', payload)
    return data
  },

  addContract: async (payload: Omit<AdministradoraContrato, 'id'>): Promise<AdministradoraContrato> => {
    const { data } = await api.post<AdministradoraContrato>('/administradora/contracts', payload)
    return data
  },
}
