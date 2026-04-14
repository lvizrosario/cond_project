import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import type { RequestWithUser } from '../interfaces/request-with-user.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const auth = request.headers.authorization
    const tenantId = request.headers['x-condominio-id']

    if (!auth || !String(auth).startsWith('Bearer ') || !tenantId) {
      throw new UnauthorizedException('Missing auth token or tenant header')
    }

    request.user = {
      id: 'seed-user-1',
      tenantId: String(tenantId),
      primaryRole: 'sindico',
      isMorador: false,
    }

    return true
  }
}
