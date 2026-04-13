import { z } from 'zod'

const senhaSchema = z
  .string()
  .min(8, 'Mínimo de 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
  .regex(/[0-9]/, 'Deve conter ao menos um número')
  .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial')

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Informe sua senha'),
})

export const registerSchema = z
  .object({
    nomeCompleto: z.string().min(3, 'Informe seu nome completo'),
    email: z.string().email('E-mail inválido'),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
    endereco: z.object({
      cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
      nomeCondominio: z.string().min(2, 'Informe o nome do condomínio'),
      quadra: z.string().min(1, 'Informe a quadra/bloco'),
      numero: z.string().min(1, 'Informe o número'),
    }),
    senha: senhaSchema,
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmarSenha'],
  })

export const reservationSchema = z.object({
  area: z.enum(['salao_festas', 'churrasqueira', 'quadra']),
  dataInicio: z.string().min(1, 'Selecione a data e hora de início'),
  dataFim: z.string().min(1, 'Selecione a data e hora de término'),
  observacoes: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ReservationFormData = z.infer<typeof reservationSchema>
