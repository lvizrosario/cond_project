import type { ReactNode } from 'react'
import { useRoleAccess } from '@/hooks/useRoleAccess'

interface RoleGuardProps {
  adminOnly?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ adminOnly, children, fallback = null }: RoleGuardProps) {
  const { isAdmin } = useRoleAccess()
  if (adminOnly && !isAdmin) return <>{fallback}</>
  return <>{children}</>
}
