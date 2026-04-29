import type { DashboardData } from '@/types/dashboard.types'

export const mockDashboardData: DashboardData = {
  stats: {
    totalMoradores: 48,
    inadimplentes: 5,
    reservasEsseMes: 12,
    receitaMesAtual: 18400,
  },
  revenueChart: [
    { mes: 'Nov', receitaPrevista: 19200, receitaRealizada: 18400 },
    { mes: 'Dez', receitaPrevista: 19200, receitaRealizada: 19200 },
    { mes: 'Jan', receitaPrevista: 19200, receitaRealizada: 17600 },
    { mes: 'Fev', receitaPrevista: 19200, receitaRealizada: 18800 },
    { mes: 'Mar', receitaPrevista: 19200, receitaRealizada: 19200 },
    { mes: 'Abr', receitaPrevista: 19200, receitaRealizada: 18400 },
  ],
  recentPayments: [
    { moradorId: '1', moradorNome: 'Carlos Eduardo Lima', unidade: 'A-10', valor: 400, status: 'pago', vencimento: '2026-04-05' },
    { moradorId: '4', moradorNome: 'Ana Paula Mendes', unidade: 'A-22', valor: 400, status: 'pago', vencimento: '2026-04-05' },
    { moradorId: '5', moradorNome: 'Marcos Oliveira', unidade: 'D-07', valor: 400, status: 'vencido', vencimento: '2026-03-05' },
    { moradorId: '3', moradorNome: 'Roberto Alves', unidade: 'C-03', valor: 400, status: 'pendente', vencimento: '2026-04-10' },
    { moradorId: '6', moradorNome: 'Juliana Santos', unidade: 'B-18', valor: 400, status: 'pago', vencimento: '2026-04-05' },
  ],
  recentActivity: [
    { id: 'a1', tipo: 'pagamento', descricao: 'Carlos Eduardo Lima realizou pagamento de abril', timestamp: '2026-04-09T14:32:00Z', userId: '1' },
    { id: 'a2', tipo: 'reserva', descricao: 'Ana Paula Mendes reservou o Salao de Festas para 20/04', timestamp: '2026-04-09T11:15:00Z', userId: '4' },
    { id: 'a3', tipo: 'pagamento', descricao: 'Juliana Santos realizou pagamento de abril', timestamp: '2026-04-08T16:45:00Z', userId: '6' },
    { id: 'a4', tipo: 'aviso', descricao: 'Novo aviso publicado: Manutencao da piscina', timestamp: '2026-04-08T09:00:00Z' },
    { id: 'a5', tipo: 'reserva', descricao: 'Roberto Alves reservou a Churrasqueira para 13/04', timestamp: '2026-04-07T20:10:00Z', userId: '3' },
    { id: 'a6', tipo: 'correspondencia', descricao: 'Ana Paula Mendes recebeu uma correspondencia na portaria', timestamp: '2026-04-12T16:20:00Z', userId: '4' },
  ],
}
