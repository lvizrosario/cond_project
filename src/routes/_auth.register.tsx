import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IMaskInput } from 'react-imask'
import { registerSchema, type RegisterFormData } from '@/lib/validators'
import { authService } from '@/services/authService'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setServerError(null)
    try {
      await authService.register(data)
      setSubmitted(true)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao realizar cadastro')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-success-bg)]">
          <CheckCircle2 className="h-7 w-7 text-[var(--color-success)]" />
        </div>
        <h2 className="font-display font-semibold text-xl mb-2">Verifique seu e-mail</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Enviamos um link de confirmação. Acesse-o para ativar sua conta.
        </p>
        <Button variant="outline" onClick={() => navigate({ to: '/login' })}>Voltar ao login</Button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-display font-semibold text-2xl text-[var(--color-text-primary)] mb-1">Criar conta</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">Preencha seus dados para acessar a plataforma</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Nome completo</Label>
          <Input placeholder="João da Silva" {...register('nomeCompleto')} />
          {errors.nomeCompleto && <p className="text-xs text-[var(--color-danger)]">{errors.nomeCompleto.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>E-mail</Label>
            <Input type="email" placeholder="seu@email.com" {...register('email')} />
            {errors.email && <p className="text-xs text-[var(--color-danger)]">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Celular</Label>
            <IMaskInput
              mask="(00) 00000-0000"
              className="flex h-9 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
              placeholder="(61) 99999-9999"
              onAccept={(value) => setValue('telefone', value, { shouldValidate: true })}
            />
            {errors.telefone && <p className="text-xs text-[var(--color-danger)]">{errors.telefone.message}</p>}
          </div>
        </div>

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide pt-1">Endereço</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>CEP</Label>
            <IMaskInput
              mask="00000-000"
              className="flex h-9 w-full rounded-[var(--radius)] border border-[var(--color-border)] bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
              placeholder="00000-000"
              onAccept={(value) => setValue('endereco.cep', value, { shouldValidate: true })}
            />
            {errors.endereco?.cep && <p className="text-xs text-[var(--color-danger)]">{errors.endereco.cep.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Condomínio</Label>
            <Input placeholder="Residencial das Acácias" {...register('endereco.nomeCondominio')} />
            {errors.endereco?.nomeCondominio && <p className="text-xs text-[var(--color-danger)]">{errors.endereco.nomeCondominio.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Quadra / Bloco</Label>
            <Input placeholder="A" {...register('endereco.quadra')} />
            {errors.endereco?.quadra && <p className="text-xs text-[var(--color-danger)]">{errors.endereco.quadra.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Número</Label>
            <Input placeholder="10" {...register('endereco.numero')} />
            {errors.endereco?.numero && <p className="text-xs text-[var(--color-danger)]">{errors.endereco.numero.message}</p>}
          </div>
        </div>

        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide pt-1">Senha</p>

        <div className="space-y-1.5">
          <Label>Senha</Label>
          <Input type="password" placeholder="Mín. 8 chars, maiúscula, número e especial" {...register('senha')} />
          {errors.senha && <p className="text-xs text-[var(--color-danger)]">{errors.senha.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Confirmar senha</Label>
          <Input type="password" placeholder="Repita a senha" {...register('confirmarSenha')} />
          {errors.confirmarSenha && <p className="text-xs text-[var(--color-danger)]">{errors.confirmarSenha.message}</p>}
        </div>

        {serverError && (
          <div className="rounded-lg bg-[var(--color-danger-bg)] px-3 py-2 text-sm text-[var(--color-danger)]">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Cadastrando…' : 'Criar conta'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-[var(--color-text-secondary)]">
        Já tem conta?{' '}
        <Link to="/login" className="text-[var(--color-brand-500)] hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </div>
  )
}
