import { ReceiptText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { formatBRL, formatCompetencia, formatDate } from '@/lib/formatters'
import type { Boleto } from '@/types/financeiro.types'

interface ResidentFinanceWidgetProps {
  boleto?: Boleto
  onClick: () => void
}

export function ResidentFinanceWidget({ boleto, onClick }: ResidentFinanceWidgetProps) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card className="h-full cursor-pointer border border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface)]">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Ultimo boleto emitido</p>
              <p className="mt-1 font-display text-xl font-semibold text-[var(--color-text-primary)]">
                {boleto ? formatBRL(boleto.valor) : 'Sem boleto'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-success-bg)]">
              <ReceiptText className="h-5 w-5 text-[var(--color-success)]" />
            </div>
          </div>

          {boleto ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <PaymentStatusBadge status={boleto.status} />
                <span className="text-xs text-[var(--color-text-muted)]">
                  Competencia {formatCompetencia(boleto.competencia)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Emissao</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{formatDate(boleto.dataEmissao)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Vencimento</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{formatDate(boleto.dataVencimento)}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Clique para abrir o menu financeiro e consultar este boleto.
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhum boleto foi emitido para este morador ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
