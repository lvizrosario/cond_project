export type PrimaryRole = 'presidente' | 'conselheiro' | 'sindico'
export type UserRole = PrimaryRole | 'morador'

export interface UserRoles {
  primary: PrimaryRole | null
  isMorador: boolean
}

export interface RegisterPayload {
  nomeCompleto: string
  email: string
  senha: string
  confirmarSenha: string
  telefone: string
  endereco: {
    cep: string
    nomeCondominio: string
    quadra: string
    numero: string
  }
}

export interface LoginPayload {
  email: string
  senha: string
}

export interface AuthSession {
  token: string
  refreshToken: string
  expiresAt: number
}
