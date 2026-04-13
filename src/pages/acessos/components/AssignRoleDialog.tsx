import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import type { User } from '@/types/user.types'
import type { PrimaryRole } from '@/types/auth.types'
import { ROLE_LABELS } from '@/lib/permissions'

interface AssignRoleDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (roles: { primary: PrimaryRole | null; isMorador: boolean }) => void
  isLoading?: boolean
}

export function AssignRoleDialog({ user, open, onOpenChange, onSave, isLoading }: AssignRoleDialogProps) {
  const [primary, setPrimary] = useState<PrimaryRole | null>(user.roles.primary)
  const [isMorador, setIsMorador] = useState(user.roles.isMorador)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>{user.nomeCompleto} · {user.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-1.5">
            <Label>Cargo principal</Label>
            <Select value={primary ?? 'nenhum'} onValueChange={(v) => setPrimary(v === 'nenhum' ? null : v as PrimaryRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nenhum">Nenhum cargo</SelectItem>
                <SelectItem value="presidente">{ROLE_LABELS.presidente}</SelectItem>
                <SelectItem value="sindico">{ROLE_LABELS.sindico}</SelectItem>
                <SelectItem value="conselheiro">{ROLE_LABELS.conselheiro}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--color-text-muted)]">Presidente, Síndico e Conselheiro são exclusivos entre si.</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">É também Morador?</p>
              <p className="text-xs text-[var(--color-text-muted)]">Permite combinar com qualquer cargo acima.</p>
            </div>
            <Switch checked={isMorador} onCheckedChange={setIsMorador} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={() => onSave({ primary, isMorador })} disabled={isLoading}>
            {isLoading ? 'Salvando…' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
