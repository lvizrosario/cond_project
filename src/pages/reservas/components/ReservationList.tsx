import { useMemo, useState } from 'react'
import { CheckCircle2, MessageSquareWarning, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ReservationStatusBadge } from '@/components/shared/StatusBadge'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useApproveReservation, useCancelReservation, useMyReservations, useRejectReservation, useReservations } from '@/hooks/useReservations'
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
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const { data: allReservations } = useReservations(area ?? undefined)
  const { data: myReservations } = useMyReservations(user?.id ?? '')
  const approve = useApproveReservation()
  const reject = useRejectReservation()
  const cancel = useCancelReservation()

  const myFiltered = useMemo(
    () => myReservations?.filter((reservation) => !area || reservation.area === area) ?? [],
    [area, myReservations],
  )

  const closeRejectDialog = () => {
    setRejectId(null)
    setRejectReason('')
  }

  const renderList = (reservations: typeof allReservations) => {
    if (!reservations?.length) return <EmptyState icon={Calendar} title="Nenhuma reserva encontrada" />

    return (
      <ul className="space-y-2">
        {reservations.map((reservation) => (
          <li key={reservation.id} className="rounded-lg border border-[var(--color-border)] bg-white p-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-start">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-sm text-[var(--color-text-primary)]">{AREA_LABELS[reservation.area]}</p>
                  <ReservationStatusBadge status={reservation.status} />
                </div>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {reservation.tipoEvento} • {reservation.moradorNome} • {formatDate(reservation.dataInicio, 'dd/MM HH:mm')} - {formatDate(reservation.dataFim, 'HH:mm')}
                </p>
                {reservation.status === 'pendente' && (
                  <p className="mt-1 text-xs text-[var(--color-warning)]">Aguardando aprovacao administrativa</p>
                )}
                {reservation.status === 'recusada' && reservation.motivoRecusa && (
                  <p className="mt-2 rounded-[var(--radius)] bg-[var(--color-danger-bg)] px-3 py-2 text-xs text-[var(--color-danger)]">
                    Motivo da recusa: {reservation.motivoRecusa}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {isAdmin && reservation.status === 'pendente' && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => approve.mutate(reservation.id)}>
                      <CheckCircle2 className="h-4 w-4" />
                      Aprovar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setRejectId(reservation.id)}>
                      <MessageSquareWarning className="h-4 w-4" />
                      Recusar
                    </Button>
                  </>
                )}

                {!['cancelada', 'recusada'].includes(reservation.status) && (reservation.moradorId === user?.id || isAdmin) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[var(--color-danger)] hover:text-[var(--color-danger)]"
                    onClick={() => setCancelId(reservation.id)}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
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

      <Dialog open={!!rejectId} onOpenChange={(open) => !open && closeRejectDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recusar reserva</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Informe o motivo da recusa. Essa justificativa sera exibida ao morador e enviada por e-mail.
            </p>
            <Textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={4}
              placeholder="Descreva o motivo da recusa..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRejectDialog}>Cancelar</Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || reject.isPending}
              onClick={() => {
                if (!rejectId) return
                reject.mutate(
                  { id: rejectId, motivo: rejectReason.trim() },
                  { onSuccess: () => closeRejectDialog() },
                )
              }}
            >
              {reject.isPending ? 'Salvando...' : 'Confirmar recusa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!cancelId}
        onOpenChange={(open) => !open && setCancelId(null)}
        title="Cancelar reserva"
        description="Tem certeza que deseja cancelar esta reserva? Essa acao nao pode ser desfeita."
        confirmLabel="Cancelar reserva"
        onConfirm={() => {
          if (cancelId) {
            cancel.mutate(cancelId, { onSuccess: () => setCancelId(null) })
          }
        }}
        isLoading={cancel.isPending}
      />
    </>
  )
}
