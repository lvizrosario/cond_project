import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const ConfiguracoesPage = lazyRouteComponent(
  () => import('@/pages/configuracoes/ConfiguracoesPage').then((module) => ({ default: module.ConfiguracoesPage })),
)

export const Route = createFileRoute('/_app/configuracoes')({
  component: ConfiguracoesPage,
})
