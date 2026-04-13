import { api } from './api'
import type { User } from '@/types/user.types'
import type { PrimaryRole } from '@/types/auth.types'

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users')
    return data
  },

  updateRoles: async (
    id: string,
    roles: { primary: PrimaryRole | null; isMorador: boolean },
  ): Promise<User> => {
    const { data } = await api.patch<User>(`/users/${id}/roles`, roles)
    return data
  },

  getPermissions: async () => {
    const { data } = await api.get('/acessos/permissions')
    return data
  },

  updatePermissions: async (permissions: unknown) => {
    const { data } = await api.patch('/acessos/permissions', permissions)
    return data
  },
}
