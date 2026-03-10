'use client'

import { Briefcase, ClipboardList, MapPin, TrendingUp, Users, Zap, Activity } from 'lucide-react'
import { StatCard, TeamStat } from './SharedComponents'

export default function ResumenView({ orders, onMonitor, MOCK_CLIENTS }: any) {
    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <header>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Ops <span className="text-primary underline underline-offset-[12px]">Intelligence</span></h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-6 max-w-xl">Gestión táctica de cuadrillas, despliegue de infraestructura y SLA de mantenimiento.</p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard label="Tickets Activos" value={orders.length} icon={<ClipboardList className="text-blue-500" />} trend="Monitoreado" />
                <StatCard label="Ingenieros Campo" value="4" icon={<Users className="text-yellow-500" />} trend="Full capacity" />
                <StatCard label="Sucursales" value="15" icon={<MapPin className="text-green-500" />} trend="Geolocalizadas" />
                <StatCard label="Meta Semanal" value="85%" icon={<TrendingUp className="text-purple-500" />} trend="En rango" />
            </section>

            {/* POWER UP: Squad Live Mapping Simulation */}
            <div
                id="squad-map-container"
                className="glass rounded-[40px] border border-white/10 p-1 relative overflow-hidden h-[500px] group mb-10 shadow-2xl shadow-blue-900/30 bg-slate-950"
            >
                {/* Background Map Simulation */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1),transparent_80%)]"></div>

                {/* Simulated Map Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                {/* Squad Markers */}
                <SquadMarker top="35%" left="28%" name="Alpha 01" status="MOVING" />
                <SquadMarker top="65%" left="48%" name="Bravo 02" status="ON_SITE" />
                <SquadMarker top="25%" left="72%" name="Zulu 03" status="IDLE" />
                <SquadMarker top="50%" left="15%" name="Delta 04" status="MOVING" />

                {/* Map HUD */}
                <div className="absolute top-10 left-10 p-8 bg-slate-950/80 backdrop-blur-2xl rounded-[32px] border border-white/10 space-y-6 max-w-[300px] shadow-2xl z-40">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
                        <span className="text-[12px] font-black uppercase tracking-[4px] text-white">Squad Telemetry</span>
                    </div>
                    <div className="space-y-4">
                        <TelemetryRow label="🛰️ Satellites" value="09 Active" color="text-green-400" />
                        <TelemetryRow label="👥 Personnel" value="12 On-Duty" color="text-primary" />
                        <TelemetryRow label="⏱️ Active Tickets" value={orders.length} color="text-blue-400" />
                        <TelemetryRow label="🛡️ Global Status" value="Secure" color="text-emerald-400" />
                    </div>
                </div>

                <div className="absolute bottom-10 right-10 flex flex-col items-end gap-3 z-40">
                    <div className="px-6 py-3 bg-slate-900/80 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[3px] border border-white/10 text-white shadow-2xl flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        CDMX Central Hub
                    </div>
                    <p className="text-[8px] font-black uppercase tracking-[4px] text-slate-500 mr-5">Operational Layer v3.0</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="glass rounded-[40px] border-white/5 p-10 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Briefcase size={80} /></div>
                    <h2 className="text-xl font-black uppercase italic tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        Despliegue Reciente
                    </h2>
                    <div className="space-y-4">
                        {orders.map((o: any) => (
                            <div key={o.id} className="p-6 glass rounded-3xl border-white/5 flex justify-between items-center group">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-primary group-hover:text-white transition-all"><MapPin size={20} /></div>
                                    <div>
                                        <p className="text-[12px] font-black uppercase italic text-white leading-none">{o.client}</p>
                                        <p className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-widest">{o.branch}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-primary mb-1 italic">{o.id}</p>
                                    <button
                                        onClick={() => {
                                            const client = MOCK_CLIENTS.find((c: any) => c.name === o.client)
                                            const branch = client?.branches.find((b: any) => b.name === o.branch)
                                            if (branch) onMonitor({ client: o.client, branch })
                                        }}
                                        className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-full text-[8px] font-black uppercase tracking-widest border border-white/5 hover:border-primary/50 hover:text-primary transition-all"
                                    >Monitor Live</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass rounded-[40px] border-primary/10 bg-primary/5 p-10 space-y-8">
                    <h2 className="text-xl font-black uppercase italic tracking-widest items-center flex gap-3 text-primary">
                        <Zap size={20} /> Métricas de Escuadrón
                    </h2>
                    <div className="space-y-6">
                        <TeamStat name="Blue Alpha" score={98} tasks={12} color="bg-blue-500" />
                        <TeamStat name="Gold Bravo" score={85} tasks={8} color="bg-yellow-500" />
                        <TeamStat name="Red Zulu" score={92} tasks={15} color="bg-red-500" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SquadMarker({ top, left, name, status }: any) {
    return (
        <div className="absolute group z-10" style={{ top, left }}>
            <div className="w-16 h-16 flex items-center justify-center relative cursor-default">
                <div className={`absolute inset-0 rounded-full animate-ping opacity-30 duration-1000 ${status === 'MOVING' ? 'bg-primary' : status === 'ON_SITE' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                <div className={`w-5 h-5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.8)] relative z-10 border-2 border-white/20 transition-transform group-hover:scale-125 ${status === 'MOVING' ? 'bg-primary' : status === 'ON_SITE' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
            </div>
            <div className="absolute top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-30 scale-90 group-hover:scale-100 shadow-2xl flex flex-col items-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">{name}</p>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${status === 'ON_SITE' ? 'bg-green-500' : 'bg-primary'}`}></div>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{status}</p>
                </div>
            </div>
        </div>
    )
}

function TelemetryRow({ label, value, color }: any) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-[8px] font-mono font-black ${color}`}>{value}</span>
        </div>
    )
}
