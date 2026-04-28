import { SetMetadata } from '@nestjs/common'

export const POLICY_KEY = 'policy_roles'
export const Policy = (...roles: Array<'admin' | 'authenticated'>) => SetMetadata(POLICY_KEY, roles)
