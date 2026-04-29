import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const DocumentosPage = lazyRouteComponent(
  () => import('@/pages/documentos/DocumentosPage').then((module) => ({ default: module.DocumentosPage })),
)

export const Route = createFileRoute('/_app/documentos')({
  component: DocumentosPage,
})
