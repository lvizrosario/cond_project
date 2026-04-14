import { createFileRoute } from '@tanstack/react-router'
import { ReunioesPage } from '@/pages/reunioes/ReunioesPage'

export const Route = createFileRoute('/_app/reunioes')({
  component: ReunioesPage,
})
