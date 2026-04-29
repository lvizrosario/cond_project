import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const CorrespondenciasPage = lazyRouteComponent(
  () => import('@/pages/correspondencias/CorrespondenciasPage').then((module) => ({ default: module.CorrespondenciasPage })),
)

export const Route = createFileRoute('/_app/correspondencias')({
  component: CorrespondenciasPage,
})
