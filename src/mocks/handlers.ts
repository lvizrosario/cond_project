import { http, HttpResponse } from 'msw'
import { mockUsers, MOCK_PASSWORD } from './data/users.mock'
import { mockDashboardData } from './data/dashboard.mock'
import { mockReservations, mockAvailability } from './data/reservations.mock'
import { mockBoletos, mockPaymentSummary } from './data/payments.mock'
import type { CreateReservationPayload } from '@/types/reservas.types'

let reservations = [...mockReservations]
let reservationCounter = mockReservations.length + 1

export const handlers = [
  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; senha: string }
    const user = mockUsers.find((u) => u.email === body.email)
    if (!user || body.senha !== MOCK_PASSWORD) {
      return HttpResponse.json({ message: 'E-mail ou senha incorretos' }, { status: 401 })
    }
    return HttpResponse.json({
      token: 'mock-jwt-token-' + user.id,
      refreshToken: 'mock-refresh-token',
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      user,
    })
  }),

  http.post('/api/auth/register', async () => {
    return HttpResponse.json({ message: 'Cadastro realizado. Verifique seu e-mail.' }, { status: 201 })
  }),

  http.get('/api/auth/confirm', ({ request }) => {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    if (token === 'valid-token') {
      return HttpResponse.json({ message: 'E-mail confirmado com sucesso.' })
    }
    return HttpResponse.json({ message: 'Token inválido ou expirado.' }, { status: 400 })
  }),

  // Users
  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  http.patch('/api/users/:id/roles', async ({ params, request }) => {
    const body = await request.json() as { primary: string | null; isMorador: boolean }
    const idx = mockUsers.findIndex((u) => u.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Usuário não encontrado' }, { status: 404 })
    return HttpResponse.json({ ...mockUsers[idx], roles: body })
  }),

  // Dashboard
  http.get('/api/dashboard', () => {
    return HttpResponse.json(mockDashboardData)
  }),

  // Reservas
  http.get('/api/reservas', ({ request }) => {
    const url = new URL(request.url)
    const area = url.searchParams.get('area')
    const moradorId = url.searchParams.get('moradorId')
    let result = [...reservations]
    if (area) result = result.filter((r) => r.area === area)
    if (moradorId) result = result.filter((r) => r.moradorId === moradorId)
    return HttpResponse.json(result)
  }),

  http.get('/api/reservas/availability/:area', ({ params }) => {
    const avail = mockAvailability[params.area as string]
    return avail
      ? HttpResponse.json(avail)
      : HttpResponse.json({ message: 'Área não encontrada' }, { status: 404 })
  }),

  http.post('/api/reservas', async ({ request }) => {
    const body = await request.json() as CreateReservationPayload
    const newReservation = {
      id: `r${reservationCounter++}`,
      ...body,
      moradorId: '4',
      moradorNome: 'Ana Paula Mendes',
      unidade: 'A-22',
      status: 'confirmada' as const,
      criadoEm: new Date().toISOString(),
    }
    reservations.push(newReservation)
    return HttpResponse.json(newReservation, { status: 201 })
  }),

  http.patch('/api/reservas/:id/cancel', ({ params }) => {
    const idx = reservations.findIndex((r) => r.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Reserva não encontrada' }, { status: 404 })
    reservations[idx] = { ...reservations[idx], status: 'cancelada' }
    return HttpResponse.json(reservations[idx])
  }),

  // Financeiro
  http.get('/api/financeiro/boletos', ({ request }) => {
    const url = new URL(request.url)
    const moradorId = url.searchParams.get('moradorId')
    const result = moradorId ? mockBoletos.filter((b) => b.moradorId === moradorId) : mockBoletos
    return HttpResponse.json(result)
  }),

  http.get('/api/financeiro/summary', () => {
    return HttpResponse.json(mockPaymentSummary)
  }),

  // Permissions
  http.get('/api/acessos/permissions', () => {
    return HttpResponse.json({
      presidente: { inicio: true, acessos: true, administradora: true, avisos: true, configuracoes: true, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
      sindico: { inicio: true, acessos: true, administradora: true, avisos: true, configuracoes: true, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
      conselheiro: { inicio: true, acessos: false, administradora: true, avisos: true, configuracoes: false, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
      morador: { inicio: true, acessos: false, administradora: false, avisos: true, configuracoes: false, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: false },
    })
  }),

  http.patch('/api/acessos/permissions', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),
]
