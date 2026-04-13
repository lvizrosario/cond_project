import { useState } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ReservationStatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useReservations, useMyReservations, useCancelReservation } from '@/hooks/useReservations'
import { useAuth } from '@/hooks/useAuth'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { formatDate } from '@/lib/formatters'
import { AREA_LABELS, type AreaCondominio } from '@/types/reservas.types'
import { Calendar } from 'lucide-react'

interface ReservationListProps {
  area: AreaCondominio | null
}

export function ReservationList({ area }: ReservationListProps) {
  const { user } = useAuth()
  const { isAdmin } = useRoleAccess()
  const [cancelId, setCancelId] = useState<string | null>(null)

  const { data: allReservations } = useReservations(area ?? undefined)
  const { data: myReservations } = useMyReservations(user?.id ?? '')
  const cancel = useCancelReservation()

  const myFiltered = myReservations?.filter((r) => !area || r.area === area) ?? []

  const renderList = (reservations: typeof allReservations) => {
    if (!reservations?.length) return <EmptyState icon={Calendar} title="Nenhuma reserva encontrada" />
    return (
      <ul className="space-y-2">
        {reservations.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-white p-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--color-text-primary)]">{AREA_LABELS[r.area]}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {r.moradorNome} · {formatDate(r.dataInicio, 'dd/MM HH:mm')} – {formatDate(r.dataFim, 'HH:mm')}
              </p>
            </div>
            <ReservationStatusBadge status={r.status} />
            {r.status !== 'cancelada' && (r.moradorId === user?.id || isAdmin) && (
              <Button size="sm" variant="ghost" className="shrink-0 text-[var(--color-danger)] hover:text-[var(--color-danger)]"
                onClick={() => setCancelId(r.id)}>
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <>
      {isAdmin ? (
        <Tabs defaultValue="minhas">
          <TabsList>
            <TabsTrigger value="minhas">Minhas Reservas</TabsTrigger>
            <TabsTrigger value="todas">Todas as Reservas</TabsTrigger>
          </TabsList>
          <TabsContent value="minhas">{renderList(myFiltered)}</TabsContent>
          <TabsContent value="todas">{renderList(allReservations)}</TabsContent>
        </Tabs>
      ) : renderList(myFiltered)}

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancelar reserva"
        description="Tem certeza que deseja cancelar esta reserva? Essa ação não pode ser desfeita."
        confirmLabel="Cancelar reserva"
        onConfirm={() => { if (cancelId) cancel.mutate(cancelId, { onSuccess: () => setCancelId(null) }) }}
        isLoading={cancel.isPending}
      />
    </>
  )
}
