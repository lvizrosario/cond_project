import { api } from './api'
import type { Boleto, PaymentSummary } from '@/types/financeiro.types'

export const financeiroService = {
  getMyBoletos: async (moradorId: string): Promise<Boleto[]> => {
    const { data } = await api.get<Boleto[]>('/financeiro/boletos', { params: { moradorId } })
    return data
  },

  getAllBoletos: async (): Promise<Boleto[]> => {
    const { data } = await api.get<Boleto[]>('/financeiro/boletos')
    return data
  },

  getSummary: async (): Promise<PaymentSummary> => {
    const { data } = await api.get<PaymentSummary>('/financeiro/summary')
    return data
  },
}
