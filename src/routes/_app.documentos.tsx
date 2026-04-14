import { createFileRoute } from '@tanstack/react-router'
import { DocumentosPage } from '@/pages/documentos/DocumentosPage'

export const Route = createFileRoute('/_app/documentos')({
  component: DocumentosPage,
})
