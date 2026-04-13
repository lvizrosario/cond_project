import { DollarSign, Calendar, Bell, UserPlus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatRelative } from '@/lib/formatters'
import type { ActivityItem } from '@/types/dashboard.types'
import type { LucideIcon } from 'lucide-react'

const ACTIVITY_ICONS: Record<ActivityItem['tipo'], LucideIcon> = {
  pagamento: DollarSign,
  reserva: Calendar,
  aviso: Bell,
  cadastro: UserPlus,
}

const ACTIVITY_COLORS: Record<ActivityItem['tipo'], string> = {
  pagamento: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
  reserva: 'bg-[var(--color-brand-100)] text-[var(--color-brand-500)]',
  aviso: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
  cadastro: 'bg-[var(--color-accent-100)] text-[var(--color-accent-500)]',
}

interface RecentActivityFeedProps {
  activities: ActivityItem[]
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {activities.map((a) => {
            const Icon = ACTIVITY_ICONS[a.tipo]
            return (
              <li key={a.id} className="flex items-start gap-3 px-5 py-3 border-b border-[var(--color-border)] last:border-0">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs ${ACTIVITY_COLORS[a.tipo]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--color-text-primary)]">{a.descricao}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{formatRelative(a.timestamp)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
