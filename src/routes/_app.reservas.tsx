import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const ReservasPage = lazyRouteComponent(
  () => import('@/pages/reservas/ReservasPage').then((module) => ({ default: module.ReservasPage })),
)

export const Route = createFileRoute('/_app/reservas')({ component: ReservasPage })
