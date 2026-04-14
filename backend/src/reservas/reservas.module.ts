import { BadRequestException, Body, Controller, Get, Injectable, Module, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

type AreaCondominio = 'salao_festas' | 'churrasqueira' | 'quadra'
type ReservationStatus = 'confirmada' | 'pendente' | 'recusada' | 'cancelada'
type AvailabilityStatus = 'confirmada' | 'pendente' | 'bloqueada'

interface ReservationPayload {
  area: AreaCondominio
  tipoEvento: string
  dataInicio: string
  dataFim: string
  observacoes?: string
}

interface RejectReservationPayload {
  motivo: string
}

const LINKED_AREAS: Partial<Record<AreaCondominio, AreaCondominio>> = {
  salao_festas: 'churrasqueira',
  churrasqueira: 'salao_festas',
}

@Injectable()
class ReservasService {
  constructor(private readonly db: MockDatabaseService) {}

  list(user: AuthUser, area?: string, moradorId?: string) {
    const isAdmin = user.primaryRole === 'presidente' || user.primaryRole === 'sindico'

    return this.db.reservas
      .filter((item) => item.tenantId === user.tenantId)
      .filter((item) => !area || item.area === area)
      .filter((item) => {
        if (moradorId) return item.moradorId === moradorId
        return isAdmin ? true : item.moradorId === user.id
      })
      .sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
  }

  getOptions(user: AuthUser) {
    return {
      tiposEventoPermitidos: this.getAllowedEventTypes(user.tenantId),
    }
  }

  getAvailability(user: AuthUser, area: AreaCondominio) {
    const activeReservations = this.db.reservas.filter(
      (item) => item.tenantId === user.tenantId && (item.status === 'pendente' || item.status === 'confirmada'),
    )
    const linkedArea = LINKED_AREAS[area]

    const statuses = activeReservations.flatMap((reservation) => {
      const date = this.toDateKey(reservation.dataInicio)
      const items: Array<Record<string, any>> = []

      if (reservation.area === area) {
        items.push({
          date,
          status: reservation.status,
          label: reservation.status === 'pendente' ? 'Aguardando aprovacao do administrador' : 'Reserva confirmada',
          reservationId: reservation.id,
          relatedArea: reservation.area,
        })
      }

      if (linkedArea && reservation.area === linkedArea) {
        items.push({
          date,
          status: 'bloqueada' satisfies AvailabilityStatus,
          label: `Bloqueado porque ${this.getAreaLabel(linkedArea)} esta ${reservation.status === 'pendente' ? 'com solicitacao pendente' : 'reservada'} no mesmo dia`,
          reservationId: reservation.id,
          relatedArea: linkedArea,
        })
      }

      return items
    })

    const deduped = Object.values(
      statuses.reduce<Record<string, Record<string, any>>>((acc, item) => {
        const current = acc[item.date]
        const priority = this.getStatusPriority(item.status)
        if (!current || priority > this.getStatusPriority(current.status)) {
          acc[item.date] = item
        }
        return acc
      }, {}),
    )

    return {
      area,
      datas: deduped.sort((a, b) => a.date.localeCompare(b.date)),
    }
  }

  create(user: AuthUser, payload: ReservationPayload) {
    this.assertReservationWindow(payload)
    this.assertValidEventType(user.tenantId, payload.tipoEvento)
    this.assertNoConflicts(user.tenantId, payload)

    const resident = this.db.users.find((item) => item.id === user.id)
    const created = {
      id: `rv${this.db.reservas.length + 1}`,
      tenantId: user.tenantId,
      area: payload.area,
      tipoEvento: payload.tipoEvento,
      moradorId: user.id,
      moradorNome: resident?.nomeCompleto ?? 'Morador',
      unidade: resident ? `${resident.tenantId === 'cond-1' ? resident.id : '00'}` : '00',
      dataInicio: payload.dataInicio,
      dataFim: payload.dataFim,
      status: 'pendente' as ReservationStatus,
      observacoes: payload.observacoes,
      criadoEm: new Date().toISOString(),
      aprovadoEm: null,
      aprovadoPorId: null,
      recusadoEm: null,
      recusadoPorId: null,
      motivoRecusa: null,
    }

    this.db.reservas.push(created)
    this.notifyAdmins(
      user.tenantId,
      'Nova solicitacao de reserva pendente',
      `${created.moradorNome} solicitou ${this.getAreaLabel(created.area)} para ${this.toDateKey(created.dataInicio)}.`,
    )

    return created
  }

  approve(user: AuthUser, id: string) {
    const reservation = this.db.reservas.find((item) => item.id === id)
    if (!reservation) throw new BadRequestException('Reserva nao encontrada')
    if (reservation.status !== 'pendente') throw new BadRequestException('Apenas reservas pendentes podem ser aprovadas')

    this.assertNoApprovalConflicts(reservation)

    reservation.status = 'confirmada'
    reservation.aprovadoEm = new Date().toISOString()
    reservation.aprovadoPorId = user.id
    reservation.recusadoEm = null
    reservation.recusadoPorId = null
    reservation.motivoRecusa = null

    const resident = this.db.users.find((item) => item.id === reservation.moradorId)
    if (resident) {
      this.db.notifications.unshift({
        id: `n${this.db.notifications.length + 1}`,
        tenantId: reservation.tenantId,
        userId: resident.id,
        titulo: 'Reserva aprovada',
        conteudo: `${this.getAreaLabel(reservation.area)} foi confirmada para ${this.toDateKey(reservation.dataInicio)}.`,
        createdAt: new Date().toISOString(),
      })

      this.db.emailOutbox.unshift({
        id: `mail${this.db.emailOutbox.length + 1}`,
        tenantId: reservation.tenantId,
        to: resident.email,
        subject: 'Sua reserva foi confirmada',
        body: `Ola, ${resident.nomeCompleto}. Sua reserva para ${this.getAreaLabel(reservation.area)} em ${this.toDateKey(reservation.dataInicio)} foi aprovada.`,
        createdAt: new Date().toISOString(),
        type: 'reserva_aprovada',
      })
    }

    return reservation
  }

  reject(user: AuthUser, id: string, payload: RejectReservationPayload) {
    const reservation = this.db.reservas.find((item) => item.id === id)
    if (!reservation) throw new BadRequestException('Reserva nao encontrada')
    if (reservation.status !== 'pendente') throw new BadRequestException('Apenas reservas pendentes podem ser recusadas')

    const motivo = payload.motivo?.trim()
    if (!motivo) throw new BadRequestException('Informe o motivo da recusa')

    reservation.status = 'recusada'
    reservation.recusadoEm = new Date().toISOString()
    reservation.recusadoPorId = user.id
    reservation.motivoRecusa = motivo
    reservation.aprovadoEm = null
    reservation.aprovadoPorId = null

    const resident = this.db.users.find((item) => item.id === reservation.moradorId)
    if (resident) {
      this.db.notifications.unshift({
        id: `n${this.db.notifications.length + 1}`,
        tenantId: reservation.tenantId,
        userId: resident.id,
        titulo: 'Reserva recusada',
        conteudo: `${this.getAreaLabel(reservation.area)} nao foi aprovada. Motivo: ${motivo}.`,
        createdAt: new Date().toISOString(),
      })

      this.db.emailOutbox.unshift({
        id: `mail${this.db.emailOutbox.length + 1}`,
        tenantId: reservation.tenantId,
        to: resident.email,
        subject: 'Sua reserva foi recusada',
        body: `Ola, ${resident.nomeCompleto}. Sua solicitacao para ${this.getAreaLabel(reservation.area)} em ${this.toDateKey(reservation.dataInicio)} foi recusada. Motivo: ${motivo}.`,
        createdAt: new Date().toISOString(),
        type: 'reserva_recusada',
      })
    }

    return reservation
  }

  cancel(id: string) {
    const reservation = this.db.reservas.find((item) => item.id === id)
    if (!reservation) throw new BadRequestException('Reserva nao encontrada')
    reservation.status = 'cancelada'
    return reservation
  }

  private assertReservationWindow(payload: ReservationPayload) {
    if (new Date(payload.dataFim) <= new Date(payload.dataInicio)) {
      throw new BadRequestException('O termino deve ser posterior ao inicio')
    }
  }

  private assertValidEventType(tenantId: string, tipoEvento: string) {
    const allowedEventTypes = this.getAllowedEventTypes(tenantId)
    if (!tipoEvento?.trim()) {
      throw new BadRequestException('Selecione o tipo de evento')
    }
    if (!allowedEventTypes.includes(tipoEvento)) {
      throw new BadRequestException('O tipo de evento informado nao esta habilitado nas configuracoes do condominio')
    }
  }

  private assertNoConflicts(tenantId: string, payload: ReservationPayload) {
    const linkedArea = LINKED_AREAS[payload.area]
    const payloadDate = this.toDateKey(payload.dataInicio)

    const hasConflict = this.db.reservas.some((reservation) => {
      if (reservation.tenantId !== tenantId || !this.isBlockingStatus(reservation.status)) return false

      if (reservation.area === payload.area) {
        return this.hasTimeOverlap(reservation.dataInicio, reservation.dataFim, payload.dataInicio, payload.dataFim)
      }

      if (linkedArea && reservation.area === linkedArea) {
        return this.toDateKey(reservation.dataInicio) === payloadDate
      }

      return false
    })

    if (hasConflict) {
      throw new BadRequestException('Este periodo nao esta disponivel para reserva ou esta bloqueado por outra area vinculada')
    }
  }

  private assertNoApprovalConflicts(target: Record<string, any>) {
    const linkedArea = LINKED_AREAS[target.area as AreaCondominio]
    const targetDate = this.toDateKey(target.dataInicio)

    const hasConflict = this.db.reservas.some((reservation) => {
      if (reservation.id === target.id || reservation.status !== 'confirmada') return false

      if (reservation.area === target.area) {
        return this.hasTimeOverlap(reservation.dataInicio, reservation.dataFim, target.dataInicio, target.dataFim)
      }

      if (linkedArea && reservation.area === linkedArea) {
        return this.toDateKey(reservation.dataInicio) === targetDate
      }

      return false
    })

    if (hasConflict) {
      throw new BadRequestException('Nao foi possivel aprovar porque existe outra reserva confirmada conflitante')
    }
  }

  private getAllowedEventTypes(tenantId: string) {
    if (this.db.configuracoes.tenantId !== tenantId) return []
    return this.db.configuracoes.reservas.tiposEventoPermitidos ?? []
  }

  private notifyAdmins(tenantId: string, titulo: string, conteudo: string) {
    const admins = this.db.users.filter(
      (item) => item.tenantId === tenantId && (item.primaryRole === 'presidente' || item.primaryRole === 'sindico'),
    )

    admins.forEach((admin) => {
      this.db.notifications.unshift({
        id: `n${this.db.notifications.length + 1}`,
        tenantId,
        userId: admin.id,
        titulo,
        conteudo,
        createdAt: new Date().toISOString(),
      })
    })
  }

  private isBlockingStatus(status: ReservationStatus) {
    return status === 'pendente' || status === 'confirmada'
  }

  private hasTimeOverlap(startA: string, endA: string, startB: string, endB: string) {
    const aStart = new Date(startA).getTime()
    const aEnd = new Date(endA).getTime()
    const bStart = new Date(startB).getTime()
    const bEnd = new Date(endB).getTime()
    return aStart < bEnd && bStart < aEnd
  }

  private toDateKey(value: string) {
    return value.slice(0, 10)
  }

  private getAreaLabel(area: AreaCondominio) {
    if (area === 'salao_festas') return 'Salao de Festas'
    if (area === 'churrasqueira') return 'Churrasqueira'
    return 'Quadra Esportiva'
  }

  private getStatusPriority(status: AvailabilityStatus | ReservationStatus) {
    if (status === 'confirmada') return 3
    if (status === 'bloqueada') return 2
    if (status === 'pendente') return 1
    return 0
  }
}

@Controller('reservas')
@UseGuards(AuthGuard, PolicyGuard)
class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Get()
  @Policy('authenticated')
  list(@CurrentUser() user: AuthUser, @Query('area') area?: string, @Query('moradorId') moradorId?: string) {
    return this.reservasService.list(user, area, moradorId)
  }

  @Get('options')
  @Policy('authenticated')
  getOptions(@CurrentUser() user: AuthUser) {
    return this.reservasService.getOptions(user)
  }

  @Get('availability/:area')
  @Policy('authenticated')
  getAvailability(@CurrentUser() user: AuthUser, @Param('area') area: AreaCondominio) {
    return this.reservasService.getAvailability(user, area)
  }

  @Post()
  @Policy('authenticated')
  create(@CurrentUser() user: AuthUser, @Body() body: ReservationPayload) {
    return this.reservasService.create(user, body)
  }

  @Post(':id/approve')
  @Policy('admin')
  approve(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.reservasService.approve(user, id)
  }

  @Post(':id/reject')
  @Policy('admin')
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body() body: RejectReservationPayload) {
    return this.reservasService.reject(user, id, body)
  }

  @Patch(':id/cancel')
  @Policy('authenticated')
  cancel(@Param('id') id: string) {
    return this.reservasService.cancel(id)
  }
}

@Module({
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
