create table public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid references public.inventory(id) on delete set null,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  movement_type text not null check (movement_type in ('add', 'deduct', 'reserve', 'release', 'order_fulfillment', 'restock')),
  quantity_delta integer not null,
  previous_quantity integer not null check (previous_quantity >= 0),
  new_quantity integer not null check (new_quantity >= 0),
  reason text,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  from_status public.order_status,
  to_status public.order_status not null,
  from_payment_status public.payment_status,
  to_payment_status public.payment_status,
  note text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.inventory_movements enable row level security;
alter table public.order_status_history enable row level security;
alter table public.notifications enable row level security;

create index inventory_movements_product_id_idx on public.inventory_movements(product_id);
create index inventory_movements_actor_id_idx on public.inventory_movements(actor_id);
create index order_status_history_order_id_idx on public.order_status_history(order_id);
create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_order_id_idx on public.notifications(order_id);

grant select, insert, update, delete on public.inventory_movements, public.order_status_history, public.notifications to authenticated;
grant all privileges on public.inventory_movements, public.order_status_history, public.notifications to service_role;

create policy "staff read inventory movements"
on public.inventory_movements for select
to authenticated
using (app_private.current_user_role() in ('staff', 'administrator'));

create policy "staff create inventory movements"
on public.inventory_movements for insert
to authenticated
with check (app_private.current_user_role() in ('staff', 'administrator'));

create policy "customers read own order status history and staff read all"
on public.order_status_history for select
to authenticated
using (
  app_private.current_user_role() in ('staff', 'administrator')
  or exists (
    select 1 from public.orders
    where orders.id = order_status_history.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "staff create order status history"
on public.order_status_history for insert
to authenticated
with check (app_private.current_user_role() in ('staff', 'administrator'));

create policy "users read own notifications"
on public.notifications for select
to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_role() in ('staff', 'administrator')
);

create policy "staff create notifications"
on public.notifications for insert
to authenticated
with check (app_private.current_user_role() in ('staff', 'administrator'));

create policy "users update own notifications"
on public.notifications for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "public reads product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy "admins manage product images bucket"
on storage.objects for all
to authenticated
using (
  bucket_id = 'product-images'
  and app_private.current_user_role() = 'administrator'
)
with check (
  bucket_id = 'product-images'
  and app_private.current_user_role() = 'administrator'
);
