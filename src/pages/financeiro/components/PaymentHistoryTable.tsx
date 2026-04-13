import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { formatBRL, formatDate, formatCompetencia } from '@/lib/formatters'
import type { Boleto } from '@/types/financeiro.types'

interface PaymentHistoryTableProps {
  boletos: Boleto[]
  showMorador?: boolean
}

export function PaymentHistoryTable({ boletos, showMorador }: PaymentHistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            {showMorador && <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Morador</th>}
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Competência</th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)] hidden sm:table-cell">Vencimento</th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Valor</th>
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Status</th>
          </tr>
        </thead>
        <tbody>
          {boletos.map((b) => (
            <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
              {showMorador && (
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-text-primary)]">{b.moradorNome}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">Unidade {b.unidade}</p>
                </td>
              )}
              <td className="px-4 py-3 text-[var(--color-text-primary)] capitalize">{formatCompetencia(b.competencia)}</td>
              <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">{formatDate(b.dataVencimento)}</td>
              <td className="px-4 py-3 font-semibold text-[var(--color-text-primary)]">{formatBRL(b.valor)}</td>
              <td className="px-4 py-3"><PaymentStatusBadge status={b.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
