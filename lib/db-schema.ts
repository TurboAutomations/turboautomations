// This file defines the database schema for reference

export interface Profile {
  id: string // UUID, matches auth.users.id
  created_at: string
  updated_at: string
  full_name: string | null
  avatar_url: string | null
  email: string
  team_id: string | null
  is_admin: boolean
  role: string // 'admin' or 'user'
}

export interface Team {
  id: string // UUID
  created_at: string
  name: string
  created_by: string // UUID, references profiles.id
}

export interface Automation {
  id: string // UUID
  created_at: string
  updated_at: string
  name: string
  description: string
  status: "active" | "paused" | "error"
  created_by: string // UUID, references profiles.id
}

export interface TeamAutomation {
  id: string // UUID
  created_at: string
  team_id: string // UUID, references teams.id
  automation_id: string // UUID, references automations.id
}

// SQL for creating these tables in Supabase:

/*
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  full_name text,
  avatar_url text,
  email text not null,
  team_id uuid references public.teams,
  is_admin boolean default false not null,
  role text default 'user' not null
);

-- Create teams table
create table public.teams (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default now() not null,
  name text not null,
  created_by uuid references public.profiles not null
);

-- Create automations table
create table public.automations (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  name text not null,
  description text,
  status text default 'paused' not null,
  created_by uuid references public.profiles not null
);

-- Create team_automations table (junction table)
create table public.team_automations (
  id uuid default uuid_generate_v4() primary key not null,
  created_at timestamp with time zone default now() not null,
  team_id uuid references public.teams not null,
  automation_id uuid references public.automations not null,
  unique(team_id, automation_id)
);

-- Set up RLS policies
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.automations enable row level security;
alter table public.team_automations enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using ((select is_admin from public.profiles where id = auth.uid()));

-- Teams policies
create policy "Users can view their own team"
  on public.teams for select
  using (id in (select team_id from public.profiles where id = auth.uid()));

create policy "Admins can view all teams"
  on public.teams for select
  using ((select is_admin from public.profiles where id = auth.uid()));

create policy "Admins can insert teams"
  on public.teams for insert
  with check ((select is_admin from public.profiles where id = auth.uid()));

-- Automations policies
create policy "Users can view automations assigned to their team"
  on public.automations for select
  using (id in (
    select automation_id from public.team_automations
    where team_id = (select team_id from public.profiles where id = auth.uid())
  ));

create policy "Admins can view all automations"
  on public.automations for select
  using ((select is_admin from public.profiles where id = auth.uid()));

create policy "Admins can insert automations"
  on public.automations for insert
  with check ((select is_admin from public.profiles where id = auth.uid()));

-- Team_automations policies
create policy "Users can view their team's automation assignments"
  on public.team_automations for select
  using (team_id = (select team_id from public.profiles where id = auth.uid()));

create policy "Admins can view all team automation assignments"
  on public.team_automations for select
  using ((select is_admin from public.profiles where id = auth.uid()));

create policy "Admins can insert team automation assignments"
  on public.team_automations for insert
  with check ((select is_admin from public.profiles where id = auth.uid()));

create policy "Admins can delete team automation assignments"
  on public.team_automations for delete
  using ((select is_admin from public.profiles where id = auth.uid()));
*/

