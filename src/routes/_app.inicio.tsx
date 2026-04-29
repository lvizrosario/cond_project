import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const DashboardPage = lazyRouteComponent(
  () => import('@/pages/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })),
)

export const Route = createFileRoute('/_app/inicio')({ component: DashboardPage })
