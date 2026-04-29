import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Calendar, DollarSign, Package, Users } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useAuth } from '@/hooks/useAuth'
import { useMyReservations } from '@/hooks/useReservations'
import { useCorrespondencias } from '@/hooks/useCorrespondencias'
import { useMyBoletos } from '@/hooks/useFinanceiro'
import { StatCard } from './components/StatCard'
import { RevenueChart } from './components/RevenueChart'
import { PaymentStatusList } from './components/PaymentStatusList'
import { RecentActivityFeed } from './components/RecentActivityFeed'
import { ResidentFinanceWidget } from './components/ResidentFinanceWidget'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { formatBRL } from '@/lib/formatters'

export function DashboardPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()
  const { user } = useAuth()
  const { isAdmin, isMorador, primaryRole } = useRoleAccess()
  const { data: myReservations, isLoading: isLoadingReservations } = useMyReservations(user?.id ?? '')
  const { data: correspondencias, isLoading: isLoadingCorrespondencias } = useCorrespondencias()
  const { data: myBoletos, isLoading: isLoadingBoletos } = useMyBoletos(user?.id ?? '')

  const isResidentOnly = isMorador && !primaryRole
  const canViewSensitiveStats = primaryRole === 'presidente'

  const myReservationsThisMonth = useMemo(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const safeMyReservations = Array.isArray(myReservations) ? myReservations : []
    return safeMyReservations.filter((item) => new Date(item.dataInicio) >= startOfMonth).length
  }, [myReservations])

  const myPendingCorrespondencias = useMemo(() => {
    const safeCorrespondencias = Array.isArray(correspondencias) ? correspondencias : []
    return safeCorrespondencias.filter((item) => item.destinatarioId === user?.id && item.status === 'recebida')
  }, [correspondencias, user?.id])

  const residentActivities = useMemo(() => {
    const threshold = new Date()
    threshold.setDate(threshold.getDate() - 30)

    return (data?.recentActivity ?? [])
      .filter((item) => item.userId === user?.id)
      .filter((item) => new Date(item.timestamp) >= threshold)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [data?.recentActivity, user?.id])

  const latestIssuedBoleto = useMemo(() => {
    const safeBoletos = Array.isArray(myBoletos) ? myBoletos : []
    return [...safeBoletos].sort((a, b) => new Date(b.dataEmissao).getTime() - new Date(a.dataEmissao).getTime())[0]
  }, [myBoletos])

  if (isLoading || (isResidentOnly && (isLoadingReservations || isLoadingCorrespondencias || isLoadingBoletos)) || !data) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {canViewSensitiveStats && (
          <>
            <StatCard
              label="Total de Moradores"
              value={String(data.stats.totalMoradores)}
              icon={Users}
              color="blue"
              delta={{ value: 4, direction: 'up' }}
            />
            <StatCard
              label="Inadimplentes"
              value={String(data.stats.inadimplentes)}
              icon={AlertTriangle}
              color="red"
              delta={{ value: 1, direction: 'down' }}
            />
          </>
        )}

        <StatCard
          label={isResidentOnly ? 'Minhas Reservas no Mes' : 'Reservas este Mes'}
          value={String(isResidentOnly ? myReservationsThisMonth : data.stats.reservasEsseMes)}
          icon={Calendar}
          color="amber"
          hint={isResidentOnly ? 'Mostra apenas as suas reservas e solicitacoes.' : undefined}
        />

        {isResidentOnly && myPendingCorrespondencias.length > 0 ? (
          <StatCard
            label="Correspondencias Pendentes"
            value={String(myPendingCorrespondencias.length)}
            icon={Package}
            color="blue"
            hint="Clique para abrir o menu de correspondencias."
            onClick={() => navigate({ to: '/correspondencias' })}
          />
        ) : (
          isAdmin && (
            <StatCard
              label="Receita do Mes"
              value={formatBRL(data.stats.receitaMesAtual)}
              icon={DollarSign}
              color="green"
              delta={{ value: 4.2, direction: 'down' }}
            />
          )
        )}
      </div>

      {isResidentOnly && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ResidentFinanceWidget
            boleto={latestIssuedBoleto}
            onClick={() => navigate({ to: '/financeiro' })}
          />
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart data={data.revenueChart} />
          </div>
          <PaymentStatusList payments={data.recentPayments} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivityFeed
          activities={isResidentOnly ? residentActivities : data.recentActivity}
          title={isResidentOnly ? 'Minhas Atividades dos Ultimos 30 Dias' : 'Atividade Recente'}
          emptyMessage={isResidentOnly ? 'Voce nao teve atividades registradas nos ultimos 30 dias.' : 'Nenhuma atividade recente encontrada.'}
        />
      </div>
    </div>
  )
}
