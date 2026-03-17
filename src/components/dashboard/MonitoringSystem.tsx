'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Shield, X, Layout, Zap, Activity } from 'lucide-react'

export default function MonitoringSystem({ branch, client, onClose }: { branch: { name: string }, client: string, onClose: () => void }) {
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    return (
        <div className="fixed inset-0 z-[120] bg-slate-950 flex flex-col animate-in fade-in duration-500 overflow-hidden">
            <header className="h-16 bg-slate-900 border-b border-white/10 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative">
                            <Image 
                                src="/logo-global.png" 
                                alt="Global Telecomunicaciones Digitales Logo" 
                                fill
                                className="object-contain drop-shadow-glow"
                            />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest leading-none text-white">Security Center</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[2px] mt-1">v4.2.0.1009 Enterprise</p>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/5"></div>
                    <div>
                        <p className="text-[11px] font-black italic uppercase text-white tracking-widest">{client}</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-tighter">{branch.name} — ONLINE</p>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-xs font-mono font-black text-slate-400">{currentTime.toLocaleTimeString()}</p>
                        <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{currentTime.toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-all"><X size={18} /></button>
                </div>
            </header>

            <div className="flex-1 bg-black grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-px border border-white/5 p-px overflow-auto">
                <CameraCell id="CAM 01" label="ENTRY POINT" bitrate="2240" image="/images/cctv/entry_point.png" />
                <CameraCell id="CAM 02" label="PERIMETER NW" bitrate="4112" image="/images/cctv/perimeter.png" />
                <CameraCell id="CAM 03" label="SERVER ROOM" bitrate="1056" image="/images/cctv/server_room.png" />
                <CameraCell id="CAM 04" label="RECEPTION" bitrate="2048" />
            </div>

            <footer className="h-14 bg-slate-900 border-t border-white/10 flex items-center justify-center gap-8 shrink-0">
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"><Layout size={14} /> Grid 2x2</button>
                <div className="h-4 w-px bg-white/5"></div>
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"><Zap size={14} className="text-yellow-500 fill-yellow-500/20" /> PTZ Control</button>
                <div className="h-4 w-px bg-white/5"></div>
                <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-red-500 animate-pulse"><div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div> REC LIVE</button>
            </footer>
        </div>
    )
}

function CameraCell({ id, label, bitrate, image }: { id: string, label: string, bitrate: string, image?: string }) {
    return (
        <div className="relative bg-[#050505] group overflow-hidden border border-white/[0.02] min-h-[300px]">
            {image ? (
                <div className="absolute inset-0 grayscale contrast-125 brightness-75 group-hover:brightness-100 transition-all duration-700">
                    <Image 
                        src={image} 
                        alt={label} 
                        fill
                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                </div>
            ) : (
                <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 flex items-center justify-center">
                    <Shield size={60} className="text-white/[0.03] group-hover:text-primary transition-all duration-700" />
                </div>
            )}

            <div className="absolute inset-0 pointer-events-none opacity-[0.08] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,4px_100%]"></div>

            <div className="absolute top-4 right-6 flex items-center gap-2 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_5px_rgba(220,38,38,0.8)]"></div>
                <span className="text-[8px] font-black text-white tracking-widest uppercase">Live</span>
            </div>

            <div className="absolute top-4 left-6 flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-white bg-primary/20 border border-primary/30 px-2 py-0.5 rounded tracking-tight">{id}</span>
                <span className="text-[8px] font-black text-slate-300 tracking-[2px] mt-1 drop-shadow-md">{label}</span>
            </div>

            <div className="absolute bottom-4 right-6 text-right">
                <p className="text-[8px] font-black text-green-500 uppercase tracking-tighter drop-shadow-md flex items-center justify-end gap-1">
                    <Activity size={8} className="animate-bounce" /> BITRATE: {bitrate} Kbps
                </p>
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1 italic drop-shadow-md">H.265 AUTO-LEVEL</p>
            </div>

            <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all pointer-events-none">
                <div className="absolute top-4 right-4 w-4 h-px bg-primary/40"></div>
                <div className="absolute top-4 right-4 h-4 w-px bg-primary/40"></div>
                <div className="absolute bottom-4 left-4 w-4 h-px bg-primary/40"></div>
                <div className="absolute bottom-4 left-4 h-4 w-px bg-primary/40"></div>
            </div>
        </div>
    )
}
