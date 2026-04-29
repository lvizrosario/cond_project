import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AlertTriangle, Calendar, DollarSign, Users } from 'lucide-react'
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
import { ResidentCorrespondenciasWidget } from './components/ResidentCorrespondenciasWidget'
import { ResidentFinanceWidget } from './components/ResidentFinanceWidget'
import { ResidentReservationsWidget } from './components/ResidentReservationsWidget'
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

  const myPendingCorrespondencias = useMemo(() => {
    const safeCorrespondencias = Array.isArray(correspondencias) ? correspondencias : []
    return safeCorrespondencias
      .filter((item) => item.destinatarioId === user?.id && item.status === 'recebida')
      .sort((a, b) => new Date(b.recebidoEm).getTime() - new Date(a.recebidoEm).getTime())
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

  const latestReservation = useMemo(() => {
    const safeMyReservations = Array.isArray(myReservations) ? myReservations : []
    return [...safeMyReservations].sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())[0]
  }, [myReservations])

  if (isLoading || (isResidentOnly && (isLoadingReservations || isLoadingCorrespondencias || isLoadingBoletos)) || !data) {
    return <PageSpinner />
  }

  return (
    <div className="space-y-6">
      {(canViewSensitiveStats || isAdmin) && (
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
            label="Reservas este Mes"
            value={String(data.stats.reservasEsseMes)}
            icon={Calendar}
            color="amber"
          />

          {isAdmin && (
            <StatCard
              label="Receita do Mes"
              value={formatBRL(data.stats.receitaMesAtual)}
              icon={DollarSign}
              color="green"
              delta={{ value: 4.2, direction: 'down' }}
            />
          )}
        </div>
      )}

      {isResidentOnly && (
        <div className="grid auto-rows-fr grid-cols-1 gap-6 lg:grid-cols-3">
          <ResidentFinanceWidget
            boleto={latestIssuedBoleto}
            onClick={() => navigate({ to: '/financeiro' })}
          />
          <ResidentReservationsWidget
            reservation={latestReservation}
            onClick={() => navigate({ to: '/reservas' })}
          />
          <ResidentCorrespondenciasWidget
            correspondencias={myPendingCorrespondencias}
            onClick={() => navigate({ to: '/correspondencias' })}
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
