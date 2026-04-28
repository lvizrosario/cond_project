import type { AdministradoraPerfil } from '@/types/administradora.types'

export const mockAdministradora: AdministradoraPerfil = {
  id: 'adm-1',
  razaoSocial: 'Acacias Gestao Condominial Ltda.',
  nomeFantasia: 'Acacias Admin',
  cnpj: '12.345.678/0001-90',
  email: 'contato@acaciasadmin.com.br',
  telefone: '(61) 3333-2200',
  site: 'https://acaciasadmin.com.br',
  canaisAtendimento: ['Portal do morador', 'WhatsApp comercial', 'Plantao de urgencia 24h'],
  contatos: [
    { id: 'ac1', nome: 'Priscila Moura', cargo: 'Gerente de contas', email: 'priscila@acaciasadmin.com.br', telefone: '(61) 99111-2200', principal: true },
    { id: 'ac2', nome: 'Rafael Costa', cargo: 'Financeiro', email: 'financeiro@acaciasadmin.com.br', telefone: '(61) 99222-3300' },
  ],
  contratos: [
    { id: 'ct1', nome: 'Gestao condominial completa', inicio: '2025-01-01', fim: '2026-12-31', status: 'ativo', observacoes: 'Renovacao automatica com revisao anual.' },
  ],
}
