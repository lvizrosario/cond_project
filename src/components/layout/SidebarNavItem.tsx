import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarNavItemProps {
  to: string
  label: string
  icon: LucideIcon
  collapsed: boolean
}

export function SidebarNavItem({ to, label, icon: Icon, collapsed }: SidebarNavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-[var(--color-brand-700)] hover:text-white',
        '[&.active]:bg-[var(--color-brand-600)] [&.active]:text-white',
        collapsed && 'justify-center px-2',
      )}
      title={collapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
