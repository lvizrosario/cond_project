import { createFileRoute } from '@tanstack/react-router'
import { ReservasPage } from '@/pages/reservas/ReservasPage'
export const Route = createFileRoute('/_app/reservas')({ component: ReservasPage })
