import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reservationSchema, type ReservationFormData } from '@/lib/validators'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateReservation } from '@/hooks/useReservations'
import { AREA_LABELS, type AreaCondominio } from '@/types/reservas.types'

interface NewReservationDialogProps {
  area: AreaCondominio
  selectedDate: Date | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewReservationDialog({ area, selectedDate, open, onOpenChange }: NewReservationDialogProps) {
  const { mutate, isPending } = useCreateReservation()

  const dateStr = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    : ''

  const { register, handleSubmit, formState: { errors } } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      area,
      dataInicio: dateStr ? `${dateStr}T09:00` : '',
      dataFim: dateStr ? `${dateStr}T17:00` : '',
    },
  })

  const onSubmit = (data: ReservationFormData) => {
    mutate({
      area: data.area,
      dataInicio: new Date(data.dataInicio).toISOString(),
      dataFim: new Date(data.dataFim).toISOString(),
      observacoes: data.observacoes,
    }, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Reserva — {AREA_LABELS[area]}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('area')} value={area} />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Input type="datetime-local" {...register('dataInicio')} />
              {errors.dataInicio && <p className="text-xs text-[var(--color-danger)]">{errors.dataInicio.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Término</Label>
              <Input type="datetime-local" {...register('dataFim')} />
              {errors.dataFim && <p className="text-xs text-[var(--color-danger)]">{errors.dataFim.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Observações (opcional)</Label>
            <textarea
              {...register('observacoes')}
              rows={3}
              placeholder="Informações adicionais sobre o evento…"
              className="flex w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Reservando…' : 'Confirmar Reserva'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
