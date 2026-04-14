import { createFileRoute } from '@tanstack/react-router'
import { ConfiguracoesPage } from '@/pages/configuracoes/ConfiguracoesPage'

export const Route = createFileRoute('/_app/configuracoes')({
  component: ConfiguracoesPage,
})
