'use client'

import { MoreVertical, Camera } from 'lucide-react'

type Device = { id: string; camera_name: string; url_or_ip: string; is_active: boolean; device_type: string };
type RealClient = { id: string; name: string; email: string; devices: Device[] };
type Branch = { name: string; id?: string };

export default function ClientesView({ onMonitor, realClients }: { onMonitor: (data: { client: string, branch: Branch }) => void, realClients: RealClient[] }) {
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter">Socios <span className="text-primary italic underline underline-offset-8">Comerciales</span></h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Base de datos de múltiples sucursales y puntos de presencia.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {realClients && realClients.map((client: RealClient) => (
                    <div key={client.id} className="glass rounded-[40px] border-white/5 p-10 space-y-8 hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-primary/10 text-primary border border-primary/20 rounded-3xl flex items-center justify-center font-black text-xl italic">{client.name[0]}</div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tighter">{client.name}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{client.email}</p>
                                </div>
                            </div>
                            <button className="p-3 bg-white/5 rounded-2xl text-slate-600 hover:text-white transition-all"><MoreVertical size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[3px] text-primary">Dispositivos Vinculados ({client.devices?.length || 0})</p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {client.devices && client.devices.map((device: Device) => (
                                    <div
                                        key={device.id}
                                        onClick={() => onMonitor({ client: client.name, branch: { name: device.camera_name, id: device.id } })}
                                        className="p-5 bg-black/20 rounded-2xl border border-white/5 space-y-2 hover:bg-black/40 hover:border-primary/40 transition-all cursor-pointer group/branch"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-white">
                                                <Camera size={12} className="text-primary" />
                                                <span className="text-[11px] font-black uppercase tracking-tight">{device.camera_name}</span>
                                            </div>
                                            <div className={`w-1.5 h-1.5 rounded-full ${device.is_active !== false ? 'bg-green-500 animate-pulse' : 'bg-red-500/50'} group-hover/branch:shadow-[0_0_8px_rgba(34,197,94,0.8)]`}></div>
                                        </div>
                                        <p className="text-[10px] text-slate-600 font-medium leading-tight">IP: {device.url_or_ip}</p>
                                        <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-2">{device.device_type} ACTIVE</p>
                                    </div>
                                ))}
                                {(!client.devices || client.devices.length === 0) && (
                                    <div className="col-span-2 p-5 border border-dashed border-white/10 rounded-2xl text-center">
                                        <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Sin dispositivos asignados</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
