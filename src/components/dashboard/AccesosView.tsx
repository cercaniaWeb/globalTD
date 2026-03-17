'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Loader2, Link as LinkIcon, Camera } from 'lucide-react'

type Device = {
    id: string;
    camera_name: string;
    device_type: string;
    username: string;
    password_enc: string;
    created_at: string;
    is_active: boolean;
    url_or_ip: string;
    port_rtsp: number;
    profiles?: { full_name?: string; email?: string };
};

export default function AccesosView() {
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState(true)
    const [showPass, setShowPass] = useState<Record<string, boolean>>({})

    const togglePass = (id: string) => {
        setShowPass(prev => ({ ...prev, [id]: !prev[id] }))
    }

    useEffect(() => {
        const fetchDevices = async () => {
            const { data, error } = await supabase
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .from('client_devices' as any)
                .select(`
                    id, 
                    camera_name, 
                    device_type, 
                    username, 
                    password_enc,
                    created_at, 
                    is_active,
                    url_or_ip,
                    port_rtsp,
                    profiles(full_name, email)
                `)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching devices:', error)
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setDevices((data as any[] as Device[]) || [])
            }
            setLoading(false)
        }
        fetchDevices()
    }, [])

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Control de <span className="text-primary italic underline underline-offset-8">Accesos</span></h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Base de datos centralizada de credenciales DVR/NVR vinculados.</p>
                </div>
            </header>

            <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[4px] text-slate-500">
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Cliente Propietario</th>
                                <th className="px-10 py-6">Equipo / IP</th>
                                <th className="px-10 py-6">Equipo / IP</th>
                                <th className="px-10 py-6">Credenciales Remotas</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-600">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Plataforma...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : devices.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                                        No hay equipos emparejados.
                                    </td>
                                </tr>
                            ) : (
                                devices.map((d: Device) => (
                                    <tr key={d.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${d.is_active !== false ? 'bg-green-500 shadow-glow' : 'bg-red-500/50'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{d.is_active !== false ? 'Activo' : 'Offline'}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black italic text-white uppercase tracking-tight">{d.profiles?.full_name || 'Desconocido'}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{d.profiles?.email || 'SIN EMAIL CONFIGURADO'}</p>
                                        </td>
                                        <td className="px-10 py-8 space-y-2">
                                            <div className="flex items-center gap-2 text-xs font-black text-white uppercase">
                                                <Camera size={14} className="text-primary" /> {d.camera_name}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded inline-block border border-emerald-500/20">
                                                <LinkIcon size={10} /> {d.url_or_ip}:{d.port_rtsp}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                                                    <User size={12} /> {d.username}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                                                        {showPass[d.id] ? d.password_enc : '••••••••'}
                                                    </span>
                                                    <button 
                                                        onClick={() => togglePass(d.id)}
                                                        className="text-[8px] font-black uppercase text-slate-600 hover:text-white transition-colors underline underline-offset-4"
                                                    >
                                                        {showPass[d.id] ? 'Ocultar' : 'Ver'}
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
