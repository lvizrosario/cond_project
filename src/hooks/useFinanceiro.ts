import { useQuery } from '@tanstack/react-query'
import { financeiroService } from '@/services/financeiroService'

export function useMyBoletos(moradorId: string) {
  return useQuery({
    queryKey: ['boletos', moradorId],
    queryFn: () => financeiroService.getMyBoletos(moradorId),
    enabled: !!moradorId,
  })
}

export function useAllBoletos() {
  return useQuery({
    queryKey: ['boletos'],
    queryFn: financeiroService.getAllBoletos,
  })
}

export function usePaymentSummary() {
  return useQuery({
    queryKey: ['financeiro', 'summary'],
    queryFn: financeiroService.getSummary,
  })
}
