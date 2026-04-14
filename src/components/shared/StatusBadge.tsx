import { Badge } from '@/components/ui/badge'
import type { PaymentStatus } from '@/types/financeiro.types'
import type { ReservationStatus } from '@/types/reservas.types'

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'outline' }> = {
  pago: { label: 'Pago', variant: 'success' },
  pendente: { label: 'Pendente', variant: 'warning' },
  vencido: { label: 'Vencido', variant: 'danger' },
  cancelado: { label: 'Cancelado', variant: 'outline' },
}

const RESERVATION_CONFIG: Record<ReservationStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'outline' }> = {
  confirmada: { label: 'Confirmada', variant: 'success' },
  pendente: { label: 'Pendente de aprovacao', variant: 'warning' },
  recusada: { label: 'Recusada', variant: 'danger' },
  cancelada: { label: 'Cancelada', variant: 'outline' },
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { label, variant } = PAYMENT_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const { label, variant } = RESERVATION_CONFIG[status]
  return <Badge variant={variant}>{label}</Badge>
}
