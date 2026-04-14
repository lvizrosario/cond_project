import { useMemo, useState } from 'react'
import { CalendarClock, ClipboardPenLine, Plus, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAddAgendaItem, useCreateReuniao, usePublishAta, useReunioes } from '@/hooks/useReunioes'
import { formatDate, formatRelative } from '@/lib/formatters'
import type { Reuniao, ReuniaoPayload } from '@/types/reunioes.types'

const INITIAL_FORM: ReuniaoPayload = {
  titulo: '',
  descricao: '',
  local: '',
  dataHora: '',
}

export function ReunioesPage() {
  const [tab, setTab] = useState<'proximas' | 'historico'>('proximas')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newAgendaItem, setNewAgendaItem] = useState('')
  const [ataResumo, setAtaResumo] = useState('')
  const [form, setForm] = useState<ReuniaoPayload>(INITIAL_FORM)
  const { data, isLoading } = useReunioes()
  const createReuniao = useCreateReuniao()
  const addAgendaItem = useAddAgendaItem()
  const publishAta = usePublishAta()

  const meetings = useMemo(() => {
    const now = new Date()
    return (data ?? []).filter((meeting) => tab === 'proximas'
      ? new Date(meeting.dataHora) >= now || meeting.status !== 'encerrada'
      : new Date(meeting.dataHora) < now || meeting.status === 'encerrada')
  }, [data, tab])

  const selectedMeeting: Reuniao | null = meetings.find((meeting) => meeting.id === selectedId) ?? meetings[0] ?? null

  if (isLoading) return <PageSpinner />

  const handleCreate = async () => {
    await createReuniao.mutateAsync(form)
    setForm(INITIAL_FORM)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reunioes"
        description="Agenda institucional, pautas detalhadas e atas prontas para consulta."
        actions={
          <RoleGuard adminOnly>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova reuniao
            </Button>
          </RoleGuard>
        }
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as 'proximas' | 'historico')}>
        <TabsList>
          <TabsTrigger value="proximas">Próximas</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <Card className="border border-[var(--color-border)]">
              <CardHeader>
                <CardDescription>Calendario editorial</CardDescription>
                <CardTitle>Encontros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {meetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    type="button"
                    onClick={() => setSelectedId(meeting.id)}
                    className={`w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors ${selectedMeeting?.id === meeting.id ? 'border-[var(--color-brand-400)] bg-[var(--color-brand-50)]' : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant={meeting.status === 'encerrada' ? 'outline' : 'accent'}>{meeting.status}</Badge>
                      <span className="text-xs text-[var(--color-text-muted)]">{formatRelative(meeting.dataHora)}</span>
                    </div>
                    <p className="mt-3 font-medium text-[var(--color-text-primary)]">{meeting.titulo}</p>
                    <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{meeting.local}</p>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-[var(--color-border)]">
              {selectedMeeting ? (
                <>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={selectedMeeting.status === 'encerrada' ? 'outline' : 'accent'}>{selectedMeeting.status}</Badge>
                    </div>
                    <CardTitle className="text-xl">{selectedMeeting.titulo}</CardTitle>
                    <CardDescription>{formatDate(selectedMeeting.dataHora, "dd/MM/yyyy 'às' HH:mm")} • {selectedMeeting.local}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[var(--radius-lg)] bg-[var(--color-surface)] p-4">
                      <p className="leading-7 text-[var(--color-text-secondary)]">{selectedMeeting.descricao}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <Card className="border border-[var(--color-border)] shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <ClipboardPenLine className="h-4 w-4 text-[var(--color-brand-500)]" />
                            Pauta
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedMeeting.agenda.map((item, index) => (
                            <div key={`${selectedMeeting.id}-${index}`} className="rounded-md border border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                              {index + 1}. {item}
                            </div>
                          ))}
                          <RoleGuard adminOnly>
                            <div className="flex gap-2 pt-2">
                              <Input value={newAgendaItem} onChange={(event) => setNewAgendaItem(event.target.value)} placeholder="Adicionar pauta" />
                              <Button variant="outline" onClick={() => { addAgendaItem.mutate({ id: selectedMeeting.id, pauta: newAgendaItem }); setNewAgendaItem('') }} disabled={!newAgendaItem}>
                                Adicionar
                              </Button>
                            </div>
                          </RoleGuard>
                        </CardContent>
                      </Card>

                      <Card className="border border-[var(--color-border)] shadow-none">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <UsersRound className="h-4 w-4 text-[var(--color-accent-500)]" />
                            Participantes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedMeeting.participantes.map((participant) => (
                            <div key={participant.userId} className="flex items-center justify-between rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
                              <span>{participant.nome}</span>
                              <Badge variant={participant.confirmado ? 'success' : 'outline'}>{participant.confirmado ? 'Confirmado' : 'Pendente'}</Badge>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border border-[var(--color-border)] shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <CalendarClock className="h-4 w-4 text-[var(--color-brand-500)]" />
                          Ata
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedMeeting.ata ? (
                          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-text-secondary)]">
                            <p>{selectedMeeting.ata.resumo}</p>
                            <p className="mt-3 text-xs text-[var(--color-text-muted)]">Publicada em {formatDate(selectedMeeting.ata.publicadaEm, "dd/MM/yyyy 'às' HH:mm")}</p>
                          </div>
                        ) : (
                          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">Ata ainda não publicada para esta reunião.</div>
                        )}
                        <RoleGuard adminOnly>
                          <div className="space-y-2">
                            <Textarea value={ataResumo} onChange={(event) => setAtaResumo(event.target.value)} placeholder="Publicar um resumo executivo da reunião..." />
                            <Button variant="outline" onClick={() => { publishAta.mutate({ id: selectedMeeting.id, resumo: ataResumo }); setAtaResumo('') }} disabled={!ataResumo}>
                              Publicar ata
                            </Button>
                          </div>
                        </RoleGuard>
                      </CardContent>
                    </Card>
                  </CardContent>
                </>
              ) : (
                <CardContent className="py-16 text-center text-sm text-[var(--color-text-secondary)]">Nenhuma reunião encontrada.</CardContent>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova reuniao</DialogTitle>
            <DialogDescription>Crie uma pauta inicial e compartilhe a convocação com o condomínio.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reuniao-titulo">Titulo</Label>
              <Input id="reuniao-titulo" value={form.titulo} onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reuniao-data">Data e hora</Label>
                <Input id="reuniao-data" type="datetime-local" value={form.dataHora} onChange={(event) => setForm((prev) => ({ ...prev, dataHora: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="reuniao-local">Local</Label>
                <Input id="reuniao-local" value={form.local} onChange={(event) => setForm((prev) => ({ ...prev, local: event.target.value }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="reuniao-descricao">Descricao</Label>
              <Textarea id="reuniao-descricao" value={form.descricao} onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.titulo || !form.local || !form.dataHora}>Salvar reunião</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
