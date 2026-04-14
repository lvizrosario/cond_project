import { Controller, Get, Injectable, Module, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class TenantsService {
  constructor(private readonly db: MockDatabaseService) {}

  getTenant(id: string) {
    return this.db.tenants.find((item) => item.id === id)
  }
}

@Controller('tenants')
@UseGuards(AuthGuard)
class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('me')
  getCurrentTenant(@CurrentUser() user: AuthUser) {
    return this.tenantsService.getTenant(user.tenantId)
  }
}

@Module({
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
