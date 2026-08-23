-- =============================================================
-- LOGIN / REGISTRO CON GOOGLE - Setup de base de datos
-- Ejecutar en: Supabase Dashboard > SQL Editor > New query
--
-- Este script es idempotente: se puede ejecutar varias veces.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Trigger: crea automaticamente el perfil en user_profiles
--    cuando un usuario nuevo se registra (Google o email).
--    SECURITY DEFINER es necesario porque el trigger corre con
--    el rol del proceso de signup, que no puede escribir en
--    user_profiles directamente por RLS.
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- 2. Backfill: crea perfiles para usuarios que ya existen en
--    auth.users y que todavia no tienen fila en user_profiles.
-- -------------------------------------------------------------
insert into public.user_profiles (id, full_name)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name',
    split_part(u.email, '@', 1)
  )
from auth.users u
on conflict (id) do nothing;

-- -------------------------------------------------------------
-- 3. RLS de user_profiles: cada usuario solo ve/edita su perfil.
--    (Si ya tienes estas politicas configuradas, este bloque
--    simplemente las deja igual.)
-- -------------------------------------------------------------
alter table public.user_profiles enable row level security;

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);
