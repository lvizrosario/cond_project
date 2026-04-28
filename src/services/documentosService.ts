import { api } from './api'
import type { Documento, DocumentoPayload, DocumentoVersion, DocumentoVersionPayload } from '@/types/documentos.types'

export const documentosService = {
  getAll: async (): Promise<Documento[]> => {
    const { data } = await api.get<Documento[]>('/documentos')
    return data
  },

  create: async (payload: DocumentoPayload): Promise<Documento> => {
    const { data } = await api.post<Documento>('/documentos', payload)
    return data
  },

  addVersion: async (id: string, payload: DocumentoVersionPayload): Promise<DocumentoVersion> => {
    const { data } = await api.post<DocumentoVersion>(`/documentos/${id}/versions`, payload)
    return data
  },

  archive: async (id: string): Promise<Documento> => {
    const { data } = await api.patch<Documento>(`/documentos/${id}/archive`)
    return data
  },
}
