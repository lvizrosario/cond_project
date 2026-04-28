import { createFileRoute } from '@tanstack/react-router'
import { AdministradoraPage } from '@/pages/administradora/AdministradoraPage'

export const Route = createFileRoute('/_app/administradora')({
  component: AdministradoraPage,
})
