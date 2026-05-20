create table products (
  id uuid primary key default gen_random_uuid(),
  title text,
  slug text unique,
  price numeric,
  created_at timestamp default now()
);