import type { User } from '@/types/user.types'

export const mockUsers: User[] = [
  {
    id: '1',
    nomeCompleto: 'Carlos Eduardo Lima',
    email: 'carlos@email.com',
    telefone: '(61) 99201-4455',
    emailConfirmado: true,
    roles: { primary: 'presidente', isMorador: true },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'A', numero: '10' },
    criadoEm: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    nomeCompleto: 'Fernanda Rocha',
    email: 'fernanda@email.com',
    telefone: '(61) 98833-2211',
    emailConfirmado: true,
    roles: { primary: 'sindico', isMorador: false },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'B', numero: '5' },
    criadoEm: '2024-01-20T10:00:00Z',
  },
  {
    id: '3',
    nomeCompleto: 'Roberto Alves',
    email: 'roberto@email.com',
    telefone: '(61) 97755-3344',
    emailConfirmado: true,
    roles: { primary: 'conselheiro', isMorador: true },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'C', numero: '3' },
    criadoEm: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    nomeCompleto: 'Ana Paula Mendes',
    email: 'ana@email.com',
    telefone: '(61) 96644-5566',
    emailConfirmado: true,
    roles: { primary: null, isMorador: true },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'A', numero: '22' },
    criadoEm: '2024-02-10T10:00:00Z',
  },
  {
    id: '5',
    nomeCompleto: 'Marcos Oliveira',
    email: 'marcos@email.com',
    telefone: '(61) 95533-7788',
    emailConfirmado: true,
    roles: { primary: null, isMorador: true },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'D', numero: '7' },
    criadoEm: '2024-03-05T10:00:00Z',
  },
  {
    id: '6',
    nomeCompleto: 'Juliana Santos',
    email: 'juliana@email.com',
    telefone: '(61) 94422-9900',
    emailConfirmado: true,
    roles: { primary: null, isMorador: true },
    condominio: { id: 'cond-1', nome: 'Residencial das Acácias', cep: '70000-000', quadra: 'B', numero: '18' },
    criadoEm: '2024-03-20T10:00:00Z',
  },
]

// Mock credentials for development: email + senha "Teste@123"
export const MOCK_PASSWORD = 'Teste@123'
