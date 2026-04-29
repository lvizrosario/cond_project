import assert from 'node:assert/strict'
import {
  formatBRL,
  formatCompetencia,
  formatDate,
  formatPhone,
  getInitials,
} from '../src/lib/formatters.js'
import {
  loginSchema,
  registerSchema,
  reservationSchema,
} from '../src/lib/validators.js'

const checks: Array<{ name: string; run: () => void }> = [
  {
    name: 'formatBRL renders pt-BR currency values',
    run: () => {
      assert.match(formatBRL(1520.5), /^R\$\s?1\.520,50$/u)
    },
  },
  {
    name: 'formatDate keeps the default Brazilian date pattern',
    run: () => {
      assert.equal(formatDate('2026-04-14T12:00:00.000Z'), '14/04/2026')
    },
  },
  {
    name: 'formatPhone normalizes mobile numbers',
    run: () => {
      assert.equal(formatPhone('61999998888'), '(61) 99999-8888')
    },
  },
  {
    name: 'formatCompetencia expands year-month values',
    run: () => {
      assert.equal(formatCompetencia('2026-04'), 'abril de 2026')
    },
  },
  {
    name: 'getInitials ignores repeated spaces and keeps the first two names',
    run: () => {
      assert.equal(getInitials('  Ana   Paula Mendes  '), 'AP')
    },
  },
  {
    name: 'registerSchema accepts a valid resident registration payload',
    run: () => {
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
    },
  },
  {
    name: 'registerSchema blocks mismatched passwords',
    run: () => {
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
      if (result.success) {
        throw new Error('Expected registerSchema to reject mismatched passwords')
      }
      assert.ok(result.error.issues.some((issue) => issue.message === 'As senhas nao coincidem'))
    },
  },
  {
    name: 'loginSchema rejects malformed e-mail values',
    run: () => {
      const result = loginSchema.safeParse({
        email: 'email-invalido',
        senha: 'Teste@123',
      })

      assert.equal(result.success, false)
      if (result.success) {
        throw new Error('Expected loginSchema to reject malformed e-mail values')
      }
      assert.ok(result.error.issues.some((issue) => issue.message === 'E-mail invalido'))
    },
  },
  {
    name: 'reservationSchema requires the end date to be after the start date',
    run: () => {
      const result = reservationSchema.safeParse({
        area: 'quadra',
        tipoEvento: 'Treino',
        dataInicio: '2026-04-25T20:00:00Z',
        dataFim: '2026-04-25T18:00:00Z',
        observacoes: 'Horario invertido',
      })

      assert.equal(result.success, false)
      if (result.success) {
        throw new Error('Expected reservationSchema to reject inverted dates')
      }
      assert.ok(result.error.issues.some((issue) => issue.message === 'O termino deve ser posterior ao inicio'))
    },
  },
]

let failed = 0

for (const check of checks) {
  try {
    check.run()
    console.log(`PASS ${check.name}`)
  } catch (error) {
    failed += 1
    console.error(`FAIL ${check.name}`)
    console.error(error)
  }
}

if (failed > 0) {
  process.exitCode = 1
  console.error(`\n${failed} frontend test(s) failed.`)
} else {
  console.log(`\nAll ${checks.length} frontend tests passed.`)
}
