'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Loader2 } from 'lucide-react'

export default function AccesosView() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchClients = async () => {
            const { data, error } = await supabase
                .from('clientes_cctv')
                .select('*')
                .order('nombre_cliente', { ascending: true })

            if (error) {
                console.error('Error fetching clients:', error)
            } else {
                setClients(data || [])
            }
            setLoading(false)
        }
        fetchClients()
    }, [])

    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Control de <span className="text-primary italic underline underline-offset-8">Accesos</span></h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Base de datos centralizada de credenciales DVR y IDs de vinculación API.</p>
                </div>
            </header>

            <div className="glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[4px] text-slate-500">
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6">Cliente</th>
                                <th className="px-10 py-6">Usuario DVR</th>
                                <th className="px-10 py-6">Clave Estándar</th>
                                <th className="px-10 py-6">Site HIK ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-600">
                                            <Loader2 className="w-8 h-8 animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando con Supabase...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-20 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                                        No se encontraron registros. Ejecuta el script de migración.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((c: any) => (
                                    <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${c.status_actual === 'Online' ? 'bg-green-500 shadow-glow' : 'bg-yellow-500/50'}`}></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{c.status_actual}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black italic text-white uppercase tracking-tight">{c.nombre_cliente}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{c.email_notificaciones || 'SIN EMAIL CONFIGURADO'}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase">
                                                <User size={12} /> {c.usuario_dvr}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <code className="bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 text-[10px] font-mono text-emerald-400 group-hover:border-primary/30 transition-all cursor-pointer">
                                                {c.pass_dvr}
                                            </code>
                                        </td>
                                        <td className="px-10 py-8">
                                            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                                                {c.sitio_hik_id || 'PENDIENTE VINCULACIÓN'}
                                            </p>
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
