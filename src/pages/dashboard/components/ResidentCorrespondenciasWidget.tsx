import { Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/formatters'
import type { Correspondencia } from '@/types/correspondencias.types'

interface ResidentCorrespondenciasWidgetProps {
  correspondencias: Correspondencia[]
  onClick: () => void
}

export function ResidentCorrespondenciasWidget({ correspondencias, onClick }: ResidentCorrespondenciasWidgetProps) {
  const latestCorrespondencia = correspondencias[0]

  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card className="h-full cursor-pointer border border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface)]">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Correspondencias pendentes</p>
              <p className="mt-1 font-display text-xl font-semibold text-[var(--color-text-primary)]">
                {correspondencias.length}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-brand-100)]">
              <Package className="h-5 w-5 text-[var(--color-brand-500)]" />
            </div>
          </div>

          {latestCorrespondencia ? (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Transportadora</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{latestCorrespondencia.transportadora}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Recebido em</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{formatDate(latestCorrespondencia.recebidoEm)}</p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Clique para abrir o menu de correspondencias e acompanhar as entregas.
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma correspondencia pendente no momento.
            </p>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
