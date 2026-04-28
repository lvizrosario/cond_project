import { useEffect, useMemo, useState } from 'react'
import { BellRing, Eye, Megaphone, Plus, Sparkles } from 'lucide-react'
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
import { useAvisos, useCreateAviso, useMarkAvisoAsRead, usePublishAviso, useUpdateAviso } from '@/hooks/useAvisos'
import { formatDate, formatRelative } from '@/lib/formatters'
import type { Aviso, AvisoAudience, AvisoCategoria, AvisoFilters, AvisoPayload } from '@/types/avisos.types'

const CATEGORY_LABELS: Record<AvisoCategoria, string> = {
  geral: 'Geral',
  manutencao: 'Manutencao',
  financeiro: 'Financeiro',
  evento: 'Evento',
}

const STATUS_VARIANTS = {
  rascunho: 'outline',
  publicado: 'success',
  expirado: 'warning',
} as const

const STATUS_LABELS = {
  rascunho: 'Rascunho',
  publicado: 'Publicado',
  expirado: 'Expirado',
} as const

const AUDIENCE_LABELS: Record<AvisoAudience, string> = {
  todos: 'Todos',
  moradores: 'Moradores',
  administracao: 'Administracao',
}

const INITIAL_FORM: AvisoPayload = {
  titulo: '',
  conteudo: '',
  categoria: 'geral',
  audience: 'todos',
  destaque: false,
}

