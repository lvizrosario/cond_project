import { useState } from 'react'
import { Copy, Check, FileText, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentStatusBadge } from '@/components/shared/StatusBadge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatBRL, formatDate, formatCompetencia } from '@/lib/formatters'
import type { Boleto } from '@/types/financeiro.types'

interface BoletoCardProps {
  boleto: Boleto
}

export function BoletoCard({ boleto }: BoletoCardProps) {
  const [copied, setCopied] = useState(false)
  const [viewerOpen, setViewerOpen] = useState(false)

  const copyCode = async () => {
    await navigator.clipboard.writeText(boleto.linhaDigitavel)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-1">Competência</p>
              <p className="font-display font-semibold text-[var(--color-text-primary)] capitalize">
                {formatCompetencia(boleto.competencia)}
              </p>
            </div>
            <PaymentStatusBadge status={boleto.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Valor</p>
              <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">{formatBRL(boleto.valor)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Vencimento</p>
              <p className="font-semibold text-[var(--color-text-primary)]">{formatDate(boleto.dataVencimento)}</p>
              {boleto.dataPagamento && (
                <p className="text-xs text-[var(--color-success)]">Pago em {formatDate(boleto.dataPagamento)}</p>
              )}
            </div>
          </div>

          {boleto.status !== 'pago' && (
            <div className="rounded-lg bg-[var(--color-surface)] p-3 mb-4">
              <p className="text-xs text-[var(--color-text-muted)] mb-1">Linha digitável</p>
              <p className="font-mono text-xs text-[var(--color-text-secondary)] break-all">{boleto.linhaDigitavel}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setViewerOpen(true)}>
              <FileText className="h-4 w-4" /> Ver boleto
            </Button>
            {boleto.status !== 'pago' && (
              <Button size="sm" className="flex-1" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copiado!' : 'Copiar código'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Boleto — {formatCompetencia(boleto.competencia)}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-muted)] text-sm min-h-[300px] flex items-center justify-center">
            {boleto.pdfUrl
              ? <iframe src={boleto.pdfUrl} className="w-full h-72 rounded" title="Boleto PDF" />
              : <p>Visualização do boleto indisponível no modo de demonstração.</p>
            }
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewerOpen(false)}>Fechar</Button>
            <Button variant="ghost" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Baixar PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
