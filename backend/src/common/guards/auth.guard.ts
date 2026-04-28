import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { MockDatabaseService } from '../../config/mock-database.service'
import type { RequestWithUser } from '../interfaces/request-with-user.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly db: MockDatabaseService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const auth = request.headers.authorization
    const tenantId = request.headers['x-condominio-id']

    if (!auth || !String(auth).startsWith('Bearer ') || !tenantId) {
      throw new UnauthorizedException('Missing auth token or tenant header')
    }

    const token = String(auth).replace('Bearer ', '')
    const userId = token.startsWith('seed-token-') ? token.replace('seed-token-', '') : null
    const matchedUser = this.db.users.find((item) => item.id === userId && item.tenantId === String(tenantId))

    if (!matchedUser) {
      throw new UnauthorizedException('Invalid seed token')
    }

    request.user = {
      id: matchedUser.id,
      tenantId: matchedUser.tenantId,
      primaryRole: matchedUser.primaryRole,
      isMorador: matchedUser.isMorador,
    }

    return true
  }
}
