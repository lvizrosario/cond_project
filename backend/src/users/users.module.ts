import { Body, Controller, Get, Injectable, Module, Param, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../common/guards/auth.guard'
import { PolicyGuard } from '../common/guards/policy.guard'
import { Policy } from '../common/decorators/policy.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import type { AuthUser } from '../common/interfaces/request-with-user.interface'
import { MockDatabaseService } from '../config/mock-database.service'

@Injectable()
class UsersService {
  constructor(private readonly db: MockDatabaseService) {}

  listByTenant(tenantId: string) {
    return this.db.users.filter((item) => item.tenantId === tenantId)
  }

  updateRoles(id: string, roles: { primary: 'presidente' | 'sindico' | 'conselheiro' | null; isMorador: boolean }) {
    const user = this.db.users.find((item) => item.id === id)
    if (!user) return null
    user.primaryRole = roles.primary
    user.isMorador = roles.isMorador
    return user
  }
}

@Controller('users')
@UseGuards(AuthGuard, PolicyGuard)
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Policy('authenticated')
  list(@CurrentUser() user: AuthUser) {
    return this.usersService.listByTenant(user.tenantId)
  }

  @Patch(':id/roles')
  @Policy('admin')
  updateRoles(@Param('id') id: string, @Body() body: { primary: 'presidente' | 'sindico' | 'conselheiro' | null; isMorador: boolean }) {
    return this.usersService.updateRoles(id, body)
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
