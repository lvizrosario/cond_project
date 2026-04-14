import { Injectable } from '@nestjs/common'

@Injectable()
export class MockDatabaseService {
  tenants: Array<Record<string, any>> = [{ id: 'cond-1', nome: 'Residencial das Acacias' }]
  users: Array<Record<string, any>> = [
    { id: '1', nomeCompleto: 'Carlos Eduardo Lima', email: 'carlos@email.com', tenantId: 'cond-1', primaryRole: 'presidente', isMorador: true },
    { id: '2', nomeCompleto: 'Fernanda Rocha', email: 'fernanda@email.com', tenantId: 'cond-1', primaryRole: 'sindico', isMorador: false },
    { id: '3', nomeCompleto: 'Roberto Alves', email: 'roberto@email.com', tenantId: 'cond-1', primaryRole: 'conselheiro', isMorador: true },
    { id: '4', nomeCompleto: 'Ana Paula Mendes', email: 'ana@email.com', tenantId: 'cond-1', primaryRole: null, isMorador: true },
  ]
  rolePermissions: Record<string, Record<string, boolean>> = {
    presidente: { inicio: true, acessos: true, administradora: true, avisos: true, configuracoes: true, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
    sindico: { inicio: true, acessos: true, administradora: true, avisos: true, configuracoes: true, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
    conselheiro: { inicio: true, acessos: false, administradora: true, avisos: true, configuracoes: false, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: true },
    morador: { inicio: true, acessos: false, administradora: false, avisos: true, configuracoes: false, correspondencias: true, documentos: true, financeiro: true, reservas: true, reunioes: false },
  }
  notifications: Array<Record<string, any>> = [
    { id: 'n1', titulo: 'Boleto de abril disponível', tenantId: 'cond-1', createdAt: new Date().toISOString() },
  ]
  avisos: Array<Record<string, any>> = [
    { id: 'a1', tenantId: 'cond-1', titulo: 'Manutenção preventiva', conteudo: 'Intervenção programada na bomba.', categoria: 'manutencao', audience: 'todos', status: 'publicado', publicadoEm: new Date().toISOString(), criadoPorId: '2' },
  ]
  correspondencias: Array<Record<string, any>> = [
    { id: 'c1', tenantId: 'cond-1', transportadora: 'Correios', destinatarioId: '4', destinatarioNome: 'Ana Paula Mendes', unidade: 'A-22', status: 'recebida', recebidoEm: new Date().toISOString() },
  ]
  documentos: Array<Record<string, any>> = [
    { id: 'd1', tenantId: 'cond-1', titulo: 'Regulamento interno', categoria: 'regulamento', audience: 'todos', arquivado: false, atualizadoEm: new Date().toISOString() },
  ]
  documentoVersions: Array<Record<string, any>> = [
    { id: 'dv1', documentoId: 'd1', versao: 1, arquivoNome: 'regulamento-interno-v1.pdf', criadoPorNome: 'Carlos Eduardo Lima', criadoEm: new Date().toISOString() },
  ]
  reunioes: Array<Record<string, any>> = [
    { id: 'r1', tenantId: 'cond-1', titulo: 'Assembleia ordinária', descricao: 'Pauta mensal do condomínio', local: 'Salão de festas', status: 'publicada', dataHora: new Date().toISOString(), agenda: ['Prestação de contas'], participantes: [], ata: null },
  ]
  administradora: Record<string, any> = {
    id: 'adm-1',
    tenantId: 'cond-1',
    razaoSocial: 'Acacias Gestao Condominial Ltda.',
    nomeFantasia: 'Acacias Admin',
    cnpj: '12.345.678/0001-90',
    email: 'contato@acaciasadmin.com.br',
    telefone: '(61) 3333-2200',
    site: 'https://acaciasadmin.com.br',
    canaisAtendimento: ['Portal do morador', 'WhatsApp comercial'],
    contatos: [],
    contratos: [],
  }
  configuracoes: Record<string, any> = {
    tenantId: 'cond-1',
    perfil: { nomeCondominio: 'Residencial das Acacias', cep: '70000-000', quadraReferencia: 'Quadra A', enderecoNumero: '10' },
    reservas: { antecedenciaHoras: 24, cancelamentoHoras: 12, limiteReservasMes: 2 },
    financeiro: { diaVencimentoPadrao: 10, multaAtrasoPercentual: 2, jurosMensalPercentual: 1 },
    branding: { corPrimaria: '#1d6fa4', assinaturaAvisos: 'Sindicatura Residencial das Acacias' },
    operacional: { notificacoesInApp: true, avisosDestaqueNaHome: true, permitirUploadMorador: false },
  }
}
