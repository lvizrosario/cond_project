import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user.types'
import type { LoginPayload } from '@/types/auth.types'
import { authService } from '@/services/authService'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { token, user } = await authService.login(payload)
          set({ token, user, isAuthenticated: true, isLoading: false })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Erro ao fazer login'
          set({ error: message, isLoading: false })
          throw err
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },

      setUser: (user) => set({ user }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cond-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
