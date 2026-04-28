import { useEffect, useMemo, useState } from 'react'
import { Building, Palette, ReceiptText, Settings2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PageSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useConfiguracoes, useUpdateConfiguracoes } from '@/hooks/useConfiguracoes'
import type { TenantSettings } from '@/types/configuracoes.types'

export function ConfiguracoesPage() {
  const { data, isLoading } = useConfiguracoes()
  const updateConfiguracoes = useUpdateConfiguracoes()
  const [form, setForm] = useState<TenantSettings | null>(null)

  useEffect(() => {
    if (data) setForm(data)
  }, [data])

  const tiposEventoTexto = useMemo(
    () => form?.reservas.tiposEventoPermitidos.join('\n') ?? '',
    [form],
  )

  if (isLoading || !form) return <PageSpinner />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuracoes"
        description="Ajustes mestres do condominio: operacao, reservas, financeiro e identidade basica."
        actions={<Button onClick={() => updateConfiguracoes.mutate(form)}>Salvar alteracoes</Button>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Dados do tenant</CardDescription>
            <CardTitle className="flex items-center gap-2"><Building className="h-4 w-4 text-[var(--color-brand-500)]" />Perfil do condominio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>Nome do condominio</Label><Input value={form.perfil.nomeCondominio} onChange={(event) => setForm((prev) => prev ? { ...prev, perfil: { ...prev.perfil, nomeCondominio: event.target.value } } : prev)} /></div>
            <div><Label>CEP</Label><Input value={form.perfil.cep} onChange={(event) => setForm((prev) => prev ? { ...prev, perfil: { ...prev.perfil, cep: event.target.value } } : prev)} /></div>
            <div><Label>Quadra de referencia</Label><Input value={form.perfil.quadraReferencia} onChange={(event) => setForm((prev) => prev ? { ...prev, perfil: { ...prev.perfil, quadraReferencia: event.target.value } } : prev)} /></div>
            <div><Label>Numero</Label><Input value={form.perfil.enderecoNumero} onChange={(event) => setForm((prev) => prev ? { ...prev, perfil: { ...prev.perfil, enderecoNumero: event.target.value } } : prev)} /></div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Regras operacionais</CardDescription>
            <CardTitle className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-[var(--color-accent-500)]" />Reservas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div><Label>Antecedencia (h)</Label><Input type="number" value={form.reservas.antecedenciaHoras} onChange={(event) => setForm((prev) => prev ? { ...prev, reservas: { ...prev.reservas, antecedenciaHoras: Number(event.target.value) } } : prev)} /></div>
              <div><Label>Cancelamento (h)</Label><Input type="number" value={form.reservas.cancelamentoHoras} onChange={(event) => setForm((prev) => prev ? { ...prev, reservas: { ...prev.reservas, cancelamentoHoras: Number(event.target.value) } } : prev)} /></div>
              <div><Label>Limite/mes</Label><Input type="number" value={form.reservas.limiteReservasMes} onChange={(event) => setForm((prev) => prev ? { ...prev, reservas: { ...prev.reservas, limiteReservasMes: Number(event.target.value) } } : prev)} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>Tipos de evento permitidos</Label>
              <Textarea
                rows={5}
                value={tiposEventoTexto}
                onChange={(event) => {
                  const tiposEventoPermitidos = event.target.value
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean)

                  setForm((prev) => prev ? { ...prev, reservas: { ...prev.reservas, tiposEventoPermitidos } } : prev)
                }}
                placeholder={'Aniversario\nChurrasco em familia\nConfraternizacao'}
              />
              <p className="text-xs text-[var(--color-text-secondary)]">
                Cadastre um tipo por linha. Esses itens serao exibidos no combo box usado pelo morador ao reservar uma area.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Parametros financeiros</CardDescription>
            <CardTitle className="flex items-center gap-2"><ReceiptText className="h-4 w-4 text-[var(--color-brand-500)]" />Cobranca padrao</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div><Label>Dia de vencimento</Label><Input type="number" value={form.financeiro.diaVencimentoPadrao} onChange={(event) => setForm((prev) => prev ? { ...prev, financeiro: { ...prev.financeiro, diaVencimentoPadrao: Number(event.target.value) } } : prev)} /></div>
            <div><Label>Multa (%)</Label><Input type="number" value={form.financeiro.multaAtrasoPercentual} onChange={(event) => setForm((prev) => prev ? { ...prev, financeiro: { ...prev.financeiro, multaAtrasoPercentual: Number(event.target.value) } } : prev)} /></div>
            <div><Label>Juros mensal (%)</Label><Input type="number" value={form.financeiro.jurosMensalPercentual} onChange={(event) => setForm((prev) => prev ? { ...prev, financeiro: { ...prev.financeiro, jurosMensalPercentual: Number(event.target.value) } } : prev)} /></div>
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Experiencia da marca</CardDescription>
            <CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4 text-[var(--color-accent-500)]" />Branding e operacao</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label>Cor primaria</Label><Input value={form.branding.corPrimaria} onChange={(event) => setForm((prev) => prev ? { ...prev, branding: { ...prev.branding, corPrimaria: event.target.value } } : prev)} /></div>
              <div><Label>Assinatura dos avisos</Label><Input value={form.branding.assinaturaAvisos} onChange={(event) => setForm((prev) => prev ? { ...prev, branding: { ...prev.branding, assinaturaAvisos: event.target.value } } : prev)} /></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Notificacoes in-app</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Cria alertas internos para avisos e correspondencias.</p>
                </div>
                <Switch checked={form.operacional.notificacoesInApp} onCheckedChange={(checked) => setForm((prev) => prev ? { ...prev, operacional: { ...prev.operacional, notificacoesInApp: checked } } : prev)} />
              </div>
              <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Avisos em destaque na home</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Exibe comunicacoes criticas na tela inicial.</p>
                </div>
                <Switch checked={form.operacional.avisosDestaqueNaHome} onCheckedChange={(checked) => setForm((prev) => prev ? { ...prev, operacional: { ...prev.operacional, avisosDestaqueNaHome: checked } } : prev)} />
              </div>
              <div className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--color-border)] px-4 py-3">
                <div>
                  <p className="font-medium text-[var(--color-text-primary)]">Upload por moradores</p>
                  <p className="text-sm text-[var(--color-text-secondary)]">Mantido desabilitado neste ciclo para preservar curadoria administrativa.</p>
                </div>
                <Switch checked={form.operacional.permitirUploadMorador} onCheckedChange={(checked) => setForm((prev) => prev ? { ...prev, operacional: { ...prev.operacional, permitirUploadMorador: checked } } : prev)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
