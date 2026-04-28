import { api } from './api'
import type { Aviso, AvisoFilters, AvisoPayload } from '@/types/avisos.types'

export const avisosService = {
  getAll: async (filters?: AvisoFilters): Promise<Aviso[]> => {
    const params = {
      categoria: filters?.categoria && filters.categoria !== 'todas' ? filters.categoria : undefined,
      status: filters?.status && filters.status !== 'todos' ? filters.status : undefined,
    }
    const { data } = await api.get<Aviso[]>('/avisos', { params })
    return data
  },

  getById: async (id: string): Promise<Aviso> => {
    const { data } = await api.get<Aviso>(`/avisos/${id}`)
    return data
  },

  create: async (payload: AvisoPayload): Promise<Aviso> => {
    const { data } = await api.post<Aviso>('/avisos', payload)
    return data
  },

  update: async (id: string, payload: Partial<AvisoPayload>): Promise<Aviso> => {
    const { data } = await api.patch<Aviso>(`/avisos/${id}`, payload)
    return data
  },

  publish: async (id: string): Promise<Aviso> => {
    const { data } = await api.post<Aviso>(`/avisos/${id}/publish`)
    return data
  },

  markAsRead: async (id: string): Promise<Aviso> => {
    const { data } = await api.post<Aviso>(`/avisos/${id}/read`)
    return data
  },
}
