import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { FileText } from 'lucide-react'
export const Route = createFileRoute('/_app/documentos')({
  component: () => <StubPage title="Documentos" description="Atas, regulamentos e documentos do condomínio" icon={FileText} />,
})
