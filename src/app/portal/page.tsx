'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard, Video, Settings, Bell, User, LogOut, Shield,
    Activity, HardDrive, Wifi, Circle, ExternalLink, MapPin,
    Thermometer, Eye, AlertTriangle, CheckCircle2, Clock,
    Maximize2, Volume2, VolumeX, RotateCcw, Camera
} from 'lucide-react'

// ─── Datos Mock de Cámaras ───────────────────────────────────
const MOCK_CAMERAS = [
    { id: 1, name: 'Acceso Principal', location: 'Entrada - Planta Baja', model: 'DS-2CD2143G2-IS', resolution: '4MP', status: 'online', recording: true, ai: 'Detección Facial', temp: '38°C', uptime: '45d 12h', storage: '85%' },
    { id: 2, name: 'Pasillo Oficinas', location: 'Piso 2 - Ala Norte', model: 'DS-2CD2T47G2-L', resolution: '4MP', status: 'online', recording: true, ai: 'Conteo de Personas', temp: '42°C', uptime: '45d 12h', storage: '85%' },
    { id: 3, name: 'Estacionamiento', location: 'Exterior - Nivel 1', model: 'DS-2CD2087G2-LU', resolution: '8MP/4K', status: 'online', recording: true, ai: 'LPR Placas', temp: '51°C', uptime: '30d 8h', storage: '72%' },
    { id: 4, name: 'Bodega Central', location: 'Sótano - Almacén', model: 'DS-2CD2347G2-LU', resolution: '4MP', status: 'offline', recording: false, ai: 'Intrusión', temp: '--', uptime: '0d', storage: '90%' },
    { id: 5, name: 'Recepción', location: 'Planta Baja - Lobby', model: 'DS-2DE4A425IWG-E', resolution: '4MP PTZ', status: 'online', recording: true, ai: 'Auto-Tracking', temp: '36°C', uptime: '45d 12h', storage: '68%' },
    { id: 6, name: 'Sala de Juntas', location: 'Piso 3 - Sala A', model: 'DS-2CD2143G2-IS', resolution: '4MP', status: 'online', recording: false, ai: 'Ninguna', temp: '34°C', uptime: '45d 12h', storage: '55%' },
]

const MOCK_EVENTS = [
    { time: '13:45', event: 'Movimiento detectado', location: 'Cámara 03 - Estacionamiento', type: 'warning', detail: 'Vehículo no registrado' },
    { time: '12:30', event: 'Rostro identificado', location: 'Cámara 01 - Acceso Principal', type: 'success', detail: 'Luis Romero - Autorizado' },
    { time: '11:15', event: 'Placa reconocida', location: 'Cámara 03 - Estacionamiento', type: 'info', detail: 'ABC-123-MX' },
    { time: '10:20', event: 'Cámara desconectada', location: 'Cámara 04 - Bodega Central', type: 'danger', detail: 'Sin señal de red' },
    { time: '09:00', event: 'Inicio de grabación', location: 'Sistema NVR Principal', type: 'info', detail: 'Grabación programada 24/7' },
    { time: '08:45', event: 'Backup completado', location: 'NAS de Respaldo', type: 'success', detail: '2.3TB transferidos' },
]

const MOCK_NVR = [
    { name: 'NVR Principal', model: 'DS-7616NXI-K2', status: 'online', channels: '12/16', hdd: [{ name: 'WD Purple 4TB', health: 'OK', used: '82%' }, { name: 'WD Purple 4TB', health: 'OK', used: '71%' }] },
]

