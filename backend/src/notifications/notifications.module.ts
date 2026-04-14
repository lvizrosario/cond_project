import { Controller, Get, Injectable, Module, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { Policy } from '../common/decorators/policy.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class NotificationsService {
  constructor(private readonly db: MockDatabaseService) {}

  listByTenant(tenantId: string) {
    return this.db.notifications.filter((item) => item.tenantId === tenantId)
  }
}

@Controller('notifications')
@UseGuards(AuthGuard, PolicyGuard)
class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Policy('authenticated')
  list(@CurrentUser() user: AuthUser) {
    return this.notificationsService.listByTenant(user.tenantId)
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
