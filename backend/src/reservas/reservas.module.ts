import { BadRequestException, Body, Controller, Get, Injectable, Module, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

type AreaCondominio = 'salao_festas' | 'churrasqueira' | 'quadra'
type ReservationStatus = 'confirmada' | 'pendente' | 'cancelada'
type AvailabilityStatus = 'confirmada' | 'pendente' | 'bloqueada'

interface ReservationPayload {
  area: AreaCondominio
  dataInicio: string
  dataFim: string
  observacoes?: string
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

  getAvailability(user: AuthUser, area: AreaCondominio) {
    const activeReservations = this.db.reservas.filter((item) => item.tenantId === user.tenantId && item.status !== 'cancelada')
    const linkedArea = LINKED_AREAS[area]

    const statuses = activeReservations.flatMap((reservation) => {
      const date = this.toDateKey(reservation.dataInicio)
      const items: Array<Record<string, any>> = []

      if (reservation.area === area) {
        items.push({
          date,
          status: reservation.status,
          label: reservation.status === 'pendente' ? 'Aguardando aprovação do administrador' : 'Reserva confirmada',
          reservationId: reservation.id,
          relatedArea: reservation.area,
        })
      }

      if (linkedArea && reservation.area === linkedArea) {
        items.push({
          date,
          status: 'bloqueada' satisfies AvailabilityStatus,
          label: `Bloqueado porque ${this.getAreaLabel(linkedArea)} está ${reservation.status === 'pendente' ? 'com solicitação pendente' : 'reservada'} no mesmo dia`,
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
    this.assertNoConflicts(user.tenantId, payload)

    const resident = this.db.users.find((item) => item.id === user.id)
    const created = {
      id: `rv${this.db.reservas.length + 1}`,
      tenantId: user.tenantId,
      area: payload.area,
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
    }

    this.db.reservas.push(created)
    this.db.notifications.unshift({
      id: `n${this.db.notifications.length + 1}`,
      tenantId: user.tenantId,
      userId: '2',
      titulo: 'Nova solicitação de reserva pendente',
      conteudo: `${created.moradorNome} solicitou ${this.getAreaLabel(created.area)} para ${this.toDateKey(created.dataInicio)}.`,
      createdAt: new Date().toISOString(),
    })

    return created
  }

  approve(user: AuthUser, id: string) {
    const reservation = this.db.reservas.find((item) => item.id === id)
    if (!reservation) throw new BadRequestException('Reserva não encontrada')
    if (reservation.status !== 'pendente') throw new BadRequestException('Apenas reservas pendentes podem ser aprovadas')

    this.assertNoApprovalConflicts(reservation)

    reservation.status = 'confirmada'
    reservation.aprovadoEm = new Date().toISOString()
    reservation.aprovadoPorId = user.id

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
        body: `Olá, ${resident.nomeCompleto}. Sua reserva para ${this.getAreaLabel(reservation.area)} em ${this.toDateKey(reservation.dataInicio)} foi aprovada.`,
        createdAt: new Date().toISOString(),
        type: 'reserva_aprovada',
      })
    }

    return reservation
  }

  cancel(id: string) {
    const reservation = this.db.reservas.find((item) => item.id === id)
    if (!reservation) throw new BadRequestException('Reserva não encontrada')
    reservation.status = 'cancelada'
    return reservation
  }

  private assertReservationWindow(payload: ReservationPayload) {
    if (new Date(payload.dataFim) <= new Date(payload.dataInicio)) {
      throw new BadRequestException('O término deve ser posterior ao início')
    }
  }

  private assertNoConflicts(tenantId: string, payload: ReservationPayload) {
    const linkedArea = LINKED_AREAS[payload.area]
    const payloadDate = this.toDateKey(payload.dataInicio)

    const hasConflict = this.db.reservas.some((reservation) => {
      if (reservation.tenantId !== tenantId || reservation.status === 'cancelada') return false

      if (reservation.area === payload.area) {
        return this.hasTimeOverlap(reservation.dataInicio, reservation.dataFim, payload.dataInicio, payload.dataFim)
      }

      if (linkedArea && reservation.area === linkedArea) {
        return this.toDateKey(reservation.dataInicio) === payloadDate
      }

      return false
    })

    if (hasConflict) {
      throw new BadRequestException('Este período não está disponível para reserva ou está bloqueado por outra área vinculada')
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
      throw new BadRequestException('Não foi possível aprovar porque existe outra reserva confirmada conflitante')
    }
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
    if (area === 'salao_festas') return 'Salão de Festas'
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
