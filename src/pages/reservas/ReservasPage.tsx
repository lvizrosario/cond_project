import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AreaCard } from './components/AreaCard'
import { ReservationList } from './components/ReservationList'
import { NewReservationDialog } from './components/NewReservationDialog'
import { useAreaAvailability } from '@/hooks/useReservations'
import { type AreaCondominio, type AvailabilityStatus } from '@/types/reservas.types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const AREAS: AreaCondominio[] = ['salao_festas', 'churrasqueira', 'quadra']

const STATUS_STYLES: Record<Exclude<AvailabilityStatus, 'disponivel'>, { cell: string; dot: string; label: string }> = {
  confirmada: {
    cell: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] cursor-not-allowed',
    dot: 'bg-[var(--color-danger)]',
    label: 'Confirmada',
  },
  pendente: {
    cell: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)] cursor-not-allowed',
    dot: 'bg-[var(--color-warning)]',
    label: 'Pendente',
  },
  bloqueada: {
    cell: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)] cursor-not-allowed',
    dot: 'bg-[var(--color-brand-500)]',
    label: 'Bloqueada',
  },
}

export function ReservasPage() {
  const [selectedArea, setSelectedArea] = useState<AreaCondominio>('salao_festas')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: availability } = useAreaAvailability(selectedArea)
  const availabilityMap = useMemo(
    () => new Map((availability?.datas ?? []).map((item) => [item.date, item])),
    [availability],
  )

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1))

  const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
  const isPast = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div>
      <PageHeader
        title="Reservas"
        description="Solicite reservas e acompanhe o status de aprovação das áreas comuns."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Reservar
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-3">
          {AREAS.map((area) => (
            <AreaCard key={area} area={area} selected={selectedArea === area} onSelect={() => setSelectedArea(area)} />
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
            <p className="mb-3 font-display text-sm font-semibold capitalize text-[var(--color-text-primary)]">
              {format(today, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-text-muted)]">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={i} />)}
              {days.map((day) => {
                const statusInfo = availabilityMap.get(dateStr(day))
                const past = isPast(day)
                const selected = selectedDate && dateStr(day) === dateStr(selectedDate)
                const disabled = past || !!statusInfo
                const statusStyle = statusInfo ? STATUS_STYLES[statusInfo.status] : null

                return (
                  <button
                    key={dateStr(day)}
                    type="button"
                    disabled={disabled}
                    title={statusInfo?.label ?? 'Disponivel para solicitação'}
                    onClick={() => { setSelectedDate(day); setDialogOpen(true) }}
                    className={`relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors
                      ${past ? 'cursor-not-allowed text-[var(--color-text-muted)]' : ''}
                      ${statusStyle ? statusStyle.cell : 'hover:bg-[var(--color-success-bg)] cursor-pointer'}
                      ${selected ? 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-500)]' : ''}
                    `}
                  >
                    {day.getDate()}
                    {statusStyle && <span className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${statusStyle.dot}`} />}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-success-bg)]" />Disponivel</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-danger-bg)]" />Confirmada</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-warning-bg)]" />Pendente</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-brand-100)]" />Bloqueada</span>
            </div>
            {selectedDate && (
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                Data selecionada: <strong>{format(selectedDate, 'dd/MM/yyyy')}</strong>. A solicitação seguirá para aprovação administrativa.
              </p>
            )}
          </div>

          <ReservationList area={selectedArea} />
        </div>
      </div>

      {dialogOpen && (
        <NewReservationDialog
          area={selectedArea}
          selectedDate={selectedDate}
          open={dialogOpen}
          onOpenChange={(open) => { setDialogOpen(open); if (!open) setSelectedDate(null) }}
        />
      )}
    </div>
  )
}
