-- ============================================================================
-- SKILLGAP BUSINESS DASHBOARD - MIGRATION COMPLETA (SEM DUPLICACOES)
-- ============================================================================

create extension if not exists "pgcrypto";

-- Funcao utilitaria para atualizar automaticamente updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Empresas (companies)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  website text not null default '',
  industry text not null default '',
  location text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_companies_updated_at on public.companies;
create trigger trg_companies_updated_at
before update on public.companies
for each row execute function public.set_updated_at();

-- 2. Subscricoes da empresa (company_subscriptions)
-- Moedas permitidas: apenas EUR e USD. Planos: 6 niveis B2B.
create table if not exists public.company_subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid unique references public.companies(id) on delete cascade,
  plan_id text not null default 'starter' check (
    plan_id in ('starter', 'growth', 'volume', 'business', 'enterprise', 'enterprise-plus')
  ),
  currency text not null default 'EUR' check (currency in ('EUR', 'USD')),
  payment_method text not null default 'card' check (
    payment_method in ('card', 'bank_transfer', 'apple_pay', 'google_pay')
  ),
  status text not null default 'active' check (status in ('active', 'pending', 'cancelled', 'past_due')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_company_subscriptions_updated_at on public.company_subscriptions;
create trigger trg_company_subscriptions_updated_at
before update on public.company_subscriptions
for each row execute function public.set_updated_at();

-- 3. Vagas (job_positions)
create table if not exists public.job_positions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  title text not null,
  department text not null default 'General',
  location text not null default 'Remote',
  status text not null default 'active' check (status in ('active', 'paused', 'closed')),
  required_skills text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_job_positions_company_id on public.job_positions(company_id);
create index if not exists idx_job_positions_status on public.job_positions(status);

drop trigger if exists trg_job_positions_updated_at on public.job_positions;
create trigger trg_job_positions_updated_at
before update on public.job_positions
for each row execute function public.set_updated_at();

-- 4. Candidatos (candidates)
create table if not exists public.candidates (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null,
  location text not null default '',
  experience_years integer not null default 0 check (experience_years >= 0),
  education text not null default '',
  languages text[] not null default '{}'::text[],
  skills text[] not null default '{}'::text[],
  availability text not null default 'Available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_candidates_role on public.candidates(role);
create index if not exists idx_candidates_location on public.candidates(location);

drop trigger if exists trg_candidates_updated_at on public.candidates;
create trigger trg_candidates_updated_at
before update on public.candidates
for each row execute function public.set_updated_at();

-- 5. Pre-selecionados (shortlisted_candidates)
create table if not exists public.shortlisted_candidates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  candidate_id uuid not null references public.candidates(id) on delete cascade,
  job_position_id uuid references public.job_positions(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (candidate_id, job_position_id)
);

create index if not exists idx_shortlisted_candidate_id on public.shortlisted_candidates(candidate_id);

-- 6. Entrevistas (interviews)
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  candidate_id uuid references public.candidates(id) on delete set null,
  candidate_name text not null,
  job_position_id uuid references public.job_positions(id) on delete set null,
  job_title text not null,
  scheduled_at text not null,
  interviewer text not null default 'HR Team',
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_interviews_scheduled_at on public.interviews(scheduled_at);

drop trigger if exists trg_interviews_updated_at on public.interviews;
create trigger trg_interviews_updated_at
before update on public.interviews
for each row execute function public.set_updated_at();

-- 7. Membros da equipa / recrutadores (team_members)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'Recruiter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_team_members_company_id on public.team_members(company_id);

drop trigger if exists trg_team_members_updated_at on public.team_members;
create trigger trg_team_members_updated_at
before update on public.team_members
for each row execute function public.set_updated_at();

-- 8. Preferencias de notificacoes da empresa (company_notification_settings)
create table if not exists public.company_notification_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid unique references public.companies(id) on delete cascade,
  channel text not null default 'both' check (channel in ('platform', 'email', 'both')),
  ai_matches boolean not null default true,
  new_applications boolean not null default true,
  interview_reminders boolean not null default true,
  team_updates boolean not null default true,
  billing_and_limits boolean not null default true,
  weekly_analytics boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_company_notification_settings_updated_at on public.company_notification_settings;
create trigger trg_company_notification_settings_updated_at
before update on public.company_notification_settings
for each row execute function public.set_updated_at();

-- 9. Tickets de suporte empresarial (support_tickets)
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  company_name text,
  plan_id text not null default 'starter',
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_support_tickets_updated_at on public.support_tickets;
create trigger trg_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) ATIVADA EM TODAS AS TABELAS
-- ============================================================================
alter table public.companies enable row level security;
alter table public.company_subscriptions enable row level security;
alter table public.job_positions enable row level security;
alter table public.candidates enable row level security;
alter table public.shortlisted_candidates enable row level security;
alter table public.interviews enable row level security;
alter table public.team_members enable row level security;
alter table public.company_notification_settings enable row level security;
alter table public.support_tickets enable row level security;

-- Politica base para utilizadores autenticados (ajusta conforme auth.uid() quando aplicavel)
do $$
declare
  tbl text;
  pol_name text;
begin
  foreach tbl in array array[
    'companies',
    'company_subscriptions',
    'job_positions',
    'candidates',
    'shortlisted_candidates',
    'interviews',
    'team_members',
    'company_notification_settings',
    'support_tickets'
  ]
  loop
    pol_name := format('authenticated_all_%s', tbl);
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = tbl and policyname = pol_name
    ) then
      execute format(
        'create policy %I on public.%I for all to authenticated using (true) with check (true)',
        pol_name,
        tbl
      );
    end if;
  end loop;
end
$$;