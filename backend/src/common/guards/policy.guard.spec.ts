import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { AuthUser } from '../interfaces/request-with-user.interface'
import { PolicyGuard } from './policy.guard'

function createContext(user?: AuthUser): ExecutionContext {
  return {
    getHandler: () => 'handler',
    getClass: () => PolicyGuard,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext
}

describe('PolicyGuard', () => {
  it('allows any authenticated user when no explicit policy is defined', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector

    const guard = new PolicyGuard(reflector)

    expect(
      guard.canActivate(
        createContext({
          id: '4',
          tenantId: 'cond-1',
          primaryRole: null,
          isMorador: true,
        }),
      ),
    ).toBe(true)
  })

  it('allows admin-only routes for presidente and sindico roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
    } as unknown as Reflector

    const guard = new PolicyGuard(reflector)

    expect(
      guard.canActivate(
        createContext({
          id: '1',
          tenantId: 'cond-1',
          primaryRole: 'presidente',
          isMorador: true,
        }),
      ),
    ).toBe(true)
  })

  it('rejects admin-only routes for non-admin roles', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
    } as unknown as Reflector

    const guard = new PolicyGuard(reflector)

    expect(
      guard.canActivate(
        createContext({
          id: '3',
          tenantId: 'cond-1',
          primaryRole: 'conselheiro',
          isMorador: true,
        }),
      ),
    ).toBe(false)
  })
})
