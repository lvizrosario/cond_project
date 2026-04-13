import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { Bell } from 'lucide-react'
export const Route = createFileRoute('/_app/avisos')({
  component: () => <StubPage title="Avisos" description="Comunicados e avisos do condomínio" icon={Bell} />,
})
