create table tenants (
  id text primary key,
  nome text not null,
  created_at timestamptz not null default now()
);

create table users (
  id text primary key,
  tenant_id text not null references tenants(id),
  nome_completo text not null,
  email text not null unique,
  telefone text,
  email_confirmado boolean not null default false,
  created_at timestamptz not null default now()
);

create table user_roles (
  user_id text primary key references users(id),
  tenant_id text not null references tenants(id),
  primary_role text,
  is_morador boolean not null default true
);

create table role_permissions (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  role_key text not null,
  menu_key text not null,
  allowed boolean not null default true
);

create table email_confirmation_tokens (
  id bigserial primary key,
  user_id text not null references users(id),
  token text not null unique,
  expires_at timestamptz not null,
  consumed_at timestamptz
);

create table refresh_tokens (
  id bigserial primary key,
  user_id text not null references users(id),
  token text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz
);

create table notifications (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  user_id text references users(id),
  titulo text not null,
  conteudo text,
  created_at timestamptz not null default now()
);

create table avisos (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  created_by text not null references users(id),
  titulo text not null,
  conteudo text not null,
  categoria text not null,
  audience text not null,
  status text not null,
  published_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table aviso_reads (
  aviso_id bigint not null references avisos(id),
  user_id text not null references users(id),
  read_at timestamptz not null default now(),
  primary key (aviso_id, user_id)
);

create table correspondencias (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  recipient_user_id text not null references users(id),
  carrier text not null,
  tracking_code text,
  notes text,
  status text not null,
  received_at timestamptz not null,
  picked_up_at timestamptz
);

create table documentos (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  titulo text not null,
  categoria text not null,
  audience text not null,
  descricao text,
  arquivado boolean not null default false,
  updated_at timestamptz not null default now()
);

create table documento_versions (
  id bigserial primary key,
  documento_id bigint not null references documentos(id),
  arquivo_nome text not null,
  storage_path text not null,
  versao integer not null,
  created_by text references users(id),
  created_at timestamptz not null default now()
);

create table reunioes (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  titulo text not null,
  descricao text not null,
  local text not null,
  status text not null,
  data_hora timestamptz not null
);

create table reuniao_agenda_items (
  id bigserial primary key,
  reuniao_id bigint not null references reunioes(id),
  ordem integer not null,
  pauta text not null
);

create table reuniao_participantes (
  reuniao_id bigint not null references reunioes(id),
  user_id text not null references users(id),
  confirmado boolean not null default false,
  primary key (reuniao_id, user_id)
);

create table reuniao_atas (
  reuniao_id bigint primary key references reunioes(id),
  resumo text not null,
  publicada_em timestamptz not null
);

create table administradoras (
  id bigserial primary key,
  tenant_id text not null references tenants(id),
  razao_social text not null,
  nome_fantasia text not null,
  cnpj text not null,
  email text not null,
  telefone text not null,
  site text
);

create table administradora_contacts (
  id bigserial primary key,
  administradora_id bigint not null references administradoras(id),
  nome text not null,
  cargo text not null,
  email text not null,
  telefone text not null,
  principal boolean not null default false
);

create table administradora_contracts (
  id bigserial primary key,
  administradora_id bigint not null references administradoras(id),
  nome text not null,
  inicio date not null,
  fim date,
  status text not null,
  observacoes text
);

create table tenant_settings (
  tenant_id text primary key references tenants(id),
  perfil jsonb not null,
  reservas jsonb not null,
  financeiro jsonb not null,
  branding jsonb not null,
  operacional jsonb not null,
  updated_at timestamptz not null default now()
);