export default function PortalPage() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [userName, setUserName] = useState('Cliente Demo')
    const [selectedCamera, setSelectedCamera] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState('')
    const router = useRouter()

    useEffect(() => {
        const user = localStorage.getItem('gt_user')
        if (user) {
            const parsed = JSON.parse(user)
            setUserName(parsed.name)
        }

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('gt_user')
        router.push('/login')
    }

    const onlineCameras = MOCK_CAMERAS.filter(c => c.status === 'online').length
    const offlineCameras = MOCK_CAMERAS.filter(c => c.status === 'offline').length

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                            <Shield className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-xs uppercase tracking-[3px]">Global <span className="text-primary">Secure</span></span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={<Video size={18} />} label="Cámaras Live" active={activeTab === 'cameras'} onClick={() => setActiveTab('cameras')} badge={onlineCameras.toString()} />
                    <SidebarItem icon={<Activity size={18} />} label="Estado de Salud" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
                    <SidebarItem icon={<Clock size={18} />} label="Eventos" active={activeTab === 'events'} onClick={() => setActiveTab('events')} badge={MOCK_EVENTS.length.toString()} />
                    <SidebarItem icon={<Settings size={18} />} label="Configuración" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer text-slate-500 hover:text-red-400 group">
                        <LogOut size={18} />
                        <span className="text-xs font-bold">Cerrar Sesión</span>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar */}
                <header className="h-16 border-b border-slate-800/50 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md sticky top-0 z-20">
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest">Bienvenido, <span className="text-primary">{userName}</span></h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono text-slate-500">{currentTime}</span>
                        <div className="relative">
                            <Bell size={18} className="text-slate-400 hover:text-white cursor-pointer transition-colors" />
                            {offlineCameras > 0 && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <User size={14} className="text-primary" />
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8">

                    {/* ═══════════ TAB: DASHBOARD ═══════════ */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatCard icon={<Wifi className="text-green-500" />} label="Sistemas Online" value={`${onlineCameras}/${MOCK_CAMERAS.length}`} sub="Conectividad activa" color="green" />
                                <StatCard icon={<HardDrive className="text-blue-500" />} label="Almacenamiento" value="78%" sub="5.2TB / 8TB ocupados" color="blue" />
                                <StatCard icon={<Video className="text-purple-500" />} label="Grabando" value={MOCK_CAMERAS.filter(c => c.recording).length.toString()} sub="Canales activos" color="purple" />
                                <StatCard icon={<AlertTriangle className="text-orange-500" />} label="Alertas" value={offlineCameras.toString()} sub={offlineCameras > 0 ? 'Requiere atención' : 'Sin incidentes'} color={offlineCameras > 0 ? 'orange' : 'green'} />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">Vistas Prioritarias</h2>
                                    <button onClick={() => setActiveTab('cameras')} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                                        Ver Todas <ExternalLink size={12} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <CameraFeed camera={MOCK_CAMERAS[0]} onExpand={() => { setSelectedCamera(0); setActiveTab('cameras') }} />
                                    <CameraFeed camera={MOCK_CAMERAS[2]} onExpand={() => { setSelectedCamera(2); setActiveTab('cameras') }} />
                                </div>
                            </div>

                            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Últimos Eventos</h3>
                                    <button onClick={() => setActiveTab('events')} className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ver Más</button>
                                </div>
                                <div className="space-y-2">
                                    {MOCK_EVENTS.slice(0, 4).map((ev, i) => (
                                        <EventRow key={i} {...ev} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════════ TAB: CÁMARAS LIVE ═══════════ */}
                    {activeTab === 'cameras' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">
                                    <Camera className="inline mr-2 text-primary" size={16} />
                                    Todas las Cámaras ({MOCK_CAMERAS.length})
                                </h2>
                                <div className="flex gap-2 text-[9px] font-black uppercase">
                                    <span className="flex items-center gap-1 text-green-500"><Circle size={6} className="fill-green-500" /> {onlineCameras} Online</span>
                                    <span className="flex items-center gap-1 text-red-500 ml-4"><Circle size={6} className="fill-red-500" /> {offlineCameras} Offline</span>
                                </div>
                            </div>

                            {selectedCamera !== null && (
                                <div className="space-y-4 animate-in zoom-in duration-300">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                            <Maximize2 size={14} className="text-primary" /> Vista Expandida: {MOCK_CAMERAS[selectedCamera].name}
                                        </h3>
                                        <button onClick={() => setSelectedCamera(null)} className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest">Cerrar ✕</button>
                                    </div>
                                    <CameraFeed camera={MOCK_CAMERAS[selectedCamera]} expanded />

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <MiniStat label="Modelo" value={MOCK_CAMERAS[selectedCamera].model} />
                                        <MiniStat label="Resolución" value={MOCK_CAMERAS[selectedCamera].resolution} />
                                        <MiniStat label="IA Activa" value={MOCK_CAMERAS[selectedCamera].ai} />
                                        <MiniStat label="Temperatura" value={MOCK_CAMERAS[selectedCamera].temp} />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {MOCK_CAMERAS.map((cam, i) => (
                                    <CameraFeed key={cam.id} camera={cam} onExpand={() => setSelectedCamera(i)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══════════ TAB: ESTADO DE SALUD ═══════════ */}
                    {activeTab === 'health' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">
                                <Activity className="inline mr-2 text-primary" size={16} /> Diagnóstico del Sistema
                            </h2>

                            {/* NVR Status */}
                            {MOCK_NVR.map((nvr, i) => (
                                <div key={i} className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-black uppercase tracking-tight text-white">{nvr.name}</h3>
                                            <p className="text-[10px] text-slate-500 font-bold">{nvr.model} • Canales: {nvr.channels}</p>
                                        </div>
                                        <span className="text-[8px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">Operativo</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {nvr.hdd.map((hdd, j) => (
                                            <div key={j} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold flex items-center gap-2"><HardDrive size={14} className="text-blue-500" /> {hdd.name}</span>
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${hdd.health === 'OK' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{hdd.health}</span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: hdd.used }}></div>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium">Uso: {hdd.used}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Camera Health Table */}
                            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden">
                                <div className="p-6 border-b border-slate-800">
                                    <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400">Diagnóstico por Cámara</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[9px] uppercase font-black text-slate-500 tracking-[2px] bg-slate-900/80">
                                                <th className="px-6 py-4">Cámara</th>
                                                <th className="px-6 py-4">Modelo</th>
                                                <th className="px-6 py-4">Estado</th>
                                                <th className="px-6 py-4">Temp.</th>
                                                <th className="px-6 py-4">Uptime</th>
                                                <th className="px-6 py-4">Grab.</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/50">
                                            {MOCK_CAMERAS.map(cam => (
                                                <tr key={cam.id} className="hover:bg-white/[0.02] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-sm text-white">{cam.name}</p>
                                                        <p className="text-[10px] text-slate-500">{cam.location}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-[10px] font-mono text-slate-400">{cam.model}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-full border ${cam.status === 'online' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                                            {cam.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">{cam.temp}</td>
                                                    <td className="px-6 py-4 text-[10px] text-slate-400 font-medium">{cam.uptime}</td>
                                                    <td className="px-6 py-4">
                                                        {cam.recording ? <CheckCircle2 size={16} className="text-green-500" /> : <Circle size={16} className="text-slate-700" />}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════════ TAB: EVENTOS ═══════════ */}
                    {activeTab === 'events' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">
                                <Clock className="inline mr-2 text-primary" size={16} /> Historial de Eventos
                            </h2>
                            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-6 space-y-2">
                                {MOCK_EVENTS.map((ev, i) => (
                                    <EventRow key={i} {...ev} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ═══════════ TAB: CONFIGURACIÓN ═══════════ */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-6 animate-in fade-in duration-500">
                            <h2 className="text-sm font-black uppercase tracking-[3px] text-slate-400">
                                <Settings className="inline mr-2 text-primary" size={16} /> Mi Configuración
                            </h2>
                            <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Nombre</label>
                                        <input type="text" value={userName} readOnly className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm text-white font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Email</label>
                                        <input type="text" value="cliente@demo.mx" readOnly className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-sm text-white font-medium" />
                                    </div>
                                </div>
                                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Integración Hik-Connect</p>
                                    <p className="text-[10px] text-slate-500">La conexión con Hik-Connect Teams se activará cuando las credenciales API sean aprobadas por Hikvision.</p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}

// ─── Componentes ─────────────────────────────────────────────

function SidebarItem({ icon, label, active, onClick, badge }: { icon: any, label: string, active: boolean, onClick: () => void, badge?: string }) {
    return (
        <div onClick={onClick} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group ${active ? 'bg-primary text-white shadow-lg shadow-blue-900/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-[11px] font-bold">{label}</span>
            </div>
            {badge && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${active ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'}`}>{badge}</span>}
        </div>
    )
}

function StatCard({ icon, label, value, sub, color }: { icon: any, label: string, value: string, sub: string, color: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
                <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">{icon}</div>
                <Circle size={6} className={`fill-${color}-500 text-${color}-500 animate-pulse`} />
            </div>
            <div>
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest">{label}</p>
                <p className="text-xl font-black">{value}</p>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">{sub}</p>
        </div>
    )
}

function CameraFeed({ camera, onExpand, expanded }: { camera: typeof MOCK_CAMERAS[0], onExpand?: () => void, expanded?: boolean }) {
    const isOffline = camera.status === 'offline'

    return (
        <div
            onClick={onExpand}
            className={`${expanded ? 'aspect-[21/9]' : 'aspect-video'} rounded-2xl border overflow-hidden relative group cursor-pointer transition-all shadow-xl ${isOffline ? 'bg-slate-900 border-red-500/20' : 'bg-slate-900 border-slate-800 hover:border-primary/30'}`}
        >
            {/* Simulated camera feed with gradient noise */}
            {isOffline ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-3">
                    <AlertTriangle size={32} className="text-red-500/50" />
                    <p className="text-[10px] font-black uppercase text-red-500/50 tracking-widest">Sin Señal</p>
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950"></div>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.1) 0%, transparent 50%)' }}></div>

                    {/* Simulated camera overlay elements */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[8px] font-mono text-white/60 bg-black/40 px-2 py-0.5 rounded">{camera.model}</span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="text-[8px] font-mono text-white/40">{new Date().toLocaleTimeString('es-MX')}</span>
                    </div>

                    {/* Center crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <div className="w-16 h-16 border border-white/30 rounded-sm"></div>
                        <div className="absolute w-px h-6 bg-white/20 top-1/2 -translate-y-1/2"></div>
                        <div className="absolute h-px w-6 bg-white/20 left-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Hover play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                            <Maximize2 size={20} className="text-white" />
                        </div>
                    </div>
                </>
            )}

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            {!isOffline && <Circle size={6} className="fill-red-500 text-red-500 animate-pulse" />}
                            <span className="text-[8px] font-black uppercase text-white/80 tracking-[2px]">{isOffline ? 'Desconectada' : 'En Vivo'}</span>
                            {camera.recording && <span className="text-[7px] font-black bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded uppercase">REC</span>}
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{camera.name}</h4>
                        <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1"><MapPin size={9} /> {camera.location}</p>
                    </div>
                    {!isOffline && (
                        <div className="flex gap-1.5">
                            <div className="text-[7px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 uppercase">{camera.resolution}</div>
                            {camera.ai !== 'Ninguna' && <div className="text-[7px] font-black bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 uppercase">{camera.ai}</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function MiniStat({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
            <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest mb-1">{label}</p>
            <p className="text-xs font-bold text-white">{value}</p>
        </div>
    )
}

function EventRow({ time, event, location, type, detail }: { time: string, event: string, location: string, type: string, detail?: string }) {
    const colors: Record<string, string> = {
        warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-slate-800 gap-4">
            <div className="flex items-center gap-4 min-w-0">
                <span className="text-[10px] font-mono text-slate-600 w-10 shrink-0">{time}</span>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-tight text-white truncate">{event}</p>
                    <p className="text-[9px] text-slate-500 font-medium truncate">{location}{detail ? ` • ${detail}` : ''}</p>
                </div>
            </div>
            <span className={`text-[7px] font-black uppercase px-2 py-1 rounded-full border shrink-0 ${colors[type] || colors.info}`}>
                {type}
            </span>
        </div>
    )
}
