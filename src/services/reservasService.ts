import { api } from './api'
import type { Reservation, CreateReservationPayload, AreaAvailability, AreaCondominio, RejectReservationPayload, ReservationFormOptions } from '@/types/reservas.types'

export const reservasService = {
  getAll: async (area?: AreaCondominio): Promise<Reservation[]> => {
    const params = area ? { area } : {}
    const { data } = await api.get<Reservation[]>('/reservas', { params })
    return data
  },

  getMine: async (moradorId: string): Promise<Reservation[]> => {
    const { data } = await api.get<Reservation[]>('/reservas', { params: { moradorId } })
    return data
  },

  getAvailability: async (area: AreaCondominio): Promise<AreaAvailability> => {
    const { data } = await api.get<AreaAvailability>(`/reservas/availability/${area}`)
    return data
  },

  getOptions: async (): Promise<ReservationFormOptions> => {
    const { data } = await api.get<ReservationFormOptions>('/reservas/options')
    return data
  },

  create: async (payload: CreateReservationPayload): Promise<Reservation> => {
    const { data } = await api.post<Reservation>('/reservas', payload)
    return data
  },

  approve: async (id: string): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(`/reservas/${id}/approve`)
    return data
  },

  reject: async (id: string, payload: RejectReservationPayload): Promise<Reservation> => {
    const { data } = await api.post<Reservation>(`/reservas/${id}/reject`, payload)
    return data
  },

  cancel: async (id: string): Promise<Reservation> => {
    const { data } = await api.patch<Reservation>(`/reservas/${id}/cancel`)
    return data
  },
}
