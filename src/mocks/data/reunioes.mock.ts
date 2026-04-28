import type { Reuniao } from '@/types/reunioes.types'

export const mockReunioes: Reuniao[] = [
  {
    id: 'r1',
    titulo: 'Assembleia ordin\u00e1ria de abril',
    descricao: 'Encontro mensal com foco em obras priorit\u00e1rias, inadimpl\u00eancia e aprova\u00e7\u00e3o do cronograma da festa junina.',
    local: 'Sal\u00e3o de festas',
    status: 'publicada',
    dataHora: '2026-04-20T19:30:00Z',
    agenda: ['Prestacao de contas do primeiro trimestre', 'Reforma da guarita', 'Calendario de eventos'],
    participantes: [
      { userId: '1', nome: 'Carlos Eduardo Lima', confirmado: true },
      { userId: '2', nome: 'Fernanda Rocha', confirmado: true },
      { userId: '4', nome: 'Ana Paula Mendes', confirmado: false },
    ],
  },
  {
    id: 'r2',
    titulo: 'Reuni\u00e3o de alinhamento com a administradora',
    descricao: 'Revis\u00e3o de SLA, atendimento e pontos contratuais para a renova\u00e7\u00e3o anual.',
    local: 'Sala da administracao',
    status: 'encerrada',
    dataHora: '2026-03-28T17:00:00Z',
    agenda: ['Status dos chamados', 'Renovacao contratual', 'Plano de comunicacao'],
    participantes: [
      { userId: '1', nome: 'Carlos Eduardo Lima', confirmado: true },
      { userId: '3', nome: 'Roberto Alves', confirmado: true },
    ],
    ata: {
      resumo: 'A administradora apresentou novo fluxo de atendimento e ficou acordado o envio do aditivo contratual ate 05/04.',
      publicadaEm: '2026-03-29T11:00:00Z',
    },
  },
]
