import { Body, Controller, Get, Injectable, Module, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class CorrespondenciasService {
  constructor(private readonly db: MockDatabaseService) {}

  list(user: AuthUser) {
    return this.db.correspondencias.filter((item) => item.tenantId === user.tenantId)
      .filter((item) => user.primaryRole ? true : item.destinatarioId === user.id)
  }

  create(user: AuthUser, body: Record<string, unknown>) {
    const resident = this.db.users.find((item) => item.id === body.destinatarioId)
    const created = {
      id: `c${this.db.correspondencias.length + 1}`,
      tenantId: user.tenantId,
      transportadora: body.transportadora,
      codigoRastreio: body.codigoRastreio,
      destinatarioId: resident?.id,
      destinatarioNome: resident?.nomeCompleto,
      unidade: 'A-22',
      status: 'recebida',
      recebidoEm: new Date().toISOString(),
      recebidoPorNome: 'Portaria Central',
      observacoes: body.observacoes,
    }
    this.db.correspondencias.unshift(created)
    return created
  }

  update(id: string, body: Record<string, unknown>) {
    const item = this.db.correspondencias.find((value) => value.id === id)
    if (!item) return null
    Object.assign(item, body)
    return item
  }

  pickup(id: string) {
    return this.update(id, { status: 'retirada', retiradoEm: new Date().toISOString() })
  }
}

@Controller('correspondencias')
@UseGuards(AuthGuard, PolicyGuard)
class CorrespondenciasController {
  constructor(private readonly correspondenciasService: CorrespondenciasService) {}

  @Get()
  @Policy('authenticated')
  list(@CurrentUser() user: AuthUser) {
    return this.correspondenciasService.list(user)
  }

  @Post()
  @Policy('admin')
  create(@CurrentUser() user: AuthUser, @Body() body: Record<string, unknown>) {
    return this.correspondenciasService.create(user, body)
  }

  @Patch(':id')
  @Policy('admin')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.correspondenciasService.update(id, body)
  }

  @Post(':id/pickup')
  @Policy('admin')
  pickup(@Param('id') id: string) {
    return this.correspondenciasService.pickup(id)
  }
}

@Module({
  controllers: [CorrespondenciasController],
  providers: [CorrespondenciasService],
})
export class CorrespondenciasModule {}
