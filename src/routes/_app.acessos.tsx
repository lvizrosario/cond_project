import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { hasMenuAccess } from '@/lib/permissions'
import { lazyRouteComponent } from '@/lib/lazyRoute'

const AcessosPage = lazyRouteComponent(
  () => import('@/pages/acessos/AcessosPage').then((module) => ({ default: module.AcessosPage })),
)

export const Route = createFileRoute('/_app/acessos')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || !hasMenuAccess(user.roles.primary, 'acessos')) {
      throw redirect({ to: '/inicio' })
    }
  },
  component: AcessosPage,
})
