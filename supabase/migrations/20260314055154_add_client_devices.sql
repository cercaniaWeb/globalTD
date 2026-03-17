-- 1. Crear tabla de dispositivos de cliente
CREATE TABLE IF NOT EXISTS client_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    camera_name TEXT NOT NULL,
    device_type TEXT DEFAULT 'Fija',
    url_or_ip TEXT NOT NULL, -- ej. cliente1.ddns.net
    port_http INT DEFAULT 80, -- Puerto web para el ISAPI snapshot
    port_rtsp INT DEFAULT 554, -- Puerto para el video en vivo futuro
    username TEXT DEFAULT 'admin',
    password_enc TEXT NOT NULL, -- Aquí guardas la contraseña del canal
    channel_id INT DEFAULT 101, -- 101 = Cámara 1 Principal, 102 = Cam 1 Substream
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Activar Seguridad (Nadie puede ver las IP/Passwords directo de la base)
ALTER TABLE client_devices ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para que usuarios vean solo sus propios dispositivos
DROP POLICY IF EXISTS "Usuarios ven sus propios dispositivos" ON client_devices;
CREATE POLICY "Usuarios ven sus propios dispositivos" 
ON client_devices FOR SELECT 
USING (auth.uid() = user_id);
