import { Body, Controller, Get, Injectable, Module, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class AvisosService {
  constructor(private readonly db: MockDatabaseService) {}

  list(user: AuthUser, categoria?: string, status?: string) {
    return this.db.avisos.filter((item) => item.tenantId === user.tenantId)
      .filter((item) => !categoria || item.categoria === categoria)
      .filter((item) => !status || item.status === status)
  }

  getById(id: string) {
    return this.db.avisos.find((item) => item.id === id)
  }

  create(user: AuthUser, body: Record<string, unknown>) {
    const created = { id: `a${this.db.avisos.length + 1}`, tenantId: user.tenantId, ...body, status: 'rascunho', criadoPorId: user.id, criadoEm: new Date().toISOString(), lidoPor: [] }
    this.db.avisos.unshift(created)
    return created
  }

  update(id: string, body: Record<string, unknown>) {
    const aviso = this.getById(id)
    if (!aviso) return null
    Object.assign(aviso, body)
    return aviso
  }

  publish(id: string) {
    return this.update(id, { status: 'publicado', publicadoEm: new Date().toISOString() })
  }

  read(id: string, userId: string) {
    const aviso = this.getById(id)
    if (!aviso) return null
    aviso.lidoPor = Array.isArray(aviso.lidoPor) ? [...new Set([...aviso.lidoPor, userId])] : [userId]
    return aviso
  }
}

@Controller('avisos')
@UseGuards(AuthGuard, PolicyGuard)
class AvisosController {
  constructor(private readonly avisosService: AvisosService) {}

  @Get()
  @Policy('authenticated')
  list(@CurrentUser() user: AuthUser, @Query('categoria') categoria?: string, @Query('status') status?: string) {
    return this.avisosService.list(user, categoria, status)
  }

  @Get(':id')
  @Policy('authenticated')
  getById(@Param('id') id: string) {
    return this.avisosService.getById(id)
  }

  @Post()
  @Policy('admin')
  create(@CurrentUser() user: AuthUser, @Body() body: Record<string, unknown>) {
    return this.avisosService.create(user, body)
  }

  @Patch(':id')
  @Policy('admin')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.avisosService.update(id, body)
  }

  @Post(':id/publish')
  @Policy('admin')
  publish(@Param('id') id: string) {
    return this.avisosService.publish(id)
  }

  @Post(':id/read')
  @Policy('authenticated')
  markAsRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.avisosService.read(id, user.id)
  }
}

@Module({
  controllers: [AvisosController],
  providers: [AvisosService],
})
export class AvisosModule {}
