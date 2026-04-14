export type DocumentoCategoria = 'regulamento' | 'assembleia' | 'financeiro' | 'servicos'
export type DocumentoAudience = 'todos' | 'moradores' | 'administracao'

export interface DocumentoVersion {
  id: string
  versao: number
  arquivoNome: string
  criadoEm: string
  criadoPorNome: string
}

export interface Documento {
  id: string
  titulo: string
  categoria: DocumentoCategoria
  audience: DocumentoAudience
  descricao?: string
  arquivado: boolean
  atualizadoEm: string
  ultimaVersao: DocumentoVersion
  versoes: DocumentoVersion[]
}

export interface DocumentoPayload {
  titulo: string
  categoria: DocumentoCategoria
  audience: DocumentoAudience
  descricao?: string
  arquivoNome: string
}

export interface DocumentoVersionPayload {
  arquivoNome: string
}
