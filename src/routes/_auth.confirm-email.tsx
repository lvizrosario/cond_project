import { createFileRoute, useSearch, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { authService } from '@/services/authService'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth/confirm-email')({
  validateSearch: (search: Record<string, unknown>) => ({ token: String(search.token ?? '') }),
  component: ConfirmEmailPage,
})

function ConfirmEmailPage() {
  const { token } = useSearch({ from: '/_auth/confirm-email' })
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) { setStatus('error'); return }
    authService.confirmEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="text-center">
      {status === 'loading' && (
        <>
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[var(--color-brand-500)]" />
          <p className="text-[var(--color-text-secondary)]">Confirmando seu e-mail…</p>
        </>
      )}
      {status === 'success' && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success-bg)]">
            <CheckCircle2 className="h-7 w-7 text-[var(--color-success)]" />
          </div>
          <h2 className="font-display font-semibold text-xl mb-2">E-mail confirmado!</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">Sua conta está ativa. Você já pode fazer login.</p>
          <Button asChild><Link to="/login">Ir para o login</Link></Button>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-danger-bg)]">
            <XCircle className="h-7 w-7 text-[var(--color-danger)]" />
          </div>
          <h2 className="font-display font-semibold text-xl mb-2">Link inválido</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">O link expirou ou é inválido. Tente se cadastrar novamente.</p>
          <Button variant="outline" asChild><Link to="/register">Cadastrar-se</Link></Button>
        </>
      )}
    </div>
  )
}
