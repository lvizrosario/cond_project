import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { Mail } from 'lucide-react'
export const Route = createFileRoute('/_app/correspondencias')({
  component: () => <StubPage title="Correspondências" description="Rastreamento de correspondências e encomendas" icon={Mail} />,
})
