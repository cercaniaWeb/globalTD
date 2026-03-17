-- Tabla para Paquetes (Kits)
CREATE TABLE IF NOT EXISTS public.bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- CCTV, Redes, etc.
    base_price DECIMAL(10,2) DEFAULT 0, -- Precio base sin margen
    margin_percentage DECIMAL(5,2) DEFAULT 25.00,
    is_active BOOLEAN DEFAULT true,
    items JSONB NOT NULL, -- Lista de productos de Syscom y servicios incluidos
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Permisos de RLS para Admin
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bundles' AND policyname = 'Admin full access to bundles'
    ) THEN
        CREATE POLICY "Admin full access to bundles" ON public.bundles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'bundles' AND policyname = 'Public read bundles'
    ) THEN
        CREATE POLICY "Public read bundles" ON public.bundles FOR SELECT USING (true);
    END IF;
END $$;
