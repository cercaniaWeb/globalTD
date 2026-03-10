-- Tabla para los prospectos (leads) del configurador
CREATE TABLE leads (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  details TEXT,
  estimate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
