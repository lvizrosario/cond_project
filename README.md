# CondAdmin - Sistema de Gestao de Condominios

Plataforma SaaS para administracao de condominios residenciais. O projeto evoluiu de um prototipo frontend para uma base full-stack com frontend funcional em todos os menus principais e um backend NestJS preparado para substituir os mocks gradualmente.

---

## Estado Atual - Fase 2 em andamento

O projeto agora esta em uma fase de **transicao de prototipo para produto full-stack**.

### O que ja esta funcionando

| Modulo | Status | Detalhes |
|---|---|---|
| **Autenticacao** | OK | Login, cadastro com validacao e confirmacao de e-mail mockada no frontend; scaffold real no backend |
| **Dashboard (Inicio)** | OK | Cards de KPI, grafico de receita, feed de atividade |
| **Acessos** | OK | Tabela de usuarios, atribuicao de cargos, matriz de permissoes |
| **Reservas** | OK | Calendario de disponibilidade, criacao e cancelamento de reservas |
| **Financeiro** | OK | Boleto do mes, historico de pagamentos, resumo administrativo |
| **Avisos** | OK | Lista, filtros, detalhe, criacao, edicao, publicacao e leitura |
| **Correspondencias** | OK | Registro de entrada, busca, listagem e confirmacao de retirada |
| **Documentos** | OK | Biblioteca por categoria, versoes, cadastro e arquivamento |
| **Reunioes** | OK | Lista de encontros, pauta, participantes e publicacao de ata |
| **Administradora** | OK | Perfil da administradora, contatos e contratos |
| **Configuracoes** | OK | Perfil do condominio, regras de reserva, parametros financeiros e operacionais |

### Backend ja iniciado

Foi adicionado um app separado em `backend/` com:

- `AuthModule`
- `TenantsModule`
- `UsersModule`
- `PermissionsModule`
- `NotificationsModule`
- `FilesModule`
- `AvisosModule`
- `CorrespondenciasModule`
- `DocumentosModule`
- `ReunioesModule`
- `AdministradoraModule`
- `ConfiguracoesModule`

Tambem existe uma base de schema PostgreSQL em `backend/database/schema.sql` para a migracao da camada mock para a API real.

---

## Como rodar localmente

### Pre-requisitos

- Node.js 18+
- npm 9+

### Frontend

```bash
git clone https://github.com/lvizrosario/cond_project
cd cond_dashboard
npm install
npm run dev
```

Acesse `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run build
npm run test:e2e
```

Quando quiser desenvolver o backend localmente:

```bash
cd backend
npm run start:dev
```

O backend sobe com prefixo `/api` e foi estruturado para respeitar o header `X-Condominio-ID`.

---

## Credenciais de teste

| Usuario | Cargo | E-mail | Senha |
|---|---|---|---|
| Carlos Eduardo Lima | Presidente | `carlos@email.com` | `Teste@123` |
| Fernanda Rocha | Sindica | `fernanda@email.com` | `Teste@123` |
| Roberto Alves | Conselheiro + Morador | `roberto@email.com` | `Teste@123` |
| Ana Paula Mendes | Moradora | `ana@email.com` | `Teste@123` |

---

## Stack Tecnologica

### Frontend

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS v4 |
| Componentes | Radix UI |
| Roteamento | TanStack Router |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand |
| Formularios | React Hook Form + Zod |
| Graficos | Recharts |
| HTTP | Axios |
| Mock de API | MSW v2 |

### Backend

| Camada | Tecnologia |
|---|---|
| Framework | NestJS |
| Runtime | Node.js |
| Banco alvo | PostgreSQL |
| Testes | Jest + Supertest |

---

## Arquitetura

### Perfis de acesso

```text
Presidente  -> acesso total
Sindico     -> acesso total
Conselheiro -> acesso parcial (sem Acessos e Configuracoes)
Morador     -> acesso restrito
```

Regra especial: `morador` pode ser combinado com qualquer cargo primario. Os demais cargos primarios sao mutuamente exclusivos.

### Multi-tenancy

Cada requisicao HTTP injeta automaticamente o header `X-Condominio-ID` via interceptor do Axios. O backend foi estruturado para validar esse escopo por tenant desde a base.

### Camada mock -> backend real

O frontend continua funcional com MSW, mas agora os contratos dos novos modulos espelham os endpoints do backend em `backend/src/*`. Isso permite migrar modulo por modulo sem reescrever os componentes.

---

## Estrutura do Projeto

```text
src/
  components/
  hooks/
  lib/
  mocks/
  pages/
  routes/
  services/
  store/
  styles/
  types/

backend/
  database/
  src/
    auth/
    tenants/
    users/
    permissions/
    notifications/
    files/
    avisos/
    correspondencias/
    documentos/
    reunioes/
    administradora/
    configuracoes/
  test/
```

---

## Validacoes recentes

As seguintes verificacoes ja passaram nesta etapa:

- `npm run lint`
- `npm run build`
- `cd backend && npm run build`
- `cd backend && npm run test:e2e`

---

## Roadmap imediato

### Proxima etapa

- Conectar os 6 novos modulos do frontend ao backend real, removendo o uso de MSW nesses fluxos
- Migrar os 4 modulos originais (`Dashboard`, `Acessos`, `Reservas`, `Financeiro`) para a API NestJS
- Persistir autenticacao JWT/refresh token com banco real
- Implementar storage real para documentos

### Depois disso

- Integracao real de e-mail
- Gateway de boleto
- Onboarding self-service de novos condominios
- Painel super-admin
- Code splitting e otimização do bundle

---

## Contribuindo

Siga a estrutura existente:

- Novos tipos -> `src/types/`
- Nova logica de API frontend -> `src/services/` + `src/hooks/`
- Novos handlers mock -> `src/mocks/handlers.ts`
- Novos modulos backend -> `backend/src/<modulo>/`
- Alteracoes de schema -> `backend/database/schema.sql`

---

## Licenca

Proprietario - todos os direitos reservados.
