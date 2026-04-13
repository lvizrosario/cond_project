import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    throw redirect({ to: isAuthenticated ? '/inicio' : '/login' })
  },
  component: () => null,
})
