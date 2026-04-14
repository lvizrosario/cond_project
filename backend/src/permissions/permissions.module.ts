import { Body, Controller, Get, Injectable, Module, Patch, UseGuards } from '@nestjs/common'
import { Policy } from '../common/decorators/policy.decorator'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class PermissionsService {
  constructor(private readonly db: MockDatabaseService) {}

  getAll() {
    return this.db.rolePermissions
  }

  updateAll(payload: Record<string, Record<string, boolean>>) {
    this.db.rolePermissions = payload
    return this.db.rolePermissions
  }
}

@Controller('acessos')
@UseGuards(AuthGuard, PolicyGuard)
class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('permissions')
  @Policy('authenticated')
  getPermissions() {
    return this.permissionsService.getAll()
  }

  @Patch('permissions')
  @Policy('admin')
  updatePermissions(@Body() body: Record<string, Record<string, boolean>>) {
    return this.permissionsService.updateAll(body)
  }
}

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
