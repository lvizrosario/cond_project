export type PaymentStatus = 'pago' | 'pendente' | 'vencido' | 'cancelado'

export interface Boleto {
  id: string
  moradorId: string
  moradorNome: string
  unidade: string
  valor: number
  dataVencimento: string
  dataEmissao: string
  dataPagamento?: string
  status: PaymentStatus
  codigoBarras: string
  linhaDigitavel: string
  competencia: string
  pdfUrl?: string
}

export interface PaymentSummary {
  competencia: string
  totalEmitido: number
  totalRecebido: number
  totalPendente: number
  totalVencido: number
  quantidadePagos: number
  quantidadePendentes: number
  quantidadeVencidos: number
}
