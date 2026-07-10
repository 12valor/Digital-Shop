create sequence if not exists app_private.order_number_seq;

create or replace function public.generate_order_number()
returns text
language sql
security definer
set search_path = public, app_private
as $$
  select 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('app_private.order_number_seq')::text, 6, '0')
$$;

revoke all on function public.generate_order_number() from public, anon;
grant execute on function public.generate_order_number() to authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "customers upload own payment proofs"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "customers read own payment proof objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "staff read payment proof objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'payment-proofs'
  and app_private.current_user_role() in ('staff', 'administrator')
);

create policy "admins manage payment proof objects"
on storage.objects for all
to authenticated
using (
  bucket_id = 'payment-proofs'
  and app_private.current_user_role() = 'administrator'
)
with check (
  bucket_id = 'payment-proofs'
  and app_private.current_user_role() = 'administrator'
);
