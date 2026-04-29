import { createFileRoute } from '@tanstack/react-router'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const FinanceiroPage = lazyRouteComponent(
  () => import('@/pages/financeiro/FinanceiroPage').then((module) => ({ default: module.FinanceiroPage })),
)

export const Route = createFileRoute('/_app/financeiro')({ component: FinanceiroPage })
