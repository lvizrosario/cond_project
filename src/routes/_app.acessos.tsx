import { createFileRoute, redirect } from '@tanstack/react-router'
import { AcessosPage } from '@/pages/acessos/AcessosPage'
import { useAuthStore } from '@/store/authStore'
import { hasMenuAccess } from '@/lib/permissions'

export const Route = createFileRoute('/_app/acessos')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (!user || !hasMenuAccess(user.roles.primary, 'acessos')) {
      throw redirect({ to: '/inicio' })
    }
  },
  component: AcessosPage,
})
