-- Tabla para eventos del calendario
CREATE TABLE calendar_events (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  category TEXT DEFAULT 'reunion', -- reunion, visita, mantenimiento, otro
  color TEXT DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para gestión de tareas
CREATE TABLE tasks (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pendiente', -- pendiente, en_proceso, completada
  priority TEXT DEFAULT 'media', -- baja, media, alta
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para suscripciones de notificaciones push (opcional para implementación futura)
CREATE TABLE push_subscriptions (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  subscription JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
