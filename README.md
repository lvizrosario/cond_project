# CondAdmin — Sistema de Gestão de Condomínios

Plataforma SaaS para administração de condomínios residenciais. Desenvolvida para ser escalável, fluida e segura, com suporte a múltiplos perfis de acesso e múltiplos condomínios.

---

## Estado Atual — MVP (Fase 1)

O projeto está na **fase de protótipo frontend**, com dados mockados via MSW (Mock Service Worker). O backend ainda não foi implementado — a troca para a API real exigirá apenas remover uma linha em `src/main.tsx`.

### O que já está funcionando

| Módulo | Status | Detalhes |
|---|---|---|
| **Autenticação** | ✅ Completo | Login, cadastro com validação, confirmação de e-mail |
| **Dashboard (Início)** | ✅ Completo | Cards de KPIs, gráfico de receita, feed de atividade |
| **Acessos** | ✅ Completo | Tabela de usuários, atribuição de cargos, matriz de permissões |
| **Reservas** | ✅ Completo | Calendário de disponibilidade, criação e cancelamento de reservas |
| **Financeiro** | ✅ Completo | Boleto do mês, histórico de pagamentos, resumo administrativo |
| **Avisos** | 🔧 Stub | Estrutura criada, aguardando implementação |
| **Correspondências** | 🔧 Stub | Estrutura criada, aguardando implementação |
| **Documentos** | 🔧 Stub | Estrutura criada, aguardando implementação |
| **Reuniões** | 🔧 Stub | Estrutura criada, aguardando implementação |
| **Administradora** | 🔧 Stub | Estrutura criada, aguardando implementação |
| **Configurações** | 🔧 Stub | Estrutura criada, aguardando implementação |

---

## Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm 9+

### Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd cond_dashboard

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173`

### Credenciais de teste

| Usuário | Cargo | E-mail | Senha |
|---|---|---|---|
| Carlos Eduardo Lima | Presidente | `carlos@email.com` | `Teste@123` |
| Fernanda Rocha | Síndica | `fernanda@email.com` | `Teste@123` |
| Roberto Alves | Conselheiro + Morador | `roberto@email.com` | `Teste@123` |
| Ana Paula Mendes | Moradora | `ana@email.com` | `Teste@123` |

> Cada perfil tem acesso a menus diferentes — experimente trocar para ver o sidebar se adaptar.

---

## Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS v4 (design tokens via `@theme`) |
| Componentes | Radix UI (primitivos acessíveis) |
| Roteamento | TanStack Router (type-safe, file-based) |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand (+ persist para sessão) |
| Formulários | React Hook Form + Zod |
| Gráficos | Recharts |
| HTTP | Axios (interceptors de auth + multi-tenant) |
| Mock de API | MSW v2 (browser mode) |
| Tipografia | Sora (display) + Inter (corpo) |

---

## Arquitetura

### Perfis de acesso

```
Presidente  → acesso total
Síndico     → acesso total
Conselheiro → acesso parcial (sem Acessos e Configurações)
Morador     → acesso restrito (financeiro próprio, reservas, avisos)
```

Regra especial: **Morador pode ser combinado** com qualquer outro cargo. Os demais cargos são **mutuamente exclusivos** entre si.

### Multi-tenancy

Cada requisição HTTP injeta automaticamente o header `X-Condominio-ID` via interceptor do Axios. Isso garante que, quando o backend for implementado, cada condomínio terá seus dados isolados — base da arquitetura SaaS.

### Camada de mock → backend

O MSW intercepta requisições no nível do Service Worker. Para migrar para o backend real:

```ts
// src/main.tsx — remover estas 4 linhas:
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

Os hooks `useQuery`, estados de loading e cache continuam funcionando identicamente.

---

## Estrutura do Projeto

```
src/
├── types/          # Interfaces TypeScript (auth, user, dashboard, reservas, financeiro)
├── lib/            # Utilitários puros (permissions, validators, formatters, utils)
├── store/          # Estado global (authStore, uiStore) via Zustand
├── services/       # Camada HTTP com Axios (auth, dashboard, reservas, financeiro, user)
├── hooks/          # Custom hooks (useAuth, useRoleAccess, useDashboard, etc.)
├── mocks/          # MSW handlers + dados mockados
├── components/
│   ├── ui/         # Primitivos de UI (Button, Card, Dialog, Select, Tabs, etc.)
│   ├── layout/     # Shell da aplicação (AppShell, Sidebar, TopBar, AuthLayout)
│   └── shared/     # Componentes de negócio (StatusBadge, EmptyState, RoleGuard, etc.)
├── pages/          # Páginas por módulo (dashboard, acessos, reservas, financeiro, stubs)
├── routes/         # Definições de rotas TanStack Router (auth guard, role guard)
└── styles/         # Design tokens globais (globals.css)
```

---

## Roadmap — O que vem a seguir

### Fase 2 — Backend & Autenticação Real
- [ ] API REST (Node.js + Fastify ou NestJS) com banco PostgreSQL
- [ ] Autenticação JWT com refresh token
- [ ] Envio de e-mail de confirmação de cadastro (Resend ou SendGrid)
- [ ] Deploy da API (Railway, Render ou AWS)

### Fase 3 — Módulos Stub
- [ ] **Avisos** — publicação e leitura de comunicados com categorias e notificações
- [ ] **Documentos** — upload, versionamento e download de arquivos (S3)
- [ ] **Correspondências** — registro de entrada de encomendas com notificação ao morador
- [ ] **Reuniões** — agendamento, pauta e ata de reuniões de condomínio
- [ ] **Administradora** — dados da empresa administradora, contatos e contratos

### Fase 4 — Financeiro Avançado
- [ ] Integração com gateway de boleto bancário (Asaas, BancoBrad, Pagar.me)
- [ ] Geração automática de boletos mensais
- [ ] Relatórios financeiros exportáveis (PDF, Excel)
- [ ] Histórico de inadimplência com régua de cobrança

### Fase 5 — SaaS Multi-Tenant
- [ ] Onboarding de novos condomínios (self-service)
- [ ] Planos e cobrança (Stripe)
- [ ] Painel de super-admin para gerenciar condomínios
- [ ] Domínio personalizado por condomínio
- [ ] Notificações push e e-mail transacional

### Fase 6 — Qualidade & Escala
- [ ] Testes unitários e de integração (Vitest + Testing Library)
- [ ] Testes E2E (Playwright)
- [ ] Code splitting por rota (redução do bundle de 1.1MB)
- [ ] App mobile com React Native (longo prazo)

---

## Contribuindo

Este projeto está em desenvolvimento ativo. Siga a estrutura existente:

- Novos tipos → `src/types/`
- Nova lógica de API → `src/services/` + `src/hooks/`
- Novos handlers mock → `src/mocks/handlers.ts`
- Novos componentes de UI → `src/components/ui/`
- Novas páginas → `src/pages/<modulo>/` + `src/routes/_app.<modulo>.tsx`

---

## Licença

Proprietário — todos os direitos reservados.
