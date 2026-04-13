import { createFileRoute, Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validators'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data)
      navigate({ to: '/inicio' })
    } catch {
      // error shown via store
    }
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-[var(--color-text-primary)] mb-1">Entrar</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Acesse sua conta do condomínio
      </p>

      <form onSubmit={handleSubmit(onSubmit)} onChange={clearError} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" placeholder="seu@email.com" {...register('email')} />
          {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" placeholder="••••••••" {...register('senha')} />
          {errors.senha && <p className="text-xs text-[var(--color-danger)]">{errors.senha.message}</p>}
        </div>

        {error && (
          <div className="rounded-lg bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/20 px-3 py-2 text-sm text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
        Ainda não tem conta?{' '}
        <Link to="/register" className="text-[var(--color-brand-500)] hover:underline font-medium">
          Cadastrar-se
        </Link>
      </p>

      <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
        Credenciais de teste: <span className="font-mono">carlos@email.com</span> / <span className="font-mono">Teste@123</span>
      </p>
    </div>
  )
}
