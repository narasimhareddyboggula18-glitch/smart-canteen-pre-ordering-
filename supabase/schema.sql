-- ============================================================
-- CampusBite (Smart Canteen) · Supabase PostgreSQL Schema
-- 
-- 1. Table: public.profiles (User & Login Details)
-- 2. Table: public.orders   (Food Orders & Tracking)
-- 3. Automatic Trigger: New auth.users -> create public.profiles
-- 4. Row Level Security (RLS) policies for both tables
-- 5. Backfill existing registered users into profiles
-- ============================================================

-- ------------------------------------------------------------
-- 1. PROFILES TABLE (Login / User Details)
-- ------------------------------------------------------------
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

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies:
-- A student can read their own profile
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- A student can update their own profile (name, phone, diet preference, wallet)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
drop policy if exists "Admins read all profiles" on public.profiles;
create policy "Admins read all profiles"
  on public.profiles
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ------------------------------------------------------------
-- 2. ORDERS TABLE (Canteen Food Orders)
-- ------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  order_code text not null unique,
  token text not null,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  gst numeric(10, 2) not null default 0,
  packaging numeric(10, 2) not null default 0,
  wallet_used numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  coupon text,
  pickup_slot text,
  status text not null default 'placed'
    check (status in ('placed', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  customer_name text,
  customer_phone text,
  placed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for fast querying
create index if not exists orders_user_placed_idx
  on public.orders (user_id, placed_at desc);

create index if not exists orders_status_idx
  on public.orders (status);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Orders RLS Policies:
-- Students can insert their own orders
drop policy if exists "Students insert own orders" on public.orders;
create policy "Students insert own orders"
  on public.orders
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Students can read their own orders
drop policy if exists "Students read own orders" on public.orders;
create policy "Students read own orders"
  on public.orders
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read all orders
drop policy if exists "Admins read all orders" on public.orders;
create policy "Admins read all orders"
  on public.orders
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admins can update order status (e.g. preparing, ready, completed)
drop policy if exists "Admins update all orders" on public.orders;
create policy "Admins update all orders"
  on public.orders
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.orders to authenticated;

-- ------------------------------------------------------------
-- 3. AUTOMATIC PROFILE CREATION TRIGGER
-- When a user signs up via Supabase Auth, automatically
-- create their record in public.profiles.
-- ------------------------------------------------------------
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

-- ------------------------------------------------------------
-- 4. AUTO-UPDATE UPDATED_AT TIMESTAMP TRIGGER
-- ------------------------------------------------------------
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

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------
-- 5. BACKFILL EXISTING USERS INTO PROFILES
-- Copies any existing users into public.profiles immediately.
-- ------------------------------------------------------------
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
