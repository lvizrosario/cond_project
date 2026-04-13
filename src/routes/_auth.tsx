import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) throw redirect({ to: '/inicio' })
  },
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
})
