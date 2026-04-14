import type { Documento } from '@/types/documentos.types'

export const mockDocumentos: Documento[] = [
  {
    id: 'd1',
    titulo: 'Regulamento interno consolidado',
    categoria: 'regulamento',
    audience: 'todos',
    descricao: 'Vers\u00e3o oficial com revis\u00f5es aprovadas na assembleia de fevereiro.',
    arquivado: false,
    atualizadoEm: '2026-03-15T10:00:00Z',
    ultimaVersao: {
      id: 'dv1',
      versao: 3,
      arquivoNome: 'regulamento-interno-v3.pdf',
      criadoEm: '2026-03-15T10:00:00Z',
      criadoPorNome: 'Carlos Eduardo Lima',
    },
    versoes: [
      { id: 'dv1', versao: 3, arquivoNome: 'regulamento-interno-v3.pdf', criadoEm: '2026-03-15T10:00:00Z', criadoPorNome: 'Carlos Eduardo Lima' },
      { id: 'dv0', versao: 2, arquivoNome: 'regulamento-interno-v2.pdf', criadoEm: '2025-12-10T10:00:00Z', criadoPorNome: 'Fernanda Rocha' },
    ],
  },
  {
    id: 'd2',
    titulo: 'Prestacao de contas do trimestre',
    categoria: 'financeiro',
    audience: 'moradores',
    descricao: 'Relat\u00f3rio resumido com receitas, despesas e saldo em caixa.',
    arquivado: false,
    atualizadoEm: '2026-04-05T18:00:00Z',
    ultimaVersao: {
      id: 'dv2',
      versao: 1,
      arquivoNome: 'prestacao-contas-2026q1.pdf',
      criadoEm: '2026-04-05T18:00:00Z',
      criadoPorNome: 'Fernanda Rocha',
    },
    versoes: [
      { id: 'dv2', versao: 1, arquivoNome: 'prestacao-contas-2026q1.pdf', criadoEm: '2026-04-05T18:00:00Z', criadoPorNome: 'Fernanda Rocha' },
    ],
  },
]
