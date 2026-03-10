'use client'

import { ReactNode } from 'react'

export function SidebarItem({ icon, label, active = false, onClick }: { icon: ReactNode, label: string, active?: boolean, onClick: () => void }) {
    return (
        <div onClick={onClick} className={`flex items-center gap-4 px-6 py-4 rounded-2xl cursor-pointer group transition-all duration-500 ${active ? 'glass border-primary/20 bg-primary/5 text-primary' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}>
            <div className={`transition-transform duration-500 group-hover:scale-110 ${active ? 'text-primary drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : ''}`}>
                {icon}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${active ? 'italic' : ''}`}>{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full shadow-glow"></div>}
        </div>
    )
}

export function StatCard({ label, value, icon, trend }: { label: string, value: string | number, icon: ReactNode, trend: string }) {
    return (
        <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">{icon}</div>
            <div className="flex justify-between items-start mb-8">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-all">{icon}</div>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary italic">{trend}</span>
            </div>
            <h3 className="text-[9px] font-black uppercase tracking-[3px] text-slate-500 mb-2">{label}</h3>
            <p className="text-3xl font-black italic text-white leading-none">{value}</p>
        </div>
    )
}

export function TeamStat({ name, score, tasks, color }: { name: string, score: number, tasks: number, color: string }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{name}</span>
                <span className="text-[10px] font-mono text-primary">{score}% Performance</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.2)]`} style={{ width: `${score}%` }}></div>
            </div>
            <p className="text-[8px] font-black uppercase text-slate-600 tracking-widest">{tasks} Misiones Completadas</p>
        </div>
    )
}
