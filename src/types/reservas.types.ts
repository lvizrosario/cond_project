export type AreaCondominio = 'salao_festas' | 'churrasqueira' | 'quadra'
export type ReservationStatus = 'confirmada' | 'pendente' | 'recusada' | 'cancelada'
export type AvailabilityStatus = 'disponivel' | 'confirmada' | 'pendente' | 'bloqueada'

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
  tipoEvento: string
  moradorId: string
  moradorNome: string
  unidade: string
  dataInicio: string
  dataFim: string
  status: ReservationStatus
  observacoes?: string
  criadoEm: string
  aprovadoEm?: string | null
  aprovadoPorId?: string | null
  recusadoEm?: string | null
  recusadoPorId?: string | null
  motivoRecusa?: string | null
}

export interface CreateReservationPayload {
  area: AreaCondominio
  tipoEvento: string
  dataInicio: string
  dataFim: string
  observacoes?: string
}

export interface RejectReservationPayload {
  motivo: string
}

export interface CalendarDateStatus {
  date: string
  status: Exclude<AvailabilityStatus, 'disponivel'>
  label: string
  reservationId?: string
  relatedArea?: AreaCondominio
}

export interface AreaAvailability {
  area: AreaCondominio
  datas: CalendarDateStatus[]
}

export interface ReservationFormOptions {
  tiposEventoPermitidos: string[]
}
