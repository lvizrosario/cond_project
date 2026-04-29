import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { MockDatabaseService } from '../../config/mock-database.service'
import type { RequestWithUser } from '../interfaces/request-with-user.interface'
import { AuthGuard } from './auth.guard'

function createContext(request: RequestWithUser): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext
}

describe('AuthGuard', () => {
  it('attaches the authenticated user when headers are valid', () => {
    const request: RequestWithUser = {
      headers: {
        authorization: 'Bearer seed-token-2',
        'x-condominio-id': 'cond-1',
      },
    }

    const guard = new AuthGuard(new MockDatabaseService())

    expect(guard.canActivate(createContext(request))).toBe(true)
    expect(request.user).toEqual({
      id: '2',
      tenantId: 'cond-1',
      primaryRole: 'sindico',
      isMorador: false,
    })
  })

  it('rejects requests without auth headers', () => {
    const guard = new AuthGuard(new MockDatabaseService())

    expect(() => guard.canActivate(createContext({ headers: {} }))).toThrow(UnauthorizedException)
  })

  it('rejects tokens that do not map to the current tenant', () => {
    const guard = new AuthGuard(new MockDatabaseService())

    expect(() =>
      guard.canActivate(
        createContext({
          headers: {
            authorization: 'Bearer seed-token-2',
            'x-condominio-id': 'cond-999',
          },
        }),
      ),
    ).toThrow('Invalid seed token')
  })
})
