import { Body, Controller, Get, Injectable, Module, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class ReunioesService {
  constructor(private readonly db: MockDatabaseService) {}

  list() {
    return this.db.reunioes
  }

  create(body: Record<string, unknown>) {
    const created = { id: `r${this.db.reunioes.length + 1}`, tenantId: 'cond-1', ...body, status: 'agendada', agenda: [], participantes: [], ata: null }
    this.db.reunioes.unshift(created)
    return created
  }

  update(id: string, body: Record<string, unknown>) {
    const meeting = this.db.reunioes.find((item) => item.id === id)
    if (!meeting) return null
    Object.assign(meeting, body)
    return meeting
  }

  addAgendaItem(id: string, pauta: string) {
    const meeting = this.db.reunioes.find((item) => item.id === id)
    if (!meeting) return null
    meeting.agenda = [...meeting.agenda, pauta]
    return meeting
  }

  publishAta(id: string, resumo: string) {
    const meeting = this.db.reunioes.find((item) => item.id === id)
    if (!meeting) return null
    meeting.status = 'encerrada'
    meeting.ata = { resumo, publicadaEm: new Date().toISOString() }
    return meeting
  }
}

@Controller('reunioes')
@UseGuards(AuthGuard, PolicyGuard)
class ReunioesController {
  constructor(private readonly reunioesService: ReunioesService) {}

  @Get()
  @Policy('authenticated')
  list() {
    return this.reunioesService.list()
  }

  @Post()
  @Policy('admin')
  create(@Body() body: Record<string, unknown>) {
    return this.reunioesService.create(body)
  }

  @Patch(':id')
  @Policy('admin')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.reunioesService.update(id, body)
  }

  @Post(':id/agenda-items')
  @Policy('admin')
  addAgendaItem(@Param('id') id: string, @Body('pauta') pauta: string) {
    return this.reunioesService.addAgendaItem(id, pauta)
  }

  @Post(':id/ata')
  @Policy('admin')
  publishAta(@Param('id') id: string, @Body('resumo') resumo: string) {
    return this.reunioesService.publishAta(id, resumo)
  }
}

@Module({
  controllers: [ReunioesController],
  providers: [ReunioesService],
})
export class ReunioesModule {}
