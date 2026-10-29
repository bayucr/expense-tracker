-- ==============================================================================
-- Migration: 002_indexes_and_trigger.sql
-- Description: Performance indexes and handle_new_user trigger seeding 8 default categories
-- ==============================================================================

-- 1. Performance Indexes
create index if not exists idx_transactions_user_date
    on public.transactions(user_id, date desc);

create index if not exists idx_transactions_user_category
    on public.transactions(user_id, category_id);

create index if not exists idx_categories_user
    on public.categories(user_id);

-- 2. Trigger function to seed 8 default categories upon new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.categories (user_id, name, type, color)
    values
        (new.id, 'Makanan & Minuman', 'expense', '#ef4444'),
        (new.id, 'Transportasi', 'expense', '#f97316'),
        (new.id, 'Belanja', 'expense', '#eab308'),
        (new.id, 'Tagihan & Utilitas', 'expense', '#06b6d4'),
        (new.id, 'Hiburan', 'expense', '#8b5cf6'),
        (new.id, 'Kesehatan', 'expense', '#ec4899'),
        (new.id, 'Gaji', 'income', '#10b981'),
        (new.id, 'Investasi & Bonus', 'income', '#3b82f6');
    return new;
end;
$$ language plpgsql security definer;

-- 3. Trigger definition on auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();
