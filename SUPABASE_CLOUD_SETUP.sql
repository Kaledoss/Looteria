-- Story of Looteria V11.9.8.6 — Supabase SQL Editor (einmal ausführen)
-- Voraussetzung: Authentication > Providers > Anonymous Sign-Ins aktivieren.
-- Spieler benötigen keine E-Mail. Cloud-Daten sind nur über die RPC-Funktionen erreichbar.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.looteria_cloud_saves (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  recovery_hash text not null unique,
  save_data jsonb not null,
  revision bigint not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.looteria_cloud_saves enable row level security;
revoke all on public.looteria_cloud_saves from anon, authenticated;
-- No direct select/insert/update/delete policies. Only the controlled functions below.

create or replace function public.looteria_cloud_put(p_code text, p_save jsonb, p_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := (select auth.uid());
  hashed text;
  current_rev bigint;
  owner_for_code uuid;
  next_rev bigint;
begin
  if uid is null then raise exception 'Anmeldung erforderlich'; end if;
  if p_code !~ '^[0-9A-F]{64}$' then raise exception 'Ungültiger Wiederherstellungscode'; end if;
  if p_save is null or jsonb_typeof(p_save) <> 'object' or p_save->>'version' <> '1'
     or not (p_save ? 'res') or not (p_save ? 'buildings') then
     raise exception 'Ungültiges Spielstandformat';
  end if;
  if pg_column_size(p_save) > 2000000 then raise exception 'Spielstand zu groß'; end if;
  hashed := encode(extensions.digest(p_code,'sha256'),'hex');
  select owner_id into owner_for_code from public.looteria_cloud_saves where recovery_hash=hashed;
  if owner_for_code is not null and owner_for_code <> uid then
    raise exception 'Wiederherstellungscode gehört einem anderen Spieler';
  end if;
  select revision into current_rev from public.looteria_cloud_saves where owner_id=uid for update;
  if found then
    if current_rev <> coalesce(p_revision,0) then
      return jsonb_build_object('conflict',true,'revision',current_rev);
    end if;
    update public.looteria_cloud_saves set save_data=p_save,recovery_hash=hashed,
      revision=revision+1,updated_at=now() where owner_id=uid returning revision into next_rev;
  else
    if coalesce(p_revision,0) <> 0 then
      return jsonb_build_object('conflict',true,'revision',0);
    end if;
    insert into public.looteria_cloud_saves(owner_id,recovery_hash,save_data)
    values(uid,hashed,p_save) returning revision into next_rev;
  end if;
  return jsonb_build_object('ok',true,'revision',next_rev);
end $$;

create or replace function public.looteria_cloud_get()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.looteria_cloud_saves%rowtype;
begin
  if (select auth.uid()) is null then raise exception 'Anmeldung erforderlich'; end if;
  select * into r from public.looteria_cloud_saves where owner_id=(select auth.uid());
  if not found then return '{}'::jsonb; end if;
  return jsonb_build_object('save',r.save_data,'revision',r.revision,'updated_at',r.updated_at,
    'player_level',coalesce((r.save_data->>'level')::integer,1),
    'taler',coalesce((r.save_data->>'tradeCoins')::numeric,0),
    'play_seconds',coalesce((r.save_data->>'activeSeconds')::numeric,0));
end $$;

create or replace function public.looteria_cloud_claim(p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); hashed text; previous_owner uuid; new_revision bigint;
begin
  if uid is null then raise exception 'Anmeldung erforderlich'; end if;
  if p_code !~ '^[0-9A-F]{64}$' then raise exception 'Ungültiger Wiederherstellungscode'; end if;
  hashed := encode(extensions.digest(p_code,'sha256'),'hex');
  select owner_id into previous_owner from public.looteria_cloud_saves
    where recovery_hash=hashed for update;
  if previous_owner is null then return jsonb_build_object('ok',false); end if;
  if previous_owner = uid then
    select revision into new_revision from public.looteria_cloud_saves where owner_id=uid;
    return jsonb_build_object('ok',true,'revision',new_revision);
  end if;
  -- Transfer control to new anonymous account. Any save already belonging to it is replaced.
  delete from public.looteria_cloud_saves where owner_id=uid;
  update public.looteria_cloud_saves set owner_id=uid,revision=revision+1,
    updated_at=now() where recovery_hash=hashed returning revision into new_revision;
  return jsonb_build_object('ok',true,'revision',new_revision);
end $$;

revoke all on function public.looteria_cloud_put(text,jsonb,bigint) from public,anon;
revoke all on function public.looteria_cloud_get() from public,anon;
revoke all on function public.looteria_cloud_claim(text) from public,anon;
grant execute on function public.looteria_cloud_put(text,jsonb,bigint) to authenticated;
grant execute on function public.looteria_cloud_get() to authenticated;
grant execute on function public.looteria_cloud_claim(text) to authenticated;
