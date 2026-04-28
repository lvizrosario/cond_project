import { Body, Controller, Get, Injectable, Module, Patch, UseGuards } from '@nestjs/common'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class ConfiguracoesService {
  constructor(private readonly db: MockDatabaseService) {}

  getAll() {
    return this.db.configuracoes
  }

  update(body: Record<string, unknown>) {
    this.db.configuracoes = body
    return this.db.configuracoes
  }
}

@Controller('configuracoes')
@UseGuards(AuthGuard, PolicyGuard)
class ConfiguracoesController {
  constructor(private readonly configuracoesService: ConfiguracoesService) {}

  @Get()
  @Policy('admin')
  getAll() {
    return this.configuracoesService.getAll()
  }

  @Patch()
  @Policy('admin')
  update(@Body() body: Record<string, unknown>) {
    return this.configuracoesService.update(body)
  }
}

@Module({
  controllers: [ConfiguracoesController],
  providers: [ConfiguracoesService],
})
export class ConfiguracoesModule {}
