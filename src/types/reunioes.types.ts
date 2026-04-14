export type ReuniaoStatus = 'agendada' | 'publicada' | 'encerrada'

export interface ReuniaoParticipante {
  userId: string
  nome: string
  confirmado: boolean
}

export interface ReuniaoAta {
  resumo: string
  publicadaEm: string
}

export interface Reuniao {
  id: string
  titulo: string
  descricao: string
  local: string
  status: ReuniaoStatus
  dataHora: string
  agenda: string[]
  participantes: ReuniaoParticipante[]
  ata?: ReuniaoAta
}

export interface ReuniaoPayload {
  titulo: string
  descricao: string
  local: string
  dataHora: string
}
