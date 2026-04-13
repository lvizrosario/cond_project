import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AssignRoleDialog } from './AssignRoleDialog'
import { ROLE_LABELS } from '@/lib/permissions'
import { getInitials } from '@/lib/formatters'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import type { User } from '@/types/user.types'
import type { PrimaryRole } from '@/types/auth.types'

export function UserRoleTable() {
  const queryClient = useQueryClient()
  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.getAll })
  const [editing, setEditing] = useState<User | null>(null)

  const mutation = useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: { primary: PrimaryRole | null; isMorador: boolean } }) =>
      userService.updateRoles(id, roles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setEditing(null)
    },
  })

  if (isLoading) return <PageSpinner />

  return (
    <>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Morador</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)] hidden sm:table-cell">E-mail</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Unidade</th>
              <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-secondary)]">Perfil</th>
              <th className="px-4 py-3 text-right font-semibold text-[var(--color-text-secondary)]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-100)] text-[var(--color-brand-500)] text-xs font-semibold">
                      {getInitials(u.nomeCompleto)}
                    </div>
                    <span className="font-medium text-[var(--color-text-primary)]">{u.nomeCompleto}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">{u.email}</td>
                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{u.condominio.quadra}-{u.condominio.numero}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {u.roles.primary && <Badge>{ROLE_LABELS[u.roles.primary]}</Badge>}
                    {u.roles.isMorador && <Badge variant="outline">Morador</Badge>}
                    {!u.roles.primary && !u.roles.isMorador && <Badge variant="outline">—</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(u)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <AssignRoleDialog
          user={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          onSave={(roles) => mutation.mutate({ id: editing.id, roles })}
          isLoading={mutation.isPending}
        />
      )}
    </>
  )
}
