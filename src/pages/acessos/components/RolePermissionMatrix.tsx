import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { Switch } from '@/components/ui/switch'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { useRoleAccess } from '@/hooks/useRoleAccess'
import { ROLE_LABELS } from '@/lib/permissions'
import type { MenuKey } from '@/types/user.types'
import type { PrimaryRole } from '@/types/auth.types'

const MENU_LABELS: Record<MenuKey, string> = {
  inicio: 'Início',
  acessos: 'Acessos',
  administradora: 'Administradora',
  avisos: 'Avisos',
  configuracoes: 'Configurações',
  correspondencias: 'Correspondências',
  documentos: 'Documentos',
  financeiro: 'Financeiro',
  reservas: 'Reservas',
  reunioes: 'Reuniões',
}

const ROLES: Array<PrimaryRole | 'morador'> = ['presidente', 'sindico', 'conselheiro', 'morador']
const MENUS = Object.keys(MENU_LABELS) as MenuKey[]

export function RolePermissionMatrix() {
  const queryClient = useQueryClient()
  const { isAdmin } = useRoleAccess()
  const { data: permissions, isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: userService.getPermissions,
  })

  const mutation = useMutation({
    mutationFn: userService.updatePermissions,
    onSuccess: (data) => queryClient.setQueryData(['permissions'], data),
  })

  if (isLoading || !permissions) return <PageSpinner />

  const toggle = (role: string, menu: MenuKey) => {
    if (!isAdmin) return
    const updated = {
      ...permissions,
      [role]: { ...permissions[role], [menu]: !permissions[role][menu] },
    }
    mutation.mutate(updated)
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Menu</th>
            {ROLES.map((role) => (
              <th key={role} className="px-4 py-3 text-center font-semibold text-[var(--color-text-secondary)]">
                {ROLE_LABELS[role]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MENUS.map((menu) => (
            <tr key={menu} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
              <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{MENU_LABELS[menu]}</td>
              {ROLES.map((role) => (
                <td key={role} className="px-4 py-3 text-center">
                  <Switch
                    checked={permissions[role]?.[menu] ?? false}
                    onCheckedChange={() => toggle(role, menu)}
                    disabled={!isAdmin || menu === 'inicio'}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!isAdmin && (
        <p className="px-4 py-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
          Apenas Presidente e Síndico podem editar as permissões.
        </p>
      )}
    </div>
  )
}
