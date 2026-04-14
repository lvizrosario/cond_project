export type AvisoCategoria = 'geral' | 'manutencao' | 'financeiro' | 'evento'
export type AvisoAudience = 'todos' | 'moradores' | 'administracao'
export type AvisoStatus = 'rascunho' | 'publicado' | 'expirado'

export interface Aviso {
  id: string
  titulo: string
  conteudo: string
  categoria: AvisoCategoria
  audience: AvisoAudience
  status: AvisoStatus
  publicadoEm?: string
  expiraEm?: string
  criadoEm: string
  criadoPorId: string
  criadoPorNome: string
  destaque?: boolean
  lidoPor: string[]
}

export interface AvisoFilters {
  categoria?: AvisoCategoria | 'todas'
  status?: AvisoStatus | 'todos'
}

export interface AvisoPayload {
  titulo: string
  conteudo: string
  categoria: AvisoCategoria
  audience: AvisoAudience
  expiraEm?: string
  destaque?: boolean
}
