import { useAuthStore } from '@/store/authStore'
import { hasMenuAccess } from '@/lib/permissions'
import type { MenuKey } from '@/types/user.types'

export function useRoleAccess() {
  const user = useAuthStore((s) => s.user)

  const canAccess = (menu: MenuKey): boolean => {
    if (!user) return false
    return hasMenuAccess(user.roles.primary, menu)
  }

  const isAdmin = user?.roles.primary === 'presidente' || user?.roles.primary === 'sindico'
  const isMorador = user?.roles.isMorador ?? false
  const primaryRole = user?.roles.primary ?? null

  return { canAccess, isAdmin, isMorador, primaryRole }
}
