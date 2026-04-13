import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-surface)]">
        <Icon className="h-7 w-7 text-[var(--color-text-muted)]" />
      </div>
      <h3 className="font-display font-semibold text-[var(--color-text-primary)] mb-1">{title}</h3>
      {description && <p className="text-sm text-[var(--color-text-secondary)] max-w-xs mb-4">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
