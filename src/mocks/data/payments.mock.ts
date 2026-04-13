import type { Boleto, PaymentSummary } from '@/types/financeiro.types'

export const mockBoletos: Boleto[] = [
  {
    id: 'b1', moradorId: '4', moradorNome: 'Ana Paula Mendes', unidade: 'A-22',
    valor: 400, dataVencimento: '2026-04-10', dataEmissao: '2026-04-01',
    status: 'pendente', competencia: '2026-04',
    codigoBarras: '34191.09008 61207.727231 71140.151209 2 100000000040000',
    linhaDigitavel: '34191.09008 61207.727231 71140.151209 2 100000000040000',
  },
  {
    id: 'b2', moradorId: '4', moradorNome: 'Ana Paula Mendes', unidade: 'A-22',
    valor: 400, dataVencimento: '2026-03-10', dataEmissao: '2026-03-01',
    dataPagamento: '2026-03-08', status: 'pago', competencia: '2026-03',
    codigoBarras: '34191.09008 61207.727231 71140.151209 2 100000000040000',
    linhaDigitavel: '34191.09008 61207.727231 71140.151209 2 100000000040000',
  },
  {
    id: 'b3', moradorId: '4', moradorNome: 'Ana Paula Mendes', unidade: 'A-22',
    valor: 400, dataVencimento: '2026-02-10', dataEmissao: '2026-02-01',
    dataPagamento: '2026-02-09', status: 'pago', competencia: '2026-02',
    codigoBarras: '34191.09008 61207.727231 71140.151209 2 100000000040000',
    linhaDigitavel: '34191.09008 61207.727231 71140.151209 2 100000000040000',
  },
  {
    id: 'b4', moradorId: '5', moradorNome: 'Marcos Oliveira', unidade: 'D-07',
    valor: 400, dataVencimento: '2026-03-10', dataEmissao: '2026-03-01',
    status: 'vencido', competencia: '2026-03',
    codigoBarras: '34191.09008 61207.727231 71140.151209 2 100000000040000',
    linhaDigitavel: '34191.09008 61207.727231 71140.151209 2 100000000040000',
  },
  {
    id: 'b5', moradorId: '5', moradorNome: 'Marcos Oliveira', unidade: 'D-07',
    valor: 400, dataVencimento: '2026-04-10', dataEmissao: '2026-04-01',
    status: 'vencido', competencia: '2026-04',
    codigoBarras: '34191.09008 61207.727231 71140.151209 2 100000000040000',
    linhaDigitavel: '34191.09008 61207.727231 71140.151209 2 100000000040000',
  },
]

export const mockPaymentSummary: PaymentSummary = {
  competencia: '2026-04',
  totalEmitido: 19200,
  totalRecebido: 18400,
  totalPendente: 400,
  totalVencido: 400,
  quantidadePagos: 46,
  quantidadePendentes: 1,
  quantidadeVencidos: 1,
}
