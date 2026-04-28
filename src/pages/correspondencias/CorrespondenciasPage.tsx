import { useMemo, useState } from 'react'
import { PackageCheck, PackagePlus, Search } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/hooks/useAuth'
import { useCorrespondencias, useCreateCorrespondencia, usePickupCorrespondencia } from '@/hooks/useCorrespondencias'
import { formatDate, formatRelative } from '@/lib/formatters'
import { mockUsers } from '@/mocks/data/users.mock'
import type { CorrespondenciaPayload } from '@/types/correspondencias.types'

const INITIAL_FORM: CorrespondenciaPayload = {
  transportadora: '',
  codigoRastreio: '',
  destinatarioId: '',
  observacoes: '',
}

export function CorrespondenciasPage() {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<CorrespondenciaPayload>(INITIAL_FORM)
  const { data, isLoading } = useCorrespondencias()
  const createCorrespondencia = useCreateCorrespondencia()
  const pickupCorrespondencia = usePickupCorrespondencia()

  const visibleItems = useMemo(() => {
    const term = search.toLowerCase()
    return (data ?? []).filter((item) => {
      const allowed = user?.roles.primary ? true : item.destinatarioId === user?.id
      return allowed && `${item.destinatarioNome} ${item.transportadora} ${item.unidade}`.toLowerCase().includes(term)
    })
  }, [data, search, user?.id, user?.roles.primary])

  if (isLoading) return <PageSpinner />

  const pendingCount = visibleItems.filter((item) => item.status === 'recebida').length

  const handleSubmit = async () => {
    await createCorrespondencia.mutateAsync(form)
    setForm(INITIAL_FORM)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Correspondencias"
        description="Controle pacotes recebidos, retiradas e histórico por unidade."
        actions={
          <RoleGuard adminOnly>
            <Button onClick={() => setDialogOpen(true)}>
              <PackagePlus className="h-4 w-4" />
              Registrar entrada
            </Button>
          </RoleGuard>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Visão da portaria</CardDescription>
            <CardTitle>Fluxo do dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,rgba(15,34,51,0.04),rgba(29,111,164,0.12))] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Pendentes</p>
              <p className="mt-2 font-display text-3xl font-semibold">{pendingCount}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Itens aguardando retirada do morador.</p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por morador ou transportadora" className="pl-9" />
            </div>
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">
              Moradores veem apenas as próprias encomendas. Perfis administrativos podem registrar e confirmar retiradas.
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Entradas recentes</CardDescription>
            <CardTitle>Pacotes e encomendas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleItems.map((item) => (
              <div key={item.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={item.status === 'retirada' ? 'success' : 'warning'}>{item.status === 'retirada' ? 'Retirada' : 'Recebida'}</Badge>
                      <Badge variant="outline">{item.transportadora}</Badge>
                    </div>
                    <p className="font-medium text-[var(--color-text-primary)]">{item.destinatarioNome} • {item.unidade}</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">Recebido {formatRelative(item.recebidoEm)} por {item.recebidoPorNome}</p>
                    {item.codigoRastreio && <p className="text-xs text-[var(--color-text-muted)]">Rastreio: {item.codigoRastreio}</p>}
                    {item.observacoes && <p className="rounded-md bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">{item.observacoes}</p>}
                  </div>
                  <div className="flex flex-col items-start gap-2 md:items-end">
                    <p className="text-xs text-[var(--color-text-muted)]">{formatDate(item.recebidoEm, "dd/MM/yyyy 'às' HH:mm")}</p>
                    {item.retiradoEm ? (
                      <p className="text-xs text-[var(--color-success)]">Retirada em {formatDate(item.retiradoEm, "dd/MM 'às' HH:mm")}</p>
                    ) : (
                      <RoleGuard adminOnly>
                        <Button size="sm" variant="accent" onClick={() => pickupCorrespondencia.mutate(item.id)}>
                          <PackageCheck className="h-4 w-4" />
                          Confirmar retirada
                        </Button>
                      </RoleGuard>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar correspondencia</DialogTitle>
            <DialogDescription>Cadastre o item na portaria e vincule ao morador correto.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="transportadora">Transportadora</Label>
                <Input id="transportadora" value={form.transportadora} onChange={(event) => setForm((prev) => ({ ...prev, transportadora: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="codigo-rastreio">Codigo de rastreio</Label>
                <Input id="codigo-rastreio" value={form.codigoRastreio} onChange={(event) => setForm((prev) => ({ ...prev, codigoRastreio: event.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Destinatario</Label>
              <Select value={form.destinatarioId} onValueChange={(value) => setForm((prev) => ({ ...prev, destinatarioId: value }))}>
                <SelectTrigger><SelectValue placeholder="Selecione um morador" /></SelectTrigger>
                <SelectContent>
                  {mockUsers.filter((resident) => resident.roles.isMorador).map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>{resident.nomeCompleto} • {resident.condominio.quadra}-{resident.condominio.numero}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="observacoes">Observacoes</Label>
              <Textarea id="observacoes" value={form.observacoes} onChange={(event) => setForm((prev) => ({ ...prev, observacoes: event.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.transportadora || !form.destinatarioId}>Salvar registro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
