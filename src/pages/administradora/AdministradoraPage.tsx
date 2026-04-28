import { useEffect, useState } from 'react'
import { Building2, FileBadge2, Plus, ShieldCheck, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { RoleGuard } from '@/components/shared/RoleGuard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAddAdministradoraContato, useAddAdministradoraContrato, useAdministradora, useUpdateAdministradora } from '@/hooks/useAdministradora'
import { formatDate } from '@/lib/formatters'
import type { AdministradoraPayload } from '@/types/administradora.types'

const EMPTY_PROFILE: AdministradoraPayload = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  email: '',
  telefone: '',
  site: '',
  canaisAtendimento: [],
}

export function AdministradoraPage() {
  const { data, isLoading } = useAdministradora()
  const updateProfile = useUpdateAdministradora()
  const addContact = useAddAdministradoraContato()
  const addContract = useAddAdministradoraContrato()
  const [profileOpen, setProfileOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)
  const [profileForm, setProfileForm] = useState<AdministradoraPayload>(EMPTY_PROFILE)
  const [contactForm, setContactForm] = useState({ nome: '', cargo: '', email: '', telefone: '', principal: false })
  const [contractForm, setContractForm] = useState({ nome: '', inicio: '', fim: '', status: 'ativo' as const, observacoes: '' })
  const [channelsText, setChannelsText] = useState('')

  useEffect(() => {
    if (!data) return
    setProfileForm({
      razaoSocial: data.razaoSocial,
      nomeFantasia: data.nomeFantasia,
      cnpj: data.cnpj,
      email: data.email,
      telefone: data.telefone,
      site: data.site,
      canaisAtendimento: data.canaisAtendimento,
    })
    setChannelsText(data.canaisAtendimento.join('\n'))
  }, [data])

  if (isLoading || !data) return <PageSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administradora"
        description="Relacione contratos, canais de atendimento e responsáveis pelo condomínio."
        actions={
          <RoleGuard adminOnly>
            <Button onClick={() => setProfileOpen(true)}>Editar perfil</Button>
          </RoleGuard>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Perfil institucional</CardDescription>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Building2 className="h-5 w-5 text-[var(--color-brand-500)]" />
              {data.nomeFantasia}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(145deg,rgba(15,34,51,0.05),rgba(29,111,164,0.11))] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Dados principais</p>
              <div className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p><strong className="text-[var(--color-text-primary)]">Razão social:</strong> {data.razaoSocial}</p>
                <p><strong className="text-[var(--color-text-primary)]">CNPJ:</strong> {data.cnpj}</p>
                <p><strong className="text-[var(--color-text-primary)]">E-mail:</strong> {data.email}</p>
                <p><strong className="text-[var(--color-text-primary)]">Telefone:</strong> {data.telefone}</p>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Canais ativos</p>
              <div className="mt-4 space-y-2">
                {data.canaisAtendimento.map((channel) => (
                  <div key={channel} className="rounded-md bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">{channel}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="border border-[var(--color-border)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Equipe da conta</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4 text-[var(--color-accent-500)]" />
                    Contatos
                  </CardTitle>
                </div>
                <RoleGuard adminOnly>
                  <Button size="sm" variant="outline" onClick={() => setContactOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </RoleGuard>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.contatos.map((contact) => (
                <div key={contact.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-[var(--color-text-primary)]">{contact.nome}</p>
                    {contact.principal && <Badge variant="success">Principal</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{contact.cargo}</p>
                  <p className="mt-2 text-xs text-[var(--color-text-muted)]">{contact.email} • {contact.telefone}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-[var(--color-border)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription>Segurança contratual</CardDescription>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileBadge2 className="h-4 w-4 text-[var(--color-brand-500)]" />
                    Contratos
                  </CardTitle>
                </div>
                <RoleGuard adminOnly>
                  <Button size="sm" variant="outline" onClick={() => setContractOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Novo
                  </Button>
                </RoleGuard>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.contratos.map((contract) => (
                <div key={contract.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[var(--color-text-primary)]">{contract.nome}</p>
                    <Badge variant={contract.status === 'ativo' ? 'success' : contract.status === 'renovacao' ? 'accent' : 'outline'}>{contract.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{contract.observacoes}</p>
                  <p className="mt-3 text-xs text-[var(--color-text-muted)]">Vigência: {formatDate(contract.inicio)}{contract.fim ? ` até ${formatDate(contract.fim)}` : ''}</p>
                </div>
              ))}
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-4 text-sm text-[var(--color-text-secondary)]">
                <p className="flex items-center gap-2 font-medium text-[var(--color-text-primary)]"><ShieldCheck className="h-4 w-4 text-[var(--color-success)]" />Governança preparada</p>
                <p className="mt-2">Use esta área para manter contratos e responsáveis atualizados antes da renovação anual.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar perfil da administradora</DialogTitle>
            <DialogDescription>Ajuste dados institucionais e os principais canais de atendimento.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Razão social</Label><Input value={profileForm.razaoSocial} onChange={(event) => setProfileForm((prev) => ({ ...prev, razaoSocial: event.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nome fantasia</Label><Input value={profileForm.nomeFantasia} onChange={(event) => setProfileForm((prev) => ({ ...prev, nomeFantasia: event.target.value }))} /></div>
              <div><Label>CNPJ</Label><Input value={profileForm.cnpj} onChange={(event) => setProfileForm((prev) => ({ ...prev, cnpj: event.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>E-mail</Label><Input value={profileForm.email} onChange={(event) => setProfileForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
              <div><Label>Telefone</Label><Input value={profileForm.telefone} onChange={(event) => setProfileForm((prev) => ({ ...prev, telefone: event.target.value }))} /></div>
            </div>
            <div><Label>Site</Label><Input value={profileForm.site} onChange={(event) => setProfileForm((prev) => ({ ...prev, site: event.target.value }))} /></div>
            <div><Label>Canais de atendimento</Label><Textarea value={channelsText} onChange={(event) => setChannelsText(event.target.value)} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setProfileOpen(false)}>Cancelar</Button>
            <Button onClick={() => updateProfile.mutate({ ...profileForm, canaisAtendimento: channelsText.split('\n').map((value) => value.trim()).filter(Boolean) })}>Salvar perfil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo contato</DialogTitle>
            <DialogDescription>Adicione um responsável da administradora para atendimento do condomínio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Nome</Label><Input value={contactForm.nome} onChange={(event) => setContactForm((prev) => ({ ...prev, nome: event.target.value }))} /></div>
              <div><Label>Cargo</Label><Input value={contactForm.cargo} onChange={(event) => setContactForm((prev) => ({ ...prev, cargo: event.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>E-mail</Label><Input value={contactForm.email} onChange={(event) => setContactForm((prev) => ({ ...prev, email: event.target.value }))} /></div>
              <div><Label>Telefone</Label><Input value={contactForm.telefone} onChange={(event) => setContactForm((prev) => ({ ...prev, telefone: event.target.value }))} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContactOpen(false)}>Cancelar</Button>
            <Button onClick={() => addContact.mutate(contactForm)}>Salvar contato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={contractOpen} onOpenChange={setContractOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo contrato</DialogTitle>
            <DialogDescription>Cadastre o resumo executivo do contrato vigente ou em renovação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome do contrato</Label><Input value={contractForm.nome} onChange={(event) => setContractForm((prev) => ({ ...prev, nome: event.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Início</Label><Input type="date" value={contractForm.inicio} onChange={(event) => setContractForm((prev) => ({ ...prev, inicio: event.target.value }))} /></div>
              <div><Label>Fim</Label><Input type="date" value={contractForm.fim} onChange={(event) => setContractForm((prev) => ({ ...prev, fim: event.target.value }))} /></div>
            </div>
            <div><Label>Observações</Label><Textarea value={contractForm.observacoes} onChange={(event) => setContractForm((prev) => ({ ...prev, observacoes: event.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setContractOpen(false)}>Cancelar</Button>
            <Button onClick={() => addContract.mutate(contractForm)}>Salvar contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
