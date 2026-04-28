import { api } from './api'
import type { Reuniao, ReuniaoPayload } from '@/types/reunioes.types'

export const reunioesService = {
  getAll: async (): Promise<Reuniao[]> => {
    const { data } = await api.get<Reuniao[]>('/reunioes')
    return data
  },

  create: async (payload: ReuniaoPayload): Promise<Reuniao> => {
    const { data } = await api.post<Reuniao>('/reunioes', payload)
    return data
  },

  update: async (id: string, payload: Partial<ReuniaoPayload>): Promise<Reuniao> => {
    const { data } = await api.patch<Reuniao>(`/reunioes/${id}`, payload)
    return data
  },

  addAgendaItem: async (id: string, pauta: string): Promise<Reuniao> => {
    const { data } = await api.post<Reuniao>(`/reunioes/${id}/agenda-items`, { pauta })
    return data
  },

  publishAta: async (id: string, resumo: string): Promise<Reuniao> => {
    const { data } = await api.post<Reuniao>(`/reunioes/${id}/ata`, { resumo })
    return data
  },
}
