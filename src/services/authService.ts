import { api } from './api'
import type { LoginPayload, RegisterPayload } from '@/types/auth.types'
import type { User } from '@/types/user.types'

interface LoginResponse {
  token: string
  refreshToken: string
  expiresAt: number
  user: User
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
  },

  register: async (payload: RegisterPayload): Promise<void> => {
    await api.post('/auth/register', payload)
  },

  confirmEmail: async (token: string): Promise<void> => {
    await api.get(`/auth/confirm?token=${token}`)
  },
}
