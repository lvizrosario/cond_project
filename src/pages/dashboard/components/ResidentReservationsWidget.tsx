import { CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ReservationStatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/formatters'
import { AREA_LABELS, type Reservation } from '@/types/reservas.types'

interface ResidentReservationsWidgetProps {
  reservation?: Reservation
  onClick: () => void
}

export function ResidentReservationsWidget({ reservation, onClick }: ResidentReservationsWidgetProps) {
  return (
    <button type="button" onClick={onClick} className="text-left">
      <Card className="h-full cursor-pointer border border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface)]">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Ultima reserva solicitada</p>
              <p className="mt-1 font-display text-xl font-semibold text-[var(--color-text-primary)]">
                {reservation ? AREA_LABELS[reservation.area] : 'Sem reserva'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-100)]">
              <CalendarDays className="h-5 w-5 text-[var(--color-accent-500)]" />
            </div>
          </div>

          {reservation ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <ReservationStatusBadge status={reservation.status} />
                <span className="text-xs text-[var(--color-text-muted)]">{reservation.tipoEvento}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Data</p>
                  <p className="font-medium text-[var(--color-text-primary)]">{formatDate(reservation.dataInicio)}</p>
                </div>
                <div>
                  <p className="text-xs text-[var(--color-text-muted)]">Horario</p>
                  <p className="font-medium text-[var(--color-text-primary)]">
                    {formatDate(reservation.dataInicio, 'HH:mm')} - {formatDate(reservation.dataFim, 'HH:mm')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Clique para abrir o menu de reservas e acompanhar todos os detalhes.
              </p>
            </>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              Nenhuma reserva foi solicitada por este morador ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
