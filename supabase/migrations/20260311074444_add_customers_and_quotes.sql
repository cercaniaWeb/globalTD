-- Customers
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    type TEXT DEFAULT 'residencial', -- residencial, empresarial, gobierno
    status TEXT DEFAULT 'activo',
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes (Cotizaciones)
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id),
    lead_id UUID REFERENCES public.leads(id),
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'borrador', -- borrador, enviado, aceptado, rechazado
    items JSONB NOT NULL, -- Storing line items as JSON for flexibility
    valid_until TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'customers' AND policyname = 'Admin full access to customers'
    ) THEN
        CREATE POLICY "Admin full access to customers" ON public.customers FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'quotes' AND policyname = 'Admin full access to quotes'
    ) THEN
        CREATE POLICY "Admin full access to quotes" ON public.quotes FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
    END IF;
END $$;