export function AvisosPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<AvisoFilters>({ categoria: 'todas', status: 'todos' })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAviso, setEditingAviso] = useState<Aviso | null>(null)
  const [form, setForm] = useState<AvisoPayload>(INITIAL_FORM)
  const { data: avisos, isLoading } = useAvisos(filters)
  const createAviso = useCreateAviso()
  const updateAviso = useUpdateAviso()
  const publishAviso = usePublishAviso()
  const markAsRead = useMarkAvisoAsRead()

  const selectedAviso = useMemo(() => {
    if (!avisos?.length) return null
    return avisos.find((aviso) => aviso.id === selectedId) ?? avisos[0]
  }, [avisos, selectedId])

  useEffect(() => {
    if (!selectedId && avisos?.[0]) setSelectedId(avisos[0].id)
  }, [avisos, selectedId])

  if (isLoading) return <PageSpinner />

  const unreadCount = avisos?.filter((aviso) => !aviso.lidoPor.includes(user?.id ?? '') && aviso.status === 'publicado').length ?? 0

  const openCreateDialog = () => {
    setEditingAviso(null)
    setForm(INITIAL_FORM)
    setDialogOpen(true)
  }

  const openEditDialog = (aviso: Aviso) => {
    setEditingAviso(aviso)
    setForm({
      titulo: aviso.titulo,
      conteudo: aviso.conteudo,
      categoria: aviso.categoria,
      audience: aviso.audience,
      expiraEm: aviso.expiraEm,
      destaque: aviso.destaque,
    })
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (editingAviso) {
      await updateAviso.mutateAsync({ id: editingAviso.id, payload: form })
    } else {
      await createAviso.mutateAsync(form)
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Avisos"
        description="Central editorial do condomínio para recados, eventos e atualizações de operação."
        actions={
          <RoleGuard adminOnly>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4" />
              Novo aviso
            </Button>
          </RoleGuard>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Card className="border border-[var(--color-border)] xl:col-span-1">
          <CardHeader>
            <CardDescription>Painel rapido</CardDescription>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRing className="h-5 w-5 text-[var(--color-accent-500)]" />
              Leitura em dia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(135deg,rgba(29,111,164,0.12),rgba(217,119,6,0.14))] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Nao lidos</p>
              <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-text-primary)]">{unreadCount}</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Avisos publicados aguardando sua leitura.</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Categoria</Label>
                <Select value={filters.categoria ?? 'todas'} onValueChange={(value) => setFilters((prev) => ({ ...prev, categoria: value as AvisoFilters['categoria'] }))}>
                  <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="manutencao">Manutencao</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={filters.status ?? 'todos'} onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value as AvisoFilters['status'] }))}>
                  <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="publicado">Publicado</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="expirado">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)] xl:col-span-1">
          <CardHeader>
            <CardDescription>Timeline</CardDescription>
            <CardTitle>Publicacoes recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {avisos?.map((aviso) => (
              <button
                key={aviso.id}
                type="button"
                onClick={() => setSelectedId(aviso.id)}
                className={`w-full rounded-[var(--radius-lg)] border p-4 text-left transition-all ${
                  selectedAviso?.id === aviso.id
                    ? 'border-[var(--color-brand-400)] bg-[var(--color-brand-50)]'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-brand-100)] hover:bg-[var(--color-surface)]'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={STATUS_VARIANTS[aviso.status]}>{STATUS_LABELS[aviso.status]}</Badge>
                  {aviso.destaque && <Sparkles className="h-4 w-4 text-[var(--color-accent-500)]" />}
                </div>
                <p className="mt-3 line-clamp-2 font-medium text-[var(--color-text-primary)]">{aviso.titulo}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{CATEGORY_LABELS[aviso.categoria]}</span>
                  <span>{formatRelative(aviso.publicadoEm ?? aviso.criadoEm)}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)] xl:col-span-2">
          {selectedAviso ? (
            <>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={STATUS_VARIANTS[selectedAviso.status]}>{STATUS_LABELS[selectedAviso.status]}</Badge>
                  <Badge variant="accent">{CATEGORY_LABELS[selectedAviso.categoria]}</Badge>
                  <Badge variant="outline">{AUDIENCE_LABELS[selectedAviso.audience]}</Badge>
                </div>
                <CardTitle className="text-xl">{selectedAviso.titulo}</CardTitle>
                <CardDescription>
                  Publicado por {selectedAviso.criadoPorNome} em {formatDate(selectedAviso.publicadoEm ?? selectedAviso.criadoEm, "dd/MM/yyyy 'às' HH:mm")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(241,245,249,0.9))] p-5">
                  <p className="whitespace-pre-line leading-7 text-[var(--color-text-primary)]">{selectedAviso.conteudo}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4">
                  <div className="text-sm text-[var(--color-text-secondary)]">
                    <p>{selectedAviso.expiraEm ? `Expira em ${formatDate(selectedAviso.expiraEm)}` : 'Sem prazo de expiração definido.'}</p>
                    <p className="mt-1">{selectedAviso.lidoPor.length} morador(es) já visualizaram este aviso.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <RoleGuard adminOnly>
                      <Button variant="outline" onClick={() => openEditDialog(selectedAviso)}>Editar</Button>
                      {selectedAviso.status === 'rascunho' && (
                        <Button variant="accent" onClick={() => publishAviso.mutate(selectedAviso.id)}>
                          <Megaphone className="h-4 w-4" />
                          Publicar
                        </Button>
                      )}
                    </RoleGuard>
                    {!selectedAviso.lidoPor.includes(user?.id ?? '') && selectedAviso.status === 'publicado' && (
                      <Button variant="outline" onClick={() => markAsRead.mutate(selectedAviso.id)}>
                        <Eye className="h-4 w-4" />
                        Marcar como lido
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-16 text-center text-sm text-[var(--color-text-secondary)]">Nenhum aviso encontrado com os filtros atuais.</CardContent>
          )}
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAviso ? 'Editar aviso' : 'Novo aviso'}</DialogTitle>
            <DialogDescription>Crie comunicações claras e organizadas para os moradores.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="aviso-titulo">Titulo</Label>
              <Input id="aviso-titulo" value={form.titulo} onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={(value) => setForm((prev) => ({ ...prev, categoria: value as AvisoCategoria }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral</SelectItem>
                    <SelectItem value="manutencao">Manutencao</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Publico</Label>
                <Select value={form.audience} onValueChange={(value) => setForm((prev) => ({ ...prev, audience: value as AvisoAudience }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="moradores">Moradores</SelectItem>
                    <SelectItem value="administracao">Administracao</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="aviso-expira">Expira em</Label>
              <Input id="aviso-expira" type="date" value={form.expiraEm?.slice(0, 10) ?? ''} onChange={(event) => setForm((prev) => ({ ...prev, expiraEm: event.target.value || undefined }))} />
            </div>
            <div>
              <Label htmlFor="aviso-conteudo">Conteudo</Label>
              <Textarea id="aviso-conteudo" value={form.conteudo} onChange={(event) => setForm((prev) => ({ ...prev, conteudo: event.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!form.titulo || !form.conteudo}>Salvar aviso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
