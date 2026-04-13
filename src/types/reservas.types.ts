export type AreaCondominio = 'salao_festas' | 'churrasqueira' | 'quadra'
export type ReservationStatus = 'confirmada' | 'pendente' | 'cancelada'

export const AREA_LABELS: Record<AreaCondominio, string> = {
  salao_festas: 'Salão de Festas',
  churrasqueira: 'Churrasqueira',
  quadra: 'Quadra Esportiva',
}

export const AREA_CAPACITY: Record<AreaCondominio, string> = {
  salao_festas: 'Até 80 pessoas',
  churrasqueira: 'Até 20 pessoas',
  quadra: 'Até 16 pessoas',
}

export interface Reservation {
  id: string
  area: AreaCondominio
  moradorId: string
  moradorNome: string
  unidade: string
  dataInicio: string
  dataFim: string
  status: ReservationStatus
  observacoes?: string
  criadoEm: string
}

export interface CreateReservationPayload {
  area: AreaCondominio
  dataInicio: string
  dataFim: string
  observacoes?: string
}

export interface AreaAvailability {
  area: AreaCondominio
  datasOcupadas: string[]
}
