import { createFileRoute } from '@tanstack/react-router'
import { CorrespondenciasPage } from '@/pages/correspondencias/CorrespondenciasPage'

export const Route = createFileRoute('/_app/correspondencias')({
  component: CorrespondenciasPage,
})
