-- Run once in the dedicated AR Camper Rentals Supabase project's SQL editor.
create table public.inventory_owners (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.inventory_owners enable row level security;
create function public.is_inventory_owner() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.inventory_owners where user_id=auth.uid()) $$;
revoke all on function public.is_inventory_owner() from public;
grant execute on function public.is_inventory_owner() to anon, authenticated;
create table public.inventory (
 id text primary key, section text not null check(section in ('Campers','Equipment','Generators','Add-ons','Merchandise','Miscellaneous')),
 category text not null default 'Miscellaneous', available boolean not null default true,
 published boolean not null default false, position integer not null default 0 check(position>=0),
 data jsonb not null check(jsonb_typeof(data)='object' and length(data->>'name') between 1 and 160 and length(data->>'rate') between 1 and 80 and jsonb_typeof(data->'photos')='array' and jsonb_typeof(data->'features')='array')
);
alter table public.inventory enable row level security;
create policy "Visitors read published listings" on public.inventory for select to anon,authenticated using(published);
create policy "Owners read inventory" on public.inventory for select to authenticated using(public.is_inventory_owner());
create policy "Owners insert inventory" on public.inventory for insert to authenticated with check(public.is_inventory_owner());
create policy "Owners edit inventory" on public.inventory for update to authenticated using(public.is_inventory_owner()) with check(public.is_inventory_owner());
create policy "Owners delete inventory" on public.inventory for delete to authenticated using(public.is_inventory_owner());
grant select on public.inventory to anon;
grant select,insert,update,delete on public.inventory to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('inventory-photos','inventory-photos',true,8388608,array['image/jpeg','image/png','image/webp']);
create policy "Public inventory photos" on storage.objects for select to anon,authenticated using(bucket_id='inventory-photos');
create policy "Owners upload inventory photos" on storage.objects for insert to authenticated with check(bucket_id='inventory-photos' and public.is_inventory_owner());
-- After creating and verifying Michael's user, add its UUID using the SQL editor:
-- insert into public.inventory_owners(user_id) values ('VERIFIED-AUTH-USER-UUID');
-- Disable public signups in Authentication settings. Never put service-role keys in the website.
