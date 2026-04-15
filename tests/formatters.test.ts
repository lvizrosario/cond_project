import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  formatBRL,
  formatCompetencia,
  formatDate,
  formatPhone,
  getInitials,
} from '../src/lib/formatters.js'

test('formatBRL renders pt-BR currency values', () => {
  assert.match(formatBRL(1520.5), /^R\$\s?1\.520,50$/u)
})

test('formatDate keeps the default Brazilian date pattern', () => {
  assert.equal(formatDate('2026-04-14T12:00:00.000Z'), '14/04/2026')
})

test('formatPhone normalizes mobile numbers', () => {
  assert.equal(formatPhone('61999998888'), '(61) 99999-8888')
})

test('formatCompetencia expands year-month values', () => {
  assert.equal(formatCompetencia('2026-04'), 'abril de 2026')
})

test('getInitials ignores repeated spaces and keeps the first two names', () => {
  assert.equal(getInitials('  Ana   Paula Mendes  '), 'AP')
})
