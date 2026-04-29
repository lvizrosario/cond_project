import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string
  delta?: { value: number; direction: 'up' | 'down' | 'neutral' }
  icon: LucideIcon
  color: 'blue' | 'green' | 'amber' | 'red'
  onClick?: () => void
  hint?: string
}

const colorMap = {
  blue: { bg: 'bg-[var(--color-brand-100)]', icon: 'text-[var(--color-brand-500)]' },
  green: { bg: 'bg-[var(--color-success-bg)]', icon: 'text-[var(--color-success)]' },
  amber: { bg: 'bg-[var(--color-accent-100)]', icon: 'text-[var(--color-accent-500)]' },
  red: { bg: 'bg-[var(--color-danger-bg)]', icon: 'text-[var(--color-danger)]' },
}

export function StatCard({ label, value, delta, icon: Icon, color, onClick, hint }: StatCardProps) {
  const { bg, icon: iconColor } = colorMap[color]

  const content = (
    <Card className={cn('p-5', onClick && 'cursor-pointer transition-colors hover:bg-[var(--color-surface)]')}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm text-[var(--color-text-secondary)]">{label}</p>
            <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{value}</p>
            {delta && (
              <div
                className={cn(
                  'mt-1 flex items-center gap-1 text-xs font-medium',
                  delta.direction === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]',
                )}
              >
                {delta.direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(delta.value)}% vs mes anterior</span>
              </div>
            )}
            {hint && <p className="mt-2 text-xs text-[var(--color-text-muted)]">{hint}</p>}
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', bg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!onClick) return content

  return (
    <button type="button" onClick={onClick} className="text-left">
      {content}
    </button>
  )
}
