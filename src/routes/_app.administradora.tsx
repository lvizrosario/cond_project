import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { Building } from 'lucide-react'
export const Route = createFileRoute('/_app/administradora')({
  component: () => <StubPage title="Administradora" description="Dados da empresa administradora do condomínio" icon={Building} />,
})
