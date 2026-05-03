-- Tabela de transações
create table if not exists public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('income', 'expense')) not null,
  amount numeric(12, 2) not null check (amount > 0),
  category text not null,
  description text not null,
  date date not null,
  created_at timestamptz default now() not null
);

-- Row Level Security
alter table public.transactions enable row level security;

create policy "Usuários veem apenas suas transações"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Usuários inserem suas transações"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam suas transações"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Usuários excluem suas transações"
  on public.transactions for delete
  using (auth.uid() = user_id);

-- Índice para buscas por usuário e data
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc);
