import { Users, AlertTriangle, Calendar, DollarSign } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { StatCard } from './components/StatCard'
import { RevenueChart } from './components/RevenueChart'
import { PaymentStatusList } from './components/PaymentStatusList'
import { RecentActivityFeed } from './components/RecentActivityFeed'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { formatBRL } from '@/lib/formatters'

export function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const { isAdmin } = useRoleAccess()

  if (isLoading || !data) return <PageSpinner />

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total de Moradores" value={String(data.stats.totalMoradores)} icon={Users} color="blue"
          delta={{ value: 4, direction: 'up' }} />
        <StatCard label="Inadimplentes" value={String(data.stats.inadimplentes)} icon={AlertTriangle} color="red"
          delta={{ value: 1, direction: 'down' }} />
        <StatCard label="Reservas este mês" value={String(data.stats.reservasEsseMes)} icon={Calendar} color="amber" />
        {isAdmin && (
          <StatCard label="Receita do mês" value={formatBRL(data.stats.receitaMesAtual)} icon={DollarSign} color="green"
            delta={{ value: 4.2, direction: 'down' }} />
        )}
      </div>

      {/* Chart + Payments */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RevenueChart data={data.revenueChart} />
          </div>
          <PaymentStatusList payments={data.recentPayments} />
        </div>
      )}

      {/* Activity feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivityFeed activities={data.recentActivity} />
      </div>
    </div>
  )
}
