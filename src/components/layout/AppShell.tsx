import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { useMatches } from '@tanstack/react-router'

const ROUTE_TITLES: Record<string, string> = {
  '/inicio': 'Início',
  '/acessos': 'Acessos',
  '/administradora': 'Administradora',
  '/avisos': 'Avisos',
  '/configuracoes': 'Configurações',
  '/correspondencias': 'Correspondências',
  '/documentos': 'Documentos',
  '/financeiro': 'Financeiro',
  '/reservas': 'Reservas',
  '/reunioes': 'Reuniões',
}

export function AppShell() {
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]
  const title = ROUTE_TITLES[lastMatch?.pathname ?? ''] ?? 'CondAdmin'

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
