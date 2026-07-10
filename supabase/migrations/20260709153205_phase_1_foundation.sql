create extension if not exists pgcrypto with schema public;
create extension if not exists citext with schema public;

create schema if not exists app_private;
revoke all on schema app_private from public;
grant usage on schema app_private to anon, authenticated, service_role;

do $$
begin
  create type public.user_role as enum ('customer', 'staff', 'administrator');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.product_status as enum ('draft', 'active', 'archived');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'awaiting_payment',
    'for_verification',
    'paid',
    'processing',
    'packed',
    'shipped',
    'completed',
    'cancelled',
    'refunded'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum (
    'awaiting_payment',
    'proof_submitted',
    'under_review',
    'paid',
    'rejected',
    'expired',
    'refunded'
  );
exception
  when duplicate_object then null;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email public.citext not null unique,
  full_name text,
  phone text,
  avatar_url text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  mobile_number text not null,
  region text not null,
  province text not null,
  city text not null,
  barangay text not null,
  postal_code text not null,
  street_address text not null,
  delivery_notes text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  specifications jsonb not null default '{}'::jsonb,
  keywords text[] not null default '{}',
  status public.product_status not null default 'draft',
  price_cents integer not null check (price_cents >= 0),
  sale_price_cents integer check (sale_price_cents is null or sale_price_cents >= 0),
  badge text,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_sale_not_above_regular check (
    sale_price_cents is null or sale_price_cents <= price_cents
  )
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  sku text unique,
  price_cents integer check (price_cents is null or price_cents >= 0),
  sale_price_cents integer check (sale_price_cents is null or sale_price_cents >= 0),
  attributes jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inventory_variant_matches_product unique (product_id, variant_id),
  constraint inventory_reserved_not_above_quantity check (reserved_quantity <= quantity)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  order_number text not null unique,
  status public.order_status not null default 'awaiting_payment',
  payment_status public.payment_status not null default 'awaiting_payment',
  subtotal_cents integer not null default 0 check (subtotal_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  total_cents integer not null default 0 check (total_cents >= 0),
  shipping_address jsonb not null default '{}'::jsonb,
  customer_notes text,
  internal_notes text,
  expires_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  variant_name text,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.payment_proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete restrict,
  sender_name text not null,
  sender_mobile_number text not null,
  amount_paid_cents integer not null check (amount_paid_cents >= 0),
  gcash_reference_number text not null unique,
  paid_at timestamptz not null,
  storage_path text not null,
  mime_type text not null,
  file_size_bytes integer not null check (file_size_bytes > 0),
  status public.payment_status not null default 'proof_submitted',
  review_notes text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.homepage_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  href text,
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  section_key text not null unique,
  config jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  sort_order integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = (select auth.uid())
$$;

revoke all on function app_private.current_user_role() from public;
grant execute on function app_private.current_user_role() to anon, authenticated, service_role;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'customer'
  )
  on conflict (id) do update
  set email = excluded.email,
      updated_at = now();

  return new;
end;
$$;

create or replace function app_private.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
    and (select auth.uid()) is not null
    and coalesce(app_private.current_user_role(), 'customer') <> 'administrator'
  then
    raise exception 'Only administrators can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_new_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger profiles_prevent_role_escalation
before update on public.profiles
for each row execute function app_private.prevent_profile_role_escalation();

create trigger addresses_set_updated_at before update on public.addresses
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger product_variants_set_updated_at before update on public.product_variants
for each row execute function public.set_updated_at();
create trigger inventory_set_updated_at before update on public.inventory
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger payment_proofs_set_updated_at before update on public.payment_proofs
for each row execute function public.set_updated_at();
create trigger homepage_banners_set_updated_at before update on public.homepage_banners
for each row execute function public.set_updated_at();
create trigger homepage_sections_set_updated_at before update on public.homepage_sections
for each row execute function public.set_updated_at();

