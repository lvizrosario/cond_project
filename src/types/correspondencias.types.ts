export type CorrespondenciaStatus = 'recebida' | 'retirada'

export interface Correspondencia {
  id: string
  transportadora: string
  codigoRastreio?: string
  destinatarioId: string
  destinatarioNome: string
  unidade: string
  status: CorrespondenciaStatus
  observacoes?: string
  recebidoEm: string
  retiradoEm?: string
  recebidoPorNome: string
}

export interface CorrespondenciaPayload {
  transportadora: string
  codigoRastreio?: string
  destinatarioId: string
  observacoes?: string
}
