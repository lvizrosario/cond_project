import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { formatBRL, formatDate, getInitials } from '@/lib/formatters'
import type { RecentPaymentItem } from '@/types/dashboard.types'

interface PaymentStatusListProps {
  payments: RecentPaymentItem[]
}

export function PaymentStatusList({ payments }: PaymentStatusListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {payments.map((p, i) => (
            <li key={p.moradorId + i} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-500)] text-xs font-semibold">
                {getInitials(p.moradorNome)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{p.moradorNome}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Unidade {p.unidade} · Venc. {formatDate(p.vencimento)}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">{formatBRL(p.valor)}</p>
                <PaymentStatusBadge status={p.status} />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
