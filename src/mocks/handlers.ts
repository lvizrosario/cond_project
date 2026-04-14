import { http, HttpResponse } from 'msw'
import { mockUsers, MOCK_PASSWORD } from './data/users.mock'
import { mockDashboardData } from './data/dashboard.mock'
import { mockReservations } from './data/reservations.mock'
import { mockBoletos, mockPaymentSummary } from './data/payments.mock'
import { mockAvisos } from './data/avisos.mock'
import { mockCorrespondencias } from './data/correspondencias.mock'
import { mockDocumentos } from './data/documentos.mock'
import { mockReunioes } from './data/reunioes.mock'
import { mockAdministradora } from './data/administradora.mock'
import { mockConfiguracoes } from './data/configuracoes.mock'
import type { CreateReservationPayload, AreaCondominio, RejectReservationPayload } from '@/types/reservas.types'
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

const LINKED_RESERVATION_AREAS: Partial<Record<AreaCondominio, AreaCondominio>> = {
  salao_festas: 'churrasqueira',
  churrasqueira: 'salao_festas',
}

function toDateKey(value: string) {
  return value.slice(0, 10)
}

function hasTimeOverlap(startA: string, endA: string, startB: string, endB: string) {
  const aStart = new Date(startA).getTime()
  const aEnd = new Date(endA).getTime()
  const bStart = new Date(startB).getTime()
  const bEnd = new Date(endB).getTime()
  return aStart < bEnd && bStart < aEnd
}

function getLinkedAreaLabel(area: AreaCondominio) {
  return area === 'churrasqueira' ? 'a churrasqueira' : 'o salao de festas'
}

function isBlockingReservationStatus(status: string) {
  return status === 'pendente' || status === 'confirmada'
}

function getReservationOptions() {
  return {
    tiposEventoPermitidos: configuracoes.reservas.tiposEventoPermitidos,
  }
}

function getReservationAvailability(area: AreaCondominio) {
  const linkedArea = LINKED_RESERVATION_AREAS[area]
  const statuses = reservations
    .filter((reservation) => isBlockingReservationStatus(reservation.status))
    .flatMap((reservation) => {
      const date = toDateKey(reservation.dataInicio)
      const items: Array<Record<string, string>> = []

      if (reservation.area === area) {
        items.push({
          date,
          status: reservation.status,
          label: reservation.status === 'pendente' ? 'Aguardando aprovacao do administrador' : 'Reserva confirmada',
          relatedArea: reservation.area,
        })
      }

      if (linkedArea && reservation.area === linkedArea) {
        items.push({
          date,
          status: 'bloqueada',
          label: `Bloqueado porque ${getLinkedAreaLabel(linkedArea)} esta ${reservation.status === 'pendente' ? 'com solicitacao pendente' : 'reservada'} no mesmo dia`,
          relatedArea: linkedArea,
        })
      }

      return items
    })

  const priority: Record<string, number> = { confirmada: 3, bloqueada: 2, pendente: 1 }
  const deduped = Object.values(
    statuses.reduce<Record<string, Record<string, string>>>((acc, item) => {
      const current = acc[item.date]
      if (!current || priority[item.status] > priority[current.status]) {
        acc[item.date] = item
      }
      return acc
    }, {}),
  )

  return { area, datas: deduped.sort((a, b) => a.date.localeCompare(b.date)) }
}

