-- ============================================================
-- Table 1: public.profiles (User & Login Information)
-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yydlpwulcpuamowzpcbj/sql/new
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default 'Campus Student',
  phone text default '',
  roll_no text default '22CS1042',
  branch text default 'B.Tech CSE · 3rd Year',
  wallet_balance numeric(10, 2) not null default 250.00 check (wallet_balance >= 0),
  reward_points integer not null default 100 check (reward_points >= 0),
  diet_pref text not null default 'all' check (diet_pref in ('all', 'veg', 'nonveg')),
  role text not null default 'student' check (role in ('student', 'staff', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policies: Students read and update their own profile
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can view all profiles
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select, insert, update on public.profiles to authenticated;

-- Automatic trigger: When a user registers in Auth, auto-create their profile row
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  user_name text;
begin
  user_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  
  insert into public.profiles (
    id,
    email,
    full_name,
    phone,
    roll_no,
    branch,
    wallet_balance,
    reward_points
  )
  values (
    new.id,
    new.email,
    user_name,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    '22CS' || floor(1000 + random() * 9000)::text,
    'B.Tech CSE · 3rd Year',
    250.00,
    100
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at timestamp
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- Backfill existing users (student@campusbite.com, etc.) into profiles
insert into public.profiles (id, email, full_name, phone, roll_no, wallet_balance, reward_points)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  coalesce(u.raw_user_meta_data->>'phone', ''),
  '22CS' || floor(1000 + random() * 9000)::text,
  250.00,
  100
from auth.users u
on conflict (id) do nothing;
