-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Añadir columna imagen (no existe todavía en la tabla)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE productos ADD COLUMN IF NOT EXISTS imagen text;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Insertar los 41 productos
--    La tabla está vacía; ejecuta esto una sola vez.
--    Si necesitas re-ejecutar, borra primero: DELETE FROM productos;
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO productos (nombre, categoria, origen, disponible, descripcion, imagen) VALUES

-- Flor cortada · Colombia / Ecuador
('Rosa',                   'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Variedades estándar y premium, tallo largo, disponible todo el año.',                       null),
('Alstroemeria',           'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Larga duración en florero. Disponible en amplia gama de colores.',                          null),
('Anastasia / Cremón',     'Flor cortada', ARRAY['Colombia'],           true,  'Crisantemo de rama de origen colombiano, tono cálido y gran volumen.',                      null),
('Clavel',                 'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Clavel estándar en todos los colores, gran durabilidad y rentabilidad.',                    null),
('Mini Clavel',            'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Clavel ramificado, ideal para composiciones y ramos complementarios.',                      null),
('Paniculata',             'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Gypsophila de volumen. Complemento clásico para cualquier ramo.',                          null),
('Hortensia rosa',         'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'Cabeza grande, pétalos compactos. Tono rosa intenso muy solicitado.',                      '/images/productos/hortensia-rosa.jpg'),
('Hortensia azul',         'Flor cortada', ARRAY['Colombia','Ecuador'], true,  'El azul de la hortensia en su versión más pura. Especialidad de temporada.',               '/images/productos/hortensia-azul.jpg'),

-- Flor cortada · Ecuador
('Rosa de tallo extra largo', 'Flor cortada', ARRAY['Ecuador'],         true,  'Tallo de 80–100 cm y cabeza XL. Especialidad ecuatoriana para nupcial.',                   null),

-- Flor cortada · Holanda
('Margarita / Crisantemo', 'Flor cortada', ARRAY['Holanda'],            true,  'Variedad estándar y spray. Excelente relación calidad-precio.',                            null),
('Lilium Oriental',        'Flor cortada', ARRAY['Holanda'],            true,  'Fragante y vistoso. Gran cabeza floral, varios colores.',                                   null),
('Lilium Longiflora',      'Flor cortada', ARRAY['Holanda'],            true,  'Blanco puro, tallo recto. Muy utilizado en floristería nupcial.',                          null),
('Gerbera',                'Flor cortada', ARRAY['Holanda'],            true,  'Gran gama de colores, cabeza grande y tallo firme.',                                        null),
('Lisianthus',             'Flor cortada', ARRAY['Holanda'],            true,  'Elegante y delicado, disponible en blanco, lila, rosa y bicolor.',                         null),
('Solidago',               'Flor cortada', ARRAY['Holanda','Nacional'], true,  'Relleno clásico en amarillo dorado. Disponible de temporada en nacional.',                 null),
('Limonium',               'Flor cortada', ARRAY['Holanda','Nacional'], true,  'Excelente como relleno seco o fresco. Muy versátil.',                                       null),
('Statice',                'Flor cortada', ARRAY['Holanda','Nacional'], true,  'Flores pequeñas, colores vivos, se seca bien conservando el color.',                       null),
('Tulipán',                'Flor cortada', ARRAY['Holanda'],            true,  'Temporada de otoño-invierno. Amplia variedad de colores y formas.',                        null),
('Rosa Ramificada',        'Flor cortada', ARRAY['Holanda'],            true,  'Spray rose de varias cabezas por tallo. Ideal para ramos complementarios.',                null),
('Hypericum',              'Flor cortada', ARRAY['Holanda'],            true,  'Baya decorativa en tonos rojizos, amarillos y naranjas.',                                   null),
('Cala',                   'Flor cortada', ARRAY['Holanda'],            true,  'Zantedeschia de líneas elegantes, blanca y en colores.',                                   null),
('Peonía',                 'Flor cortada', ARRAY['Holanda'],            true,  'Flor de temporada primaveral, muy demandada. Gran tamaño de cabeza.',                      null),
('Anthurium',              'Flor cortada', ARRAY['Holanda'],            true,  'Flor tropical de larga duración, aspecto lacado y brillante.',                             null),
('Astilbe',                'Flor cortada', ARRAY['Holanda'],            true,  'Plumosa y ligera, en tonos blancos, rosas y rojos. Ideal para bodas.',                     null),

-- Flor cortada · Nacional
('Lilium Asiático',        'Flor cortada', ARRAY['Nacional'],           true,  'Lilium sin fragancia, más rústico y asequible que el oriental.',                           null),
('Antirrinum',             'Flor cortada', ARRAY['Nacional'],           true,  'Boca de dragón. Flor de temporada en múltiples colores, muy rentable.',                    null),

-- Verdes
('Eucalipto',              'Verdes',       ARRAY['Nacional'],           true,  'Eucalipto de distintas variedades: babby blue, parvifolia, cinerea.',                      null),
('Camelia',                'Verdes',       ARRAY['Nacional'],           true,  'Hoja oscura y brillante, larga duración fuera del agua.',                                  null),
('Hiedra arbórea',         'Verdes',       ARRAY['Nacional'],           true,  'Verde de volumen, muy resistente y de bajo coste.',                                        null),
('Pitosporum',             'Verdes',       ARRAY['Nacional'],           true,  'Hoja pequeña con variegaciones, elegante y discreto.',                                      null),
('Ruscus',                 'Verdes',       ARRAY['Nacional'],           true,  'Verde clásico, oscuro, de fácil manejo. Muy utilizado como base.',                         null),
('Chico Hojas',            'Verdes',       ARRAY['Nacional'],           true,  'Hoja tropical ancha, verde intenso, muy decorativa.',                                       null),
('Roebellini',             'Verdes',       ARRAY['Nacional'],           true,  'Palmera miniatura, ideal para composiciones de gran formato.',                              null),
('Helecho',                'Verdes',       ARRAY['Nacional'],           true,  'Helecho espada, relleno clásico y muy económico.',                                          null),
('Aspidistra',             'Verdes',       ARRAY['Nacional'],           true,  'Hoja grande y robusta, perfecto para composiciones nupciales y fúnebres.',                  null),

-- Plantas
('Poinsetia',              'Plantas',      ARRAY['Holanda','Nacional'], true,  'Estrella de Navidad. Temporada de invierno. Varias variedades.',                           null),
('Hortensia (planta)',     'Plantas',      ARRAY['Holanda','Nacional'], true,  'Hortensia en maceta, floración de primavera y verano.',                                     null),

-- Accesorios
('Envoltorios',            'Accesorios',   ARRAY['Nacional'],           true,  'Papel decorativo en diferentes colores, texturas y acabados.',                             null),
('Aros de coronas',        'Accesorios',   ARRAY['Nacional'],           true,  'Bases metálicas para coronas fúnebres, varios diámetros.',                                 null),
('Bandejas y tarrinas',    'Accesorios',   ARRAY['Nacional'],           true,  'Contenedores plásticos para composiciones con esponja floral.',                            null),
('Esponjas florales',      'Accesorios',   ARRAY['Nacional'],           true,  'Oasis estándar y de variedades, en bloques y formas especiales.',                          null);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Verificar el resultado
-- ─────────────────────────────────────────────────────────────────────────────
SELECT COUNT(*) AS total, categoria FROM productos GROUP BY categoria ORDER BY categoria;
