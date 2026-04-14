import { api } from './api'
import type { TenantSettings } from '@/types/configuracoes.types'

export const configuracoesService = {
  getAll: async (): Promise<TenantSettings> => {
    const { data } = await api.get<TenantSettings>('/configuracoes')
    return data
  },

  update: async (payload: TenantSettings): Promise<TenantSettings> => {
    const { data } = await api.patch<TenantSettings>('/configuracoes', payload)
    return data
  },
}
