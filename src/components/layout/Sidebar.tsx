import { Building2, LayoutDashboard, Users, Bell, Settings, Mail, FileText, DollarSign, Calendar, BookOpen, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { SidebarNavItem } from './SidebarNavItem'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { useUiStore } from '@/store/uiStore'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import type { MenuKey } from '@/types/user.types'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
  menu: MenuKey
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { menu: 'inicio', to: '/inicio', label: 'Início', icon: LayoutDashboard },
  { menu: 'acessos', to: '/acessos', label: 'Acessos', icon: Users },
  { menu: 'administradora', to: '/administradora', label: 'Administradora', icon: Building2 },
  { menu: 'avisos', to: '/avisos', label: 'Avisos', icon: Bell },
  { menu: 'correspondencias', to: '/correspondencias', label: 'Correspondências', icon: Mail },
  { menu: 'documentos', to: '/documentos', label: 'Documentos', icon: FileText },
  { menu: 'financeiro', to: '/financeiro', label: 'Financeiro', icon: DollarSign },
  { menu: 'reservas', to: '/reservas', label: 'Reservas', icon: Calendar },
  { menu: 'reunioes', to: '/reunioes', label: 'Reuniões', icon: BookOpen },
  { menu: 'configuracoes', to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const { canAccess } = useRoleAccess()
  const { user } = useAuth()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.menu))

  return (
    <aside
      className={cn(
        'flex flex-col bg-[var(--color-brand-800)] transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center border-b border-white/10 px-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-500)]">
          <Building2 className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="ml-3 font-display font-semibold text-white text-base">CondAdmin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleItems.map((item) => (
          <SidebarNavItem key={item.menu} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User footer */}
      <div className={cn('border-t border-white/10 p-3', collapsed && 'flex justify-center')}>
        {collapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-white text-xs font-semibold">
            {user ? getInitials(user.nomeCompleto) : <User className="h-4 w-4" />}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-white text-xs font-semibold">
              {user ? getInitials(user.nomeCompleto) : <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.nomeCompleto ?? '—'}</p>
              <p className="truncate text-xs text-white/50">{user?.email ?? ''}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="flex h-10 items-center justify-center border-t border-white/10 text-white/50 hover:text-white transition-colors"
        aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  )
}
