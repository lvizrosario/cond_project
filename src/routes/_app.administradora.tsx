import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const AdministradoraPage = lazyRouteComponent(
  () => import('@/pages/administradora/AdministradoraPage').then((module) => ({ default: module.AdministradoraPage })),
)

export const Route = createFileRoute('/_app/administradora')({
  component: AdministradoraPage,
})
