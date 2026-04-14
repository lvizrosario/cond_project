import { http, HttpResponse } from 'msw'
import { mockUsers, MOCK_PASSWORD } from './data/users.mock'
import { mockDashboardData } from './data/dashboard.mock'
import { mockReservations, mockAvailability } from './data/reservations.mock'
import { mockBoletos, mockPaymentSummary } from './data/payments.mock'
import { mockAvisos } from './data/avisos.mock'
import { mockCorrespondencias } from './data/correspondencias.mock'
import { mockDocumentos } from './data/documentos.mock'
import { mockReunioes } from './data/reunioes.mock'
import { mockAdministradora } from './data/administradora.mock'
import { mockConfiguracoes } from './data/configuracoes.mock'
import type { CreateReservationPayload } from '@/types/reservas.types'
import type { AvisoPayload } from '@/types/avisos.types'
import type { CorrespondenciaPayload } from '@/types/correspondencias.types'
import type { DocumentoPayload, DocumentoVersionPayload } from '@/types/documentos.types'
import type { ReuniaoPayload } from '@/types/reunioes.types'
import type { AdministradoraContato, AdministradoraContrato, AdministradoraPayload } from '@/types/administradora.types'
import type { TenantSettings } from '@/types/configuracoes.types'

const reservations = [...mockReservations]
let reservationCounter = mockReservations.length + 1
let avisos = [...mockAvisos]
let avisoCounter = mockAvisos.length + 1
let correspondencias = [...mockCorrespondencias]
let correspondenciaCounter = mockCorrespondencias.length + 1
let documentos = [...mockDocumentos]
let documentoCounter = mockDocumentos.length + 1
let documentoVersionCounter = 50
let reunioes = [...mockReunioes]
let reuniaoCounter = mockReunioes.length + 1
let administradora = { ...mockAdministradora, contatos: [...mockAdministradora.contatos], contratos: [...mockAdministradora.contratos] }
let configuracoes = structuredClone(mockConfiguracoes)

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

  // Avisos
  http.get('/api/avisos', ({ request }) => {
    const url = new URL(request.url)
    const categoria = url.searchParams.get('categoria')
    const status = url.searchParams.get('status')
    let result = [...avisos]
    if (categoria) result = result.filter((item) => item.categoria === categoria)
    if (status) result = result.filter((item) => item.status === status)
    return HttpResponse.json(result)
  }),

  http.get('/api/avisos/:id', ({ params }) => {
    const aviso = avisos.find((item) => item.id === params.id)
    return aviso
      ? HttpResponse.json(aviso)
      : HttpResponse.json({ message: 'Aviso não encontrado' }, { status: 404 })
  }),

  http.post('/api/avisos', async ({ request }) => {
    const body = await request.json() as AvisoPayload
    const newAviso = {
      id: `a${avisoCounter++}`,
      ...body,
      status: 'rascunho' as const,
      criadoEm: new Date().toISOString(),
      criadoPorId: '2',
      criadoPorNome: 'Fernanda Rocha',
      lidoPor: [],
    }
    avisos = [newAviso, ...avisos]
    return HttpResponse.json(newAviso, { status: 201 })
  }),

  http.patch('/api/avisos/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<AvisoPayload>
    const index = avisos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Aviso não encontrado' }, { status: 404 })
    avisos[index] = { ...avisos[index], ...body }
    return HttpResponse.json(avisos[index])
  }),

  http.post('/api/avisos/:id/publish', ({ params }) => {
    const index = avisos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Aviso não encontrado' }, { status: 404 })
    avisos[index] = { ...avisos[index], status: 'publicado', publicadoEm: new Date().toISOString() }
    return HttpResponse.json(avisos[index])
  }),

  http.post('/api/avisos/:id/read', ({ params }) => {
    const index = avisos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Aviso não encontrado' }, { status: 404 })
    if (!avisos[index].lidoPor.includes('4')) {
      avisos[index] = { ...avisos[index], lidoPor: [...avisos[index].lidoPor, '4'] }
    }
    return HttpResponse.json(avisos[index])
  }),

  // Correspondencias
  http.get('/api/correspondencias', () => {
    return HttpResponse.json(correspondencias)
  }),

  http.post('/api/correspondencias', async ({ request }) => {
    const body = await request.json() as CorrespondenciaPayload
    const resident = mockUsers.find((item) => item.id === body.destinatarioId)
    if (!resident) return HttpResponse.json({ message: 'Morador não encontrado' }, { status: 404 })
    const created = {
      id: `c${correspondenciaCounter++}`,
      transportadora: body.transportadora,
      codigoRastreio: body.codigoRastreio,
      destinatarioId: resident.id,
      destinatarioNome: resident.nomeCompleto,
      unidade: `${resident.condominio.quadra}-${resident.condominio.numero}`,
      status: 'recebida' as const,
      observacoes: body.observacoes,
      recebidoEm: new Date().toISOString(),
      recebidoPorNome: 'Portaria Central',
    }
    correspondencias = [created, ...correspondencias]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch('/api/correspondencias/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<CorrespondenciaPayload>
    const index = correspondencias.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Correspondência não encontrada' }, { status: 404 })
    correspondencias[index] = { ...correspondencias[index], ...body }
    return HttpResponse.json(correspondencias[index])
  }),

  http.post('/api/correspondencias/:id/pickup', ({ params }) => {
    const index = correspondencias.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Correspondência não encontrada' }, { status: 404 })
    correspondencias[index] = { ...correspondencias[index], status: 'retirada', retiradoEm: new Date().toISOString() }
    return HttpResponse.json(correspondencias[index])
  }),

  // Documentos
  http.get('/api/documentos', () => {
    return HttpResponse.json(documentos)
  }),

  http.post('/api/documentos', async ({ request }) => {
    const body = await request.json() as DocumentoPayload
    const version = {
      id: `dv${documentoVersionCounter++}`,
      versao: 1,
      arquivoNome: body.arquivoNome,
      criadoEm: new Date().toISOString(),
      criadoPorNome: 'Fernanda Rocha',
    }
    const created = {
      id: `d${documentoCounter++}`,
      titulo: body.titulo,
      categoria: body.categoria,
      audience: body.audience,
      descricao: body.descricao,
      arquivado: false,
      atualizadoEm: version.criadoEm,
      ultimaVersao: version,
      versoes: [version],
    }
    documentos = [created, ...documentos]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.post('/api/documentos/:id/versions', async ({ params, request }) => {
    const body = await request.json() as DocumentoVersionPayload
    const index = documentos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Documento não encontrado' }, { status: 404 })
    const version = {
      id: `dv${documentoVersionCounter++}`,
      versao: documentos[index].ultimaVersao.versao + 1,
      arquivoNome: body.arquivoNome,
      criadoEm: new Date().toISOString(),
      criadoPorNome: 'Carlos Eduardo Lima',
    }
    documentos[index] = {
      ...documentos[index],
      atualizadoEm: version.criadoEm,
      ultimaVersao: version,
      versoes: [version, ...documentos[index].versoes],
    }
    return HttpResponse.json(version, { status: 201 })
  }),

  http.patch('/api/documentos/:id/archive', ({ params }) => {
    const index = documentos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Documento não encontrado' }, { status: 404 })
    documentos[index] = { ...documentos[index], arquivado: true }
    return HttpResponse.json(documentos[index])
  }),

  // Reunioes
  http.get('/api/reunioes', () => {
    return HttpResponse.json(reunioes)
  }),

  http.post('/api/reunioes', async ({ request }) => {
    const body = await request.json() as ReuniaoPayload
    const created = {
      id: `rm${reuniaoCounter++}`,
      ...body,
      status: 'agendada' as const,
      agenda: [],
      participantes: [],
    }
    reunioes = [created, ...reunioes]
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch('/api/reunioes/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<ReuniaoPayload>
    const index = reunioes.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Reunião não encontrada' }, { status: 404 })
    reunioes[index] = { ...reunioes[index], ...body }
    return HttpResponse.json(reunioes[index])
  }),

  http.post('/api/reunioes/:id/agenda-items', async ({ params, request }) => {
    const body = await request.json() as { pauta: string }
    const index = reunioes.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Reunião não encontrada' }, { status: 404 })
    reunioes[index] = { ...reunioes[index], agenda: [...reunioes[index].agenda, body.pauta] }
    return HttpResponse.json(reunioes[index])
  }),

  http.post('/api/reunioes/:id/ata', async ({ params, request }) => {
    const body = await request.json() as { resumo: string }
    const index = reunioes.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Reunião não encontrada' }, { status: 404 })
    reunioes[index] = {
      ...reunioes[index],
      status: 'encerrada',
      ata: { resumo: body.resumo, publicadaEm: new Date().toISOString() },
    }
    return HttpResponse.json(reunioes[index])
  }),

  // Administradora
  http.get('/api/administradora', () => {
    return HttpResponse.json(administradora)
  }),

  http.patch('/api/administradora', async ({ request }) => {
    const body = await request.json() as AdministradoraPayload
    administradora = { ...administradora, ...body }
    return HttpResponse.json(administradora)
  }),

  http.post('/api/administradora/contacts', async ({ request }) => {
    const body = await request.json() as Omit<AdministradoraContato, 'id'>
    const contact = { id: `ac${administradora.contatos.length + 10}`, ...body }
    administradora = { ...administradora, contatos: [contact, ...administradora.contatos] }
    return HttpResponse.json(contact, { status: 201 })
  }),

  http.post('/api/administradora/contracts', async ({ request }) => {
    const body = await request.json() as Omit<AdministradoraContrato, 'id'>
    const contract = { id: `ct${administradora.contratos.length + 10}`, ...body }
    administradora = { ...administradora, contratos: [contract, ...administradora.contratos] }
    return HttpResponse.json(contract, { status: 201 })
  }),

  // Configuracoes
  http.get('/api/configuracoes', () => {
    return HttpResponse.json(configuracoes)
  }),

  http.patch('/api/configuracoes', async ({ request }) => {
    const body = await request.json() as TenantSettings
    configuracoes = body
    return HttpResponse.json(configuracoes)
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