function hasReservationConflict(payload: CreateReservationPayload) {
  const linkedArea = LINKED_RESERVATION_AREAS[payload.area]
  const requestedDate = toDateKey(payload.dataInicio)

  return reservations.some((reservation) => {
    if (!isBlockingReservationStatus(reservation.status)) return false
    if (reservation.area === payload.area) {
      return hasTimeOverlap(reservation.dataInicio, reservation.dataFim, payload.dataInicio, payload.dataFim)
    }
    if (linkedArea && reservation.area === linkedArea) {
      return toDateKey(reservation.dataInicio) === requestedDate
    }
    return false
  })
}

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; senha: string }
    const user = mockUsers.find((u) => u.email === body.email)
    if (!user || body.senha !== MOCK_PASSWORD) {
      return HttpResponse.json({ message: 'E-mail ou senha incorretos' }, { status: 401 })
    }
    return HttpResponse.json({
      token: `mock-jwt-token-${user.id}`,
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
    return HttpResponse.json({ message: 'Token invalido ou expirado.' }, { status: 400 })
  }),

  http.get('/api/users', () => {
    return HttpResponse.json(mockUsers)
  }),

  http.patch('/api/users/:id/roles', async ({ params, request }) => {
    const body = await request.json() as { primary: string | null; isMorador: boolean }
    const idx = mockUsers.findIndex((u) => u.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Usuario nao encontrado' }, { status: 404 })
    return HttpResponse.json({ ...mockUsers[idx], roles: body })
  }),

  http.get('/api/dashboard', () => {
    return HttpResponse.json(mockDashboardData)
  }),

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
    return HttpResponse.json(getReservationAvailability(params.area as AreaCondominio))
  }),

  http.get('/api/reservas/options', () => {
    return HttpResponse.json(getReservationOptions())
  }),

  http.post('/api/reservas', async ({ request }) => {
    const body = await request.json() as CreateReservationPayload
    if (!body.tipoEvento || !getReservationOptions().tiposEventoPermitidos.includes(body.tipoEvento)) {
      return HttpResponse.json({ message: 'O tipo de evento informado nao esta habilitado nas configuracoes do condominio' }, { status: 400 })
    }
    if (new Date(body.dataFim) <= new Date(body.dataInicio)) {
      return HttpResponse.json({ message: 'O termino deve ser posterior ao inicio' }, { status: 400 })
    }
    if (hasReservationConflict(body)) {
      return HttpResponse.json({ message: 'Este periodo nao esta disponivel para reserva ou esta bloqueado por outra area vinculada' }, { status: 400 })
    }

    const newReservation = {
      id: `r${reservationCounter++}`,
      ...body,
      moradorId: '4',
      moradorNome: 'Ana Paula Mendes',
      unidade: 'A-22',
      status: 'pendente' as const,
      criadoEm: new Date().toISOString(),
      aprovadoEm: null,
      aprovadoPorId: null,
      recusadoEm: null,
      recusadoPorId: null,
      motivoRecusa: null,
    }
    reservations.push(newReservation)
    return HttpResponse.json(newReservation, { status: 201 })
  }),

  http.post('/api/reservas/:id/approve', ({ params }) => {
    const idx = reservations.findIndex((r) => r.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Reserva nao encontrada' }, { status: 404 })

    const target = reservations[idx]
    if (target.status !== 'pendente') {
      return HttpResponse.json({ message: 'Apenas reservas pendentes podem ser aprovadas' }, { status: 400 })
    }
    const linkedArea = LINKED_RESERVATION_AREAS[target.area]
    const targetDate = toDateKey(target.dataInicio)
    const hasConflict = reservations.some((reservation) => {
      if (reservation.id === target.id || reservation.status !== 'confirmada') return false
      if (reservation.area === target.area) {
        return hasTimeOverlap(reservation.dataInicio, reservation.dataFim, target.dataInicio, target.dataFim)
      }
      if (linkedArea && reservation.area === linkedArea) {
        return toDateKey(reservation.dataInicio) === targetDate
      }
      return false
    })

    if (hasConflict) {
      return HttpResponse.json({ message: 'Nao foi possivel aprovar porque existe outra reserva confirmada conflitante' }, { status: 400 })
    }

    reservations[idx] = {
      ...target,
      status: 'confirmada',
      aprovadoEm: new Date().toISOString(),
      aprovadoPorId: '2',
      recusadoEm: null,
      recusadoPorId: null,
      motivoRecusa: null,
    }
    return HttpResponse.json(reservations[idx])
  }),

  http.post('/api/reservas/:id/reject', async ({ params, request }) => {
    const body = await request.json() as RejectReservationPayload
    const idx = reservations.findIndex((r) => r.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Reserva nao encontrada' }, { status: 404 })
    if (reservations[idx].status !== 'pendente') {
      return HttpResponse.json({ message: 'Apenas reservas pendentes podem ser recusadas' }, { status: 400 })
    }
    if (!body.motivo?.trim()) {
      return HttpResponse.json({ message: 'Informe o motivo da recusa' }, { status: 400 })
    }

    reservations[idx] = {
      ...reservations[idx],
      status: 'recusada',
      aprovadoEm: null,
      aprovadoPorId: null,
      recusadoEm: new Date().toISOString(),
      recusadoPorId: '2',
      motivoRecusa: body.motivo.trim(),
    }

    return HttpResponse.json(reservations[idx])
  }),

  http.patch('/api/reservas/:id/cancel', ({ params }) => {
    const idx = reservations.findIndex((r) => r.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Reserva nao encontrada' }, { status: 404 })
    reservations[idx] = { ...reservations[idx], status: 'cancelada' }
    return HttpResponse.json(reservations[idx])
  }),

  http.get('/api/financeiro/boletos', ({ request }) => {
    const url = new URL(request.url)
    const moradorId = url.searchParams.get('moradorId')
    const result = moradorId ? mockBoletos.filter((b) => b.moradorId === moradorId) : mockBoletos
    return HttpResponse.json(result)
  }),

  http.get('/api/financeiro/summary', () => {
    return HttpResponse.json(mockPaymentSummary)
  }),

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
      : HttpResponse.json({ message: 'Aviso nao encontrado' }, { status: 404 })
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
    if (index === -1) return HttpResponse.json({ message: 'Aviso nao encontrado' }, { status: 404 })
    avisos[index] = { ...avisos[index], ...body }
    return HttpResponse.json(avisos[index])
  }),

  http.post('/api/avisos/:id/publish', ({ params }) => {
    const index = avisos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Aviso nao encontrado' }, { status: 404 })
    avisos[index] = { ...avisos[index], status: 'publicado', publicadoEm: new Date().toISOString() }
    return HttpResponse.json(avisos[index])
  }),

  http.post('/api/avisos/:id/read', ({ params }) => {
    const index = avisos.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Aviso nao encontrado' }, { status: 404 })
    if (!avisos[index].lidoPor.includes('4')) {
      avisos[index] = { ...avisos[index], lidoPor: [...avisos[index].lidoPor, '4'] }
    }
    return HttpResponse.json(avisos[index])
  }),

  http.get('/api/correspondencias', () => {
    return HttpResponse.json(correspondencias)
  }),

  http.post('/api/correspondencias', async ({ request }) => {
    const body = await request.json() as CorrespondenciaPayload
    const resident = mockUsers.find((item) => item.id === body.destinatarioId)
    if (!resident) return HttpResponse.json({ message: 'Morador nao encontrado' }, { status: 404 })
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
    if (index === -1) return HttpResponse.json({ message: 'Correspondencia nao encontrada' }, { status: 404 })
    correspondencias[index] = { ...correspondencias[index], ...body }
    return HttpResponse.json(correspondencias[index])
  }),

  http.post('/api/correspondencias/:id/pickup', ({ params }) => {
    const index = correspondencias.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Correspondencia nao encontrada' }, { status: 404 })
    correspondencias[index] = { ...correspondencias[index], status: 'retirada', retiradoEm: new Date().toISOString() }
    return HttpResponse.json(correspondencias[index])
  }),

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
    if (index === -1) return HttpResponse.json({ message: 'Documento nao encontrado' }, { status: 404 })
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
    if (index === -1) return HttpResponse.json({ message: 'Documento nao encontrado' }, { status: 404 })
    documentos[index] = { ...documentos[index], arquivado: true }
    return HttpResponse.json(documentos[index])
  }),

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
    if (index === -1) return HttpResponse.json({ message: 'Reuniao nao encontrada' }, { status: 404 })
    reunioes[index] = { ...reunioes[index], ...body }
    return HttpResponse.json(reunioes[index])
  }),

  http.post('/api/reunioes/:id/agenda-items', async ({ params, request }) => {
    const body = await request.json() as { pauta: string }
    const index = reunioes.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Reuniao nao encontrada' }, { status: 404 })
    reunioes[index] = { ...reunioes[index], agenda: [...reunioes[index].agenda, body.pauta] }
    return HttpResponse.json(reunioes[index])
  }),

  http.post('/api/reunioes/:id/ata', async ({ params, request }) => {
    const body = await request.json() as { resumo: string }
    const index = reunioes.findIndex((item) => item.id === params.id)
    if (index === -1) return HttpResponse.json({ message: 'Reuniao nao encontrada' }, { status: 404 })
    reunioes[index] = {
      ...reunioes[index],
      status: 'encerrada',
      ata: { resumo: body.resumo, publicadaEm: new Date().toISOString() },
    }
    return HttpResponse.json(reunioes[index])
  }),

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

  http.get('/api/configuracoes', () => {
    return HttpResponse.json(configuracoes)
  }),

  http.patch('/api/configuracoes', async ({ request }) => {
    const body = await request.json() as TenantSettings
    configuracoes = body
    return HttpResponse.json(configuracoes)
  }),

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
