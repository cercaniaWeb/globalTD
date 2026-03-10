-- CRM Leads Table
CREATE TABLE IF NOT EXISTS crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    client_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    status TEXT DEFAULT 'Prospecto' CHECK (status IN ('Prospecto', 'Levantamiento', 'Cotizado', 'Cerrado', 'Perdido')),
    estimated_value DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    source TEXT DEFAULT 'Web'
);

-- CRM Measurements Table (AR Measurements)
CREATE TABLE IF NOT EXISTS crm_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
    from_point JSONB NOT NULL, -- {x, y, z}
    to_point JSONB NOT NULL,   -- {x, y, z}
    distance FLOAT NOT NULL,    -- in meters
    label TEXT
);

-- RLS Policies
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users on leads" ON crm_leads
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all for authenticated users on measurements" ON crm_measurements
    FOR ALL USING (auth.role() = 'authenticated');
