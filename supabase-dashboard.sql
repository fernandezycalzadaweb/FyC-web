-- ============================================================
-- PASO 1: Columna estado en mensajes_contacto
-- ============================================================
-- Añade la columna con valor por defecto 'pendiente'.
-- El CHECK garantiza que solo se acepten esos dos valores.
ALTER TABLE mensajes_contacto
  ADD COLUMN IF NOT EXISTS estado text DEFAULT 'pendiente'
  CHECK (estado IN ('pendiente', 'respondido'));

-- Si tienes mensajes anteriores sin estado, los marca como pendiente:
UPDATE mensajes_contacto SET estado = 'pendiente' WHERE estado IS NULL;

-- ============================================================
-- PASO 2: Columna email en mensajes_contacto (si no la añadiste ya)
-- ============================================================
ALTER TABLE mensajes_contacto
  ADD COLUMN IF NOT EXISTS email text;

-- ============================================================
-- PASO 3: Tabla analytics_visitas (para tracking futuro)
-- ============================================================
-- Esta tabla no recibe datos todavía — el frontend no registra visitas.
-- Créala ahora para que el panel no muestre error; añade los INSERTs
-- en cada página cuando quieras activar el tracking.
CREATE TABLE IF NOT EXISTS analytics_visitas (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  pagina     text        NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Política RLS: el rol autenticado puede insertar y leer sus propias visitas.
-- Ajusta según tus necesidades de privacidad.
ALTER TABLE analytics_visitas ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "anon_insert_visitas"
  ON analytics_visitas FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "auth_select_visitas"
  ON analytics_visitas FOR SELECT TO authenticated USING (true);

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'mensajes_contacto'
ORDER BY ordinal_position;
