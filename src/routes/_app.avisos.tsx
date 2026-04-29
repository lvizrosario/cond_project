import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const AvisosPage = lazyRouteComponent(
  () => import('@/pages/avisos/AvisosPage').then((module) => ({ default: module.AvisosPage })),
)

export const Route = createFileRoute('/_app/avisos')({
  component: AvisosPage,
})
