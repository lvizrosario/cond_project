import type { Correspondencia } from '@/types/correspondencias.types'

export const mockCorrespondencias: Correspondencia[] = [
  {
    id: 'c1',
    transportadora: 'Correios',
    codigoRastreio: 'BR123456789',
    destinatarioId: '4',
    destinatarioNome: 'Ana Paula Mendes',
    unidade: 'A-22',
    status: 'recebida',
    observacoes: 'Envelope registrado recebido na portaria.',
    recebidoEm: '2026-04-12T16:20:00Z',
    recebidoPorNome: 'Portaria Noturna',
  },
  {
    id: 'c2',
    transportadora: 'Mercado Livre',
    codigoRastreio: 'ML9988776655',
    destinatarioId: '5',
    destinatarioNome: 'Marcos Oliveira',
    unidade: 'D-07',
    status: 'retirada',
    recebidoEm: '2026-04-10T14:10:00Z',
    retiradoEm: '2026-04-10T20:30:00Z',
    recebidoPorNome: 'Portaria Diurna',
  },
]
