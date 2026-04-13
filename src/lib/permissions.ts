import type { MenuKey } from '@/types/user.types'
import type { PrimaryRole } from '@/types/auth.types'

type PermissionMap = Record<PrimaryRole | 'morador', Record<MenuKey, boolean>>

export const ROLE_PERMISSIONS: PermissionMap = {
  presidente: {
    inicio: true, acessos: true, administradora: true, avisos: true,
    configuracoes: true, correspondencias: true, documentos: true,
    financeiro: true, reservas: true, reunioes: true,
  },
  sindico: {
    inicio: true, acessos: true, administradora: true, avisos: true,
    configuracoes: true, correspondencias: true, documentos: true,
    financeiro: true, reservas: true, reunioes: true,
  },
  conselheiro: {
    inicio: true, acessos: false, administradora: true, avisos: true,
    configuracoes: false, correspondencias: true, documentos: true,
    financeiro: true, reservas: true, reunioes: true,
  },
  morador: {
    inicio: true, acessos: false, administradora: false, avisos: true,
    configuracoes: false, correspondencias: true, documentos: true,
    financeiro: true, reservas: true, reunioes: false,
  },
}

export function hasMenuAccess(
  primaryRole: PrimaryRole | null,
  menu: MenuKey,
): boolean {
  const key = primaryRole ?? 'morador'
  return ROLE_PERMISSIONS[key][menu]
}

export const ROLE_LABELS: Record<PrimaryRole | 'morador', string> = {
  presidente: 'Presidente',
  sindico: 'Síndico',
  conselheiro: 'Conselheiro',
  morador: 'Morador',
}

export const PRIMARY_ROLES: PrimaryRole[] = ['presidente', 'sindico', 'conselheiro']
