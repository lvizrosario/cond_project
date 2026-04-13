import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const { token, user } = useAuthStore.getState()
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (user?.condominio?.id) config.headers['X-Condominio-ID'] = user.condominio.id
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    const message = error.response?.data?.message ?? 'Erro inesperado'
    return Promise.reject(new Error(message))
  },
)
