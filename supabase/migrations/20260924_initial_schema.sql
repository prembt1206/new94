-- MindGuard AI - Production PostgreSQL Database Schema & RLS Policies
-- Enables UUID generation
create extension if not exists "uuid-ossp";

-- User Roles Enum
create type user_role as enum ('survivor', 'counselor', 'admin');

-- Risk Level Enum
create type risk_level as enum ('green', 'yellow', 'orange', 'red');

-- Profiles Table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    role user_role default 'survivor' not null,
    full_name text,
    alias text,
    emergency_contact text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Check-ins Table
create table if not exists public.check_ins (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    mood_score integer check (mood_score between 1 and 5) not null,
    anxiety_score integer check (anxiety_score between 1 and 5) not null,
    sleep_quality integer check (sleep_quality between 1 and 5) not null,
    physical_tension integer check (physical_tension between 1 and 5) default 1,
    free_text_reflection text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Distress Predictions Table
create table if not exists public.distress_predictions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    check_in_id uuid references public.check_ins(id) on delete set null,
    distress_score numeric(5,2) not null,
    risk_level risk_level not null,
    ai_analysis_summary text not null,
    recommended_actions jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Alerts Table
create table if not exists public.alerts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    counselor_id uuid references public.profiles(id) on delete set null,
    prediction_id uuid references public.distress_predictions(id) on delete cascade not null,
    status text default 'pending' check (status in ('pending', 'acknowledged', 'resolved')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Audit Logs Table for Security Compliance
create table if not exists public.audit_logs (
    id uuid default uuid_generate_v4() primary key,
    actor_id uuid references public.profiles(id) on delete set null,
    action text not null,
    target_user_id uuid references public.profiles(id) on delete set null,
    details jsonb,
    ip_address text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_check_ins_user_created on public.check_ins(user_id, created_at desc);
create index if not exists idx_predictions_user_created on public.distress_predictions(user_id, created_at desc);
create index if not exists idx_alerts_status_created on public.alerts(status, created_at desc);
create index if not exists idx_alerts_user on public.alerts(user_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id, created_at desc);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

alter table public.profiles enable row level security;
alter table public.check_ins enable row level security;
alter table public.distress_predictions enable row level security;
alter table public.alerts enable row level security;
alter table public.audit_logs enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view their own profile or counselors can view assigned profiles." on public.profiles;
drop policy if exists "Users can update their own profile." on public.profiles;
drop policy if exists "Survivors can insert their own check-ins." on public.check_ins;
drop policy if exists "Survivors can view own check-ins; counselors can view patient check-ins." on public.check_ins;
drop policy if exists "System/Service role or authorized users can view predictions." on public.distress_predictions;
drop policy if exists "Counselors and system can manage alerts." on public.alerts;
drop policy if exists "Counselors and admins can view audit logs." on public.audit_logs;

-- Profiles Policies
create policy "Users can view their own profile or counselors can view assigned profiles."
    on public.profiles for select
    using (auth.uid() = id or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ));

create policy "Users can update their own profile."
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile."
    on public.profiles for insert
    with check (auth.uid() = id);

-- Check-ins Policies
create policy "Survivors can insert their own check-ins."
    on public.check_ins for insert
    with check (auth.uid() = user_id);

create policy "Survivors can view own check-ins; counselors can view patient check-ins."
    on public.check_ins for select
    using (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ));

-- Distress Predictions Policies
create policy "System/Service role or authorized users can view predictions."
    on public.distress_predictions for select
    using (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ));

create policy "Service role or user can insert predictions."
    on public.distress_predictions for insert
    with check (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ));

-- Alerts Policies
create policy "Counselors and system can manage alerts."
    on public.alerts for all
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ) or auth.uid() = user_id);

-- Audit Logs Policies
create policy "Counselors and admins can view audit logs."
    on public.audit_logs for select
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('counselor', 'admin')
    ));

create policy "System and counselors can insert audit logs."
    on public.audit_logs for insert
    with check (true);
