import { Bell, Calendar, DollarSign, Package, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatRelative } from '@/lib/formatters'
import type { ActivityItem } from '@/types/dashboard.types'
import type { LucideIcon } from 'lucide-react'

const ACTIVITY_ICONS: Record<ActivityItem['tipo'], LucideIcon> = {
  pagamento: DollarSign,
  reserva: Calendar,
  aviso: Bell,
  cadastro: UserPlus,
  correspondencia: Package,
}

const ACTIVITY_COLORS: Record<ActivityItem['tipo'], string> = {
  pagamento: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  reserva: 'bg-[var(--color-brand-100)] text-[var(--color-brand-500)]',
  aviso: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  cadastro: 'bg-[var(--color-accent-100)] text-[var(--color-accent-500)]',
  correspondencia: 'bg-[var(--color-accent-100)] text-[var(--color-accent-500)]',
}

interface RecentActivityFeedProps {
  activities: ActivityItem[]
  title?: string
  emptyMessage?: string
}

export function RecentActivityFeed({
  activities,
  title = 'Atividade Recente',
  emptyMessage = 'Nenhuma atividade recente encontrada.',
}: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="px-5 py-6 text-sm text-[var(--color-text-secondary)]">{emptyMessage}</div>
        ) : (
          <ul>
            {activities.map((activity) => {
              const Icon = ACTIVITY_ICONS[activity.tipo]
              return (
                <li key={activity.id} className="flex items-start gap-3 border-b border-[var(--color-border)] px-5 py-3 last:border-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${ACTIVITY_COLORS[activity.tipo]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--color-text-primary)]">{activity.descricao}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{formatRelative(activity.timestamp)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
