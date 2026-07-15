-- ============================================================
-- Fernández y Calzada S.L. — esquema inicial
-- ============================================================

-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- ── Perfiles de usuario ──────────────────────────────────────
-- Extiende auth.users. Role: 'empresa' | 'administrador'
create table public.profiles (
  id        uuid references auth.users(id) on delete cascade primary key,
  role      text not null default 'empresa' check (role in ('empresa', 'administrador')),
  nombre    text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Usuarios leen su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Solo administradores leen todos los perfiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'administrador'
    )
  );

-- Trigger: crear perfil automáticamente al registrar usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, nombre)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'empresa'),
    coalesce(new.raw_user_meta_data->>'nombre', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Productos ────────────────────────────────────────────────
create table public.productos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  categoria   text not null check (categoria in ('Flor cortada', 'Verdes', 'Plantas', 'Accesorios')),
  origen      text[] not null default '{}',
  descripcion text,
  disponible  boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.productos enable row level security;

-- Cualquier visitante puede leer productos disponibles
create policy "Productos disponibles son públicos"
  on public.productos for select
  using (disponible = true);

-- Usuarios autenticados (empresa o admin) pueden ver todos
create policy "Autenticados ven todos los productos"
  on public.productos for select
  using (auth.role() = 'authenticated');

-- Solo empresa o admin pueden insertar/actualizar/borrar
create policy "Empresa puede editar productos"
  on public.productos for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('empresa', 'administrador')
    )
  );

-- Trigger: actualizar updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger productos_updated_at
  before update on public.productos
  for each row execute procedure public.set_updated_at();

-- ── Mensajes de contacto ─────────────────────────────────────
create table public.mensajes_contacto (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  floristeria text,
  email       text not null,
  telefono    text,
  mensaje     text not null,
  leido       boolean not null default false,
  created_at  timestamptz default now()
);

alter table public.mensajes_contacto enable row level security;

-- Cualquier visitante puede insertar (enviar formulario)
create policy "Visitantes pueden enviar mensajes"
  on public.mensajes_contacto for insert
  with check (true);

-- Solo empresa o admin pueden leer
create policy "Empresa puede leer mensajes"
  on public.mensajes_contacto for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('empresa', 'administrador')
    )
  );

create policy "Empresa puede actualizar mensajes (marcar leído)"
  on public.mensajes_contacto for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('empresa', 'administrador')
    )
  );

-- ── Analytics de visitas ─────────────────────────────────────
create table public.analytics_visitas (
  id          uuid primary key default gen_random_uuid(),
  pagina      text not null,
  referrer    text,
  user_agent  text,
  created_at  timestamptz default now()
);

alter table public.analytics_visitas enable row level security;

-- Cualquier visitante puede insertar (trackear visita)
create policy "Visitantes pueden registrar visita"
  on public.analytics_visitas for insert
  with check (true);

-- Solo administrador puede leer métricas
create policy "Solo administrador lee analytics"
  on public.analytics_visitas for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'administrador'
    )
  );
