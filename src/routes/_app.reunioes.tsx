import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const ReunioesPage = lazyRouteComponent(
  () => import('@/pages/reunioes/ReunioesPage').then((module) => ({ default: module.ReunioesPage })),
)

export const Route = createFileRoute('/_app/reunioes')({
  component: ReunioesPage,
})
