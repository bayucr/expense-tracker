-- ==============================================================================
-- Migration: 001_tables_and_rls.sql
-- Description: Creates categories and transactions tables with constraints and RLS
-- ==============================================================================

-- 1. Create categories table
create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    type text not null check (type in ('income', 'expense')),
    color text not null default '#64748b',
    created_at timestamptz not null default now(),
    constraint categories_user_name_type_unique unique (user_id, name, type)
);

-- 2. Create transactions table
-- All monetary values stored as numeric(14,2) in IDR
create table if not exists public.transactions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    category_id uuid references public.categories(id) on delete set null,
    amount numeric(14,2) not null check (amount > 0),
    type text not null check (type in ('income', 'expense')),
    date date not null,
    description text,
    created_at timestamptz not null default now()
);

-- 3. Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- 4. RLS Policies for Categories
create policy "Users can view their own categories"
    on public.categories
    for select
    using (auth.uid() = user_id);

create policy "Users can create their own categories"
    on public.categories
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own categories"
    on public.categories
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own categories"
    on public.categories
    for delete
    using (auth.uid() = user_id);

-- 5. RLS Policies for Transactions
create policy "Users can view their own transactions"
    on public.transactions
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
    on public.transactions
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
    on public.transactions
    for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own transactions"
    on public.transactions
    for delete
    using (auth.uid() = user_id);
