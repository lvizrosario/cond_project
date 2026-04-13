import { PageHeader } from '@/components/layout/PageHeader'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { PaymentSummaryBanner } from './components/PaymentSummaryBanner'
import { BoletoCard } from './components/BoletoCard'
import { PaymentHistoryTable } from './components/PaymentHistoryTable'
import { useMyBoletos, useAllBoletos, usePaymentSummary } from '@/hooks/useFinanceiro'
import { useAuth } from '@/hooks/useAuth'
import { useRoleAccess } from '@/hooks/useRoleAccess'

export function FinanceiroPage() {
  const { user } = useAuth()
  const { isAdmin } = useRoleAccess()
  const { data: summary, isLoading: summaryLoading } = usePaymentSummary()
  const { data: myBoletos, isLoading: myLoading } = useMyBoletos(user?.id ?? '')
  const { data: allBoletos, isLoading: allLoading } = useAllBoletos()

  const isLoading = summaryLoading || myLoading || (isAdmin && allLoading)
  if (isLoading) return <PageSpinner />

  const currentBoleto = myBoletos?.[0] // Most recent
  const historyBoletos = myBoletos?.slice(1) ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Financeiro" description="Acompanhe seus pagamentos e boletos" />

      {/* Admin summary */}
      <RoleGuard adminOnly>
        {summary && <PaymentSummaryBanner summary={summary} />}
      </RoleGuard>

      {/* Current boleto */}
      {currentBoleto && (
        <div>
          <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)] mb-3">Boleto atual</h3>
          <div className="max-w-sm">
            <BoletoCard boleto={currentBoleto} />
          </div>
        </div>
      )}

      {/* History */}
      {historyBoletos.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)] mb-3">Histórico de pagamentos</h3>
          <PaymentHistoryTable boletos={historyBoletos} />
        </div>
      )}

      {/* Admin: all boletos */}
      <RoleGuard adminOnly>
        <div>
          <h3 className="font-display font-semibold text-base text-[var(--color-text-primary)] mb-3">Todos os boletos</h3>
          <PaymentHistoryTable boletos={allBoletos ?? []} showMorador />
        </div>
      </RoleGuard>
    </div>
  )
}
