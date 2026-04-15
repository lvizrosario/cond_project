import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  loginSchema,
  registerSchema,
  reservationSchema,
} from '../src/lib/validators.js'

function getMessages(result: ReturnType<typeof registerSchema.safeParse> | ReturnType<typeof loginSchema.safeParse> | ReturnType<typeof reservationSchema.safeParse>) {
  if (result.success) return []
  return result.error.issues.map((issue) => issue.message)
}

test('registerSchema accepts a valid resident registration payload', () => {
  const result = registerSchema.safeParse({
    nomeCompleto: 'Ana Paula Mendes',
    email: 'ana@email.com',
    telefone: '(61) 99999-8888',
    endereco: {
      cep: '70000-000',
      nomeCondominio: 'Residencial das Acacias',
      quadra: 'A',
      numero: '22',
    },
    senha: 'Teste@123',
    confirmarSenha: 'Teste@123',
  })

  assert.equal(result.success, true)
})

test('registerSchema blocks mismatched passwords', () => {
  const result = registerSchema.safeParse({
    nomeCompleto: 'Ana Paula Mendes',
    email: 'ana@email.com',
    telefone: '(61) 99999-8888',
    endereco: {
      cep: '70000-000',
      nomeCondominio: 'Residencial das Acacias',
      quadra: 'A',
      numero: '22',
    },
    senha: 'Teste@123',
    confirmarSenha: 'Outro@123',
  })

  assert.equal(result.success, false)
  assert.ok(getMessages(result).includes('As senhas nao coincidem'))
})

test('loginSchema rejects malformed e-mail values', () => {
  const result = loginSchema.safeParse({
    email: 'email-invalido',
    senha: 'Teste@123',
  })

  assert.equal(result.success, false)
  assert.ok(getMessages(result).includes('E-mail invalido'))
})

test('reservationSchema requires the end date to be after the start date', () => {
  const result = reservationSchema.safeParse({
    area: 'quadra',
    tipoEvento: 'Treino',
    dataInicio: '2026-04-25T20:00:00Z',
    dataFim: '2026-04-25T18:00:00Z',
    observacoes: 'Horario invertido',
  })

  assert.equal(result.success, false)
  assert.ok(getMessages(result).includes('O termino deve ser posterior ao inicio'))
})
