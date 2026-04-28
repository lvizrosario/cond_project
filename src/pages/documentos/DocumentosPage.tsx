import { useMemo, useState } from 'react'
import { Archive, FileStack, FolderKanban, Plus, UploadCloud } from 'lucide-react'
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
import { useAddDocumentoVersion, useArchiveDocumento, useCreateDocumento, useDocumentos } from '@/hooks/useDocumentos'
import { formatDate } from '@/lib/formatters'
import type { Documento, DocumentoAudience, DocumentoCategoria, DocumentoPayload } from '@/types/documentos.types'

const CATEGORY_LABELS: Record<DocumentoCategoria, string> = {
  regulamento: 'Regulamento',
  assembleia: 'Assembleia',
  financeiro: 'Financeiro',
  servicos: 'Servicos',
}

const INITIAL_FORM: DocumentoPayload = {
  titulo: '',
  categoria: 'regulamento',
  audience: 'todos',
  descricao: '',
  arquivoNome: '',
}

export function DocumentosPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<DocumentoCategoria | 'todas'>('todas')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<DocumentoPayload>(INITIAL_FORM)
  const { data, isLoading } = useDocumentos()
  const createDocumento = useCreateDocumento()
  const addVersion = useAddDocumentoVersion()
  const archiveDocumento = useArchiveDocumento()

  const documents = useMemo(() => (data ?? []).filter((item) => selectedCategory === 'todas' || item.categoria === selectedCategory), [data, selectedCategory])
  const selectedDocument: Documento | null = documents.find((item) => item.id === selectedId) ?? documents[0] ?? null

  if (isLoading) return <PageSpinner />

  const handleCreate = async () => {
    await createDocumento.mutateAsync(form)
    setForm(INITIAL_FORM)
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documentos"
        description="Biblioteca institucional com versões, público-alvo e histórico de atualização."
        actions={
          <RoleGuard adminOnly>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Novo documento
            </Button>
          </RoleGuard>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Navegacao</CardDescription>
            <CardTitle>Categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(['todas', 'regulamento', 'assembleia', 'financeiro', 'servicos'] as const).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex w-full items-center justify-between rounded-[var(--radius-lg)] px-4 py-3 text-left text-sm transition-colors ${selectedCategory === category ? 'bg-[var(--color-brand-50)] text-[var(--color-brand-700)]' : 'hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)]'}`}
              >
                <span className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  {category === 'todas' ? 'Todos os documentos' : CATEGORY_LABELS[category]}
                </span>
                <span className="text-xs">{category === 'todas' ? data?.length ?? 0 : data?.filter((item) => item.categoria === category).length ?? 0}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          <CardHeader>
            <CardDescription>Acervo compartilhado</CardDescription>
            <CardTitle>Arquivos publicados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {documents.map((documento) => (
              <button
                key={documento.id}
                type="button"
                onClick={() => setSelectedId(documento.id)}
                className={`w-full rounded-[var(--radius-lg)] border p-4 text-left transition-colors ${selectedDocument?.id === documento.id ? 'border-[var(--color-brand-400)] bg-[var(--color-brand-50)]' : 'border-[var(--color-border)] hover:bg-[var(--color-surface)]'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{CATEGORY_LABELS[documento.categoria]}</Badge>
                    {documento.arquivado && <Badge variant="warning">Arquivado</Badge>}
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)]">v{documento.ultimaVersao.versao}</span>
                </div>
                <p className="mt-3 font-medium text-[var(--color-text-primary)]">{documento.titulo}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{documento.descricao}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{documento.ultimaVersao.arquivoNome}</span>
                  <span>{formatDate(documento.atualizadoEm)}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-[var(--color-border)]">
          {selectedDocument ? (
            <>
              <CardHeader>
                <CardDescription>Ficha do documento</CardDescription>
                <CardTitle className="text-lg">{selectedDocument.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[var(--radius-lg)] bg-[linear-gradient(160deg,rgba(29,111,164,0.08),rgba(255,255,255,0.9))] p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{CATEGORY_LABELS[selectedDocument.categoria]}</Badge>
                    <Badge variant="accent">{selectedDocument.audience}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{selectedDocument.descricao}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-sm font-semibold">Historico de versoes</h3>
                  {selectedDocument.versoes.map((versao) => (
                    <div key={versao.id} className="flex items-center justify-between rounded-[var(--radius)] border border-[var(--color-border)] px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium">v{versao.versao} • {versao.arquivoNome}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{versao.criadoPorNome}</p>
                      </div>
                      <span className="text-xs text-[var(--color-text-muted)]">{formatDate(versao.criadoEm)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <FileStack className="h-4 w-4" />
                    Visualizar metadados
                  </Button>
                  <RoleGuard adminOnly>
                    <Button variant="outline" onClick={() => addVersion.mutate({ id: selectedDocument.id, payload: { arquivoNome: `${selectedDocument.titulo.toLowerCase().replace(/\s+/g, '-')}-v${selectedDocument.ultimaVersao.versao + 1}.pdf` } })}>
                      <UploadCloud className="h-4 w-4" />
                      Nova versao
                    </Button>
                    {!selectedDocument.arquivado && (
                      <Button variant="ghost" onClick={() => archiveDocumento.mutate(selectedDocument.id)}>
                        <Archive className="h-4 w-4" />
                        Arquivar
                      </Button>
                    )}
                  </RoleGuard>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="py-16 text-center text-sm text-[var(--color-text-secondary)]">Selecione um documento para ver detalhes.</CardContent>
          )}
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo documento</DialogTitle>
            <DialogDescription>Cadastre um arquivo e a primeira versão do documento.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="doc-titulo">Titulo</Label>
              <Input id="doc-titulo" value={form.titulo} onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Categoria</Label>
                <Select value={form.categoria} onValueChange={(value) => setForm((prev) => ({ ...prev, categoria: value as DocumentoCategoria }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regulamento">Regulamento</SelectItem>
                    <SelectItem value="assembleia">Assembleia</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="servicos">Servicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Publico</Label>
                <Select value={form.audience} onValueChange={(value) => setForm((prev) => ({ ...prev, audience: value as DocumentoAudience }))}>
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
              <Label htmlFor="doc-arquivo">Nome do arquivo</Label>
              <Input id="doc-arquivo" value={form.arquivoNome} onChange={(event) => setForm((prev) => ({ ...prev, arquivoNome: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="doc-descricao">Descricao</Label>
              <Textarea id="doc-descricao" value={form.descricao} onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.titulo || !form.arquivoNome}>Salvar documento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
