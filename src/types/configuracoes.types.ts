export interface TenantProfileSettings {
  nomeCondominio: string
  cep: string
  quadraReferencia: string
  enderecoNumero: string
}

export interface ReservationSettings {
  antecedenciaHoras: number
  cancelamentoHoras: number
  limiteReservasMes: number
  tiposEventoPermitidos: string[]
}

export interface FinanceSettings {
  diaVencimentoPadrao: number
  multaAtrasoPercentual: number
  jurosMensalPercentual: number
}

export interface BrandingSettings {
  corPrimaria: string
  assinaturaAvisos: string
}

export interface OperationalSettings {
  notificacoesInApp: boolean
  avisosDestaqueNaHome: boolean
  permitirUploadMorador: boolean
}

export interface TenantSettings {
  perfil: TenantProfileSettings
  reservas: ReservationSettings
  financeiro: FinanceSettings
  branding: BrandingSettings
  operacional: OperationalSettings
}
