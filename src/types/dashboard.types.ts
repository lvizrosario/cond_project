export type StatColor = 'blue' | 'green' | 'amber' | 'red'
export type DeltaDirection = 'up' | 'down' | 'neutral'

export interface MonthlyRevenue {
  mes: string
  receitaPrevista: number
  receitaRealizada: number
}

export interface RecentPaymentItem {
  moradorId: string
  moradorNome: string
  unidade: string
  valor: number
  status: 'pago' | 'pendente' | 'vencido'
  vencimento: string
}

export interface ActivityItem {
  id: string
  tipo: 'pagamento' | 'reserva' | 'aviso' | 'cadastro'
  descricao: string
  timestamp: string
}

export interface DashboardData {
  stats: {
    totalMoradores: number
    inadimplentes: number
    reservasEsseMes: number
    receitaMesAtual: number
  }
  revenueChart: MonthlyRevenue[]
  recentPayments: RecentPaymentItem[]
  recentActivity: ActivityItem[]
}
