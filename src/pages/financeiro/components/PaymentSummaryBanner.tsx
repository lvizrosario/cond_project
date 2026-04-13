import { formatBRL } from '@/lib/formatters'
import type { PaymentSummary } from '@/types/financeiro.types'

interface PaymentSummaryBannerProps {
  summary: PaymentSummary
}

export function PaymentSummaryBanner({ summary }: PaymentSummaryBannerProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: 'Total Emitido', value: formatBRL(summary.totalEmitido), color: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]' },
        { label: 'Recebido', value: formatBRL(summary.totalRecebido), color: 'bg-[var(--color-success-bg)] text-[var(--color-success)]' },
        { label: 'Pendente', value: formatBRL(summary.totalPendente), color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' },
        { label: 'Vencido', value: formatBRL(summary.totalVencido), color: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' },
      ].map((item) => (
        <div key={item.label} className={`rounded-[var(--radius-lg)] p-4 ${item.color}`}>
          <p className="text-xs font-medium opacity-80">{item.label}</p>
          <p className="font-display text-xl font-semibold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  )
}
