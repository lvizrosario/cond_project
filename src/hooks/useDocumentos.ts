import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { documentosService } from '@/services/documentosService'
import type { DocumentoPayload, DocumentoVersionPayload } from '@/types/documentos.types'

export function useDocumentos() {
  return useQuery({
    queryKey: ['documentos'],
    queryFn: documentosService.getAll,
  })
}

export function useCreateDocumento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: DocumentoPayload) => documentosService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documentos'] }),
  })
}

export function useAddDocumentoVersion() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DocumentoVersionPayload }) => documentosService.addVersion(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documentos'] }),
  })
}

export function useArchiveDocumento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => documentosService.archive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documentos'] }),
  })
}
