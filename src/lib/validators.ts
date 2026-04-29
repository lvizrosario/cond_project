import { z } from 'zod'

const senhaSchema = z
  .string()
  .min(8, 'Minimo de 8 caracteres')
  .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiuscula')
  .regex(/[0-9]/, 'Deve conter ao menos um numero')
  .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial')

export const loginSchema = z.object({
  email: z.string().email('E-mail invalido'),
  senha: z.string().min(1, 'Informe sua senha'),
})

export const registerSchema = z
  .object({
    nomeCompleto: z.string().min(3, 'Informe seu nome completo'),
    email: z.string().email('E-mail invalido'),
    telefone: z
      .string()
      .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone invalido'),
    endereco: z.object({
      cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP invalido'),
      nomeCondominio: z.string().min(2, 'Informe o nome do condominio'),
      quadra: z.string().min(1, 'Informe a quadra/bloco'),
      numero: z.string().min(1, 'Informe o numero'),
    }),
    senha: senhaSchema,
    confirmarSenha: z.string(),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: 'As senhas nao coincidem',
    path: ['confirmarSenha'],
  })

export const reservationSchema = z.object({
  area: z.enum(['salao_festas', 'churrasqueira', 'quadra']),
  tipoEvento: z.string().min(1, 'Selecione o tipo de evento'),
  dataInicio: z.string().min(1, 'Selecione a data e hora de inicio'),
  dataFim: z.string().min(1, 'Selecione a data e hora de termino'),
  observacoes: z.string().optional(),
}).refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
  message: 'O termino deve ser posterior ao inicio',
  path: ['dataFim'],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ReservationFormData = z.infer<typeof reservationSchema>
