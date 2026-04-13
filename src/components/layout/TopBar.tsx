import { LogOut, User } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { getInitials } from '@/lib/formatters'
import { ROLE_LABELS } from '@/lib/permissions'

interface TopBarProps {
  title: string
}

export function TopBar({ title }: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const roleLabel = user?.roles.primary
    ? ROLE_LABELS[user.roles.primary]
    : user?.roles.isMorador
    ? 'Morador'
    : '—'

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] bg-white px-6">
      <h1 className="font-display font-semibold text-lg text-[var(--color-text-primary)]">{title}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-[var(--color-surface)] transition-colors focus:outline-none">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">{user?.nomeCompleto}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user ? getInitials(user.nomeCompleto) : '?'}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2">
            <User className="h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 text-[var(--color-danger)]" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
