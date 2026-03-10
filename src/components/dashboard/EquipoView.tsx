'use client'

import { User, MessageCircle } from 'lucide-react'

export default function EquipoView({ orders, MOCK_TECHNICIANS }: any) {
    return (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Escuadrón <span className="text-primary underline underline-offset-8">Técnico</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {MOCK_TECHNICIANS.map((tech: any) => {
                    const activeOrder = orders.find((o: any) => o.technician === tech.name && o.status !== 'Completada')
                    const isAvailable = !activeOrder

                    return (
                        <div key={tech.id} className="glass rounded-[32px] border-white/5 p-8 relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-10 rounded-full transition-all group-hover:opacity-20 ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 bg-slate-900 border border-white/10 rounded-full flex items-center justify-center shadow-2xl relative">
                                    <User size={40} className="text-slate-600 group-hover:text-primary transition-colors" />
                                    <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-4 border-slate-950 ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                </div>
                                <div>
                                    <h4 className="font-black uppercase tracking-tight italic text-sm">{tech.name}</h4>
                                    <a
                                        href={`https://wa.me/${tech.phone.replace(/\s/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 mt-2 text-[10px] font-black text-primary hover:text-green-500 uppercase tracking-widest transition-colors group/wa"
                                    >
                                        <MessageCircle size={12} className="group-hover/wa:fill-green-500/20" /> {tech.phone}
                                    </a>
                                </div>
                                <div className="pt-4 border-t border-white/5 w-full flex flex-col items-center gap-2">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${isAvailable ? 'text-green-500 bg-green-500/10 px-3 py-1 rounded-full' : 'text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full'}`}>
                                        {isAvailable ? '● Disponible / Libre' : `○ Asignado: ${activeOrder.id}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
