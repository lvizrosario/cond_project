import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center py-12', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-brand-500)]" />
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