create index addresses_user_id_idx on public.addresses(user_id);
create index products_status_idx on public.products(status);
create index products_category_id_idx on public.products(category_id);
create index products_brand_id_idx on public.products(brand_id);
create index product_variants_product_id_idx on public.product_variants(product_id);
create index product_images_product_id_idx on public.product_images(product_id);
create index inventory_product_id_idx on public.inventory(product_id);
create index orders_user_id_idx on public.orders(user_id);
create index orders_status_idx on public.orders(status);
create index order_items_order_id_idx on public.order_items(order_id);
create index payment_proofs_order_id_idx on public.payment_proofs(order_id);
create index payment_proofs_user_id_idx on public.payment_proofs(user_id);
create index audit_logs_actor_id_idx on public.audit_logs(actor_id);

grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories, public.brands, public.products, public.product_variants, public.product_images, public.homepage_banners, public.homepage_sections to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant all privileges on all tables in schema public to service_role;

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.inventory enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_proofs enable row level security;
alter table public.homepage_banners enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.audit_logs enable row level security;

create policy "users read own profile and staff read profiles"
on public.profiles for select
to authenticated
using (
  id = (select auth.uid())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "users update own profile and admins update profiles"
on public.profiles for update
to authenticated
using (
  id = (select auth.uid())
  or app_private.current_user_role() = 'administrator'
)
with check (
  id = (select auth.uid())
  or app_private.current_user_role() = 'administrator'
);

create policy "users manage own addresses"
on public.addresses for all
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_role() in ('staff', 'administrator')
)
with check (
  user_id = (select auth.uid())
  or app_private.current_user_role() = 'administrator'
);

create policy "public reads active categories"
on public.categories for select
to anon, authenticated
using (is_active = true or app_private.current_user_role() in ('staff', 'administrator'));

create policy "admins manage categories"
on public.categories for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "public reads active brands"
on public.brands for select
to anon, authenticated
using (is_active = true or app_private.current_user_role() in ('staff', 'administrator'));

create policy "admins manage brands"
on public.brands for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "public reads active products"
on public.products for select
to anon, authenticated
using (status = 'active' or app_private.current_user_role() in ('staff', 'administrator'));

create policy "admins manage products"
on public.products for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "public reads active product variants"
on public.product_variants for select
to anon, authenticated
using (
  is_active = true
  and exists (
    select 1 from public.products
    where products.id = product_variants.product_id
      and products.status = 'active'
  )
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "admins manage product variants"
on public.product_variants for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "public reads active product images"
on public.product_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.products
    where products.id = product_images.product_id
      and products.status = 'active'
  )
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "admins manage product images"
on public.product_images for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "staff reads inventory"
on public.inventory for select
to authenticated
using (app_private.current_user_role() in ('staff', 'administrator'));

create policy "admins manage inventory"
on public.inventory for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "customers read own orders and staff read orders"
on public.orders for select
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "customers create own orders"
on public.orders for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "staff update orders"
on public.orders for update
to authenticated
using (app_private.current_user_role() in ('staff', 'administrator'))
with check (app_private.current_user_role() in ('staff', 'administrator'));

create policy "customers read own order items and staff read order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (
        orders.user_id = (select auth.uid())
        or app_private.current_user_role() in ('staff', 'administrator')
      )
  )
);

create policy "customers create own order items"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "customers read own payment proofs and staff read proofs"
on public.payment_proofs for select
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "customers create own payment proofs"
on public.payment_proofs for insert
to authenticated
with check (user_id = (select auth.uid()));

create policy "staff update payment proofs"
on public.payment_proofs for update
to authenticated
using (app_private.current_user_role() in ('staff', 'administrator'))
with check (app_private.current_user_role() in ('staff', 'administrator'));

create policy "public reads visible homepage banners"
on public.homepage_banners for select
to anon, authenticated
using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "admins manage homepage banners"
on public.homepage_banners for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "public reads visible homepage sections"
on public.homepage_sections for select
to anon, authenticated
using (
  is_visible = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "admins manage homepage sections"
on public.homepage_sections for all
to authenticated
using (app_private.current_user_role() = 'administrator')
with check (app_private.current_user_role() = 'administrator');

create policy "admins read audit logs"
on public.audit_logs for select
to authenticated
using (app_private.current_user_role() = 'administrator');

create policy "staff create audit logs"
on public.audit_logs for insert
to authenticated
with check (app_private.current_user_role() in ('staff', 'administrator'));
