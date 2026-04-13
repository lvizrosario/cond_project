import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Wrench } from 'lucide-react'

interface StubPageProps {
  title: string
  description?: string
  icon?: LucideIcon
}

export function StubPage({ title, description, icon: Icon = Wrench }: StubPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={Icon}
        title="Em desenvolvimento"
        description="Esta funcionalidade estará disponível em breve."
      />
    </div>
  )
}
