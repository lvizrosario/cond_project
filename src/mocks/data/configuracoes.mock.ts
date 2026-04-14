import type { TenantSettings } from '@/types/configuracoes.types'

export const mockConfiguracoes: TenantSettings = {
  perfil: {
    nomeCondominio: 'Residencial das Acacias',
    cep: '70000-000',
    quadraReferencia: 'Quadra A',
    enderecoNumero: '10',
  },
  reservas: {
    antecedenciaHoras: 24,
    cancelamentoHoras: 12,
    limiteReservasMes: 2,
    tiposEventoPermitidos: ['Aniversario', 'Churrasco em familia', 'Confraternizacao', 'Reuniao esportiva'],
  },
  financeiro: {
    diaVencimentoPadrao: 10,
    multaAtrasoPercentual: 2,
    jurosMensalPercentual: 1,
  },
  branding: {
    corPrimaria: '#1d6fa4',
    assinaturaAvisos: 'Sindicatura Residencial das Acacias',
  },
  operacional: {
    notificacoesInApp: true,
    avisosDestaqueNaHome: true,
    permitirUploadMorador: false,
  },
}
