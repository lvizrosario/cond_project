import type { PrimaryRole } from './auth.types'

export type MenuKey =
  | 'inicio'
  | 'acessos'
  | 'administradora'
  | 'avisos'
  | 'configuracoes'
  | 'correspondencias'
  | 'documentos'
  | 'financeiro'
  | 'reservas'
  | 'reunioes'

export interface User {
  id: string
  nomeCompleto: string
  email: string
  telefone: string
  emailConfirmado: boolean
  roles: {
    primary: PrimaryRole | null
    isMorador: boolean
  }
  condominio: {
    id: string
    nome: string
    cep: string
    quadra: string
    numero: string
  }
  avatar?: string
  criadoEm: string
}

export interface RolePermission {
  roleKey: string
  menuAccess: Record<MenuKey, boolean>
}
