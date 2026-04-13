import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { AreaCard } from './components/AreaCard'
import { ReservationList } from './components/ReservationList'
import { NewReservationDialog } from './components/NewReservationDialog'
import { useAreaAvailability } from '@/hooks/useReservations'
import { type AreaCondominio } from '@/types/reservas.types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const AREAS: AreaCondominio[] = ['salao_festas', 'churrasqueira', 'quadra']

export function ReservasPage() {
  const [selectedArea, setSelectedArea] = useState<AreaCondominio>('salao_festas')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const { data: availability } = useAreaAvailability(selectedArea)
  const occupiedDates = new Set(availability?.datasOcupadas ?? [])

  const today = new Date()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1))

  const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
  const isPast = (d: Date) => d < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isOccupied = (d: Date) => occupiedDates.has(dateStr(d))

  return (
    <div>
      <PageHeader
        title="Reservas"
        description="Reserve as áreas comuns do condomínio"
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova reserva
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Area cards */}
        <div className="lg:col-span-1 space-y-3">
          {AREAS.map((area) => (
            <AreaCard key={area} area={area} selected={selectedArea === area} onSelect={() => setSelectedArea(area)} />
          ))}
        </div>

        {/* Calendar + list */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simple month grid */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
            <p className="font-display font-semibold text-sm text-[var(--color-text-primary)] mb-3 capitalize">
              {format(today, "MMMM 'de' yyyy", { locale: ptBR })}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-[var(--color-text-muted)] mb-1">
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d) => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: days[0].getDay() }).map((_, i) => <div key={i} />)}
              {days.map((day) => {
                const occupied = isOccupied(day)
                const past = isPast(day)
                const selected = selectedDate && dateStr(day) === dateStr(selectedDate)
                return (
                  <button
                    key={dateStr(day)}
                    disabled={past || occupied}
                    onClick={() => { setSelectedDate(day); setDialogOpen(true) }}
                    className={`relative flex h-8 w-full items-center justify-center rounded-md text-sm transition-colors
                      ${past ? 'text-[var(--color-text-muted)] cursor-not-allowed' : ''}
                      ${occupied ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] cursor-not-allowed' : ''}
                      ${!past && !occupied ? 'hover:bg-[var(--color-brand-100)] cursor-pointer' : ''}
                      ${selected ? 'bg-[var(--color-brand-500)] text-white hover:bg-[var(--color-brand-500)]' : ''}
                    `}
                  >
                    {day.getDate()}
                    {occupied && <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-danger)]" />}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-danger-bg)]" />Ocupado</span>
              <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-[var(--color-brand-100)]" />Disponível</span>
            </div>
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
