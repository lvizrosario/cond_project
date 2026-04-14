import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { POLICY_KEY } from '../decorators/policy.decorator'
import type { RequestWithUser } from '../interfaces/request-with-user.interface'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Array<'admin' | 'authenticated'>>(POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? ['authenticated']

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user
    if (!user) return false

    if (roles.includes('authenticated')) return true
    if (roles.includes('admin')) return user.primaryRole === 'presidente' || user.primaryRole === 'sindico'
    return false
  }
}
