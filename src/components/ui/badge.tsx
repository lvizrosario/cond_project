import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[var(--color-brand-100)] text-[var(--color-brand-700)]',
        success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
        danger: 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
        warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
        outline: 'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
        accent: 'bg-[var(--color-accent-100)] text-[var(--color-accent-600)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
