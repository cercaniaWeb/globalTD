'use client'

import React, { useState, useEffect } from 'react';
import { Camera, Shield, Users, LayoutGrid, Bell, Settings, LogOut, ChevronRight, Globe, Lock, Loader2, AlertTriangle, UserPlus, FileText, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Tipo de cámara mock o real
interface CameraData {
  id: string | number;
  name: string;
  type: string;
  status: 'online' | 'offline';
  lastUpdate: string;
  url: string;
}

interface ClientDeviceRow {
  id: string;
  user_id: string;
  camera_name: string;
  device_type: string;
  url_or_ip: string;
  port_http: number;
  port_rtsp: number;
  username: string;
  password_enc: string;
  channel_id: number;
  is_active: boolean;
  created_at: string;
}

export default function PortalPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('Cargando...');
  const [clientId, setClientId] = useState('GTD-...');
  const [isLoading, setIsLoading] = useState(true);

  // Simulación inicial de cámaras
  const [cameras, setCameras] = useState<CameraData[]>([
    { id: 1, name: "Acceso Principal", type: "PTZ", status: "online", lastUpdate: "Ahora", url: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800" },
    { id: 2, name: "Estacionamiento Sur", type: "Fija", status: "online", lastUpdate: "Ahora", url: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800" },
    { id: 3, name: "Área de Piscina", type: "Fija", status: "offline", lastUpdate: "Hace 2h", url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800" },
    { id: 4, name: "Pasillo B", type: "Domo", status: "online", lastUpdate: "Ahora", url: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=800" }
  ]);

  const [selectedCam, setSelectedCam] = useState<CameraData | null>(null);
  const [activeTab, setActiveTab] = useState('cameras');

  // Formularios mock
  const [supportMsg, setSupportMsg] = useState('');

  // Time key for cache busting snapshots
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, id')
        .eq('id', user.id)
        .single();

      setUserName(profile?.full_name || user.email || 'Cliente');
      setClientId(`GTD-${user.id.substring(0, 4).toUpperCase()}`);

      // Obtener cámaras reales de la base de datos
      const { data: devices } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('client_devices' as any)
        .select('*')
        .eq('user_id', user.id);

      if (devices && devices.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const realCameras: CameraData[] = (devices as any[]).map((d: any) => ({
          id: d.id,
          name: d.camera_name,
          type: d.device_type,
          status: d.is_active ? 'online' : 'offline',
          lastUpdate: new Date(d.created_at).toLocaleTimeString('es-MX'),
          url: `/api/cameras/proxy?id=${d.id}`
        }));
        setCameras(realCameras);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Actualizar las imágenes (snapshots) cada 3 segundos
    const interval = setInterval(() => {
        setRefreshKey(Date.now());
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const activeCameras = cameras.filter(c => c.status === 'online').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#050505] text-slate-200 overflow-hidden font-sans">
      
      {/* Sidebar Personalizada */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <Shield fill="currentColor" size={24} className="text-primary" />
            <span className="tracking-tighter text-white font-black">CORE <span className="text-primary">SYSTEMS</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase px-2 mb-4 tracking-widest">Menú Cliente</p>
          <button 
            onClick={() => setActiveTab('cameras')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border ${activeTab === 'cameras' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
          >
            <LayoutGrid size={18} /> Mis Cámaras
          </button>
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border ${activeTab === 'alerts' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
          >
            <Bell size={18} /> Alertas <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">3</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border ${activeTab === 'users' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
          >
            <Users size={18} /> Usuarios App
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all border ${activeTab === 'support' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' : 'text-slate-400 hover:bg-white/5 border-transparent'}`}
          >
            <Settings size={18} /> Soporte Técnico
          </button>
        </nav>

        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs text-[#0F172A]">
              {userName.substring(0,2).toUpperCase()}
            </div>
            <div className="overflow-hidden text-xs">
              <p className="font-bold truncate text-white">{userName}</p>
              <p className="text-slate-500 truncate">{clientId}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-all font-medium border border-transparent hover:border-red-500/20"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Superior */}
        <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-xl flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={14} className="text-slate-700" />
            <span className="text-white font-medium">Vista de Cámaras en Vivo</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Conexión Segura</span>
             </div>
             <Globe size={18} className="text-slate-500" />
          </div>
        </header>

        {activeTab === 'cameras' && (
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 underline decoration-primary decoration-4 underline-offset-8">Hola, {userName.split(' ')[0]}</h1>
              <p className="text-slate-400 text-sm">Sistemas operativos bajo supervisión técnica de Core.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cameras.map((camera) => (
                <div 
                  key={camera.id}
                  className="group relative bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 shadow-2xl scale-shadow hover:border-glow cursor-pointer"
                  onClick={() => setSelectedCam(camera)}
                >
                  {/* Imagen de la cámara */}
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={camera.url.includes('?') ? `${camera.url}&t=${refreshKey}` : `${camera.url}?t=${refreshKey}`} 
                      alt={camera.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${camera.status === 'offline' ? 'grayscale opacity-30' : ''}`} 
                    />
                    
                    {/* Overlay Gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Status Tags */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${camera.status === 'online' ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {camera.status}
                      </span>
                      <span className="bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white/70 font-mono border border-white/10">
                        {camera.type}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white font-bold text-sm group-hover:text-primary transition-colors drop-shadow-md">{camera.name}</h3>
                      <p className="text-[10px] text-slate-300 opacity-80 drop-shadow-md">NODO ACTIVO | IP PROXY</p>
                    </div>

                    {camera.status === 'offline' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
                        <Lock size={24} className="text-slate-400" />
                        <span className="text-xs text-slate-300 font-medium">Se requiere reconexión</span>
                      </div>
                    )}

                    <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-black/50 backdrop-blur-md hover:bg-primary rounded-lg transition-all transform scale-90 group-hover:scale-100 border border-white/10">
                      <Camera size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Pestaña: Alertas --- */}
        {activeTab === 'alerts' && (
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Centro de <span className="text-blue-500">Alertas</span></h1>
              <p className="text-slate-400 text-sm">Registro de detecciones y eventos del sistema analítico.</p>
            </div>

            <div className="max-w-3xl space-y-4">
              {[
                { time: 'Hace 10 min', type: 'Movimiento Sospechoso', cam: 'Acceso Principal', color: 'orange' },
                { time: 'Hace 2 horas', type: 'Cruce de Línea', cam: 'Estacionamiento Sur', color: 'red' },
                { time: 'Ayer, 23:40', type: 'Vehículo Desconocido', cam: 'Acceso Principal', color: 'blue' }
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-[#111] border border-white/5 rounded-2xl hover:bg-white/[0.02] transition-colors">
                  <div className={`mt-1 w-8 h-8 rounded-full bg-${alert.color}-500/20 text-${alert.color}-500 flex items-center justify-center`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">{alert.type}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Cámara: <span className="text-slate-400">{alert.cam}</span></p>
                    <p className="text-[10px] text-slate-500 mt-2 font-mono">{alert.time}</p>
                  </div>
                  <button className="ml-auto px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors">
                    Ver Clip
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Pestaña: Usuarios --- */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Permisos y <span className="text-blue-500">Accesos</span></h1>
                <p className="text-slate-400 text-sm">Administra quién puede ver tus cámaras en la App Móvil.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-lg hover:shadow-blue-500/20">
                <UserPlus size={16} /> Invitar Usuario
              </button>
            </div>

            <div className="max-w-3xl bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-black/40 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{userName}</p>
                      <p className="text-xs text-slate-500">{clientId}</p>
                    </td>
                    <td className="px-6 py-4"><span className="text-xs font-medium text-blue-400">Propietario</span></td>
                    <td className="px-6 py-4"><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>Activo</td>
                    <td className="px-6 py-4 text-right"></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-300">Guardia Turno Nocturno</p>
                      <p className="text-xs text-slate-500">Invitado hace 2 días</p>
                    </td>
                    <td className="px-6 py-4"><span className="text-xs font-medium text-slate-400">Sólo Vista</span></td>
                    <td className="px-6 py-4"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block mr-2"></span>Pendiente</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-red-400 font-medium hover:text-red-300">Revocar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- Pestaña: Soporte --- */}
        {activeTab === 'support' && (
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Centro de <span className="text-blue-500">Resolución</span></h1>
              <p className="text-slate-400 text-sm">Levanta un ticket directamente a nuestros técnicos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario de Ticket */}
              <div className="bg-[#111] p-6 border border-white/5 rounded-2xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-2"><Send size={16} className="text-blue-500"/> Abrir Ticket Nuevo</h3>
                
                <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert("Ticket enviado a soporte!"); setSupportMsg(''); }}>
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Asunto</label>
                    <input type="text" required placeholder="Ej. Falla en cámara 2" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 font-medium mb-1 block">Descripción del problema</label>
                    <textarea required value={supportMsg} onChange={e => setSupportMsg(e.target.value)} rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none resize-none" placeholder="Describe lo que sucede..."></textarea>
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20">
                    Enviar a Central
                  </button>
                </form>
              </div>

              {/* Status de Cuenta y Manuales */}
              <div className="space-y-6">
                <div className="bg-[#111] p-6 border border-white/5 rounded-2xl">
                   <h3 className="text-sm font-bold uppercase tracking-widest text-slate-300 mb-4 flex items-center gap-2"><Shield size={16} className="text-green-500"/> Póliza de Servicio</h3>
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-slate-400">Estado</span>
                      <span className="text-sm font-bold text-green-400">Vigente (Premium)</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-sm text-slate-400">Mantenimiento Prox.</span>
                      <span className="text-sm font-bold text-white">15 Dic, 2026</span>
                   </div>
                   <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-400">Atención Garantizada</span>
                      <span className="text-sm font-bold text-white">4 horas (SLA)</span>
                   </div>
                </div>

                <button className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Manual de Usuario</p>
                      <p className="text-xs text-slate-500">Aprende a usar tu app</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Banner de Marca Blanca */}
        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          <span className="text-primary">Soporte Técnico 24/7:</span> +52 800-GLOBAL-TEC &nbsp;|&nbsp; Soluciones por <span className="text-white">Global Telecomunicaciones Digitales</span>
        </div>
      </main>

      {/* Modal de Cámara Expandida */}
      {selectedCam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-md">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl">
            <button 
              onClick={() => setSelectedCam(null)}
              className="absolute top-4 right-4 z-10 px-4 py-2 bg-black/50 backdrop-blur hover:bg-red-500/20 hover:text-red-400 rounded-full text-white text-xs font-bold transition-all border border-white/10"
            >
              Cerrar Vista
            </button>
            <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden group">
              <img src={selectedCam.url.includes('?') ? `${selectedCam.url}&t=${refreshKey}` : `${selectedCam.url}?t=${refreshKey}`} className="w-full h-full object-contain" alt={selectedCam.name} />
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay pointer-events-none" />
              
              {/* OSD (On Screen Display) Típico de cámara */}
              <div className="absolute top-4 left-4 text-white/70 font-mono text-xs drop-shadow-md pointer-events-none">
                {selectedCam.name.toUpperCase()} - CAM 0{selectedCam.id}
              </div>
              <div className="absolute top-4 right-4 text-white/70 font-mono text-xs drop-shadow-md pointer-events-none pr-24">
                {new Date().toLocaleString('es-MX')}
              </div>
            </div>
            
            <div className="p-6 flex justify-between items-center border-t border-white/5 bg-[#0a0a0a]">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCam.name}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                   <Shield size={12} className="text-green-500" /> 
                   Túnel Proxy Seguro (ISAPI)
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-500/20">
                  Ver Grabaciones
                </button>
                <button className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold text-slate-300 transition-all">
                  Opciones PTZ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
