import { api } from './api'
import type { Correspondencia, CorrespondenciaPayload } from '@/types/correspondencias.types'

export const correspondenciasService = {
  getAll: async (): Promise<Correspondencia[]> => {
    const { data } = await api.get<Correspondencia[]>('/correspondencias')
    return data
  },

  create: async (payload: CorrespondenciaPayload): Promise<Correspondencia> => {
    const { data } = await api.post<Correspondencia>('/correspondencias', payload)
    return data
  },

  update: async (id: string, payload: Partial<CorrespondenciaPayload>): Promise<Correspondencia> => {
    const { data } = await api.patch<Correspondencia>(`/correspondencias/${id}`, payload)
    return data
  },

  pickup: async (id: string): Promise<Correspondencia> => {
    const { data } = await api.post<Correspondencia>(`/correspondencias/${id}/pickup`)
    return data
  },
}
