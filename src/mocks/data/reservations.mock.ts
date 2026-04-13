import type { Reservation, AreaAvailability } from '@/types/reservas.types'

export const mockReservations: Reservation[] = [
  {
    id: 'r1', area: 'salao_festas', moradorId: '4', moradorNome: 'Ana Paula Mendes', unidade: 'A-22',
    dataInicio: '2026-04-20T14:00:00Z', dataFim: '2026-04-20T22:00:00Z',
    status: 'confirmada', criadoEm: '2026-04-09T11:15:00Z',
  },
  {
    id: 'r2', area: 'churrasqueira', moradorId: '3', moradorNome: 'Roberto Alves', unidade: 'C-03',
    dataInicio: '2026-04-13T11:00:00Z', dataFim: '2026-04-13T17:00:00Z',
    status: 'confirmada', criadoEm: '2026-04-07T20:10:00Z',
  },
  {
    id: 'r3', area: 'quadra', moradorId: '5', moradorNome: 'Marcos Oliveira', unidade: 'D-07',
    dataInicio: '2026-04-12T08:00:00Z', dataFim: '2026-04-12T10:00:00Z',
    status: 'confirmada', criadoEm: '2026-04-06T18:00:00Z',
  },
  {
    id: 'r4', area: 'salao_festas', moradorId: '6', moradorNome: 'Juliana Santos', unidade: 'B-18',
    dataInicio: '2026-04-27T16:00:00Z', dataFim: '2026-04-27T23:00:00Z',
    status: 'pendente', criadoEm: '2026-04-10T08:00:00Z',
  },
  {
    id: 'r5', area: 'churrasqueira', moradorId: '1', moradorNome: 'Carlos Eduardo Lima', unidade: 'A-10',
    dataInicio: '2026-03-30T11:00:00Z', dataFim: '2026-03-30T17:00:00Z',
    status: 'confirmada', criadoEm: '2026-03-25T10:00:00Z',
  },
]

export const mockAvailability: Record<string, AreaAvailability> = {
  salao_festas: { area: 'salao_festas', datasOcupadas: ['2026-04-20', '2026-04-27'] },
  churrasqueira: { area: 'churrasqueira', datasOcupadas: ['2026-04-13'] },
  quadra: { area: 'quadra', datasOcupadas: ['2026-04-12'] },
}
