export interface AdministradoraContato {
  id: string
  nome: string
  cargo: string
  email: string
  telefone: string
  principal?: boolean
}

export interface AdministradoraContrato {
  id: string
  nome: string
  inicio: string
  fim?: string
  status: 'ativo' | 'renovacao' | 'encerrado'
  observacoes?: string
}

export interface AdministradoraPerfil {
  id: string
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  email: string
  telefone: string
  site?: string
  canaisAtendimento: string[]
  contatos: AdministradoraContato[]
  contratos: AdministradoraContrato[]
}

export interface AdministradoraPayload {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  email: string
  telefone: string
  site?: string
  canaisAtendimento: string[]
}
