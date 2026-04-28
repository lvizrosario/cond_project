export interface AuthUser {
  id: string
  tenantId: string
  primaryRole: 'presidente' | 'sindico' | 'conselheiro' | null
  isMorador: boolean
}

export interface RequestWithUser {
  headers: Record<string, string | string[] | undefined>
  user?: AuthUser
}
