import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { Settings } from 'lucide-react'
export const Route = createFileRoute('/_app/configuracoes')({
  component: () => <StubPage title="Configurações" description="Preferências e configurações do sistema" icon={Settings} />,
})
