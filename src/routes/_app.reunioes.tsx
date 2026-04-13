import { createFileRoute } from '@tanstack/react-router'
import { StubPage } from '@/pages/stubs/StubPage'
import { BookOpen } from 'lucide-react'
export const Route = createFileRoute('/_app/reunioes')({
  component: () => <StubPage title="Reuniões" description="Pautas e atas das reuniões de condomínio" icon={BookOpen} />,
})
